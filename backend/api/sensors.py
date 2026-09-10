from fastapi import APIRouter, Query
from data.demo_data import get_sensor_stream, MACHINES
import random, math
from datetime import datetime

router = APIRouter()

@router.get("/stream/{machine_id}")
def get_sensor_data(machine_id: str, points: int = Query(60, ge=10, le=300)):
    return {
        "machine_id": machine_id,
        "data_type": "Live Simulation",
        "disclaimer": "This data is AI-generated simulation — not connected to physical hardware.",
        "points": get_sensor_stream(machine_id, points)
    }

@router.get("/current")
def get_current_readings():
    readings = []
    for m in MACHINES:
        readings.append({
            "machine_id": m["id"],
            "machine_name": m["name"],
            "status": m["status"],
            "temperature": m["temperature"] + random.gauss(0, 0.2),
            "pressure": m["pressure"] + random.gauss(0, 0.02),
            "vibration": m["vibration"] + random.gauss(0, 0.05),
            "rpm": m["rpm"],
            "humidity": 42 + random.gauss(0, 0.3),
            "current": m["current"] + random.gauss(0, 0.1),
            "cycle_time": m["cycle_time"],
            "timestamp": datetime.now().isoformat(),
            "data_type": "Live Simulation"
        })
    return readings

@router.get("/parameters")
def get_parameter_definitions():
    return [
        {"id": "temperature", "name": "Temperature", "unit": "°C", "normal_range": [228, 245], "warning_threshold": 248, "critical_threshold": 255},
        {"id": "pressure", "name": "Pressure", "unit": "bar", "normal_range": [7.8, 8.5], "warning_threshold": 8.7, "critical_threshold": 9.0},
        {"id": "vibration", "name": "Vibration", "unit": "mm/s", "normal_range": [0, 4.0], "warning_threshold": 6.0, "critical_threshold": 8.0},
        {"id": "rpm", "name": "RPM", "unit": "RPM", "normal_range": [1720, 1850], "warning_threshold": 1900, "critical_threshold": 1950},
        {"id": "humidity", "name": "Humidity", "unit": "%", "normal_range": [38, 48], "warning_threshold": 52, "critical_threshold": 58},
        {"id": "current", "name": "Machine Current", "unit": "A", "normal_range": [15, 22], "warning_threshold": 24, "critical_threshold": 27},
        {"id": "cycle_time", "name": "Cycle Time", "unit": "s", "normal_range": [38, 48], "warning_threshold": 52, "critical_threshold": 58}
    ]
