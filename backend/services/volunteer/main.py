import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("volunteer_service")
logger = logging.getLogger("volunteer_service")

app = FastAPI(title="StadiaX Volunteer Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class Assignment(BaseModel):
    team_name: str
    target_location: str
    assignment_task: str

@app.post("/api/v1/volunteers/assign")
async def assign_volunteer(payload: Assignment):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Publish VolunteerAssigned event
    await eb.publish("VolunteerAssigned", {
        "team": payload.team_name,
        "location": payload.target_location,
        "task": payload.assignment_task
    })
    
    logger.info(f"Assigned volunteer team {payload.team_name} to {payload.target_location}")
    return {"status": "dispatched", "team": payload.team_name}

@app.get("/api/v1/volunteers/roster")
def get_roster():
    return {
        "total_active_staff": 104,
        "standby_count": 15,
        "active_deployments": [
            {"team": "Team A", "zone": "Sector 108", "task": "Crowd Flow"},
            {"team": "Team B", "zone": "Gate 4", "task": "Queue Validation"},
            {"team": "Team D", "zone": "Sector 204", "task": "Accessibility Escort"}
        ]
    }

@app.get("/api/v1/volunteers/health")
def health():
    return {"status": "nominal"}
