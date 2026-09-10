"""
ForgeGuard AI - Comprehensive Demo Data
Realistic synthetic manufacturing data for immediate demo without hardware.
"""
import random
import math
from datetime import datetime, timedelta

# ── Production Lines ──────────────────────────────────────────────────────────

PRODUCTION_LINES = [
    {
        "id": "LINE_A",
        "name": "Production Line A",
        "description": "Precision CNC Machining",
        "status": "running",
        "efficiency": 94.2,
        "machines": ["M-01", "M-02", "M-03", "M-04"],
        "product": "Aerospace Bracket Type-7",
        "shift": "Day Shift"
    },
    {
        "id": "LINE_B",
        "name": "Production Line B",
        "description": "High-Volume Stamping",
        "status": "running",
        "efficiency": 89.7,
        "machines": ["M-05", "M-06", "M-07"],
        "product": "Automotive Frame Component",
        "shift": "Day Shift"
    },
    {
        "id": "LINE_C",
        "name": "Production Line C",
        "description": "Injection Molding",
        "status": "maintenance",
        "efficiency": 0.0,
        "machines": ["M-08"],
        "product": "Polymer Housing Assembly",
        "shift": "Maintenance"
    }
]

# ── Machines ──────────────────────────────────────────────────────────────────

MACHINES = [
    {
        "id": "M-01", "name": "CNC Mill Unit 1", "line": "LINE_A",
        "type": "CNC Milling", "status": "normal",
        "temperature": 238.4, "pressure": 8.1, "vibration": 3.2,
        "rpm": 1820, "humidity": 42.1, "current": 18.4, "cycle_time": 42.3,
        "health": 96.2, "uptime_hrs": 2847, "last_maintenance": "2024-11-15"
    },
    {
        "id": "M-02", "name": "CNC Mill Unit 2", "line": "LINE_A",
        "type": "CNC Milling", "status": "warning",
        "temperature": 244.7, "pressure": 8.4, "vibration": 5.1,
        "rpm": 1795, "humidity": 43.8, "current": 19.2, "cycle_time": 44.1,
        "health": 84.3, "uptime_hrs": 3124, "last_maintenance": "2024-10-28"
    },
    {
        "id": "M-03", "name": "CNC Mill Unit 3", "line": "LINE_A",
        "type": "CNC Milling", "status": "critical",
        "temperature": 251.3, "pressure": 8.7, "vibration": 8.7,
        "rpm": 1756, "humidity": 45.2, "current": 21.8, "cycle_time": 47.9,
        "health": 61.7, "uptime_hrs": 4231, "last_maintenance": "2024-09-12"
    },
    {
        "id": "M-04", "name": "Inspection Station 1", "line": "LINE_A",
        "type": "Quality Inspection", "status": "normal",
        "temperature": 22.1, "pressure": 1.0, "vibration": 0.4,
        "rpm": 0, "humidity": 40.0, "current": 2.1, "cycle_time": 12.0,
        "health": 98.9, "uptime_hrs": 1247, "last_maintenance": "2024-12-01"
    },
    {
        "id": "M-05", "name": "Stamp Press Alpha", "line": "LINE_B",
        "type": "Hydraulic Press", "status": "normal",
        "temperature": 58.3, "pressure": 142.0, "vibration": 4.8,
        "rpm": 85, "humidity": 38.4, "current": 42.1, "cycle_time": 8.2,
        "health": 91.4, "uptime_hrs": 5812, "last_maintenance": "2024-11-02"
    },
    {
        "id": "M-06", "name": "Stamp Press Beta", "line": "LINE_B",
        "type": "Hydraulic Press", "status": "warning",
        "temperature": 62.7, "pressure": 138.5, "vibration": 6.2,
        "rpm": 82, "humidity": 39.1, "current": 44.8, "cycle_time": 9.1,
        "health": 78.2, "uptime_hrs": 6247, "last_maintenance": "2024-10-15"
    },
    {
        "id": "M-07", "name": "Feed Conveyor B", "line": "LINE_B",
        "type": "Conveyor", "status": "normal",
        "temperature": 28.4, "pressure": 3.2, "vibration": 1.8,
        "rpm": 240, "humidity": 38.9, "current": 8.4, "cycle_time": 2.1,
        "health": 95.1, "uptime_hrs": 2104, "last_maintenance": "2024-11-20"
    },
    {
        "id": "M-08", "name": "Injection Molder C1", "line": "LINE_C",
        "type": "Injection Molding", "status": "offline",
        "temperature": 24.2, "pressure": 0.0, "vibration": 0.0,
        "rpm": 0, "humidity": 41.2, "current": 0.0, "cycle_time": 0.0,
        "health": 72.4, "uptime_hrs": 8901, "last_maintenance": "2024-12-05"
    }
]

# ── Anomalies ─────────────────────────────────────────────────────────────────

def generate_anomalies():
    now = datetime.now()
    return [
        {
            "id": "ANO-001",
            "timestamp": (now - timedelta(minutes=28)).isoformat(),
            "machine_id": "M-03",
            "machine_name": "CNC Mill Unit 3",
            "parameter": "Vibration",
            "observed_value": 8.7,
            "baseline_value": 3.5,
            "unit": "mm/s",
            "expected_range": [0.0, 6.0],
            "severity": "critical",
            "status": "active",
            "description": "Vibration exceeds safe operating threshold by 45%",
            "ai_interpretation": "Abnormal vibration pattern detected. Consistent with spindle bearing wear or imbalance. Combined with temperature drift, risk of dimensional deviation is high.",
            "potential_impact": "Dimensional accuracy degradation, potential tool damage",
            "recommended_action": "Inspect spindle alignment and bearing condition immediately",
            "correlated_anomalies": ["ANO-002", "ANO-003"]
        },
        {
            "id": "ANO-002",
            "timestamp": (now - timedelta(minutes=25)).isoformat(),
            "machine_id": "M-03",
            "machine_name": "CNC Mill Unit 3",
            "parameter": "Temperature",
            "observed_value": 251.3,
            "baseline_value": 238.0,
            "unit": "°C",
            "expected_range": [230.0, 245.0],
            "severity": "high",
            "status": "active",
            "description": "Temperature drifted 6.8°C above learned process baseline",
            "ai_interpretation": "Temperature increase correlates with vibration anomaly on M-03. Historical patterns indicate thermal expansion contributing to dimensional deviations.",
            "potential_impact": "Part dimensional tolerance breach, material stress",
            "recommended_action": "Reduce cutting speed and check coolant flow rate",
            "correlated_anomalies": ["ANO-001", "ANO-003"]
        },
        {
            "id": "ANO-003",
            "timestamp": (now - timedelta(minutes=22)).isoformat(),
            "machine_id": "M-03",
            "machine_name": "CNC Mill Unit 3",
            "parameter": "Combined",
            "observed_value": None,
            "baseline_value": None,
            "unit": None,
            "expected_range": None,
            "severity": "critical",
            "status": "active",
            "description": "Multi-parameter anomaly: vibration + temperature deviation detected simultaneously",
            "ai_interpretation": "Correlated anomaly pattern identified. Temperature increased 6.8°C while vibration simultaneously increased 149%. This combined signature was present in 87% of historical dimensional deviation events.",
            "potential_impact": "High probability dimensional defect in next 35 production cycles",
            "recommended_action": "Halt production on M-03, perform immediate inspection",
            "correlated_anomalies": ["ANO-001", "ANO-002"]
        },
        {
            "id": "ANO-004",
            "timestamp": (now - timedelta(hours=2, minutes=14)).isoformat(),
            "machine_id": "M-06",
            "machine_name": "Stamp Press Beta",
            "parameter": "Pressure",
            "observed_value": 138.5,
            "baseline_value": 145.0,
            "unit": "bar",
            "expected_range": [140.0, 150.0],
            "severity": "warning",
            "status": "monitoring",
            "description": "Hydraulic pressure below optimal range",
            "ai_interpretation": "Gradual pressure drop over 2-hour window detected. May indicate hydraulic seal degradation or fluid loss.",
            "potential_impact": "Reduced press force, potential surface finish deviation",
            "recommended_action": "Check hydraulic fluid level and inspect seals",
            "correlated_anomalies": []
        },
        {
            "id": "ANO-005",
            "timestamp": (now - timedelta(hours=4, minutes=33)).isoformat(),
            "machine_id": "M-02",
            "machine_name": "CNC Mill Unit 2",
            "parameter": "Vibration",
            "observed_value": 5.1,
            "baseline_value": 3.2,
            "unit": "mm/s",
            "expected_range": [0.0, 5.0],
            "severity": "warning",
            "status": "monitoring",
            "description": "Vibration trend approaching threshold",
            "ai_interpretation": "Vibration trend shows gradual upward drift. Predictive models suggest continued escalation without intervention.",
            "potential_impact": "Surface finish degradation if trend continues",
            "recommended_action": "Schedule inspection during next shift break",
            "correlated_anomalies": []
        }
    ]

ANOMALIES = generate_anomalies()

# ── Defect Predictions ─────────────────────────────────────────────────────────

def get_predictions():
    now = datetime.now()
    return [
        {
            "id": "PRED-001",
            "generated_at": now.isoformat(),
            "machine_id": "M-03",
            "machine_name": "CNC Mill Unit 3",
            "line_id": "LINE_A",
            "defect_type": "Dimensional Deviation",
            "probability": 82,
            "risk_level": "HIGH",
            "estimated_occurrence_cycles": 35,
            "confidence": 89,
            "status": "active",
            "contributing_factors": [
                {"factor": "Temperature drift", "weight": 42, "value": "251.3°C (baseline: 238°C)"},
                {"factor": "Machine vibration", "weight": 28, "value": "8.7 mm/s (limit: 6.0 mm/s)"},
                {"factor": "Material moisture", "weight": 18, "value": "Lot #4821 — 0.8% above spec"},
                {"factor": "Calibration drift", "weight": 12, "value": "Last calibration: 84 days ago"}
            ],
            "explanation": "Temperature increased by 6.8°C above the learned process baseline while machine vibration simultaneously increased by 149%. Similar historical production cycles (87% correlation) were associated with dimensional deviations meeting rejection criteria. Material moisture in current lot adds minor compounding risk.",
            "historical_pattern": "14 of 16 similar multi-parameter events in past 90 days resulted in dimensional deviation defects",
            "recommendation_id": "REC-001"
        },
        {
            "id": "PRED-002",
            "generated_at": now.isoformat(),
            "machine_id": "M-06",
            "machine_name": "Stamp Press Beta",
            "line_id": "LINE_B",
            "defect_type": "Surface Defect",
            "probability": 34,
            "risk_level": "MEDIUM",
            "estimated_occurrence_cycles": 120,
            "confidence": 71,
            "status": "monitoring",
            "contributing_factors": [
                {"factor": "Hydraulic pressure drop", "weight": 65, "value": "138.5 bar (optimal: 145 bar)"},
                {"factor": "Vibration increase", "weight": 35, "value": "6.2 mm/s (baseline: 4.2 mm/s)"}
            ],
            "explanation": "Hydraulic pressure running 4.5% below optimal range. Reduced press force correlates with surface finish inconsistency in similar historical events. Risk is moderate and trending.",
            "historical_pattern": "8 of 23 similar pressure-drop events resulted in surface defects requiring rework",
            "recommendation_id": "REC-002"
        }
    ]

# ── Recommendations ───────────────────────────────────────────────────────────

def get_recommendations():
    now = datetime.now()
    return [
        {
            "id": "REC-001",
            "number": "024",
            "generated_at": now.isoformat(),
            "prediction_id": "PRED-001",
            "machine_id": "M-03",
            "machine_name": "CNC Mill Unit 3",
            "issue": "High dimensional defect risk — multi-parameter anomaly",
            "evidence": [
                "Temperature drift: +6.8°C above baseline",
                "Vibration: 8.7 mm/s (limit 6.0 mm/s)",
                "Material moisture: Lot #4821 above spec",
                "Last calibration: 84 days (recommended: 60 days)"
            ],
            "prediction": "82% probability of dimensional deviation in next 35 production cycles",
            "confidence": 89,
            "risk_level": "HIGH",
            "status": "pending",
            "approved_by": None,
            "approved_at": None,
            "actions": [
                {
                    "type": "parameter_change",
                    "description": "Reduce machine temperature",
                    "current_value": "240°C",
                    "proposed_value": "232°C",
                    "unit": "°C",
                    "parameter": "temperature"
                },
                {
                    "type": "parameter_change",
                    "description": "Reduce operating speed",
                    "current_value": "1800 RPM",
                    "proposed_value": "1720 RPM",
                    "unit": "RPM",
                    "parameter": "rpm"
                },
                {
                    "type": "inspection",
                    "description": "Inspect spindle alignment and bearing condition",
                    "current_value": None,
                    "proposed_value": None,
                    "unit": None,
                    "parameter": None
                },
                {
                    "type": "calibration",
                    "description": "Perform machine calibration check",
                    "current_value": None,
                    "proposed_value": None,
                    "unit": None,
                    "parameter": None
                }
            ],
            "expected_impact": {
                "defect_probability_before": 82,
                "defect_probability_after": 31,
                "quality_score_before": 78,
                "quality_score_after": 93,
                "production_impact": "~3% cycle time increase during temperature stabilization"
            },
            "disclaimer": "AI-generated recommendation — Engineer approval required before implementation."
        },
        {
            "id": "REC-002",
            "number": "023",
            "generated_at": (now - timedelta(hours=1, minutes=30)).isoformat(),
            "prediction_id": "PRED-002",
            "machine_id": "M-06",
            "machine_name": "Stamp Press Beta",
            "issue": "Moderate surface defect risk — hydraulic pressure drop",
            "evidence": [
                "Hydraulic pressure: 138.5 bar (optimal: 145 bar)",
                "Vibration increase: 6.2 mm/s (baseline: 4.2 mm/s)"
            ],
            "prediction": "34% probability of surface defect in next 120 production cycles",
            "confidence": 71,
            "risk_level": "MEDIUM",
            "status": "pending",
            "approved_by": None,
            "approved_at": None,
            "actions": [
                {
                    "type": "inspection",
                    "description": "Check hydraulic fluid level and inspect seals",
                    "current_value": None,
                    "proposed_value": None,
                    "unit": None,
                    "parameter": None
                }
            ],
            "expected_impact": {
                "defect_probability_before": 34,
                "defect_probability_after": 12,
                "quality_score_before": 89,
                "quality_score_after": 95,
                "production_impact": "Minimal — inspection can be performed during next scheduled break"
            },
            "disclaimer": "AI-generated recommendation — Engineer approval required before implementation."
        }
    ]

# ── AI Agents ─────────────────────────────────────────────────────────────────

AGENTS = [
    {
        "id": "AGENT-001",
        "name": "Process Monitoring Agent",
        "status": "active",
        "icon": "activity",
        "description": "Continuously monitors machine parameters and sensor readings. Detects deviations from normal operating baselines.",
        "current_task": "Monitoring M-03: vibration threshold exceeded — escalating to Quality Analysis Agent",
        "last_execution": "2 seconds ago",
        "confidence": 97.2,
        "recent_action": "Detected multi-parameter anomaly on M-03",
        "executions_today": 28419,
        "alerts_generated": 3
    },
    {
        "id": "AGENT-002",
        "name": "Quality Analysis Agent",
        "status": "active",
        "icon": "search",
        "description": "Analyzes production data patterns. Correlates multi-sensor readings to identify quality-impacting conditions.",
        "current_task": "Analyzing combined vibration+temperature anomaly on M-03",
        "last_execution": "8 seconds ago",
        "confidence": 91.4,
        "recent_action": "Classified M-03 anomaly as critical — forwarding to Defect Prediction",
        "executions_today": 4218,
        "alerts_generated": 2
    },
    {
        "id": "AGENT-003",
        "name": "Defect Prediction Agent",
        "status": "active",
        "icon": "zap",
        "description": "Predicts manufacturing defects before they occur using pattern matching against historical defect signatures.",
        "current_task": "Predicting defect probability for M-03 anomaly pattern",
        "last_execution": "15 seconds ago",
        "confidence": 89.0,
        "recent_action": "Generated PRED-001: Dimensional Deviation 82% probability",
        "executions_today": 1847,
        "alerts_generated": 2
    },
    {
        "id": "AGENT-004",
        "name": "Process Optimization Agent",
        "status": "active",
        "icon": "settings",
        "description": "Generates corrective action recommendations to reduce defect risk and improve quality scores.",
        "current_task": "Generating optimization parameters for PRED-001",
        "last_execution": "32 seconds ago",
        "confidence": 84.7,
        "recent_action": "Generated REC-024: Reduce temperature 240°C→232°C, RPM 1800→1720",
        "executions_today": 847,
        "alerts_generated": 1
    },
    {
        "id": "AGENT-005",
        "name": "Reporting Agent",
        "status": "idle",
        "icon": "file-text",
        "description": "Generates quality reports, shift summaries, and executive briefings based on production session data.",
        "current_task": "Awaiting next scheduled report cycle (14:00)",
        "last_execution": "2 hours ago",
        "confidence": 95.1,
        "recent_action": "Generated Morning Shift Quality Summary — Shift A",
        "executions_today": 4,
        "alerts_generated": 0
    }
]

# ── Historical Data ────────────────────────────────────────────────────────────

def generate_historical_data(days=30):
    records = []
    now = datetime.now()
    base_quality = 91.0
    base_defect_rate = 4.2
    base_fpy = 93.0

    for i in range(days * 24):
        dt = now - timedelta(hours=i)
        noise = math.sin(i * 0.3) * 2 + random.gauss(0, 1)
        defect_spike = 8 if 180 < i < 195 else 0
        defect_spike2 = 6 if 420 < i < 432 else 0

        quality = max(60, min(100, base_quality + noise - defect_spike * 0.3 - defect_spike2 * 0.2))
        defect_rate = max(0, min(30, base_defect_rate - noise * 0.3 + defect_spike + defect_spike2))
        fpy = max(60, min(100, base_fpy + noise * 0.8 - defect_spike * 0.4))

        records.append({
            "timestamp": dt.isoformat(),
            "quality_score": round(quality, 1),
            "defect_rate": round(defect_rate, 2),
            "first_pass_yield": round(fpy, 1),
            "production_volume": int(1200 + random.gauss(0, 50)),
            "temperature_m03": round(238 + math.sin(i * 0.1) * 3 + (defect_spike * 2) + random.gauss(0, 0.5), 1),
            "pressure_m03": round(8.2 + math.sin(i * 0.15) * 0.3 + random.gauss(0, 0.05), 2),
            "vibration_m03": round(3.5 + (defect_spike * 0.5) + random.gauss(0, 0.2), 2),
            "anomaly": defect_spike > 0 or defect_spike2 > 0
        })
    return list(reversed(records))

HISTORICAL_DATA = generate_historical_data(30)

# ── Knowledge Base (RAG Documents) ───────────────────────────────────────────

KNOWLEDGE_BASE = [
    {
        "id": "KB-001",
        "title": "CNC Mill Operating Manual — Temperature Parameters",
        "category": "Machine Manual",
        "content": "Optimal operating temperature range for CNC mill units: 228°C–245°C. Temperatures exceeding 245°C risk thermal expansion beyond tolerance. Recommended coolant flow: 12–15 L/min. Emergency shutdown threshold: 260°C. Temperature increase >5°C from baseline within 30 minutes warrants immediate investigation.",
        "tags": ["temperature", "CNC", "operating parameters"]
    },
    {
        "id": "KB-002",
        "title": "Standard Operating Procedure — Vibration Limits",
        "category": "SOP",
        "content": "Vibration limits for CNC milling operations: Normal: 0–4 mm/s. Warning: 4–6 mm/s. Action required: >6 mm/s. Immediate shutdown: >10 mm/s. Elevated vibration correlated with spindle bearing wear, tool imbalance, or machine foundation issues. When vibration exceeds 6 mm/s, reduce RPM by 5% and inspect spindle.",
        "tags": ["vibration", "SOP", "limits", "spindle"]
    },
    {
        "id": "KB-003",
        "title": "Quality Standard QS-2024-07 — Dimensional Tolerance",
        "category": "Quality Standard",
        "content": "Dimensional tolerance for Aerospace Bracket Type-7: ±0.05mm for critical dimensions. Inspection frequency: 100% for first 50 units of new lot, then statistical sampling (AQL 1.5). Dimensional deviation exceeding tolerance requires batch hold and root cause analysis. Contributing factors historically include temperature variation, vibration, tool wear, and material inconsistency.",
        "tags": ["dimensional", "tolerance", "quality standard", "inspection"]
    },
    {
        "id": "KB-004",
        "title": "Maintenance Procedure MP-CNC-003 — Spindle Inspection",
        "category": "Maintenance Record",
        "content": "Spindle inspection procedure for CNC units M-01 through M-04: 1) Power down machine and lock out. 2) Remove spindle access panel. 3) Inspect bearing races for wear or scoring. 4) Check spindle runout with dial indicator (max 0.002mm). 5) Verify collet grip force. 6) Inspect coolant ports. Recommended interval: 60 days or when vibration exceeds 5 mm/s. Last inspection M-03: 84 days ago.",
        "tags": ["maintenance", "spindle", "inspection", "bearing"]
    },
    {
        "id": "KB-005",
        "title": "Defect History Report — Q3 2024",
        "category": "Defect History",
        "content": "Q3 2024 Defect Analysis: Primary defect: Dimensional Deviation (47% of rejections). Common triggers: Temperature variance >5°C (correlation 0.87), vibration >6 mm/s (correlation 0.79), combined temperature+vibration events (correlation 0.94). Secondary defect: Surface finish irregularity (28%). Tertiary: Material inconsistency (15%). Root causes: 65% machine condition, 23% material lot variation, 12% process parameter drift.",
        "tags": ["defect history", "dimensional deviation", "Q3 2024", "root cause"]
    },
    {
        "id": "KB-006",
        "title": "Process Parameter Guidelines — Line A CNC Machining",
        "category": "Process Guidelines",
        "content": "Recommended process parameters for Line A CNC operations: Temperature: 232–242°C. RPM: 1720–1850. Pressure: 7.8–8.5 bar. Vibration: <4 mm/s. Humidity: 38–48%. Material moisture: <2.5%. When defect risk is elevated, reduce temperature to lower range (232°C) and RPM to 1720. This conservative configuration has shown 62% reduction in dimensional deviation events.",
        "tags": ["process parameters", "Line A", "CNC", "recommended settings"]
    },
    {
        "id": "KB-007",
        "title": "Inspection Report — Machine M-03 Pre-Shift Check",
        "category": "Inspection Report",
        "content": "M-03 Pre-shift inspection log: Last formal inspection: September 12, 2024 (84 days ago). Findings at last inspection: Minor bearing surface scoring noted, within tolerance. Recommendation: schedule bearing replacement at next planned maintenance window. Current vibration trending upward over past 8 hours. Temperature drift observed over past 3 hours. Recommend priority inspection scheduling.",
        "tags": ["M-03", "inspection", "bearing", "maintenance schedule"]
    },
    {
        "id": "KB-008",
        "title": "Safety Procedure SP-01 — Machine Anomaly Response",
        "category": "Safety Procedure",
        "content": "When critical anomaly is detected: 1) Alert shift supervisor immediately. 2) Do not override AI recommendations without supervisor authorization. 3) If shutdown is triggered, complete lockout/tagout before inspection. 4) Document all deviations in the quality management system. 5) Do not restart without clearance from maintenance and quality engineer. Escalation matrix: Warning → Shift Supervisor. Critical → Plant Manager + Quality Manager.",
        "tags": ["safety", "anomaly response", "procedure", "escalation"]
    }
]

# ── Quality Score Breakdown ───────────────────────────────────────────────────

QUALITY_SCORE_BREAKDOWN = {
    "overall": 91.0,
    "components": [
        {"name": "Process Stability", "score": 88.4, "weight": 25, "trend": 1.1, "status": "good"},
        {"name": "Machine Health", "score": 82.1, "weight": 30, "trend": -2.3, "status": "warning"},
        {"name": "Material Consistency", "score": 94.7, "weight": 20, "trend": 0.5, "status": "excellent"},
        {"name": "Environmental Conditions", "score": 96.2, "weight": 10, "trend": 0.2, "status": "excellent"},
        {"name": "Historical Defect Rate", "score": 91.3, "weight": 10, "trend": 1.8, "status": "good"},
        {"name": "Inspection Results", "score": 93.8, "weight": 5, "trend": 0.9, "status": "excellent"}
    ],
    "main_factors_positive": [
        "Stable coolant temperature on M-01 and M-04",
        "Material Lot #4820 within all specification limits",
        "Environmental humidity within optimal range"
    ],
    "main_factors_negative": [
        "M-03 vibration increased 149% above baseline",
        "M-03 temperature drifted 6.8°C above process average",
        "M-06 hydraulic pressure 4.5% below optimal",
        "M-03 calibration overdue by 24 days"
    ]
}

# ── Sensor Streams ────────────────────────────────────────────────────────────

def get_sensor_stream(machine_id: str, count: int = 60):
    machine = next((m for m in MACHINES if m["id"] == machine_id), MACHINES[0])
    points = []
    now = datetime.now()

    base_temp = machine["temperature"]
    base_vib = machine["vibration"]
    base_press = machine["pressure"]
    base_rpm = machine["rpm"]

    for i in range(count):
        t = now - timedelta(seconds=(count - i) * 5)
        spike = 1.5 if machine_id == "M-03" and i > 40 else 0
        points.append({
            "timestamp": t.isoformat(),
            "temperature": round(base_temp + math.sin(i * 0.2) * 1.5 + spike * 3 + random.gauss(0, 0.3), 1),
            "pressure": round(base_press + math.sin(i * 0.15) * 0.1 + random.gauss(0, 0.02), 2),
            "vibration": round(max(0, base_vib + math.sin(i * 0.3) * 0.4 + spike * 1.2 + random.gauss(0, 0.1)), 2),
            "rpm": int(base_rpm + math.sin(i * 0.1) * 20 + random.gauss(0, 5)) if base_rpm > 0 else 0,
            "humidity": round(42 + math.sin(i * 0.05) * 2 + random.gauss(0, 0.5), 1),
            "current": round(machine["current"] + math.sin(i * 0.2) * 0.5 + spike * 0.8 + random.gauss(0, 0.1), 1),
            "cycle_time": round(machine["cycle_time"] + random.gauss(0, 0.3) + spike * 0.5, 1) if machine["cycle_time"] > 0 else 0
        })
    return points
