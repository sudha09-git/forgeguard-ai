import React, { useState, useEffect } from 'react';
import { GitBranch, ArrowRight } from 'lucide-react';
import { fetchActivePredictions, fetchAnomalyTimeline } from '../services/api';

export default function RootCauseAnalysis() {
  const [predictions, setPredictions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePredictions().then(data => {
      setPredictions(data);
      if (data.length > 0) setSelected(data[0]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading root cause analysis...</div>;

  const factorColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#06b6d4'];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">Root Cause Analysis</div>
          <div className="page-subtitle">AI Root Cause Explorer · Multi-parameter correlation analysis</div>
        </div>
        <div className="ibm-badge">IBM Granite 13B · RAG-Grounded Analysis</div>
      </div>

      <div className="grid-2">
        {/* Left: prediction selector + cause chain */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {predictions.map(p => (
              <button
                key={p.id}
                className={`btn btn-sm ${selected?.id === p.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelected(p)}
              >
                {p.defect_type} ({p.probability}%)
              </button>
            ))}
          </div>

          {selected && (
            <>
              {/* Cause chain */}
              <div className="card">
                <div className="section-title"><GitBranch size={14} color="var(--accent-blue)" />CAUSAL CHAIN VISUALIZATION</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                  {[
                    { label: 'Sensor Signals', items: ['Temperature +6.8°C', 'Vibration 8.7 mm/s'], color: 'var(--accent-blue)' },
                    { label: 'Process Variation', items: ['Thermal expansion', 'Mechanical instability'], color: 'var(--accent-orange)' },
                    { label: 'Anomaly Pattern', items: ['Combined multi-parameter event', '87% historical match'], color: 'var(--accent-yellow)' },
                    { label: 'Predicted Defect Risk', items: [selected.defect_type, `${selected.probability}% probability`], color: 'var(--accent-red)' },
                  ].map((stage, i) => (
                    <React.Fragment key={stage.label}>
                      <div style={{
                        background: `${stage.color}15`,
                        border: `1px solid ${stage.color}40`,
                        borderRadius: 8,
                        padding: '10px 14px',
                        width: '100%'
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                          STAGE {i + 1}: {stage.label}
                        </div>
                        {stage.items.map(item => (
                          <div key={item} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>• {item}</div>
                        ))}
                      </div>
                      {i < 3 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 20 }}>
                          <div style={{ width: 2, height: 14, background: 'var(--border)' }} />
                          <svg width="8" height="5" viewBox="0 0 8 5">
                            <path d="M0 0 L4 5 L8 0" fill="none" stroke="var(--border)" strokeWidth="1.5" />
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* AI Explanation */}
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <div className="ibm-badge">IBM Granite 13B Explanation</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', borderLeft: '2px solid var(--accent-blue)', paddingLeft: 12 }}>
                  "{selected.explanation}"
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'normal' }}>
                  📊 {selected.historical_pattern}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: contributing factors + knowledge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {selected && (
            <>
              <div className="card">
                <div className="section-title">CONTRIBUTING FACTOR ANALYSIS</div>
                <div style={{ marginBottom: 12 }}>
                  {selected.contributing_factors.map((f, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{f.factor}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.value}</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: factorColors[i] }}>{f.weight}%</div>
                      </div>
                      <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${f.weight}%`,
                          background: `linear-gradient(90deg, ${factorColors[i]}, ${factorColors[i]}88)`,
                          borderRadius: 5,
                          transition: 'width 0.8s ease',
                          boxShadow: `0 0 8px ${factorColors[i]}60`
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pie summary */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {selected.contributing_factors.map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 4, fontSize: 11
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: factorColors[i] }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{f.factor.split(' ')[0]}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correlated knowledge */}
              <div className="card">
                <div className="section-title">RAG-RETRIEVED KNOWLEDGE</div>
                {[
                  { title: 'Defect History Q3-2024', category: 'Defect History', relevance: 'HIGH', note: 'Temperature +vibration correlation: 0.94 with dimensional deviation.' },
                  { title: 'Maintenance Procedure MP-CNC-003', category: 'Maintenance', relevance: 'HIGH', note: 'Spindle inspection recommended at 60-day intervals or vibration >5 mm/s. M-03 is 84 days overdue.' },
                  { title: 'SOP Vibration Limits', category: 'SOP', relevance: 'HIGH', note: 'Action required when vibration >6 mm/s: reduce RPM 5%, inspect spindle.' },
                ].map((doc, i) => (
                  <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{doc.title}</div>
                      <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.1)', color: 'var(--accent-green)', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                        {doc.relevance}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--accent-cyan)', marginBottom: 4 }}>{doc.category}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.note}</div>
                  </div>
                ))}
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 8 }}>
                  * Sources retrieved from ForgeGuard AI knowledge base via RAG pipeline
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
