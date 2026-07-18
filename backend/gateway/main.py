import asyncio
import os
import logging
from typing import List, Dict
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import httpx
import redis.asyncio as aioredis
from jose import jwt, JWTError
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

# Setup structured logging
setup_logging("api_gateway")
logger = logging.getLogger("api_gateway")

app = FastAPI(title="StadiaX API Gateway", version="1.0.0")

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration settings
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
JWT_SECRET = os.getenv("JWT_SECRET", "stadiax_ultra_secret_key_2026")
JWT_ALGORITHM = "HS256"

# Microservices routing directory
SERVICES = {
    "auth": os.getenv("AUTH_SERVICE_URL", "http://localhost:8001"),
    "ai": os.getenv("AI_SERVICE_URL", "http://localhost:8002"),
    "crowd": os.getenv("CROWD_SERVICE_URL", "http://localhost:8003"),
    "transit": os.getenv("TRANSIT_SERVICE_URL", "http://localhost:8004"),
    "security": os.getenv("SECURITY_SERVICE_URL", "http://localhost:8005"),
    "volunteers": os.getenv("VOLUNTEER_SERVICE_URL", "http://localhost:8006"),
    "operations": os.getenv("OPERATIONS_SERVICE_URL", "http://localhost:8007"),
    "vendors": os.getenv("VENDOR_SERVICE_URL", "http://localhost:8008"),
    "accessibility": os.getenv("ACCESSIBILITY_SERVICE_URL", "http://localhost:8009"),
    "sustainability": os.getenv("SUSTAINABILITY_SERVICE_URL", "http://localhost:8010"),
    "analytics": os.getenv("ANALYTICS_SERVICE_URL", "http://localhost:8011"),
}

# Shared HTTP Client
http_client = httpx.AsyncClient()

# Active WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket client connected. Active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket client disconnected. Active connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send websocket message: {e}")

ws_manager = ConnectionManager()
redis_client = None

@app.on_event("startup")
async def startup_event():
    global redis_client
    redis_client = await aioredis.from_url(REDIS_URL, decode_responses=True)
    logger.info("Gateway connected to Redis.")

    # Spawn background event bus listener for WS broadcasts
    asyncio.create_task(listen_event_bus())

@app.on_event("shutdown")
async def shutdown_event():
    global redis_client
    if redis_client:
        await redis_client.close()
    await http_client.aclose()

# Rate limiting using Token Bucket algorithm in Redis
async def rate_limiter(request: Request):
    client_ip = request.client.host
    rate_limit_key = f"rate_limit:{client_ip}"
    
    # 60 requests per minute capacity
    max_tokens = 60
    refill_rate = 1  # token per second
    
    now = asyncio.get_event_loop().time()
    
    # Retrieve current bucket status
    data = await redis_client.hmget(rate_limit_key, "tokens", "last_update")
    
    if data[0] is None:
        tokens = max_tokens
        last_update = now
    else:
        tokens = float(data[0])
        last_update = float(data[1])
        # Add new tokens based on elapsed time
        elapsed = now - last_update
        tokens = min(max_tokens, tokens + elapsed * refill_rate)
        
    if tokens < 1:
        logger.warning(f"Rate limit exceeded for IP {client_ip}")
        raise HTTPException(status_code=429, detail="Too Many Requests. Rate limit exceeded.")
        
    # Decrement token and save
    await redis_client.hset(rate_limit_key, mapping={
        "tokens": tokens - 1,
        "last_update": now
    })

# Authenticate requests using JWT
async def authenticate_user(request: Request):
    # Exclude auth paths
    if request.url.path.startswith("/api/v1/auth/"):
        return
        
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized. Missing authorization token.")
        
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        # Attach user context to request state
        request.state.user = payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Unauthorized. Invalid or expired token.")

# Gateway reverse proxy
@app.api_route("/api/v1/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def route_proxy(service: str, path: str, request: Request, _=Depends(rate_limiter), __=Depends(authenticate_user)):
    if service not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found.")

    target_url = f"{SERVICES[service]}/api/v1/{service}/{path}"
    
    # Gather body/params/headers
    body = await request.body()
    headers = dict(request.headers)
    
    # Prune Host header to avoid routing loops
    headers.pop("host", None)
    
    # Forward Authorization header and user metadata if validated
    if hasattr(request.state, "user"):
        headers["X-User-Id"] = request.state.user.get("sub", "")
        headers["X-User-Role"] = request.state.user.get("role", "guest")

    try:
        # Downstream proxy execution
        response = await http_client.request(
            method=request.method,
            url=target_url,
            content=body,
            params=dict(request.query_params),
            headers=headers,
            timeout=10.0
        )
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    except httpx.RequestError as exc:
        logger.error(f"Downstream connection error: {exc}")
        raise HTTPException(status_code=502, detail="Bad Gateway. Downstream service unavailable.")

# WebSocket Connection Node
@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Client heartbeats or incoming telemetry messages
            data = await websocket.receive_text()
            logger.debug(f"Received websocket client message: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# Background subscriber listening to the EventBus stream
async def listen_event_bus():
    logger.info("Initializing event bus listener loop in API Gateway...")
    
    # Connect directly to Redis Stream
    eb = EventBus(redis_url=REDIS_URL)
    await eb.connect()

    async def handle_bus_event(event_type: str, payload: dict):
        # Broadcast all events to the connected WebSockets
        broadcast_msg = {
            "event": event_type,
            "data": payload
        }
        logger.info(f"EventBus captured event '{event_type}'. Broadcasting to WS pool.")
        await ws_manager.broadcast(broadcast_msg)

    # Subscribe as API Gateway consumer
    await eb.subscribe(group_name="api_gateway_group", consumer_name="gateway_ws_broadcast", callback=handle_bus_event)

@app.get("/health")
async def health_check():
    return {
        "status": "nominal",
        "gateway_sync": "active",
        "services_available": list(SERVICES.keys())
    }
