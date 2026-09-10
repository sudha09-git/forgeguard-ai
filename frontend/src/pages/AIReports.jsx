import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Loader } from 'lucide-react';
import { generateReport, fetchReportHistory } from '../services/api';

export default function AIReports() {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audience, setAudience] = useState('quality_engineer');

  useEffect(() => {
    fetchReportHistory().then(setHistory);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const r = await generateReport({ audience, report_type: 'quality_report', include_recommendations: true });
      setReport(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="page-title">AI Quality Reports</div>
          <div className="page-subtitle">AI-generated quality intelligence reports · Reporting Agent</div>
        </div>
        <div className="ibm-badge">IBM Granite 13B · Reporting Agent</div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">GENERATE AI REPORT</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Target Audience</div>
            <select className="header-select" value={audience} onChange={e => setAudience(e.target.value)}>
              <option value="quality_engineer">Quality Engineer</option>
              <option value="production_manager">Production Manager</option>
              <option value="maintenance_engineer">Maintenance Engineer</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ marginTop: 16 }}>
            {loading ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating...</> : <><FileText size={14} /> Generate AI Report</>}
          </button>
          {report && (
            <button className="btn btn-secondary" onClick={handlePrint} style={{ marginTop: 16 }}>
              <Printer size={14} /> Print Report
            </button>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Report Display */}
        <div>
          {report ? (
            <div className="card" style={{ fontSize: 13 }}>
              {/* Report Header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.08) 100%)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 8, padding: 16, marginBottom: 16
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: -0.5 }}>⚙ FORGEGUARD AI</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{report.title}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="ibm-badge">{report.ibm_model}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Report ID: {report.id}</div>
                  </div>
                </div>
              </div>

              {/* Production Summary */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Production Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    ['Date', report.production_summary.date],
                    ['Shift', report.production_summary.shift],
                    ['Line', report.production_summary.line],
                    ['Machines', `${report.production_summary.machines_active}/${report.production_summary.machines_monitored}`],
                    ['Volume', report.production_summary.production_volume],
                    ['FPY', `${report.production_summary.first_pass_yield}%`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: 8 }}>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{k}</div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Summary */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Quality Summary</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent-green)' }}>{report.quality_summary.overall_score}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)' }}>{report.quality_summary.score_status}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Overall Quality Score</div>
                  </div>
                </div>
              </div>

              {/* Anomalies */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Anomaly Summary ({report.anomaly_summary.active} active)
                </div>
                {report.anomaly_summary.events.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span className={`badge ${e.severity}`}>{e.severity.toUpperCase()}</span>
                    <span style={{ fontSize: 12 }}>{e.machine} — {e.parameter}</span>
                  </div>
                ))}
              </div>

              {/* AI Narrative */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>AI ANALYSIS NARRATIVE</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', background: 'var(--bg-secondary)', padding: 12, borderRadius: 8 }}>
                  {report.ai_narrative}
                </div>
              </div>

              <div className="disclaimer">{report.disclaimer}</div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <FileText size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Select audience and click "Generate AI Report"</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>IBM Granite 13B · Reporting Agent</div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="card">
          <div className="section-title">REPORT HISTORY</div>
          {history.map((r, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.audience} · {new Date(r.generated_at).toLocaleString()}</div>
              </div>
              <span className={`badge ${r.status === 'complete' ? 'normal' : 'pending'}`}>{r.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
