from fastapi import APIRouter, Query
from data.demo_data import HISTORICAL_DATA

router = APIRouter()

@router.get("/")
def get_defects(machine_id: str = Query(None), defect_type: str = Query(None)):
    defect_types = [
        "Dimensional Deviation",
        "Surface Defect",
        "Structural Weakness",
        "Overheating Damage",
        "Material Inconsistency",
        "Machine-Induced Defect"
    ]
    records = []
    from datetime import datetime, timedelta
    import random
    now = datetime.now()

    for i in range(45):
        dt = now - timedelta(hours=random.randint(1, 720))
        dtype = random.choice(defect_types)
        mach = random.choice(["M-01","M-02","M-03","M-04","M-05","M-06"])
        sev = random.choice(["minor","moderate","major","critical"])
        records.append({
            "id": f"DEF-{1000+i}",
            "timestamp": dt.isoformat(),
            "machine_id": mach,
            "defect_type": dtype,
            "severity": sev,
            "quantity": random.randint(1, 8),
            "batch_id": f"BATCH-{2400+i}",
            "disposition": random.choice(["scrapped","reworked","accepted_concession"]),
            "root_cause": random.choice(["Temperature variation","Vibration","Material lot","Calibration drift","Operator error"])
        })

    if machine_id:
        records = [r for r in records if r["machine_id"] == machine_id]
    if defect_type:
        records = [r for r in records if r["defect_type"] == defect_type]

    return sorted(records, key=lambda x: x["timestamp"], reverse=True)

@router.get("/categories")
def get_defect_categories():
    return [
        {"id": "dimensional_deviation", "name": "Dimensional Deviation", "description": "Part dimensions outside tolerance", "impact": "High"},
        {"id": "surface_defect", "name": "Surface Defect", "description": "Surface finish or cosmetic issues", "impact": "Medium"},
        {"id": "structural_weakness", "name": "Structural Weakness", "description": "Reduced structural integrity", "impact": "Critical"},
        {"id": "overheating_damage", "name": "Overheating Damage", "description": "Thermal damage to material or coating", "impact": "High"},
        {"id": "material_inconsistency", "name": "Material Inconsistency", "description": "Material property variation", "impact": "Medium"},
        {"id": "machine_induced", "name": "Machine-Induced Defect", "description": "Defect from machine malfunction or wear", "impact": "High"}
    ]
