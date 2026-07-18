import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("sustainability_service")
logger = logging.getLogger("sustainability_service")

app = FastAPI(title="StadiaX Sustainability Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class EcoOffsetRequest(BaseModel):
    grid_boost_kw: float
    offset_solar_battery: bool

@app.post("/api/v1/sustainability/offset")
async def trigger_offset(payload: EcoOffsetRequest):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Publish event
    await eb.publish("SustainabilityGridOffset", {
        "load_kw": payload.grid_boost_kw,
        "solar_battery": payload.offset_solar_battery
    })
    
    logger.info(f"Eco Battery grid offset triggered. Grid draw: {payload.grid_boost_kw}kW, Solar buffer: {payload.offset_solar_battery}")
    return {"status": "eco_offset_triggered", "load_offset_kw": payload.grid_boost_kw}

@app.get("/api/v1/sustainability/metrics")
def get_metrics():
    return {
        "green_score": 94.8,
        "carbon_offset_ratio": 94.8,
        "recycled_water_liters": 14200,
        "solar_battery_charge": 85,
        "sorting_efficiency_pct": 82.5
    }

@app.get("/api/v1/sustainability/health")
def health():
    return {"status": "nominal"}
