from fastapi import APIRouter
from data.demo_data import PRODUCTION_LINES, MACHINES

router = APIRouter()

@router.get("/lines")
def get_production_lines():
    return PRODUCTION_LINES

@router.get("/lines/{line_id}")
def get_production_line(line_id: str):
    line = next((l for l in PRODUCTION_LINES if l["id"] == line_id), None)
    if not line:
        return {"error": "Line not found"}
    return line

@router.get("/machines")
def get_machines():
    return MACHINES

@router.get("/machines/{machine_id}")
def get_machine(machine_id: str):
    machine = next((m for m in MACHINES if m["id"] == machine_id), None)
    if not machine:
        return {"error": "Machine not found"}
    return machine
