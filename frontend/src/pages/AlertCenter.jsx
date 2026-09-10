import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, Filter } from 'lucide-react';
import { fetchAnomalies } from '../services/api';

const SEVERITY_ORDER = { critical: 0, high: 1, warning: 2, info: 3 };
const SEVERITY_ICONS = {
  critical: AlertTriangle, high: AlertCircle, warning: AlertTriangle, info: Info
};

export default function AlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnomalies().then(data => {
      setAlerts(data.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]));
    }).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);

  const counts = alerts.reduce((acc, a) => {
    acc[a.severity] = (acc[a.severity] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="loading"><div className="spinner" />Loading alerts...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">Alert Center</div>
          <div className="page-subtitle">Active anomaly alerts with AI interpretation</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'ALL', value: 'all', count: alerts.length, color: 'var(--text-primary)' },
          { label: 'CRITICAL', value: 'critical', count: counts.critical || 0, color: 'var(--accent-red)' },
          { label: 'HIGH', value: 'high', count: counts.high || 0, color: 'var(--accent-orange)' },
          { label: 'WARNING', value: 'warning', count: counts.warning || 0, color: 'var(--accent-yellow)' },
        ].map(item => (
          <button
            key={item.value}
            className={`btn btn-sm ${filter === item.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(item.value)}
            style={{ borderLeft: filter === item.value ? `3px solid ${item.color}` : undefined }}
          >
            <span style={{ color: item.color, fontWeight: 700 }}>{item.count}</span>
            <span style={{ marginLeft: 4 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--accent-green)' }}>
          <AlertTriangle size={32} style={{ marginBottom: 12 }} />
          <div>No alerts matching filter</div>
        </div>
      ) : (
        filtered.map(alert => {
          const Icon = SEVERITY_ICONS[alert.severity] || AlertTriangle;
          const borderColor = {
            critical: 'var(--accent-red)', high: 'var(--accent-orange)',
            warning: 'var(--accent-yellow)', info: 'var(--accent-blue)'
          }[alert.severity];

          return (
            <div key={alert.id} className={`alert-item ${alert.severity}`} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon size={18} color={borderColor} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                      <span className={`badge ${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{alert.machine_name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.machine_id}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{alert.description}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 10 }}>
                {alert.observed_value !== null && (
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: 8 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>OBSERVED VALUE</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: borderColor }}>
                      {alert.observed_value}{alert.unit}
                    </div>
                    {alert.expected_range && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Expected: {alert.expected_range[0]}–{alert.expected_range[1]}{alert.unit}
                      </div>
                    )}
                  </div>
                )}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: 8 }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>PARAMETER</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{alert.parameter}</div>
                  <span className={`badge ${alert.status || 'active'}`} style={{ marginTop: 4 }}>{(alert.status || 'active').toUpperCase()}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>🤖 AI INTERPRETATION</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{alert.ai_interpretation}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {alert.potential_impact && (
                  <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 6, padding: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent-orange)', marginBottom: 3 }}>⚡ POTENTIAL IMPACT</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{alert.potential_impact}</div>
                  </div>
                )}
                {alert.recommended_action && (
                  <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 6, padding: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent-green)', marginBottom: 3 }}>✓ RECOMMENDED ACTION</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{alert.recommended_action}</div>
                  </div>
                )}
              </div>
              {alert.correlated_anomalies && alert.correlated_anomalies.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
                  🔗 Correlated anomalies: {alert.correlated_anomalies.join(', ')}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
