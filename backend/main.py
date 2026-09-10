from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import production, sensors, anomalies, defects, predictions, recommendations, agents, reports, simulation, rag, history

app = FastAPI(title="ForgeGuard AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(production.router, prefix="/api/production", tags=["production"])
app.include_router(sensors.router, prefix="/api/sensors", tags=["sensors"])
app.include_router(anomalies.router, prefix="/api/anomalies", tags=["anomalies"])
app.include_router(defects.router, prefix="/api/defects", tags=["defects"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["simulation"])
app.include_router(rag.router, prefix="/api/rag", tags=["rag"])
app.include_router(history.router, prefix="/api/history", tags=["history"])

@app.get("/api/health")
def health_check():
    return {"status": "operational", "service": "ForgeGuard AI", "version": "1.0.0"}

@app.get("/api/dashboard/summary")
def dashboard_summary():
    return {
        "quality_score": 96.4,
        "quality_score_trend": 2.8,
        "production_rate": 1247,
        "production_rate_unit": "units/hr",
        "production_rate_trend": 1.2,
        "first_pass_yield": 94.2,
        "first_pass_yield_trend": 0.8,
        "defect_probability": 7.8,
        "defect_probability_trend": -3.1,
        "active_anomalies": 3,
        "predicted_defects": 2,
        "machine_health": 92.1,
        "machine_health_trend": -0.5,
        "process_stability": 88.4,
        "process_stability_trend": 1.1,
        "machines_online": 8,
        "machines_total": 8,
        "system_status": "operational",
        "ai_status": "active",
        "active_alerts": 3,
        "sparklines": {
            "quality_score": [93.1, 94.2, 93.8, 95.1, 94.7, 95.8, 96.4],
            "defect_probability": [12.4, 11.2, 10.8, 9.5, 8.9, 8.1, 7.8],
            "production_rate": [1180, 1200, 1215, 1230, 1220, 1241, 1247],
            "machine_health": [91.2, 91.8, 92.5, 93.1, 92.8, 92.4, 92.1]
        }
    }
