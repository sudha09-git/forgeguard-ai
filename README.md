# ⚙ ForgeGuard AI
## Autonomous Manufacturing Quality Intelligence & Control Platform

> **"Predict Quality. Prevent Defects. Optimize Production."**

ForgeGuard AI is a production-grade, full-stack AI application that functions as an intelligent manufacturing quality command center. It continuously analyzes production parameters, detects anomalies, predicts defects, explains root causes, recommends corrective actions, and generates actionable quality insights using **IBM AI technologies**.

---

## 🚀 Quick Start

### 1. Start the Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### 2. Start the Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The application will be available at: `http://localhost:5173`

---

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↕ REST API
Backend (Python FastAPI)
    ↕
AI Layer (IBM Langflow + IBM Granite 13B via watsonx.ai)
    ↕
RAG Pipeline (Manufacturing Knowledge Base)
    ↕
Demo Data Layer (Synthetic manufacturing simulation)
```

### Intelligence Control Loop
```
MONITOR → DETECT → PREDICT → EXPLAIN → OPTIMIZE → VERIFY
```

---

## 📱 Application Pages

| Page | Description |
|------|-------------|
| **Command Center** | Main dashboard with KPIs, production line visualization, AI quality score |
| **Process Monitor** | Real-time sensor data streaming with multi-parameter charts |
| **Quality Intelligence** | AI quality score breakdown with radar and bar charts |
| **Defect Prediction** | Defect Prediction Agent — probability gauges, contributing factors |
| **Root Cause Analysis** | AI Root Cause Explorer — causal chain, factor analysis, RAG knowledge |
| **Optimization Center** | Engineer Decision Center — approve/reject AI recommendations |
| **What-If Simulator** | Interactive parameter simulation — before/after defect risk modeling |
| **Production History** | Historical trends with anomaly markers |
| **AI Reports** | AI-generated quality reports using IBM Granite 13B |
| **Agent Control Center** | Multi-agent dashboard with workflow visualization |
| **ForgeGuard Copilot** | RAG-grounded AI assistant using IBM knowledge base |
| **Alert Center** | Active anomaly alerts with AI interpretation |

---

## 🤖 AI Agents

1. **Process Monitoring Agent** — Monitors 8 machines, 7 sensor parameters
2. **Quality Analysis Agent** — Multi-parameter anomaly correlation
3. **Defect Prediction Agent** — Pattern matching, defect probability forecasting
4. **Process Optimization Agent** — Corrective action recommendations
5. **Reporting Agent** — AI quality report generation

---

## 🔧 IBM Technologies

- **IBM Langflow** — Multi-agent orchestration pipeline
- **IBM watsonx.ai** — Model hosting and inference
- **IBM Granite 13B Instruct** — NL explanation, report generation, RAG synthesis
- **RAG Pipeline** — 8 manufacturing knowledge base documents

---

## 📊 Demo Scenario

The application ships with a complete demo scenario:

1. **Machine M-03** develops combined temperature + vibration anomaly
2. **Process Monitoring Agent** detects multi-parameter deviation
3. **Quality Analysis Agent** classifies it as CRITICAL
4. **Defect Prediction Agent** predicts 82% dimensional deviation probability in 35 cycles
5. **Root Cause Analysis** identifies calibration drift (42%), vibration (28%), temperature (18%), material moisture (12%)
6. **Optimization Agent** generates Recommendation #024: Reduce temp 240°C→232°C, RPM 1800→1720
7. **Engineer** reviews in What-If Simulator: shows defect risk 82%→31%, quality score 78→93
8. **Engineer** approves/rejects recommendation — decision logged in audit trail
9. **Reporting Agent** generates quality report with IBM Granite narrative

---

## 📁 Project Structure

```
project2/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── api/
│   │   ├── production.py    # Production lines & machines
│   │   ├── sensors.py       # Sensor streaming data
│   │   ├── anomalies.py     # Anomaly detection results
│   │   ├── defects.py       # Defect records
│   │   ├── predictions.py   # AI defect predictions
│   │   ├── recommendations.py # Optimization recommendations + approval
│   │   ├── agents.py        # AI agent status + workflow
│   │   ├── reports.py       # AI quality report generation
│   │   ├── simulation.py    # What-If simulator
│   │   ├── rag.py           # RAG query endpoint
│   │   └── history.py       # Historical data
│   └── data/
│       └── demo_data.py     # Comprehensive synthetic manufacturing data
│
└── frontend/
    └── src/
        ├── pages/           # 12 application pages
        ├── services/api.js  # Backend API client
        └── index.css        # Dark enterprise theme
```

---

## ⚠️ Important Notes

- All sensor data is **AI-generated simulation** — not connected to physical hardware
- All AI predictions are **model-based estimates** — require engineer validation
- All recommendations require **engineer approval** before implementation
- RAG responses are grounded in the **ForgeGuard AI knowledge base**
- The application maintains a complete **audit trail** of all decisions

---

*ForgeGuard AI — Built for IBM AI Hackathon demonstration*  
*Technologies: React · FastAPI · IBM Langflow · IBM Granite 13B · IBM watsonx.ai*
