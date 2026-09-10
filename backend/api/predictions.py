from fastapi import APIRouter
from data.demo_data import get_predictions, QUALITY_SCORE_BREAKDOWN

router = APIRouter()

@router.get("/")
def get_all_predictions():
    return get_predictions()

@router.get("/active")
def get_active_predictions():
    return [p for p in get_predictions() if p["status"] == "active"]

@router.get("/quality-score")
def get_quality_score():
    return QUALITY_SCORE_BREAKDOWN

@router.get("/{prediction_id}")
def get_prediction(prediction_id: str):
    preds = get_predictions()
    item = next((p for p in preds if p["id"] == prediction_id), None)
    if not item:
        return {"error": "Prediction not found"}
    return item
