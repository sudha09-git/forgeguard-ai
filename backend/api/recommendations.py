from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from data.demo_data import get_recommendations
from datetime import datetime

router = APIRouter()

_approval_store = {}

@router.get("/")
def get_all_recommendations():
    recs = get_recommendations()
    for r in recs:
        if r["id"] in _approval_store:
            r.update(_approval_store[r["id"]])
    return recs

@router.get("/{rec_id}")
def get_recommendation(rec_id: str):
    recs = get_recommendations()
    item = next((r for r in recs if r["id"] == rec_id), None)
    if not item:
        return {"error": "Recommendation not found"}
    if rec_id in _approval_store:
        item.update(_approval_store[rec_id])
    return item

class ApprovalRequest(BaseModel):
    action: str  # "approve" or "reject"
    engineer_name: Optional[str] = "Engineer"
    notes: Optional[str] = None

@router.post("/{rec_id}/decision")
def process_decision(rec_id: str, body: ApprovalRequest):
    recs = get_recommendations()
    item = next((r for r in recs if r["id"] == rec_id), None)
    if not item:
        return {"error": "Recommendation not found"}

    status = "approved" if body.action == "approve" else "rejected"
    _approval_store[rec_id] = {
        "status": status,
        "approved_by": body.engineer_name,
        "approved_at": datetime.now().isoformat(),
        "notes": body.notes
    }
    return {
        "rec_id": rec_id,
        "status": status,
        "message": f"Recommendation {status} by {body.engineer_name}",
        "timestamp": datetime.now().isoformat()
    }

@router.get("/audit-trail/all")
def get_audit_trail():
    trail = []
    for rec_id, data in _approval_store.items():
        trail.append({"rec_id": rec_id, **data})
    return trail
