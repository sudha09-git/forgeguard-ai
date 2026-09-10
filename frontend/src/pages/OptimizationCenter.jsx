import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle, XCircle, FlaskConical, Clock } from 'lucide-react';
import { fetchRecommendations, submitDecision, fetchAuditTrail } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function OptimizationCenter() {
  const [recommendations, setRecommendations] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    const [recs, audit] = await Promise.all([fetchRecommendations(), fetchAuditTrail()]);
    setRecommendations(recs);
    setAuditTrail(audit);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDecision = async (recId, action) => {
    setSubmitting(recId + action);
    try {
      await submitDecision(recId, action, 'J. Smith — Quality Engineer', action === 'approve' ? 'Approved per review of AI recommendation and process data.' : 'Rejected — further analysis required.');
      setNotification({ type: action, message: `Recommendation ${action === 'approve' ? 'approved' : 'rejected'} successfully. Decision logged in audit trail.` });
      await load();
    } catch (e) {
      setNotification({ type: 'error', message: 'Failed to submit decision. Please try again.' });
    } finally {
      setSubmitting(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" />Loading optimization center...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">Optimization Center</div>
          <div className="page-subtitle">AI-generated corrective action recommendations · Engineer Decision Center</div>
        </div>
        <div className="ibm-badge">Process Optimization Agent · Active</div>
      </div>

      {notification && (
        <div style={{
          background: notification.type === 'approve' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${notification.type === 'approve' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12,
          color: notification.type === 'approve' ? 'var(--accent-green)' : 'var(--accent-red)'
        }}>
          {notification.type === 'approve' ? '✓' : '✗'} {notification.message}
        </div>
      )}

      <div className="disclaimer" style={{ marginBottom: 16 }}>
        ⚠ AI-generated recommendations — Engineer approval required before implementation. These are simulation-based suggestions, not validated physical outcomes.
      </div>

      {recommendations.map(rec => (
        <div key={rec.id} className="card" style={{
          marginBottom: 16,
          borderTop: `2px solid ${rec.risk_level === 'HIGH' ? 'var(--accent-red)' : 'var(--accent-orange)'}`,
          opacity: rec.status === 'rejected' ? 0.7 : 1
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>AI RECOMMENDATION #{rec.number}</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{rec.issue}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rec.machine_name} · Generated {new Date(rec.generated_at).toLocaleTimeString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${rec.status}`}>{rec.status.toUpperCase()}</span>
              <div style={{ fontSize: 12, color: 'var(--accent-cyan)', marginTop: 4 }}>Confidence: {rec.confidence}%</div>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
            {/* Evidence */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Evidence</div>
              {rec.evidence.map((e, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>• {e}</div>
              ))}
            </div>
            {/* Expected Impact */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Expected Impact</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Defect Risk</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-red)' }}>{rec.expected_impact.defect_probability_before}%</span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-green)' }}>{rec.expected_impact.defect_probability_after}%</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Quality Score</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-orange)' }}>{rec.expected_impact.quality_score_before}</span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-green)' }}>{rec.expected_impact.quality_score_after}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
                📌 {rec.expected_impact.production_impact}
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>RECOMMENDED ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
              {rec.actions.map((action, i) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 10, color: action.type === 'parameter_change' ? 'var(--accent-blue)' : 'var(--accent-orange)', fontWeight: 700, marginBottom: 4 }}>
                    {action.type === 'parameter_change' ? '⚙ PARAMETER CHANGE' : action.type === 'inspection' ? '🔍 INSPECTION' : '📐 CALIBRATION'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{action.description}</div>
                  {action.current_value && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {action.current_value} → <span style={{ color: 'var(--accent-green)' }}>{action.proposed_value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prediction */}
          <div className="disclaimer" style={{ marginBottom: 16 }}>
            📊 AI Prediction: {rec.prediction}
          </div>

          {/* Action Buttons */}
          {rec.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-success" onClick={() => handleDecision(rec.id, 'approve')} disabled={!!submitting}>
                <CheckCircle size={14} /> Approve Recommendation
              </button>
              <button className="btn btn-danger" onClick={() => handleDecision(rec.id, 'reject')} disabled={!!submitting}>
                <XCircle size={14} /> Reject
              </button>
              <button className="btn btn-warning" onClick={() => navigate('/simulator')}>
                <FlaskConical size={14} /> Run What-If Simulation
              </button>
            </div>
          )}
          {rec.status !== 'pending' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge ${rec.status}`}>{rec.status.toUpperCase()} by {rec.approved_by}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                {rec.approved_at ? new Date(rec.approved_at).toLocaleString() : ''}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Audit Trail */}
      {auditTrail.length > 0 && (
        <div className="card">
          <div className="section-title"><Clock size={14} color="var(--accent-blue)" />DECISION AUDIT TRAIL</div>
          {auditTrail.map((entry, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span className={`badge ${entry.status}`}>{entry.status.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Rec {entry.rec_id}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {entry.approved_by}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {new Date(entry.approved_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
