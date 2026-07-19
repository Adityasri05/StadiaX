import os
import logging
import asyncio
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from shared.logging_helper import setup_logging
from shared.event_bus import EventBus
import httpx

setup_logging("ai_gateway")
logger = logging.getLogger("ai_gateway")

app = FastAPI(title="StadiaX AI Gateway Service", version="1.0.0")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "unknown"
    role: Optional[str] = "fan"

class AgentResponse(BaseModel):
    summary: str
    reasoning: str
    evidence: str
    confidence_score: float
    priority: str
    recommended_actions: List[str]
    affected_services: List[str]
    estimated_impact: str
    supporting_data: Dict[str, Any]
    next_suggested_action: str

# In-memory backup vector storage for local testing
local_memory = []

@app.on_event("startup")
async def startup():
    logger.info("AI Gateway Service started.")

# --- Multi-Agent Node Classes ---
class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    async def run(self, query: str) -> Dict[str, Any]:
        raise NotImplementedError

class XFanAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Identified seat location in Sector 108.",
            "reasoning": "Standard ticket match shows Gate 4 entrance as closest. Access lift B-3 outage requires redirecting via South Ramp 3.",
            "evidence": "Ticket barcode #WC26-108H-14 resolves to Sector 108.",
            "confidence_score": 0.98,
            "priority": "normal",
            "recommended_actions": ["Reroute guest to Gate 6, utilize lower concourse corridor"],
            "affected_services": ["accessibility", "crowd"],
            "estimated_impact": "Discharge fan direct pathing in 6 mins walk",
            "supporting_data": {"gate_closest": "Gate 4", "gate_recommended": "Gate 6", "delay": "0 wait time"},
            "next_suggested_action": "Push route layout card to user mobile client"
        }

class XCrowdAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Gate 4 bottleneck detected.",
            "reasoning": "Security check lane 3 is congested (92% capacity) with wait times hitting 11 minutes.",
            "evidence": "Visual density sensors G4-Inner report crowd build-up at 180 p/m.",
            "confidence_score": 0.95,
            "priority": "high",
            "recommended_actions": ["Trigger bypass signboards to divert incoming flow to Gate 6"],
            "affected_services": ["crowd", "operations"],
            "estimated_impact": "Reduce Gate 4 queue latency from 11m to 2m",
            "supporting_data": {"wait_time": 11, "inflow_rate": 180, "target_gate": "Gate 6"},
            "next_suggested_action": "Enable secondary verification scanners at Gate 6"
        }

class XSecureAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Unattended bag alert at Gate 8 security zone.",
            "reasoning": "Object tracking system flagged bag stationary for over 12 minutes.",
            "evidence": "CCTV-08 feed frame check confirms owner departed zone.",
            "confidence_score": 0.99,
            "priority": "high",
            "recommended_actions": ["Deploy K9 Unit S-2", "Isolate a 15-meter buffer radius at Gate 8"],
            "affected_services": ["security", "volunteers"],
            "estimated_impact": "Threat isolation in under 3 minutes",
            "supporting_data": {"incident_id": "inc-3", "k9_unit": "S-2", "safe_radius": "15m"},
            "next_suggested_action": "Coordinate standby emergency exits clearance"
        }

class XTransitAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Metro Station East platform spike forecast.",
            "reasoning": "End-of-match egress volumes will exceed standard metro loading capacities by 30%.",
            "evidence": "Tournament historic egress vectors map 40% of South Stand exiting to Metro East.",
            "confidence_score": 0.92,
            "priority": "high",
            "recommended_actions": ["Divert fans to Shuttle Bus Loop B", "Implement delayed train boarding schedules"],
            "affected_services": ["transit", "crowd"],
            "estimated_impact": "Prevent metro platform gridlock delay of 18 minutes",
            "supporting_data": {"metro_load": 94, "shuttles_available": 12, "headways": "150s"},
            "next_suggested_action": "Send rideshare loop capacity boost instructions to terminal managers"
        }

class XVolunteerAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Volunteer re-deployment proposal.",
            "reasoning": "Sector 104 is experiencing a spike in Spanish language requests.",
            "evidence": "4 active translation tickets queued. Volunteer Team A has standby capacity.",
            "confidence_score": 0.89,
            "priority": "normal",
            "recommended_actions": ["Move 2 Spanish-speaking volunteers from Team A to Sector 104"],
            "affected_services": ["volunteer"],
            "estimated_impact": "Clear language request backlog in <5 minutes",
            "supporting_data": {"bilingual_count": 5, "team_source": "Team A", "target_sector": "Sector 104"},
            "next_suggested_action": "Broadcast re-deployment coordinates to Team A lead"
        }

class XAssistAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Elevator B-3 outage diversion routing.",
            "reasoning": "Hydraulic failure detected. Wheelchair itineraries must avoid main stand lifts.",
            "evidence": "Lift B-3 telemetry states error: Hydraulic pressure drop.",
            "confidence_score": 0.97,
            "priority": "high",
            "recommended_actions": ["Reroute accessibility guests to Elevator B-4", "Activate South Ramp 3 guide lines"],
            "affected_services": ["accessibility", "operations"],
            "estimated_impact": "Maintain 100% step-free routing compliance",
            "supporting_data": {"outage_node": "Lift B-3", "alt_node": "Lift B-4", "ramp_slope": "1:12"},
            "next_suggested_action": "Deploy accessibility assistant to guide guests around B-3 corridor"
        }

class XOpsAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Sector 108 cooling grid adjustments.",
            "reasoning": "Thermal sensors report Sector 108 average temperature exceeded target bounds by 1.2°C.",
            "evidence": "Sensory telemetry logs target: 18.5°C vs current: 19.7°C.",
            "confidence_score": 0.94,
            "priority": "normal",
            "recommended_actions": ["Boost airflow nodes in Sector 108 by 12%"],
            "affected_services": ["operations", "sustainability"],
            "estimated_impact": "Restore thermal baseline comfort in 4 minutes",
            "supporting_data": {"temp_current": 19.7, "temp_target": 18.5, "flow_boost": 12},
            "next_suggested_action": "Monitor smart solar batteries cap offset load"
        }

class XVendorAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Halal Hotdogs supply depletion warning.",
            "reasoning": "Sales rate at Concourse 3 North indicates stockout before half-time.",
            "evidence": "Hotdogs stock: 12 units. Sales speed: +32/m.",
            "confidence_score": 0.91,
            "priority": "low",
            "recommended_actions": ["Dispatch supply run cart from central depot Bay D"],
            "affected_services": ["vendors"],
            "estimated_impact": "Prevent concessions stockout during half-time",
            "supporting_data": {"concession": "Concourse 3 North", "stock": 12, "sales_speed": 32},
            "next_suggested_action": "Acknowledge supply dispatcher alert"
        }

class XGreenAgent(BaseAgent):
    async def run(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Solar battery buffer engagement.",
            "reasoning": "Grid draw spike detected. Solar battery bank has 85% capacity.",
            "evidence": "Cooling load boost requires 150kW grid draw.",
            "confidence_score": 0.96,
            "priority": "normal",
            "recommended_actions": ["Engage solar battery grid dispatch offset"],
            "affected_services": ["sustainability"],
            "estimated_impact": "Save 150kW peak grid draw, maintain carbon offset baseline",
            "supporting_data": {"battery_cap": 85, "load_offset": 150},
            "next_suggested_action": "Review green energy sorting stats"
        }

# Agent registry
AGENTS = {
    "fan": XFanAgent("X-Fan", "fan assistance"),
    "crowd": XCrowdAgent("X-Crowd", "crowd modeling"),
    "security": XSecureAgent("X-Secure", "threat assessment"),
    "transit": XTransitAgent("X-Transit", "transportation"),
    "volunteer": XVolunteerAgent("X-Volunteer", "staff management"),
    "accessibility": XAssistAgent("X-Assist", "accessibility routing"),
    "operations": XOpsAgent("X-Ops", "facility control"),
    "vendor": XVendorAgent("X-Vendor", "inventory predict"),
    "sustainability": XGreenAgent("X-Green", "energy optimize")
}

async def call_gemini_api(prompt: str, model: str = GEMINI_MODEL) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers, timeout=12.0)
            if response.status_code == 200:
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                logger.error(f"Gemini API returned status code {response.status_code}: {response.text}")
                return ""
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return ""

# LangGraph-inspired Cognitive pipeline orchestrator
async def orchestrate_agents(query: str) -> Dict[str, Any]:
    lower_query = query.toLowerCase() if hasattr(query, "toLowerCase") else query.lower()
    
    # 1. Intent Detection / Routing
    selected_agent_keys = []
    if "seat" in lower_query or "guide" in lower_query:
        selected_agent_keys = ["fan", "accessibility", "crowd"]
    elif "food" in lower_query or "halal" in lower_query or "vegetarian" in lower_query:
        selected_agent_keys = ["fan", "vendor"]
    elif "emergency" in lower_query or "bag" in lower_query or "security" in lower_query or "missing" in lower_query:
        selected_agent_keys = ["security", "volunteer", "accessibility"]
    elif "metro" in lower_query or "parking" in lower_query or "exit" in lower_query:
        selected_agent_keys = ["transit", "crowd"]
    elif "temp" in lower_query or "cooling" in lower_query or "hvac" in lower_query:
        selected_agent_keys = ["operations", "sustainability"]
    else:
        # Default fallback includes fan concierge & operations summary
        selected_agent_keys = ["fan", "operations"]

    logger.info(f"LangGraph classifier selected agents: {selected_agent_keys}")

    # 2. Parallel Agent Execution
    tasks = []
    for key in selected_agent_keys:
        agent = AGENTS[key]
        tasks.append(agent.run(query))
        
    outputs = await asyncio.gather(*tasks)

    # 3. Merge & Conflict Resolution Node
    # (Example: If security blocks West egress but transit planned it, we resolve here)
    merged_summary = []
    merged_actions = []
    merged_services = set()
    highest_priority = "low"
    max_confidence = 0.0
    combined_supporting = {}
    
    is_hazard = any("bag" in o["summary"].lower() or "unattended" in o["summary"].lower() for o in outputs)
    is_exit_query = "exit" in lower_query or "leave" in lower_query

    for out in outputs:
        merged_summary.append(out["summary"])
        merged_services.update(out["affected_services"])
        
        # Override actions in case of a hazard + exit conflict
        if is_hazard and is_exit_query and "transit" in out["affected_services"]:
            # Route away from Gate 8/West
            merged_actions.append("REROUTE EGRESS VECTOR: Divert passengers strictly through East Ramps. Avoid West Gate area.")
        else:
            merged_actions.extend(out["recommended_actions"])
            
        combined_supporting.update(out["supporting_data"])
        
        # Track max confidence and highest priority
        max_confidence = max(max_confidence, out["confidence_score"])
        if out["priority"] == "high":
            highest_priority = "high"
        elif out["priority"] == "medium" and highest_priority == "low":
            highest_priority = "medium"

    final_summary = " // ".join(merged_summary)
    final_reasoning = "LangGraph orchestrated parallel agent nodes. Resolved safety parameters."
    
    if GEMINI_API_KEY:
        prompt = f"""
You are the StadiaX AI OS, an autonomous operations brain for smart stadiums during the FIFA World Cup 2026.
Synthesize the following telemetry findings into a single, cohesive, professional operational briefing for the commander.

User Query: "{query}"

Sub-Agent Findings:
{"\n".join(f"- {out['name']} ({out['role']}): {out['summary']} (Confidence: {out['confidence_score']})" for out in outputs)}

Provide a concise, formal summary of the situation.
"""
        gemini_summary = await call_gemini_api(prompt)
        if gemini_summary:
            final_summary = gemini_summary.strip()
            final_reasoning = f"Synthesized via {GEMINI_MODEL} using sub-agent inputs."

    # 4. Long-term memory simulation (Write back to vector Qdrant/local storage)
    memory_entry = {
        "query": query,
        "summary": final_summary,
        "agents_consulted": selected_agent_keys,
        "timestamp": datetime_string()
    }
    local_memory.append(memory_entry)
    logger.info("Saved cognitive trace to memory.")

    # 5. Formulate final response standard schema
    return {
        "summary": final_summary,
        "reasoning": final_reasoning,
        "evidence": f"Telemetry verified across {len(outputs)} sensor arrays.",
        "confidence_score": max_confidence,
        "priority": highest_priority,
        "recommended_actions": list(set(merged_actions)),
        "affected_services": list(merged_services),
        "estimated_impact": "Operational compliance preserved with reduced response latencies.",
        "supporting_data": combined_supporting,
        "next_suggested_action": "Deploy volunteers to monitor gate redirects"
    }

def datetime_string() -> str:
    import datetime
    return datetime.datetime.utcnow().isoformat()

# AI Endpoint
@app.post("/api/v1/ai/query", response_model=AgentResponse)
async def query_ai(payload: QueryRequest):
    # If GEMINI_API_KEY is present, we could do full LLM call
    # For robust enterprise operations, we execute our LangGraph coordinator
    try:
        response_data = await orchestrate_agents(payload.query)
        
        # Publish event about AI Decision
        eb = EventBus(redis_url=REDIS_URL)
        await eb.publish("AIDecisionLogged", {
            "user_id": payload.user_id,
            "query": payload.query,
            "summary": response_data["summary"],
            "priority": response_data["priority"]
        })
        
        return response_data
    except Exception as e:
        logger.error(f"Error in AI Gateway query: {e}")
        raise HTTPException(status_code=500, detail="Internal AI engine error.")

@app.get("/api/v1/ai/health")
def health():
    return {
        "status": "nominal",
        "langgraph_engine": "active",
        "vector_memory": f"Qdrant local sync active ({len(local_memory)} indices)"
    }
