import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("accessibility_service")
logger = logging.getLogger("accessibility_service")

app = FastAPI(title="StadiaX Accessibility Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class AidRequest(BaseModel):
    guest_id: str
    assistance_type: str  # Wheelchair, Visual, Hearing
    pickup_point: str

@app.post("/api/v1/accessibility/request")
async def dispatch_aid(payload: AidRequest):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Publish event
    await eb.publish("AccessibilityAssistanceLogged", {
        "guest_id": payload.guest_id,
        "type": payload.assistance_type,
        "location": payload.pickup_point
    })
    
    logger.info(f"Accessibility aid request logged for guest {payload.guest_id}: {payload.assistance_type}")
    return {"status": "aid_dispatched", "guest_id": payload.guest_id}

@app.get("/api/v1/accessibility/diagnostics")
def get_diagnostics():
    return {
        "elevators_online": "3 / 4",
        "sensory_room_load_pct": 45,
        "active_itineraries": 38,
        "equipment_in_use": {
            "wheelchairs": 25,
            "hearing_loops": 12,
            "audio_description_devices": 66
        }
    }

@app.get("/api/v1/accessibility/health")
def health():
    return {"status": "nominal"}
