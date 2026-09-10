import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchActivePredictions } from '../services/api';

function ProbabilityGauge({ value }) {
  const color = value >= 70 ? '#ef4444' : value >= 40 ? '#f97316' : '#22c55e';
  const r = 40, cx = 50, cy = 50;
  const circumference = 2 * Math.PI * r;
  const arc = (value / 100) * circumference * 0.75;
  const offset = circumference * 0.125;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="gauge-svg">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="8"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeDashoffset={-offset} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeDashoffset={-offset} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      <text x={cx} y={cy - 3} textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="900">{value}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontWeight="600">PROB</text>
    </svg>
  );
}

export default function DefectPrediction() {
  const [predictions, setPredictions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePredictions()
      .then(data => {
        setPredictions(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading predictions...</div>;

  const defectColors = {
    'Dimensional Deviation': '#ef4444',
    'Surface Defect': '#f97316',
    'Structural Weakness': '#8b5cf6',
    'Overheating Damage': '#ef4444',
    'Material Inconsistency': '#eab308',
    'Machine-Induced Defect': '#f97316'
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">Defect Prediction</div>
          <div className="page-subtitle">AI defect forecasting · Defect Prediction Agent</div>
        </div>
        <div className="ibm-badge">IBM Granite 13B · Defect Prediction Agent</div>
      </div>

      {predictions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--accent-green)' }}>
          <CheckCircle size={40} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 700 }}>No Active Defect Predictions</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>All production parameters within normal ranges</div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Prediction List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {predictions.map(p => (
              <div
                key={p.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  borderLeft: `3px solid ${p.risk_level === 'HIGH' ? 'var(--accent-red)' : 'var(--accent-orange)'}`,
                  background: selected?.id === p.id ? 'var(--bg-card-hover)' : 'var(--bg-card)'
                }}
                onClick={() => setSelected(p)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{p.defect_type}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.machine_name}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <ProbabilityGauge value={p.probability} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className={`badge ${p.risk_level.toLowerCase()}`}>{p.risk_level} RISK</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Next {p.estimated_occurrence_cycles} cycles</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Confidence: {p.confidence}%</span>
                </div>
              </div>
            ))}

            {/* Probability chart */}
            <div className="card">
              <div className="section-title"><Zap size={14} color="var(--accent-blue)" />DEFECT RISK OVERVIEW</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={predictions.map(p => ({ name: p.defect_type.split(' ')[0], prob: p.probability, conf: p.confidence }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
                  <Bar dataKey="prob" name="Probability %" radius={[4, 4, 0, 0]}>
                    {predictions.map((p, i) => <Cell key={i} fill={defectColors[p.defect_type] || '#3b82f6'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prediction Detail */}
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card" style={{ borderTop: `2px solid ${selected.risk_level === 'HIGH' ? 'var(--accent-red)' : 'var(--accent-orange)'}` }}>
                <div className="section-title"><AlertCircle size={14} color="var(--accent-red)" />PREDICTION DETAIL</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  {[
                    { label: 'Predicted Defect', value: selected.defect_type, color: 'var(--text-primary)' },
                    { label: 'Probability', value: `${selected.probability}%`, color: defectColors[selected.defect_type] || '#ef4444' },
                    { label: 'Risk Level', value: selected.risk_level, color: selected.risk_level === 'HIGH' ? 'var(--accent-red)' : 'var(--accent-orange)' },
                    { label: 'Est. Occurrence', value: `${selected.estimated_occurrence_cycles} cycles`, color: 'var(--text-secondary)' },
                    { label: 'Confidence', value: `${selected.confidence}%`, color: 'var(--accent-cyan)' },
                    { label: 'Machine', value: selected.machine_name, color: 'var(--text-secondary)' },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--bg-secondary)', padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Explanation */}
              <div className="card">
                <div className="section-title">AI EXPLANATION</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                  {selected.explanation}
                </div>
                <div className="disclaimer">{selected.historical_pattern}</div>
              </div>

              {/* Contributing Factors */}
              <div className="card">
                <div className="section-title">CONTRIBUTING FACTORS</div>
                {selected.contributing_factors.map((f, i) => (
                  <div key={i} className="factor-bar">
                    <div className="factor-label">
                      <div style={{ fontSize: 11, fontWeight: 600 }}>{f.factor}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.value}</div>
                    </div>
                    <div className="factor-track">
                      <div className="factor-fill" style={{
                        width: `${f.weight}%`,
                        background: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : i === 2 ? '#eab308' : '#3b82f6'
                      }} />
                    </div>
                    <div className="factor-pct">{f.weight}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="disclaimer" style={{ marginTop: 16 }}>
        ⚠ AI-generated defect predictions — Not guaranteed outcomes. All predictions require qualified engineer validation before action.
      </div>
    </div>
  );
}
