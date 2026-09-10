from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SimulationRequest(BaseModel):
    machine_id: str = "M-03"
    temperature: Optional[float] = 232.0
    rpm: Optional[int] = 1720
    pressure: Optional[float] = 8.0
    vibration_threshold: Optional[float] = 4.0
    material_moisture: Optional[float] = 2.2
    flow_rate: Optional[float] = 13.0

def compute_defect_risk(temp, rpm, pressure, vibration, moisture):
    base = 0.10
    temp_factor = max(0, (temp - 235) / 20) * 0.35
    rpm_factor = max(0, (rpm - 1750) / 200) * 0.15
    pressure_factor = max(0, (pressure - 8.4) / 0.8) * 0.10
    vib_factor = max(0, (vibration - 4.0) / 4.0) * 0.30
    moisture_factor = max(0, (moisture - 2.3) / 1.5) * 0.10
    total = base + temp_factor + rpm_factor + pressure_factor + vib_factor + moisture_factor
    return min(0.98, max(0.02, round(total, 3)))

def compute_quality_score(defect_risk):
    return round(max(40, min(100, 100 - defect_risk * 75)), 1)

@router.post("/run")
def run_simulation(req: SimulationRequest):
    # Current M-03 values
    current_temp = 251.3
    current_rpm = 1756
    current_pressure = 8.7
    current_vibration = 8.7
    current_moisture = 2.8

    current_risk = compute_defect_risk(current_temp, current_rpm, current_pressure, current_vibration, current_moisture)
    proposed_risk = compute_defect_risk(req.temperature, req.rpm, req.pressure, req.vibration_threshold, req.material_moisture)

    current_quality = compute_quality_score(current_risk)
    proposed_quality = compute_quality_score(proposed_risk)

    improvement_pct = round((current_risk - proposed_risk) / current_risk * 100, 1) if current_risk > 0 else 0

    return {
        "simulation_id": f"SIM-{__import__('uuid').uuid4().hex[:8].upper()}",
        "machine_id": req.machine_id,
        "disclaimer": "AI-assisted scenario simulation — not a guaranteed physical outcome. Physical validation required before implementing changes.",
        "current_config": {
            "temperature": current_temp,
            "rpm": current_rpm,
            "pressure": current_pressure,
            "vibration_threshold": current_vibration,
            "material_moisture": current_moisture,
            "flow_rate": 11.8
        },
        "proposed_config": {
            "temperature": req.temperature,
            "rpm": req.rpm,
            "pressure": req.pressure,
            "vibration_threshold": req.vibration_threshold,
            "material_moisture": req.material_moisture,
            "flow_rate": req.flow_rate
        },
        "results": {
            "current_defect_risk_pct": round(current_risk * 100, 1),
            "simulated_defect_risk_pct": round(proposed_risk * 100, 1),
            "current_quality_score": current_quality,
            "simulated_quality_score": proposed_quality,
            "risk_reduction_pct": improvement_pct,
            "quality_improvement": round(proposed_quality - current_quality, 1)
        },
        "chart_data": {
            "before_after": [
                {"metric": "Defect Risk %", "current": round(current_risk * 100, 1), "simulated": round(proposed_risk * 100, 1)},
                {"metric": "Quality Score", "current": current_quality, "simulated": proposed_quality},
                {"metric": "Estimated FPY %", "current": round(100 - current_risk * 30, 1), "simulated": round(100 - proposed_risk * 30, 1)}
            ]
        }
    }

@router.get("/defaults")
def get_simulation_defaults():
    return {
        "machine_id": "M-03",
        "current_temperature": 251.3,
        "current_rpm": 1756,
        "current_pressure": 8.7,
        "current_vibration": 8.7,
        "current_moisture": 2.8,
        "recommended_temperature": 232.0,
        "recommended_rpm": 1720,
        "recommended_pressure": 8.0,
        "recommended_vibration": 4.0,
        "recommended_moisture": 2.2
    }
