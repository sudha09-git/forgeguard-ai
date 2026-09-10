import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { Activity, Thermometer, Gauge, Zap, Droplets, Wind, Radio } from 'lucide-react';
import { fetchSensorStream, fetchMachines } from '../services/api';

const PARAMS = [
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#ef4444', icon: Thermometer, normal: [228, 245], warn: 248, crit: 255 },
  { key: 'pressure', label: 'Pressure', unit: ' bar', color: '#3b82f6', icon: Gauge, normal: [7.8, 8.5], warn: 8.7, crit: 9.0 },
  { key: 'vibration', label: 'Vibration', unit: ' mm/s', color: '#f97316', icon: Radio, normal: [0, 4.0], warn: 6.0, crit: 8.0 },
  { key: 'rpm', label: 'RPM', unit: '', color: '#8b5cf6', icon: Zap, normal: [1720, 1850], warn: 1900, crit: 1950 },
  { key: 'humidity', label: 'Humidity', unit: '%', color: '#06b6d4', icon: Droplets, normal: [38, 48], warn: 52, crit: 58 },
  { key: 'current', label: 'Machine Current', unit: ' A', color: '#eab308', icon: Zap, normal: [15, 22], warn: 24, crit: 27 },
];

function getStatus(value, param) {
  if (value >= param.crit) return 'critical';
  if (value >= param.warn) return 'high';
  if (value < param.normal[0] || value > param.normal[1]) return 'warning';
  return 'normal';
}

function ParameterCard({ param, currentValue, data }) {
  const status = getStatus(currentValue, param);
  const statusColor = {
    normal: 'var(--accent-green)', warning: 'var(--accent-yellow)',
    high: 'var(--accent-orange)', critical: 'var(--accent-red)'
  }[status];
  const Icon = param.icon;

  return (
    <div className="card" style={{ borderTop: `2px solid ${statusColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Icon size={13} color={param.color} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {param.label}
          </span>
        </div>
        <span className={`badge ${status}`}>{status.toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: statusColor, letterSpacing: -1 }}>
        {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{param.unit}</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
        Normal: {param.normal[0]}–{param.normal[1]}{param.unit} · Warn: {param.warn}{param.unit}
      </div>
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={data.slice(-30).map((d, i) => ({ i, v: d[param.key] }))}>
          <Line type="monotone" dataKey="v" stroke={param.color} strokeWidth={1.5} dot={false} />
          <ReferenceLine y={param.warn} stroke={statusColor} strokeDasharray="3 3" strokeOpacity={0.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ProcessMonitor() {
  const [selectedMachine, setSelectedMachine] = useState('M-03');
  const [machines, setMachines] = useState([]);
  const [streamData, setStreamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchMachines().then(setMachines);
  }, []);

  useEffect(() => {
    const loadStream = async () => {
      setLoading(true);
      try {
        const result = await fetchSensorStream(selectedMachine, 60);
        setStreamData(result.points || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStream();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      try {
        const result = await fetchSensorStream(selectedMachine, 1);
        if (result.points && result.points.length > 0) {
          setStreamData(prev => {
            const newData = [...prev.slice(-59), result.points[0]];
            return newData;
          });
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [selectedMachine]);

  const currentMachine = machines.find(m => m.id === selectedMachine);
  const latest = streamData[streamData.length - 1] || {};
  const chartData = streamData.map((d, i) => ({ ...d, i }));

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">Process Monitor</div>
          <div className="page-subtitle">Real-time sensor monitoring · AI Process Monitoring Agent</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="simulation-badge"><Activity size={10} /> LIVE SIMULATION</span>
          <div className="ibm-badge">Process Monitoring Agent · Active</div>
        </div>
      </div>

      <div className="disclaimer" style={{ marginBottom: 16 }}>
        ⚠ This display shows AI-generated simulation data for demonstration purposes. Not connected to physical factory hardware.
      </div>

      {/* Machine Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {machines.map(m => (
          <button
            key={m.id}
            className={`btn ${selectedMachine === m.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSelectedMachine(m.id)}
            style={{ borderLeft: `3px solid ${m.status === 'critical' ? 'var(--accent-red)' : m.status === 'warning' ? 'var(--accent-orange)' : 'var(--accent-green)'}` }}
          >
            {m.id}
            {m.status === 'critical' && <span style={{ marginLeft: 4, color: 'var(--accent-red)' }}>●</span>}
            {m.status === 'warning' && <span style={{ marginLeft: 4, color: 'var(--accent-orange)' }}>●</span>}
          </button>
        ))}
      </div>

      {/* Machine Summary */}
      {currentMachine && (
        <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(6,182,212,0.04) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{currentMachine.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentMachine.type} · Line {currentMachine.line?.replace('LINE_', '')} · Uptime: {currentMachine.uptime_hrs.toLocaleString()} hrs</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge ${currentMachine.status}`}>{currentMachine.status.toUpperCase()}</span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: currentMachine.health > 90 ? 'var(--accent-green)' : currentMachine.health > 70 ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
                  {currentMachine.health}%
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>HEALTH</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" />Loading sensor data...</div>
      ) : (
        <>
          {/* Parameter Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 16 }}>
            {PARAMS.map(p => (
              <ParameterCard key={p.key} param={p} currentValue={latest[p.key] || 0} data={streamData} />
            ))}
          </div>

          {/* Full-width chart */}
          <div className="card">
            <div className="section-title">
              <Activity size={14} color="var(--accent-blue)" />
              MULTI-PARAMETER TREND — {selectedMachine}
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>
                Last {streamData.length} data points · 5s intervals
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="i" hide />
                <YAxis yAxisId="temp" domain={['auto', 'auto']} orientation="left" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis yAxisId="vib" domain={[0, 12]} orientation="right" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 11 }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine yAxisId="temp" y={245} stroke="var(--accent-orange)" strokeDasharray="4 4" label={{ value: 'Temp Warn', fontSize: 9, fill: 'var(--accent-orange)' }} />
                <ReferenceLine yAxisId="vib" y={6} stroke="var(--accent-red)" strokeDasharray="4 4" />
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} name="Temperature (°C)" />
                <Line yAxisId="vib" type="monotone" dataKey="vibration" stroke="#f97316" strokeWidth={2} dot={false} name="Vibration (mm/s)" />
                <Line yAxisId="vib" type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Pressure (bar)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
