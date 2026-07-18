import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus

setup_logging("vendor_service")
logger = logging.getLogger("vendor_service")

app = FastAPI(title="StadiaX Vendor Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class InventoryAlert(BaseModel):
    concession_id: str
    item_name: str
    units_remaining: int

@app.post("/api/v1/vendors/alert")
async def register_alert(payload: InventoryAlert):
    eb = EventBus(redis_url=REDIS_URL)
    
    # Check if stock is low and publish alert
    if payload.units_remaining < 20:
        await eb.publish("VendorInventoryLow", {
            "concession_id": payload.concession_id,
            "item": payload.item_name,
            "remaining": payload.units_remaining
        })
        logger.warning(f"Stockout risk reported at {payload.concession_id}: {payload.item_name} has {payload.units_remaining} units left.")
        
    return {"status": "recorded", "concession": payload.concession_id}

@app.get("/api/v1/vendors/status")
def get_concessions():
    return {
        "active_pos_registers": 84,
        "concessions_revenue_usd": 412480,
        "popular_items": [
            {"name": "Medina Grill Shawarma", "sales": 1420},
            {"name": "Green Field Hummus Wrap", "sales": 980}
        ],
        "inventory_warnings": [
            {"concession": "Concourse 3 North", "item": "Halal Hotdogs", "remaining": 12}
        ]
    }

@app.get("/api/v1/vendors/health")
def health():
    return {"status": "nominal"}
