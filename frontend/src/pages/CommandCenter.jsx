import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Zap, Activity, BarChart3, Cpu, ArrowUp, ArrowDown
} from 'lucide-react';
import { fetchDashboard, fetchMachines, fetchAnomalyTimeline } from '../services/api';

function RadialGauge({ value, max = 100, size = 120, color }) {
  const r = 44;
  const cx = 60, cy = 60;
  const circumference = 2 * Math.PI * r;
  const arc = (value / max) * circumference * 0.75;
  const offset = circumference * 0.125;

  const getColor = (v) => {
    if (v >= 90) return '#22c55e';
    if (v >= 70) return '#3b82f6';
    if (v >= 50) return '#f97316';
    return '#ef4444';
  };

  const c = color || getColor(value);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="gauge-svg">
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--bg-secondary)"
        strokeWidth="8"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`}
      />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={c}
        strokeWidth="8"
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.8s ease', filter: `drop-shadow(0 0 4px ${c})` }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="800">
        {value}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600">
        {max === 100 ? '%' : ''}
      </text>
    </svg>
  );
}

function SparkLine({ data, color = '#3b82f6' }) {
  if (!data || data.length === 0) return null;
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          fill={`url(#grad-${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function KPICard({ label, value, unit, trend, trendGood, status, sparkline, color, statusLabel }) {
  const trendUp = trend > 0;
  const trendClass = trendGood ? (trendUp ? 'up' : 'down') : (trendUp ? 'down' : 'up');
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: color || 'var(--text-primary)' }}>
        {value}{unit && <span style={{ fontSize: 14, fontWeight: 600 }}>{unit}</span>}
      </div>
      <div style={{ marginBottom: 6 }}>
        <SparkLine data={sparkline} color={color || '#3b82f6'} />
      </div>
      <div className={`kpi-trend ${trendClass}`}>
        {trendUp ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
        {Math.abs(trend)}%
      </div>
      {statusLabel && (
        <div className={`kpi-status ${status}`}>{statusLabel}</div>
      )}
    </div>
  );
}

function MachineNode({ machine, onClick }) {
  const statusColor = {
    normal: 'var(--accent-green)', warning: 'var(--accent-orange)',
    critical: 'var(--accent-red)', offline: 'var(--text-muted)'
  };

  return (
    <div className={`machine-node ${machine.status}`} onClick={() => onClick && onClick(machine)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div className="machine-id">{machine.id}</div>
          <div className="machine-name">{machine.name}</div>
        </div>
        <span className={`badge ${machine.status}`}>{machine.status.toUpperCase()}</span>
      </div>
      <div className="machine-params">
        <div className="machine-param">Temp <span style={{ color: machine.temperature > 248 ? 'var(--accent-red)' : machine.temperature > 245 ? 'var(--accent-orange)' : 'var(--text-secondary)' }}>{machine.temperature}°C</span></div>
        <div className="machine-param">Vib <span style={{ color: machine.vibration > 6 ? 'var(--accent-red)' : machine.vibration > 5 ? 'var(--accent-orange)' : 'var(--text-secondary)' }}>{machine.vibration}mm/s</span></div>
        <div className="machine-param">Press <span>{machine.pressure}bar</span></div>
        <div className="machine-param">Health <span style={{ color: machine.health > 90 ? 'var(--accent-green)' : machine.health > 70 ? 'var(--accent-orange)' : 'var(--accent-red)' }}>{machine.health}%</span></div>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flow-arrow">
      <div className="flow-line" />
      <svg width="10" height="6" viewBox="0 0 10 6">
        <path d="M0 0 L5 6 L10 0" fill="none" stroke="var(--accent-blue)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function CommandCenter() {
  const [summary, setSummary] = useState(null);
  const [machines, setMachines] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, m, t] = await Promise.all([
          fetchDashboard(), fetchMachines(), fetchAnomalyTimeline()
        ]);
        setSummary(s);
        setMachines(m);
        setTimeline(t);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setSummary(prev => prev ? {
        ...prev,
        quality_score: parseFloat((prev.quality_score + (Math.random() - 0.48) * 0.1).toFixed(1)),
        defect_probability: parseFloat((prev.defect_probability + (Math.random() - 0.5) * 0.05).toFixed(1)),
        production_rate: Math.round(prev.production_rate + (Math.random() - 0.5) * 2)
      } : prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /><span>Initializing ForgeGuard AI...</span></div>;

  const lineAMachines = machines.filter(m => m.line === 'LINE_A');
  const lineBMachines = machines.filter(m => m.line === 'LINE_B');

  const severityColor = { critical: 'var(--accent-red)', high: 'var(--accent-orange)', warning: 'var(--accent-yellow)', info: 'var(--accent-blue)' };

  return (
    <div className="page-content">
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.08) 100%)',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            ⚙ FORGEGUARD AI — Command Center
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Predict Quality. Prevent Defects. Optimize Production.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="simulation-badge"><Activity size={10} /> LIVE SIMULATION</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>Simulated sensor data</div>
          </div>
          <div className="ibm-badge">IBM Granite 13B · Langflow</div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid">
        <KPICard
          label="QUALITY SCORE" value={summary.quality_score} unit="%"
          trend={summary.quality_score_trend} trendGood={true}
          status="optimal" statusLabel="OPTIMAL"
          sparkline={summary.sparklines.quality_score} color="var(--accent-green)"
        />
        <KPICard
          label="PRODUCTION RATE" value={summary.production_rate} unit=" u/hr"
          trend={summary.production_rate_trend} trendGood={true}
          status="normal" statusLabel="ON TARGET"
          sparkline={summary.sparklines.production_rate} color="var(--accent-blue)"
        />
        <KPICard
          label="FIRST PASS YIELD" value={summary.first_pass_yield} unit="%"
          trend={summary.first_pass_yield_trend} trendGood={true}
          status="normal" statusLabel="GOOD"
          sparkline={summary.sparklines.quality_score} color="var(--accent-cyan)"
        />
        <KPICard
          label="DEFECT RISK" value={summary.defect_probability} unit="%"
          trend={summary.defect_probability_trend} trendGood={false}
          status="warning" statusLabel="MONITOR"
          sparkline={summary.sparklines.defect_probability} color="var(--accent-orange)"
        />
        <KPICard
          label="ACTIVE ANOMALIES" value={summary.active_anomalies} unit=""
          trend={0} trendGood={false}
          status={summary.active_anomalies > 2 ? 'critical' : 'warning'} statusLabel={summary.active_anomalies > 2 ? 'ACTION NEEDED' : 'MONITORING'}
          sparkline={[1,1,2,2,3,3,3]} color="var(--accent-red)"
        />
        <KPICard
          label="MACHINE HEALTH" value={summary.machine_health} unit="%"
          trend={summary.machine_health_trend} trendGood={true}
          status="warning" statusLabel="REVIEW M-03"
          sparkline={summary.sparklines.machine_health} color="var(--accent-purple)"
        />
        <KPICard
          label="MACHINES ONLINE" value={`${summary.machines_online}/${summary.machines_total}`} unit=""
          trend={0} trendGood={true}
          status="normal" statusLabel="ALL MONITORED"
          sparkline={[8,8,8,8,7,8,8]} color="var(--accent-blue)"
        />
        <KPICard
          label="PROCESS STABILITY" value={summary.process_stability} unit="%"
          trend={summary.process_stability_trend} trendGood={true}
          status="warning" statusLabel="WARNING"
          sparkline={[85,86,87,86,88,88,88.4]} color="var(--accent-yellow)"
        />
      </div>

      {/* Main Grid */}
      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        {/* Production Line Visualization */}
        <div className="card" style={{ background: 'var(--bg-card)' }}>
          <div className="section-title">
            <Activity size={14} color="var(--accent-blue)" />
            AI QUALITY CONTROL STATUS
            <span className="simulation-badge" style={{ marginLeft: 'auto' }}>
              <span className="status-dot blue" style={{ width: 6, height: 6, display: 'inline-block', borderRadius: '50%', background: 'var(--accent-blue)', animation: 'pulse 2s infinite' }}></span>
              LIVE SIMULATION
            </span>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            {/* Line A flow */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Line A — CNC Machining</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div className="card" style={{ padding: '6px 14px', fontSize: 11, background: 'var(--bg-secondary)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, width: '100%', textAlign: 'center' }}>
                  RAW MATERIAL INPUT
                </div>
                <FlowArrow />
                {lineAMachines.map((m, i) => (
                  <React.Fragment key={m.id}>
                    <MachineNode machine={m} />
                    {i < lineAMachines.length - 1 && <FlowArrow />}
                  </React.Fragment>
                ))}
                <FlowArrow />
                <div className="card" style={{ padding: '6px 14px', fontSize: 11, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--accent-green)', width: '100%', textAlign: 'center', letterSpacing: 1 }}>
                  ✓ FINISHED PRODUCT
                </div>
              </div>
            </div>

            {/* Line B flow */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Line B — Stamping</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div className="card" style={{ padding: '6px 14px', fontSize: 11, background: 'var(--bg-secondary)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, width: '100%', textAlign: 'center' }}>
                  RAW MATERIAL INPUT
                </div>
                <FlowArrow />
                {lineBMachines.map((m, i) => (
                  <React.Fragment key={m.id}>
                    <MachineNode machine={m} />
                    {i < lineBMachines.length - 1 && <FlowArrow />}
                  </React.Fragment>
                ))}
                <FlowArrow />
                <div className="card" style={{ padding: '6px 14px', fontSize: 11, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--accent-green)', width: '100%', textAlign: 'center', letterSpacing: 1 }}>
                  ✓ FINISHED PRODUCT
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: Quality Score + Anomaly Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quality Score Gauge */}
          <div className="card">
            <div className="section-title"><BarChart3 size={14} color="var(--accent-blue)" />AI QUALITY SCORE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div className="gauge-container">
                <RadialGauge value={Math.round(summary.quality_score)} />
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>OVERALL QUALITY</div>
              </div>
              <div style={{ flex: 1 }}>
                {[
                  { name: 'Process Stability', score: 88.4, color: '#3b82f6' },
                  { name: 'Machine Health', score: 82.1, color: '#f97316' },
                  { name: 'Material Consistency', score: 94.7, color: '#22c55e' },
                  { name: 'Environmental', score: 96.2, color: '#06b6d4' },
                  { name: 'Inspection Results', score: 93.8, color: '#8b5cf6' },
                ].map(item => (
                  <div key={item.name} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 3 }}>
                      <span>{item.name}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${item.score}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="disclaimer">
              Quality score calculated from 6 weighted factors. M-03 anomaly is currently the primary drag on Machine Health component.
            </div>
          </div>

          {/* Anomaly Timeline */}
          <div className="card" style={{ flex: 1 }}>
            <div className="section-title"><AlertTriangle size={14} color="var(--accent-orange)" />ANOMALY TIMELINE</div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {timeline.slice(0, 5).map(item => (
                <div key={item.id} className="timeline-item">
                  <div className={`timeline-dot ${item.severity}`} />
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
                      {item.machine_id} — {item.parameter} Anomaly
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {item.description?.slice(0, 80)}...
                    </div>
                    <span className={`badge ${item.severity}`}>{item.severity.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Panel */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 100%)',
        border: '1px solid rgba(59,130,246,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Zap size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)' }}>AI INTELLIGENCE INSIGHT</span>
          <span className="ibm-badge" style={{ marginLeft: 'auto' }}>IBM Granite 13B</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--accent-red)', fontWeight: 700, marginBottom: 6 }}>⚠ CRITICAL DETECTION</div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              M-03 multi-parameter anomaly: temperature +6.8°C above baseline simultaneously with vibration at 8.7 mm/s (145% above limit). <strong>82% defect probability</strong> in next 35 cycles.
            </div>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--accent-orange)', fontWeight: 700, marginBottom: 6 }}>🔍 ROOT CAUSE ANALYSIS</div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              AI identifies calibration drift (84 days overdue) as primary contributor. Historical pattern match: 87% correlation with dimensional deviation events in Q3 2024 defect database.
            </div>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--accent-blue)', fontWeight: 700, marginBottom: 6 }}>💡 OPTIMIZATION READY</div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              Recommendation #024 pending engineer approval: Reduce temperature 240°C→232°C, RPM 1800→1720. Projected outcome: defect risk 82%→31%, quality score 78→93.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
