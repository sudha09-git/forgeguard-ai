import React, { useState, useEffect, useRef } from 'react';
import { Shield, Send, BookOpen, Lightbulb, Loader } from 'lucide-react';
import { ragQuery, fetchSuggestedQuestions, fetchKnowledgeBase } from '../services/api';

const WELCOME = {
  role: 'ai',
  content: `Hello! I'm **ForgeGuard Copilot**, your AI manufacturing quality assistant.

I use IBM Granite 13B model with a RAG-grounded knowledge base to answer your questions about:
• Current production anomalies and defect risks
• Machine parameters and normal operating ranges  
• Standard Operating Procedures (SOPs)
• Maintenance procedures and schedules
• Quality standards and inspection requirements
• Historical defect patterns and root causes

Try asking me one of the suggested questions below, or type your own query.`,
  sources: []
};

export default function Copilot() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [kb, setKb] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchSuggestedQuestions().then(setSuggestions);
    fetchKnowledgeBase().then(setKb);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (query) => {
    const q = query || input.trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q, sources: [] }]);
    setLoading(true);
    try {
      const res = await ragQuery(q);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: res.answer,
        sources: res.sources || [],
        model: res.model,
        pipeline: res.pipeline,
        disclaimer: res.disclaimer
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'I encountered an error connecting to the backend. Please ensure the ForgeGuard AI server is running.',
        sources: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', padding: 0 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color="var(--accent-blue)" /> ForgeGuard Copilot
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>RAG-grounded AI assistant · IBM Granite 13B · Manufacturing knowledge base</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className={`tab-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</div>
          <div className={`tab-item ${activeTab === 'kb' ? 'active' : ''}`} onClick={() => setActiveTab('kb')}>Knowledge Base</div>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Messages */}
          <div className="copilot-messages" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Shield size={12} color="var(--accent-blue)" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-blue)' }}>FORGEGUARD COPILOT</span>
                    {msg.model && <span className="ibm-badge" style={{ fontSize: 9 }}>{msg.model.split(' ')[0]}</span>}
                  </div>
                )}
                <div className={`message-bubble ${msg.role}`}>
                  {msg.content}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="message-sources">
                      <span style={{ fontSize: 9, color: 'var(--text-muted)', marginRight: 4 }}>SOURCES:</span>
                      {msg.sources.map((s, j) => (
                        <span key={j} className="source-chip">{s.title?.slice(0, 35)}... [{s.relevance}]</span>
                      ))}
                    </div>
                  )}
                  {msg.disclaimer && (
                    <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border-light)', paddingTop: 6 }}>
                      ⚠ {msg.disclaimer}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={12} color="var(--accent-blue)" />
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--accent-blue)',
                      animation: `pulse 1.2s ease ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Retrieving knowledge...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {suggestions.length > 0 && (
            <div style={{ padding: '8px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {suggestions.slice(0, 4).map((q, i) => (
                <button
                  key={i}
                  className="btn btn-secondary btn-sm"
                  onClick={() => sendMessage(q)}
                  style={{ fontSize: 11 }}
                >
                  <Lightbulb size={10} /> {q.length > 50 ? q.slice(0, 50) + '...' : q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              className="input"
              placeholder="Ask about anomalies, parameters, SOPs, maintenance procedures..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              {loading ? <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={14} />}
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <div className="section-title"><BookOpen size={14} color="var(--accent-blue)" />KNOWLEDGE BASE DOCUMENTS</div>
          <div className="disclaimer" style={{ marginBottom: 16 }}>
            The ForgeGuard Copilot retrieves information from these manufacturing documents using IBM RAG pipeline before generating responses.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {kb.map(doc => (
              <div key={doc.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>{doc.category}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{doc.title}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {doc.tags.map(t => (
                    <span key={t} style={{ fontSize: 9, background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: 4 }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
