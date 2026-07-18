import os
import logging
import asyncio
from typing import List, Dict, Any
from fastapi import FastAPI
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("analytics_service")
logger = logging.getLogger("analytics_service")

app = FastAPI(title="StadiaX Analytics Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# In-memory event ledger for local timeline aggregation
event_timeline: List[Dict[str, Any]] = [
    {"time": "14:44:02", "category": "Medical", "desc": "Medical Team dispatch confirmed for Sector 112 Row F."},
    {"time": "14:42:15", "category": "Transit", "desc": "Shuttle Loop 12 schedule adjusted to offset Metro East load."},
    {"time": "14:41:40", "category": "Vendor", "desc": "Food Court C vendor flagged restock order #942."},
    {"time": "14:40:02", "category": "Crowd", "desc": "Bypass signages enabled: Redirecting fans to Gate 6."},
    {"time": "14:38:50", "category": "Security", "desc": "Unattended bag isolated near Gate 8. K9 sweep in progress."}
]

@app.on_event("startup")
async def startup_event():
    logger.info("Analytics Service started.")
    # Spawn background event bus listener to build our real-time timeline ledger
    asyncio.create_task(listen_to_all_events())

@app.get("/api/v1/analytics/timeline")
def get_timeline():
    # Return last 20 events
    return event_timeline[-20:]

@app.get("/api/v1/analytics/dashboard")
def get_dashboard_aggregates():
    return {
        "attendance_trends": [
            {"match": "Match 1", "fans": 82000, "target": 90000},
            {"match": "Match 2", "fans": 85500, "target": 90000},
            {"match": "Match 3", "fans": 88450, "target": 90000},
            {"match": "Match 4", "fans": 89100, "target": 90000}
        ],
        "incidents_by_category": [
            {"category": "Crowd", "count": 42},
            {"category": "Transit", "count": 28},
            {"category": "Security", "count": 14},
            {"category": "Medical", "count": 22},
            {"category": "Accessibility", "count": 19}
        ],
        "volunteer_response_latencies": [
            {"team": "Team A", "latency": 4.2},
            {"team": "Team B", "latency": 3.8},
            {"team": "Team C", "latency": 5.1},
            {"team": "Team D", "latency": 2.9}
        ],
        "sales_split": [
            {"name": "Beverages", "value": 142000},
            {"name": "Snacks", "value": 98000},
            {"name": "Hot Meals", "value": 120000},
            {"name": "Merchandise", "value": 52480}
        ]
    }

async def listen_to_all_events():
    logger.info("Analytics event subscriber starting up...")
    eb = EventBus(redis_url=REDIS_URL)
    await eb.connect()

    async def handle_bus_event(event_type: str, payload: dict):
        import datetime
        time_str = datetime.datetime.utcnow().strftime("%H:%M:%S")
        
        # Build description based on event payload
        desc = f"Telemetry alert of type {event_type} registered."
        category = "Operations"
        
        if event_type == "SecurityIncident":
            desc = f"Security: {payload.get('title')} reported at {payload.get('location')}."
            category = "Security"
        elif event_type == "TransitAlert":
            desc = f"Transit: Delay reported at {payload.get('hub')} ({payload.get('delay')} min delay)."
            category = "Transit"
        elif event_type == "VolunteerAssigned":
            desc = f"Volunteer: Roster team {payload.get('team')} deployed to {payload.get('location')} for {payload.get('task')}."
            category = "Volunteer"
        elif event_type == "GateOpened":
            desc = f"Operations: Gate {payload.get('gate_id')} status set to {payload.get('status')}."
            category = "Operations"
        elif event_type == "VendorInventoryLow":
            desc = f"Vendor: Concessions inventory low on {payload.get('item')} at {payload.get('concession_id')}."
            category = "Vendor"
        elif event_type == "EvacuationActive":
            desc = f"EMERGENCY SIGNAL BROADCAST: Evacuation state set to {payload.get('active')} ({payload.get('reason')})."
            category = "Security"

        new_event = {
            "time": time_str,
            "category": category,
            "desc": desc
        }
        event_timeline.append(new_event)
        logger.info(f"Timeline updated: {desc}")

    # Subscribe to group
    await eb.subscribe(group_name="analytics_group", consumer_name="analytics_ledger_builder", callback=handle_bus_event)

@app.get("/api/v1/analytics/health")
def health():
    return {"status": "nominal"}
