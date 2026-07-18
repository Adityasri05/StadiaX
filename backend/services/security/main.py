import os
import logging
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("security_service")
logger = logging.getLogger("security_service")

app = FastAPI(title="StadiaX Security Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class IncidentReport(BaseModel):
    title: str
    location: str
    priority: str  # high, medium, low
    category: str  # Crowd, Accessibility, Security, Medical

class EvacuationSignal(BaseModel):
    active: bool
    reason: str

@app.post("/api/v1/security/incident")
async def report_incident(payload: IncidentReport):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Publish SecurityIncident event
    await eb.publish("SecurityIncident", {
        "title": payload.title,
        "location": payload.location,
        "priority": payload.priority,
        "category": payload.category,
        "status": "Active"
    })
    
    return {"status": "incident_logged", "priority": payload.priority}

@app.post("/api/v1/security/evacuate")
async def toggle_evacuation(payload: EvacuationSignal):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Publish EvacuationActive event
    await eb.publish("EvacuationActive", {
        "active": payload.active,
        "reason": payload.reason
    })
    
    logger.warning(f"EVACUATION TRIGGER COMMAND INITIATED: {payload.reason}")
    return {"status": "evacuation_status_updated", "active": payload.active}

@app.get("/api/v1/security/alerts")
def get_alerts():
    return {
        "active_incidents": 3,
        "k9_units_deployed": 2,
        "cctv_nodes_scanning": 480,
        "medical_emergencies": 1
    }

@app.get("/api/v1/security/health")
def health():
    return {"status": "nominal"}
