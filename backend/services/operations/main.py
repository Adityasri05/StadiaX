import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("operations_service")
logger = logging.getLogger("operations_service")

app = FastAPI(title="StadiaX Operations Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class GateState(BaseModel):
    gate_id: str
    status: str  # Open, Closed, Blocked

class HVACConfig(BaseModel):
    sector: str
    fan_speed_boost: int
    target_temp_c: float

@app.post("/api/v1/operations/gate")
async def toggle_gate(payload: GateState):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Publish GateOpened/Closed event
    await eb.publish("GateOpened", {
        "gate_id": payload.gate_id,
        "status": payload.status
    })
    
    logger.info(f"Gate {payload.gate_id} status updated to {payload.status}")
    return {"status": "success", "gate_id": payload.gate_id, "gate_status": payload.status}

@app.post("/api/v1/operations/hvac")
async def adjust_hvac(payload: HVACConfig):
    # Process HVAC update
    logger.info(f"HVAC grid adjusted in {payload.sector}: fan boost +{payload.fan_speed_boost}%, target {payload.target_temp_c}°C")
    return {"status": "baseline_adjusted", "hvac_offset": payload.fan_speed_boost}

@app.get("/api/v1/operations/facility")
def get_facility_status():
    return {
        "open_gates": 24,
        "cooling_grid_efficiency": 94.2,
        "hvac_power_kw": 240,
        "solar_battery_cap": 85,
        "maintenance_backlog": [
            {"node": "Lift B-3", "status": "dispatched_repair", "sla_min": 30}
        ]
    }

@app.get("/api/v1/operations/health")
def health():
    return {"status": "nominal"}
