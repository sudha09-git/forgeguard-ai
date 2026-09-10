from fastapi import APIRouter
from data.demo_data import AGENTS

router = APIRouter()

@router.get("/")
def get_agents():
    return AGENTS

@router.get("/workflow")
def get_agent_workflow():
    return {
        "steps": [
            {"order": 1, "name": "Sensor Data Ingestion", "agent": None, "type": "input", "status": "active"},
            {"order": 2, "name": "Process Monitoring Agent", "agent": "AGENT-001", "type": "agent", "status": "active"},
            {"order": 3, "name": "Quality Analysis Agent", "agent": "AGENT-002", "type": "agent", "status": "active"},
            {"order": 4, "name": "Defect Prediction Agent", "agent": "AGENT-003", "type": "agent", "status": "active"},
            {"order": 5, "name": "Root Cause Analysis", "agent": "AGENT-003", "type": "analysis", "status": "active"},
            {"order": 6, "name": "Optimization Agent", "agent": "AGENT-004", "type": "agent", "status": "active"},
            {"order": 7, "name": "Engineer Approval", "agent": None, "type": "human", "status": "pending"},
            {"order": 8, "name": "Report Generation", "agent": "AGENT-005", "type": "agent", "status": "idle"}
        ],
        "technology": "IBM Langflow + IBM Granite Models",
        "architecture": "Multi-Agent RAG Pipeline"
    }

@router.get("/{agent_id}")
def get_agent(agent_id: str):
    agent = next((a for a in AGENTS if a["id"] == agent_id), None)
    if not agent:
        return {"error": "Agent not found"}
    return agent
