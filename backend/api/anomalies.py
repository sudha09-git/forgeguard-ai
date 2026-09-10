from fastapi import APIRouter, Query
from data.demo_data import ANOMALIES, generate_anomalies

router = APIRouter()

@router.get("/")
def get_anomalies(severity: str = Query(None), status: str = Query(None), machine_id: str = Query(None)):
    data = generate_anomalies()
    if severity:
        data = [a for a in data if a["severity"] == severity]
    if status:
        data = [a for a in data if a["status"] == status]
    if machine_id:
        data = [a for a in data if a["machine_id"] == machine_id]
    return data

@router.get("/timeline")
def get_anomaly_timeline():
    data = generate_anomalies()
    return sorted(data, key=lambda x: x["timestamp"], reverse=True)

@router.get("/summary")
def get_anomaly_summary():
    data = generate_anomalies()
    return {
        "total": len(data),
        "critical": sum(1 for a in data if a["severity"] == "critical"),
        "high": sum(1 for a in data if a["severity"] == "high"),
        "warning": sum(1 for a in data if a["severity"] == "warning"),
        "active": sum(1 for a in data if a["status"] == "active"),
        "monitoring": sum(1 for a in data if a["status"] == "monitoring")
    }

@router.get("/{anomaly_id}")
def get_anomaly(anomaly_id: str):
    data = generate_anomalies()
    item = next((a for a in data if a["id"] == anomaly_id), None)
    if not item:
        return {"error": "Anomaly not found"}
    return item
