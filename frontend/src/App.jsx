import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, BarChart3, Zap, GitBranch,
  Settings, FlaskConical, Clock, FileText, Bot, Bell,
  ChevronDown, User, Shield, AlertTriangle, CheckCircle
} from 'lucide-react';
import CommandCenter from './pages/CommandCenter';
import ProcessMonitor from './pages/ProcessMonitor';
import QualityIntelligence from './pages/QualityIntelligence';
import DefectPrediction from './pages/DefectPrediction';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
import OptimizationCenter from './pages/OptimizationCenter';
import WhatIfSimulator from './pages/WhatIfSimulator';
import ProductionHistory from './pages/ProductionHistory';
import AIReports from './pages/AIReports';
import AgentControlCenter from './pages/AgentControlCenter';
import Copilot from './pages/Copilot';
import AlertCenter from './pages/AlertCenter';
import './App.css';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Command Center' },
  { to: '/process-monitor', icon: Activity, label: 'Process Monitor', badge: 'live', badgeClass: 'blue' },
  { to: '/quality-intelligence', icon: BarChart3, label: 'Quality Intelligence' },
  { to: '/defect-prediction', icon: Zap, label: 'Defect Prediction', badge: '2', badgeClass: '' },
  { to: '/root-cause', icon: GitBranch, label: 'Root Cause Analysis' },
  { to: '/optimization', icon: Settings, label: 'Optimization Center' },
  { to: '/simulator', icon: FlaskConical, label: 'What-If Simulator' },
  { to: '/history', icon: Clock, label: 'Production History' },
  { to: '/reports', icon: FileText, label: 'AI Reports' },
  { to: '/agents', icon: Bot, label: 'Agent Control Center' },
  { to: '/copilot', icon: Shield, label: 'ForgeGuard Copilot' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alert Center', badge: '3', badgeClass: '' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">⚙ FORGEGUARD AI</div>
        <div className="logo-tagline">Predict Quality. Prevent Defects.</div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`sidebar-item${isActive ? ' active' : ''}`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`badge${item.badgeClass ? ' ' + item.badgeClass : ''}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>POWERED BY</div>
        <div className="ibm-badge">IBM watsonx.ai + Langflow</div>
      </div>
    </nav>
  );
}

function Header() {
  const [plant, setPlant] = React.useState('Plant 01 — Detroit');
  const [line, setLine] = React.useState('LINE_A');

  return (
    <header className="header">
      <select className="header-select" value={plant} onChange={e => setPlant(e.target.value)}>
        <option>Plant 01 — Detroit</option>
        <option>Plant 02 — Chicago</option>
        <option>Plant 03 — Houston</option>
      </select>
      <select className="header-select" value={line} onChange={e => setLine(e.target.value)}>
        <option value="LINE_A">Production Line A</option>
        <option value="LINE_B">Production Line B</option>
        <option value="LINE_C">Production Line C</option>
      </select>
      <div className="header-status">
        <span className="status-dot green"></span>
        AI SYSTEM OPERATIONAL
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
        <span className="status-dot blue"></span>
        5 AGENTS ACTIVE
      </div>
      <button className="header-btn" title="Notifications">
        <Bell size={16} />
        <span className="notif-badge"></span>
      </button>
      <button className="header-btn" title="User Profile">
        <User size={16} />
      </button>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/process-monitor" element={<ProcessMonitor />} />
            <Route path="/quality-intelligence" element={<QualityIntelligence />} />
            <Route path="/defect-prediction" element={<DefectPrediction />} />
            <Route path="/root-cause" element={<RootCauseAnalysis />} />
            <Route path="/optimization" element={<OptimizationCenter />} />
            <Route path="/simulator" element={<WhatIfSimulator />} />
            <Route path="/history" element={<ProductionHistory />} />
            <Route path="/reports" element={<AIReports />} />
            <Route path="/agents" element={<AgentControlCenter />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/alerts" element={<AlertCenter />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
