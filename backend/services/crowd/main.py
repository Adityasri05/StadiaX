import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("crowd_service")
logger = logging.getLogger("crowd_service")

app = FastAPI(title="StadiaX Crowd Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class SensorUpdate(BaseModel):
    sensor_id: str
    density_pct: float
    flow_rate: int  # people per minute

@app.post("/api/v1/crowd/sensor")
async def update_sensor(payload: SensorUpdate):
    # Process sensor update
    risk_score = "low"
    if payload.density_pct > 90:
        risk_score = "high"
    elif payload.density_pct > 70:
        risk_score = "medium"

    # Publish CrowdUpdated event
    eb = EventBus(redis_url=REDIS_URL)
    await eb.publish("CrowdUpdated", {
        "sensor_id": payload.sensor_id,
        "density": payload.density_pct,
        "flow_rate": payload.flow_rate,
        "risk_level": risk_score
    })

    return {
        "status": "success",
        "sensor_id": payload.sensor_id,
        "risk_score": risk_score
    }

@app.get("/api/v1/crowd/metrics")
def get_metrics():
    return {
        "active_sensors": 48,
        "average_density": 64.5,
        "peak_zones": ["Gate 4", "Sector 204 Lift Corridor"],
        "average_concourse_wait": 288  # seconds (4.8 mins)
    }

@app.get("/api/v1/crowd/health")
def health():
    return {"status": "nominal"}
