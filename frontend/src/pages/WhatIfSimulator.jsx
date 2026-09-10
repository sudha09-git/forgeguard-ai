import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { FlaskConical, Play, RotateCcw } from 'lucide-react';
import { runSimulation } from '../services/api';

const DEFAULTS = {
  temperature: 251.3, rpm: 1756, pressure: 8.7,
  vibration_threshold: 8.7, material_moisture: 2.8, flow_rate: 11.8
};
const RECOMMENDED = {
  temperature: 232.0, rpm: 1720, pressure: 8.0,
  vibration_threshold: 4.0, material_moisture: 2.2, flow_rate: 13.0
};

const PARAMS = [
  { key: 'temperature', label: 'Temperature', unit: '°C', min: 210, max: 270, step: 0.5 },
  { key: 'rpm', label: 'RPM', unit: '', min: 1600, max: 2000, step: 10 },
  { key: 'pressure', label: 'Pressure', unit: ' bar', min: 7.0, max: 10.0, step: 0.1 },
  { key: 'vibration_threshold', label: 'Vibration Threshold', unit: ' mm/s', min: 0, max: 12, step: 0.1 },
  { key: 'material_moisture', label: 'Material Moisture', unit: '%', min: 0, max: 5, step: 0.1 },
  { key: 'flow_rate', label: 'Coolant Flow Rate', unit: ' L/min', min: 8, max: 18, step: 0.5 },
];

export default function WhatIfSimulator() {
  const [params, setParams] = useState({ ...RECOMMENDED });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await runSimulation(params);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setParams({ ...RECOMMENDED });
    setResult(null);
  };

  const chartData = result ? result.results.chart_data?.before_after || [] : [];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">What-If Process Simulator</div>
          <div className="page-subtitle">AI-assisted scenario simulation · Test parameter changes before implementation</div>
        </div>
        <div className="ibm-badge">Optimization Agent · Simulation Mode</div>
      </div>

      <div className="disclaimer" style={{ marginBottom: 16 }}>
        ⚠ AI-assisted scenario simulation — Not a guaranteed physical outcome. Results are model-based estimates. Physical validation required before implementing any changes.
      </div>

      <div className="grid-2">
        {/* Controls */}
        <div className="card">
          <div className="section-title"><FlaskConical size={14} color="var(--accent-blue)" />PARAMETER CONFIGURATION</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setParams({ ...DEFAULTS })}>Load Current State</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setParams({ ...RECOMMENDED })}>Load AI Recommendation</button>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}><RotateCcw size={12} /> Reset</button>
          </div>

          {PARAMS.map(p => (
            <div key={p.key} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{p.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Current: <span style={{ color: 'var(--accent-orange)' }}>{DEFAULTS[p.key]}{p.unit}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-blue)', minWidth: 70, textAlign: 'right' }}>
                    {params[p.key]}{p.unit}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={p.min} max={p.max} step={p.step}
                value={params[p.key]}
                onChange={e => setParams(prev => ({ ...prev, [p.key]: parseFloat(e.target.value) }))}
                style={{
                  accentColor: params[p.key] < DEFAULTS[p.key] ? 'var(--accent-green)' : params[p.key] > DEFAULTS[p.key] ? 'var(--accent-orange)' : 'var(--accent-blue)'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>
                <span>{p.min}{p.unit}</span>
                <span style={{ color: 'var(--accent-green)' }}>AI Rec: {RECOMMENDED[p.key]}{p.unit}</span>
                <span>{p.max}{p.unit}</span>
              </div>
            </div>
          ))}

          <button className="btn btn-primary" onClick={handleRun} disabled={loading} style={{ width: '100%' }}>
            {loading ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Running simulation...</> : <><Play size={14} /> Run Simulation</>}
          </button>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Comparison table */}
          <div className="card">
            <div className="section-title">CONFIGURATION COMPARISON</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '6px 8px' }}>PARAMETER</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-orange)', padding: '6px 8px', textAlign: 'center' }}>CURRENT (M-03)</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-blue)', padding: '6px 8px', textAlign: 'center' }}>PROPOSED</div>
              {PARAMS.map(p => (
                <React.Fragment key={p.key}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '6px 8px', borderTop: '1px solid var(--border-light)' }}>{p.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-orange)', padding: '6px 8px', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
                    {DEFAULTS[p.key]}{p.unit}
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: params[p.key] < DEFAULTS[p.key] ? 'var(--accent-green)' : params[p.key] > DEFAULTS[p.key] ? 'var(--accent-red)' : 'var(--text-muted)',
                    padding: '6px 8px', textAlign: 'center', borderTop: '1px solid var(--border-light)'
                  }}>
                    {params[p.key]}{p.unit} {params[p.key] < DEFAULTS[p.key] ? '↓' : params[p.key] > DEFAULTS[p.key] ? '↑' : ''}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Simulation Results */}
          {result ? (
            <>
              <div className="card" style={{ borderTop: '2px solid var(--accent-green)' }}>
                <div className="section-title">SIMULATION RESULTS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>DEFECT RISK</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-red)' }}>{result.results.current_defect_risk_pct}%</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>
                      <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-green)' }}>{result.results.simulated_defect_risk_pct}%</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 4 }}>
                      ↓ {result.results.risk_reduction_pct}% reduction
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>QUALITY SCORE</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-orange)' }}>{result.results.current_quality_score}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>
                      <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-green)' }}>{result.results.simulated_quality_score}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 4 }}>
                      ↑ +{result.results.quality_improvement} points improvement
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
                    <Bar dataKey="current" name="Current" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Bar dataKey="simulated" name="Simulated" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="disclaimer" style={{ marginTop: 12 }}>
                  {result.disclaimer}
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <FlaskConical size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Adjust parameters and click "Run Simulation"</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>AI will model the expected quality impact of your configuration</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
