import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { fetchQualityScore, fetchAnomalySummary } from '../services/api';

function RadialGauge({ value, max = 100, size = 140, label }) {
  const r = 52;
  const cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  const arc = (value / max) * circumference * 0.75;
  const offset = circumference * 0.125;
  const color = value >= 90 ? '#22c55e' : value >= 70 ? '#3b82f6' : value >= 50 ? '#f97316' : '#ef4444';

  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className="gauge-svg">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="10"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeDashoffset={-offset} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeDashoffset={-offset} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.8s ease', filter: `drop-shadow(0 0 6px ${color})` }} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="22" fontWeight="900">{value}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="600">{label || '/100'}</text>
    </svg>
  );
}

export default function QualityIntelligence() {
  const [quality, setQuality] = useState(null);
  const [anomalySummary, setAnomalySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchQualityScore(), fetchAnomalySummary()])
      .then(([q, a]) => { setQuality(q); setAnomalySummary(a); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading quality intelligence...</div>;
  if (!quality) return null;

  const radarData = quality.components.map(c => ({
    subject: c.name.replace('Historical Defect Rate', 'Defect Rate').replace('Environmental Conditions', 'Environment'),
    value: c.score,
    fullMark: 100
  }));

  const barData = quality.components.map(c => ({
    name: c.name.replace('Environmental Conditions', 'Environment').replace('Historical Defect Rate', 'Defect Rate'),
    score: c.score,
    weight: c.weight
  }));

  const getBarColor = (score) => score >= 90 ? '#22c55e' : score >= 80 ? '#3b82f6' : score >= 70 ? '#f97316' : '#ef4444';

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">Quality Intelligence</div>
          <div className="page-subtitle">AI-powered quality scoring and analysis · Quality Analysis Agent</div>
        </div>
        <div className="ibm-badge">IBM Granite 13B · Quality Analysis Agent</div>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Main gauge */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div className="gauge-container">
            <RadialGauge value={Math.round(quality.overall)} label="QUALITY" />
            <div style={{ fontSize: 11, fontWeight: 700, color: quality.overall >= 90 ? 'var(--accent-green)' : 'var(--accent-orange)', marginTop: 4 }}>
              {quality.overall >= 90 ? '● EXCELLENT' : quality.overall >= 80 ? '● GOOD' : '● NEEDS ATTENTION'}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)', marginBottom: 6 }}>✓ POSITIVE FACTORS</div>
              {quality.main_factors_positive.map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 6 }}>
                  <span style={{ color: 'var(--accent-green)' }}>+</span> {f}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-red)', marginBottom: 6 }}>✗ NEGATIVE FACTORS</div>
              {quality.main_factors_negative.map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3, display: 'flex', gap: 6 }}>
                  <span style={{ color: 'var(--accent-red)' }}>−</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="card">
          <div className="section-title"><BarChart3 size={14} color="var(--accent-blue)" />QUALITY COMPONENT RADAR</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border-light)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Radar name="Quality" dataKey="value" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Component Breakdown Bar Chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title"><BarChart3 size={14} color="var(--accent-cyan)" />COMPONENT SCORES</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} angle={-20} textAnchor="end" />
            <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Components Detail */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">DETAILED COMPONENT BREAKDOWN</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {quality.components.map(c => (
            <div key={c.name} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Weight: {c.weight}%</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: getBarColor(c.score) }}>{c.score}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${c.score}%`, background: getBarColor(c.score) }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10 }}>
                <span className={`badge ${c.status}`}>{c.status.toUpperCase()}</span>
                <span style={{ color: c.trend > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {c.trend > 0 ? '↑' : '↓'} {Math.abs(c.trend)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly summary */}
      {anomalySummary && (
        <div className="card">
          <div className="section-title"><AlertTriangle size={14} color="var(--accent-orange)" />ANOMALY IMPACT ON QUALITY</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Total Anomalies', value: anomalySummary.total, color: 'var(--text-primary)' },
              { label: 'Critical', value: anomalySummary.critical, color: 'var(--accent-red)' },
              { label: 'High', value: anomalySummary.high, color: 'var(--accent-orange)' },
              { label: 'Warning', value: anomalySummary.warning, color: 'var(--accent-yellow)' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
