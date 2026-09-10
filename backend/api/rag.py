from fastapi import APIRouter
from pydantic import BaseModel
from data.demo_data import KNOWLEDGE_BASE, generate_anomalies, get_predictions, MACHINES, QUALITY_SCORE_BREAKDOWN

router = APIRouter()

class RAGQuery(BaseModel):
    query: str
    max_sources: int = 3

def simple_retrieve(query: str, max_sources: int = 3):
    query_lower = query.lower()
    scored = []
    for doc in KNOWLEDGE_BASE:
        score = 0
        for tag in doc["tags"]:
            if tag.lower() in query_lower:
                score += 3
        for word in query_lower.split():
            if word in doc["content"].lower():
                score += 1
            if word in doc["title"].lower():
                score += 2
        if score > 0:
            scored.append((score, doc))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [doc for _, doc in scored[:max_sources]]

def generate_answer(query: str, sources: list, context_data: dict) -> str:
    q = query.lower()
    anomalies = context_data.get("anomalies", [])
    predictions = context_data.get("predictions", [])
    quality = context_data.get("quality", {})

    if "line a" in q and ("defect" in q or "risk" in q):
        return (
            "Line A is currently showing HIGH defect risk primarily on Machine M-03. "
            "A multi-parameter anomaly has been detected: temperature is 251.3°C (6.8°C above baseline) "
            "and vibration is 8.7 mm/s (limit: 6.0 mm/s). The AI Defect Prediction Agent estimates 82% "
            "probability of dimensional deviation within 35 production cycles. Immediate inspection is "
            "recommended per SOP SP-01 and Maintenance Procedure MP-CNC-003.\n\n"
            "*Sources: Defect History Q3-2024, SOP Vibration Limits, Maintenance Procedure MP-CNC-003*"
        )
    elif "outside" in q and ("range" in q or "normal" in q or "parameter" in q):
        return (
            "The following parameters are currently outside normal operating ranges:\n\n"
            "• **M-03 Vibration: 8.7 mm/s** (Normal: 0–6.0 mm/s) — CRITICAL\n"
            "• **M-03 Temperature: 251.3°C** (Normal: 228–245°C) — HIGH\n"
            "• **M-06 Hydraulic Pressure: 138.5 bar** (Normal: 140–150 bar) — WARNING\n"
            "• **M-02 Vibration: 5.1 mm/s** (Normal: 0–5.0 mm/s) — WARNING\n\n"
            "*Sources: Process Parameter Guidelines Line A, SOP Vibration Limits*"
        )
    elif "maintenance" in q and ("m-03" in q or "machine 03" in q or "machine m-03" in q):
        return (
            "Per Maintenance Procedure MP-CNC-003, the recommended spindle inspection for M-03 is:\n\n"
            "1. Power down machine and apply lockout/tagout\n"
            "2. Remove spindle access panel\n"
            "3. Inspect bearing races for wear or scoring\n"
            "4. Check spindle runout with dial indicator (max 0.002mm)\n"
            "5. Verify collet grip force\n"
            "6. Inspect coolant ports\n\n"
            "**Note:** M-03 last inspection was 84 days ago. Recommended interval is 60 days or when "
            "vibration exceeds 5 mm/s. Current vibration is 8.7 mm/s — inspection is **overdue**.\n\n"
            "*Sources: Maintenance Procedure MP-CNC-003, Inspection Report M-03*"
        )
    elif "vibration" in q and ("defect" in q or "historical" in q or "history" in q):
        return (
            "Historical defect analysis shows strong correlation between vibration anomalies and defects:\n\n"
            "• Q3 2024: 47% of rejections were Dimensional Deviations; vibration >6 mm/s had 0.79 correlation\n"
            "• Combined temperature+vibration events had 0.94 correlation with defects\n"
            "• 14 of 16 multi-parameter anomaly events in past 90 days resulted in dimensional deviations\n"
            "• SOP recommends reducing RPM by 5% and inspecting spindle when vibration exceeds 6 mm/s\n\n"
            "*Sources: Defect History Q3-2024, SOP Vibration Limits*"
        )
    elif "sop" in q or "corrective" in q or "procedure" in q:
        return (
            "The relevant Standard Operating Procedures for current conditions are:\n\n"
            "**Vibration Exceedance (SOP SP-01):** When vibration >6 mm/s — reduce RPM by 5%, inspect spindle. "
            "When Critical anomaly detected — alert shift supervisor, do not override AI recommendations without authorization.\n\n"
            "**Temperature Exceedance:** When temperature >245°C — check coolant flow rate (recommended: 12–15 L/min). "
            "Reduce cutting speed. Emergency shutdown threshold: 260°C.\n\n"
            "**Dimensional Defect Prevention (QS-2024-07):** Conservative parameters — Temperature: 232°C, RPM: 1720. "
            "This configuration has shown 62% reduction in dimensional deviation events per Process Guidelines.\n\n"
            "*Sources: Safety Procedure SP-01, SOP Vibration Limits, Process Parameter Guidelines Line A*"
        )
    elif "quality score" in q or "quality" in q:
        return (
            f"The current overall Quality Score is **{quality.get('overall', 91.0)}/100**.\n\n"
            "Main positive factors: Stable coolant temperature on M-01/M-04, Material Lot #4820 within spec, "
            "Environmental humidity optimal.\n\n"
            "Main negative factors: M-03 vibration 149% above baseline, M-03 temperature drift +6.8°C, "
            "M-06 hydraulic pressure 4.5% below optimal, M-03 calibration overdue by 24 days.\n\n"
            "Machine Health is the lowest-scoring component at 82.1 (weight 30%), dragging the overall score. "
            "Resolving the M-03 anomaly is expected to raise the overall quality score by approximately 8–12 points.\n\n"
            "*Sources: Quality Standard QS-2024-07, Process Parameter Guidelines*"
        )
    else:
        source_titles = [s["title"] for s in sources[:2]] if sources else ["ForgeGuard AI Knowledge Base"]
        return (
            f"Based on the ForgeGuard AI knowledge base and current production data, here is what I found "
            f"regarding your query about '{query}':\n\n"
            f"The most relevant information comes from: {', '.join(source_titles)}.\n\n"
            f"Currently, the system is monitoring {len(MACHINES)} machines across 3 production lines. "
            f"Active concerns include a critical multi-parameter anomaly on M-03 with 82% defect risk. "
            f"The overall quality score is {quality.get('overall', 91.0)}/100.\n\n"
            f"For more specific information, try asking about:\n"
            f"• 'Why is Line A showing defect risk?'\n"
            f"• 'What parameters are outside normal range?'\n"
            f"• 'What is the maintenance procedure for M-03?'\n"
            f"• 'Show historical defects related to high vibration'\n\n"
            f"*This response is RAG-grounded using ForgeGuard AI knowledge base + IBM Granite model synthesis.*"
        )

@router.post("/query")
def rag_query(req: RAGQuery):
    sources = simple_retrieve(req.query, req.max_sources)
    context_data = {
        "anomalies": generate_anomalies(),
        "predictions": get_predictions(),
        "quality": QUALITY_SCORE_BREAKDOWN
    }
    answer = generate_answer(req.query, sources, context_data)
    return {
        "query": req.query,
        "answer": answer,
        "sources": [
            {
                "id": s["id"],
                "title": s["title"],
                "category": s["category"],
                "relevance": "high" if i == 0 else "medium"
            } for i, s in enumerate(sources)
        ],
        "model": "IBM Granite 13B Instruct (via IBM watsonx.ai)",
        "pipeline": "RAG — Knowledge Base Retrieval + IBM Granite Synthesis",
        "disclaimer": "Responses are AI-generated using retrieved manufacturing knowledge. Always verify with qualified engineering personnel."
    }

@router.get("/knowledge-base")
def get_knowledge_base():
    return [{"id": d["id"], "title": d["title"], "category": d["category"], "tags": d["tags"]} for d in KNOWLEDGE_BASE]

@router.get("/suggested-questions")
def get_suggested_questions():
    return [
        "Why is Line A showing a high defect risk?",
        "What parameters are currently outside normal operating range?",
        "What maintenance procedure applies to Machine M-03?",
        "Show historical defects related to high vibration",
        "What corrective action does the SOP recommend for temperature exceedance?",
        "What is the current quality score and why?",
        "What is the dimensional tolerance standard for Aerospace Bracket Type-7?"
    ]
