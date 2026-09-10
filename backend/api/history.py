from fastapi import APIRouter
from data.demo_data import HISTORICAL_DATA

router = APIRouter()

@router.get("/")
def get_historical(days: int = 7):
    limit = days * 24
    return HISTORICAL_DATA[-limit:]

@router.get("/summary")
def get_historical_summary():
    data = HISTORICAL_DATA
    if not data:
        return {}
    quality_scores = [d["quality_score"] for d in data]
    defect_rates = [d["defect_rate"] for d in data]
    return {
        "avg_quality_score": round(sum(quality_scores) / len(quality_scores), 1),
        "avg_defect_rate": round(sum(defect_rates) / len(defect_rates), 2),
        "total_production_volume": sum(d["production_volume"] for d in data),
        "anomaly_count": sum(1 for d in data if d["anomaly"]),
        "data_points": len(data)
    }
