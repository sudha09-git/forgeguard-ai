import React, { useState, useEffect } from 'react';
import { Bot, Activity, Zap, Settings, FileText, Search, ArrowDown } from 'lucide-react';
import { fetchAgents, fetchAgentWorkflow } from '../services/api';

const ICONS = { activity: Activity, search: Search, zap: Zap, settings: Settings, 'file-text': FileText };

export default function AgentControlCenter() {
  const [agents, setAgents] = useState([]);
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    Promise.all([fetchAgents(), fetchAgentWorkflow()])
      .then(([a, w]) => { setAgents(a); setWorkflow(w); })
      .finally(() => setLoading(false));

    const interval = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading agent control center...</div>;

  const statusColor = { active: 'var(--accent-blue)', idle: 'var(--text-muted)', alert: 'var(--accent-red)' };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">AI Agent Control Center</div>
          <div className="page-subtitle">Multi-agent architecture · IBM Langflow orchestration</div>
        </div>
        <div className="ibm-badge">IBM Langflow · 5 Agents Active</div>
      </div>

      {/* IBM Architecture Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 'var(--radius)',
        padding: '16px 20px',
        marginBottom: 20,
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: 1, marginBottom: 4 }}>IBM AI ARCHITECTURE</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            IBM Langflow Orchestration → IBM watsonx.ai (Granite 13B) → RAG Knowledge Base → Multi-Agent Pipeline
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['IBM Langflow', 'IBM Granite 13B', 'IBM watsonx.ai', 'RAG Pipeline'].map(t => (
            <span key={t} className="ibm-badge">{t}</span>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Agent Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="section-title"><Bot size={14} color="var(--accent-blue)" />DEPLOYED AGENTS</div>
          {agents.map(agent => {
            const Icon = ICONS[agent.icon] || Bot;
            const isActive = agent.status === 'active';
            return (
              <div key={agent.id} className={`agent-card ${agent.status}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: isActive ? 'rgba(59,130,246,0.15)' : 'rgba(75,94,122,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <Icon size={16} color={isActive ? 'var(--accent-blue)' : 'var(--text-muted)'} />
                      {isActive && (
                        <span style={{
                          position: 'absolute', top: -2, right: -2,
                          width: 8, height: 8, borderRadius: '50%',
                          background: 'var(--accent-green)', border: '1px solid var(--bg-card)',
                          animation: 'pulse 2s infinite'
                        }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{agent.id}</div>
                    </div>
                  </div>
                  <span className={`badge ${agent.status}`}>{agent.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>{agent.description}</div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>CURRENT TASK</div>
                  <div style={{ fontSize: 11, color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)', fontStyle: isActive ? 'normal' : 'italic' }}>
                    {isActive && <span style={{ color: 'var(--accent-blue)' }}>▶ </span>}{agent.current_task}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)' }}>{agent.confidence}%</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>CONFIDENCE</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{agent.executions_today.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>EXECUTIONS</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: agent.alerts_generated > 0 ? 'var(--accent-orange)' : 'var(--text-muted)' }}>{agent.alerts_generated}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>ALERTS</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
                  Last: {agent.last_execution} · {agent.recent_action}
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="section-title"><Zap size={14} color="var(--accent-cyan)" />AGENT WORKFLOW PIPELINE</div>

          {workflow && (
            <div className="card">
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span className="ibm-badge">{workflow.technology}</span>
                <span className="ibm-badge">{workflow.architecture}</span>
              </div>
              {workflow.steps.map((step, i) => (
                <React.Fragment key={step.order}>
                  <div className={`workflow-step ${step.status === 'active' ? 'active' : step.status === 'pending' ? 'pending' : ''}`}>
                    <div className={`workflow-num ${step.status === 'pending' ? 'pending' : step.status === 'idle' ? 'idle' : ''}`}>
                      {step.status === 'active' ? (
                        <span style={{ animation: 'pulse 1.5s infinite', display: 'inline-block' }}>{step.order}</span>
                      ) : step.order}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: step.status === 'active' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {step.name}
                      </div>
                      {step.agent && (
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{step.agent}</div>
                      )}
                    </div>
                    <span className={`badge ${step.status}`}>{step.status.toUpperCase()}</span>
                  </div>
                  {i < workflow.steps.length - 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
                      <div style={{ width: 2, height: 10, background: 'var(--accent-blue)', opacity: step.status === 'active' ? 1 : 0.3 }} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* MONITOR → OPTIMIZE loop */}
          <div className="card" style={{ background: 'rgba(59,130,246,0.05)' }}>
            <div className="section-title">INTELLIGENCE CONTROL LOOP</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
              {['MONITOR', 'DETECT', 'PREDICT', 'EXPLAIN', 'OPTIMIZE', 'VERIFY'].map((s, i, arr) => (
                <React.Fragment key={s}>
                  <div style={{
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: 6, padding: '6px 12px',
                    fontSize: 11, fontWeight: 700, color: 'var(--accent-blue)'
                  }}>
                    {s}
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ fontSize: 14, color: 'var(--accent-cyan)', alignSelf: 'center' }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
