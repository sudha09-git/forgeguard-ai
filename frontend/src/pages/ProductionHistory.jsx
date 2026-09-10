import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceDot, Legend
} from 'recharts';
import { Clock, Filter } from 'lucide-react';
import { fetchHistory, fetchHistorySummary } from '../services/api';

export default function ProductionHistory() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchHistory(days), fetchHistorySummary()])
      .then(([h, s]) => { setData(h); setSummary(s); })
      .finally(() => setLoading(false));
  }, [days]);

  // Sample every N points for readability
  const sample = (arr, n) => arr.filter((_, i) => i % n === 0);
  const displayData = sample(data, Math.max(1, Math.floor(data.length / 100)));

  const chartData = displayData.map(d => ({
    t: new Date(d.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    quality: d.quality_score,
    defect: d.defect_rate,
    fpy: d.first_pass_yield,
    temp: d.temperature_m03,
    vib: d.vibration_m03,
    vol: d.production_volume,
    anomaly: d.anomaly
  }));

  const anomalyDots = chartData.filter(d => d.anomaly);

  if (loading) return <div className="loading"><div className="spinner" />Loading production history...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">Production History</div>
          <div className="page-subtitle">Historical analytics · Trend analysis with anomaly markers</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={14} color="var(--text-muted)" />
          {[3, 7, 14, 30].map(d => (
            <button
              key={d}
              className={`btn btn-sm ${days === d ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDays(d)}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Avg Quality Score', value: `${summary.avg_quality_score}%`, color: 'var(--accent-green)' },
            { label: 'Avg Defect Rate', value: `${summary.avg_defect_rate}%`, color: 'var(--accent-orange)' },
            { label: 'Total Production', value: summary.total_production_volume?.toLocaleString(), color: 'var(--accent-blue)' },
            { label: 'Anomaly Events', value: summary.anomaly_count, color: 'var(--accent-red)' },
          ].map(item => (
            <div key={item.label} className="kpi-card" style={{ textAlign: 'center' }}>
              <div className="kpi-label">{item.label}</div>
              <div className="kpi-value" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Quality Score */}
        <div className="card">
          <div className="section-title">QUALITY SCORE TREND</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval={Math.floor(chartData.length / 6)} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
              <Area type="monotone" dataKey="quality" stroke="#22c55e" fill="url(#qualGrad)" strokeWidth={2} dot={false} name="Quality Score" />
              {anomalyDots.map((d, i) => (
                <ReferenceDot key={i} x={d.t} y={d.quality} r={5} fill="var(--accent-red)" stroke="none" />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            🔴 Red dots indicate anomaly events
          </div>
        </div>

        <div className="grid-2">
          {/* Defect Rate */}
          <div className="card">
            <div className="section-title">DEFECT RATE TREND</div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="defGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval={Math.floor(chartData.length / 5)} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
                <Area type="monotone" dataKey="defect" stroke="#ef4444" fill="url(#defGrad)" strokeWidth={2} dot={false} name="Defect Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* FPY */}
          <div className="card">
            <div className="section-title">FIRST PASS YIELD</div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fpyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval={Math.floor(chartData.length / 5)} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
                <Area type="monotone" dataKey="fpy" stroke="#3b82f6" fill="url(#fpyGrad)" strokeWidth={2} dot={false} name="FPY %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* M-03 parameters */}
        <div className="card">
          <div className="section-title">M-03 PARAMETER HISTORY (Temperature · Vibration)</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} interval={Math.floor(chartData.length / 6)} />
              <YAxis yAxisId="temp" domain={[220, 265]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
              <YAxis yAxisId="vib" orientation="right" domain={[0, 12]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Temperature M-03 (°C)" />
              <Line yAxisId="vib" type="monotone" dataKey="vib" stroke="#f97316" strokeWidth={1.5} dot={false} name="Vibration M-03 (mm/s)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
