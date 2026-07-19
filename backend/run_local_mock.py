import os
import json
import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from jose import jwt

# Setup structured console logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(name)s - %(message)s')
logger = logging.getLogger("stadiax_mock_backend")

app = FastAPI(title="StadiaX Unified Mock Backend", version="1.0.0")

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = os.getenv("JWT_SECRET") or ("stadiax_ultra_sec_" + str(1013 * 2))
JWT_ALGORITHM = "HS256"
SALT = os.getenv("PASSWORD_SALT") or ("stadiax_sec_" + str(1013 * 2))

# --- Shared WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket client disconnected. Connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to broadcast message: {e}")

ws_manager = ConnectionManager()

import hashlib

# Utility hash helper
def hashlib_hash(password: str) -> str:
    salted = SALT + password
    return hashlib.sha256(salted.encode()).hexdigest()

# --- In-Memory Databases & Timeline ---
users_db = {
    "operator@stadiax.com": {
        "id": 1,
        "name": "FIFA Operator",
        "role": "operator",
        "password_hash": hashlib_hash("stadium2026")
    }
}

event_timeline = [
    {"time": "14:44:02", "category": "Medical", "desc": "Medical Team dispatch confirmed for Sector 112 Row F."},
    {"time": "14:42:15", "category": "Transit", "desc": "Shuttle Loop 12 schedule adjusted to offset Metro East load."},
    {"time": "14:41:40", "category": "Vendor", "desc": "Food Court C vendor flagged restock order #942."},
    {"time": "14:40:02", "category": "Crowd", "desc": "Bypass signages enabled: Redirecting fans to Gate 6."},
    {"time": "14:38:50", "category": "Security", "desc": "Unattended bag isolated near Gate 8. K9 sweep in progress."}
]

simulation_mode = "Normal"
active_alerts_count = 6

# --- Models ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Optional[str] = "fan"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "unknown"
    role: Optional[str] = "fan"

class SensorUpdate(BaseModel):
    sensor_id: str
    density_pct: float
    flow_rate: int

class TransitUpdate(BaseModel):
    hub: str
    delay_minutes: int
    occupancy_pct: float

class IncidentReport(BaseModel):
    title: str
    location: str
    priority: str
    category: str

class EvacuationSignal(BaseModel):
    active: bool
    reason: str

class Assignment(BaseModel):
    team_name: str
    target_location: str
    assignment_task: str

class GateState(BaseModel):
    gate_id: str
    status: str

class HVACConfig(BaseModel):
    sector: str
    fan_speed_boost: int
    target_temp_c: float

class InventoryAlert(BaseModel):
    concession_id: str
    item_name: str
    units_remaining: int

class AidRequest(BaseModel):
    guest_id: str
    assistance_type: str
    pickup_point: str

class EcoOffsetRequest(BaseModel):
    grid_boost_kw: float
    offset_solar_battery: bool

# --- Auth Endpoints ---
@app.post("/api/v1/auth/register")
def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    users_db[user.email] = {
        "id": len(users_db) + 1,
        "name": user.name,
        "role": user.role,
        "password_hash": hashlib_hash(user.password)
    }
    return {"status": "success", "message": "User registered successfully"}

@app.post("/api/v1/auth/login")
def login(user: UserLogin):
    if user.email not in users_db or users_db[user.email]["password_hash"] != hashlib_hash(user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    u = users_db[user.email]
    access_token = jwt.encode(
        {"sub": str(u["id"]), "email": user.email, "name": u["name"], "role": u["role"]},
        JWT_SECRET, algorithm=JWT_ALGORITHM
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": u["id"],
            "email": user.email,
            "name": u["name"],
            "role": u["role"]
        }
    }

# --- AI Gateway & LangGraph Nodes ---
@app.post("/api/v1/ai/query")
async def query_ai(payload: QueryRequest):
    lower = payload.query.lower()
    
    # 1. Simulate agent triggers
    summary = "System executing nominal concourse routing."
    actions = ["Monitor active gate signages"]
    priority = "low"
    
    if "seat" in lower or "guide" in lower:
        summary = "Guide guest to Seat 14, Sector 108. Avoid Elevator B-3 due to active fault."
        actions = ["Direct guest via South Ramp 3 and Elevator B-4"]
        priority = "normal"
    elif "food" in lower or "halal" in lower:
        summary = "Found Medina Grill (Halal Mediterranean, Concourse 1 East) wait time under 4 minutes."
        actions = ["Push Medina Grill location overlay card"]
        priority = "normal"
    elif "emergency" in lower or "missing" in lower or "bag" in lower:
        summary = "CRITICAL ALERT: Security incident identified. Dispatched volunteer escort."
        actions = ["Deploy K9 Unit S-2 to Gate 8", "Clear 15-meter security radius"]
        priority = "high"
    elif "exit" in lower or "metro" in lower:
        summary = "Metro East Hub congestion forecast active. Redirecting to Shuttle Loop B."
        actions = ["Broadcast Bus loop redirects to passenger mobile apps"]
        priority = "high"

    # Append to timeline log
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    event_timeline.append({
        "time": time_str,
        "category": "AI Coordinator",
        "desc": f"AI Query processed: {payload.query}. Summary: {summary}"
    })
    
    # Broadcast event via WS
    await ws_manager.broadcast({
        "event": "AIDecisionLogged",
        "data": {"query": payload.query, "summary": summary, "priority": priority}
    })

    return {
        "summary": summary,
        "reasoning": "LangGraph orchestrated parallel agent nodes. Resolved safety parameters.",
        "evidence": "In-memory telemetry logs matches baseline configuration.",
        "confidence_score": 0.96,
        "priority": priority,
        "recommended_actions": actions,
        "affected_services": ["crowd", "security", "transit"],
        "estimated_impact": "Operational compliance preserved with reduced response latencies.",
        "supporting_data": {"active_agents": ["X-Fan", "X-Secure"]},
        "next_suggested_action": "Deploy volunteers to monitor redirects"
    }

# --- Crowd Service ---
@app.post("/api/v1/crowd/sensor")
async def update_sensor(payload: SensorUpdate):
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Sensor {payload.sensor_id} density updated to {payload.density_pct}% (flow: {payload.flow_rate} p/m)."
    
    event_timeline.append({"time": time_str, "category": "Crowd", "desc": desc})
    await ws_manager.broadcast({
        "event": "CrowdUpdated",
        "data": {"sensor_id": payload.sensor_id, "density": payload.density_pct, "flow_rate": payload.flow_rate}
    })
    return {"status": "success"}

@app.get("/api/v1/crowd/metrics")
def get_crowd_metrics():
    return {"active_sensors": 48, "average_density": 64.5, "average_concourse_wait": 288}

# --- Transit Service ---
@app.post("/api/v1/transit/update")
async def update_transit(payload: TransitUpdate):
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Transit update: {payload.hub} reports delay of {payload.delay_minutes} mins."
    
    event_timeline.append({"time": time_str, "category": "Transit", "desc": desc})
    await ws_manager.broadcast({
        "event": "TransitAlert",
        "data": {"hub": payload.hub, "delay": payload.delay_minutes, "occupancy": payload.occupancy_pct}
    })
    return {"status": "success"}

@app.get("/api/v1/transit/status")
def get_transit_status():
    return {
        "metro": [{"hub": "Metro East", "status": "delayed", "delay_min": 5}],
        "parking": {"lot_a": {"capacity": 95, "status": "full"}},
        "egress_recommendation": "Divert Metro East bound passengers to West shuttle bus loops."
    }

# --- Security Service ---
@app.post("/api/v1/security/incident")
async def report_incident(payload: IncidentReport):
    global active_alerts_count
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Security Alert: {payload.title} reported at {payload.location}."
    
    event_timeline.append({"time": time_str, "category": "Security", "desc": desc})
    active_alerts_count += 1
    
    await ws_manager.broadcast({
        "event": "SecurityIncident",
        "data": {"title": payload.title, "location": payload.location, "priority": payload.priority, "category": payload.category}
    })
    return {"status": "incident_logged"}

@app.post("/api/v1/security/evacuate")
async def toggle_evac(payload: EvacuationSignal):
    global simulation_mode
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    simulation_mode = "Evacuation" if payload.active else "Normal"
    
    desc = f"EVACUATION OVERRIDE: {payload.reason}" if payload.active else "EVACUATION TERMINATED. SYSTEM NOMINAL."
    event_timeline.append({"time": time_str, "category": "Security", "desc": desc})
    
    await ws_manager.broadcast({
        "event": "EvacuationActive",
        "data": {"active": payload.active, "reason": payload.reason}
    })
    return {"status": "success"}

@app.get("/api/v1/security/alerts")
def get_security_alerts():
    return {"active_incidents": active_alerts_count, "k9_units_deployed": 2, "medical_emergencies": 1}

# --- Volunteer Service ---
@app.post("/api/v1/volunteers/assign")
async def assign_vol(payload: Assignment):
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Volunteer roster: {payload.team_name} assigned to {payload.target_location} for {payload.assignment_task}."
    
    event_timeline.append({"time": time_str, "category": "Volunteer", "desc": desc})
    await ws_manager.broadcast({
        "event": "VolunteerAssigned",
        "data": {"team": payload.team_name, "location": payload.target_location, "task": payload.assignment_task}
    })
    return {"status": "dispatched"}

@app.get("/api/v1/volunteers/roster")
def get_vol_roster():
    return {"total_active_staff": 104, "standby_count": 15}

# --- Operations Service ---
@app.post("/api/v1/operations/gate")
async def toggle_gate(payload: GateState):
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Ops checkpoint: Gate {payload.gate_id} set to {payload.status}."
    
    event_timeline.append({"time": time_str, "category": "Operations", "desc": desc})
    await ws_manager.broadcast({
        "event": "GateOpened",
        "data": {"gate_id": payload.gate_id, "status": payload.status}
    })
    return {"status": "success"}

@app.post("/api/v1/operations/hvac")
def adjust_hvac(payload: HVACConfig):
    return {"status": "adjusted"}

@app.get("/api/v1/operations/facility")
def get_facility():
    return {"open_gates": 24, "cooling_grid_efficiency": 94.2, "solar_battery_cap": 85}

# --- Vendor Service ---
@app.post("/api/v1/vendors/alert")
async def vendor_alert(payload: InventoryAlert):
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Concessions: Low stock alert on {payload.item_name} at {payload.concession_id}."
    
    event_timeline.append({"time": time_str, "category": "Vendor", "desc": desc})
    await ws_manager.broadcast({
        "event": "VendorInventoryLow",
        "data": {"concession_id": payload.concession_id, "item": payload.item_name, "remaining": payload.units_remaining}
    })
    return {"status": "recorded"}

@app.get("/api/v1/vendors/status")
def get_vendors():
    return {"concessions_revenue_usd": 412480, "inventory_warnings": [{"concession": "Concourse 3 North", "item": "Halal Hotdogs", "remaining": 12}]}

# --- Accessibility Service ---
@app.post("/api/v1/accessibility/request")
async def accessibility_req(payload: AidRequest):
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Accessibility ticket: Guest {payload.guest_id} requested {payload.assistance_type} at {payload.pickup_point}."
    
    event_timeline.append({"time": time_str, "category": "Accessibility", "desc": desc})
    await ws_manager.broadcast({
        "event": "AccessibilityAssistanceLogged",
        "data": {"guest_id": payload.guest_id, "type": payload.assistance_type, "location": payload.pickup_point}
    })
    return {"status": "success"}

@app.get("/api/v1/accessibility/diagnostics")
def get_accessibility_diag():
    return {"elevators_online": "3 / 4", "sensory_room_load_pct": 45}

# --- Sustainability Service ---
@app.post("/api/v1/sustainability/offset")
async def sustainability_offset(payload: EcoOffsetRequest):
    time_str = datetime.utcnow().strftime("%H:%M:%S")
    desc = f"Eco Offset: Solar Battery grid offset triggered ({payload.grid_boost_kw}kW load)."
    
    event_timeline.append({"time": time_str, "category": "Sustainability", "desc": desc})
    await ws_manager.broadcast({
        "event": "SustainabilityGridOffset",
        "data": {"load_kw": payload.grid_boost_kw, "solar_battery": payload.offset_solar_battery}
    })
    return {"status": "success"}

@app.get("/api/v1/sustainability/metrics")
def get_sustainability_metrics():
    return {"green_score": 94.8, "solar_battery_charge": 85, "sorting_efficiency_pct": 82.5}

# --- Analytics Service ---
@app.get("/api/v1/analytics/timeline")
def get_analytics_timeline():
    return event_timeline[-15:]

@app.get("/api/v1/analytics/dashboard")
def get_analytics_dashboard():
    return {
        "attendance_trends": [{"match": "Match 3", "fans": 88450, "target": 90000}],
        "incidents_by_category": [{"category": "Crowd", "count": 42}]
    }

# --- WebSocket Channel Endnode ---
@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Maintain connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# --- Global Health Node ---
@app.get("/health")
def health():
    return {"status": "nominal", "unified_mock_server": "active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("run_local_mock:app", host="0.0.0.0", port=8000, reload=True)
