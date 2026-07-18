import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("transit_service")
logger = logging.getLogger("transit_service")

app = FastAPI(title="StadiaX Transit Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class TransitUpdate(BaseModel):
    hub: str
    delay_minutes: int
    occupancy_pct: float

@app.post("/api/v1/transit/update")
async def update_transit(payload: TransitUpdate):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Check if load is high and publish alert
    if payload.occupancy_pct > 90:
        await eb.publish("TransitAlert", {
            "hub": payload.hub,
            "delay": payload.delay_minutes,
            "occupancy": payload.occupancy_pct,
            "critical": True
        })
        
    return {"status": "synced", "hub": payload.hub}

@app.get("/api/v1/transit/status")
def get_status():
    return {
        "metro": [
            {"hub": "Metro East", "status": "delayed", "delay_min": 5},
            {"hub": "Metro West", "status": "nominal", "delay_min": 0}
        ],
        "parking": {
            "lot_a": {"capacity": 95, "status": "full"},
            "lot_b": {"capacity": 72, "status": "available"}
        },
        "egress_recommendation": "Divert Metro East bound passengers to West shuttle bus loops."
    }

@app.get("/api/v1/transit/health")
def health():
    return {"status": "nominal"}
