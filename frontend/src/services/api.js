import axios from 'axios';

const BASE = 'http://localhost:8000';

const api = axios.create({ baseURL: BASE });

export const fetchDashboard = () => api.get('/api/dashboard/summary').then(r => r.data);
export const fetchProductionLines = () => api.get('/api/production/lines').then(r => r.data);
export const fetchMachines = () => api.get('/api/production/machines').then(r => r.data);
export const fetchSensorStream = (machineId, points = 60) => api.get(`/api/sensors/stream/${machineId}?points=${points}`).then(r => r.data);
export const fetchCurrentReadings = () => api.get('/api/sensors/current').then(r => r.data);
export const fetchAnomalies = (params = {}) => api.get('/api/anomalies/', { params }).then(r => r.data);
export const fetchAnomalyTimeline = () => api.get('/api/anomalies/timeline').then(r => r.data);
export const fetchAnomalySummary = () => api.get('/api/anomalies/summary').then(r => r.data);
export const fetchPredictions = () => api.get('/api/predictions/').then(r => r.data);
export const fetchActivePredictions = () => api.get('/api/predictions/active').then(r => r.data);
export const fetchQualityScore = () => api.get('/api/predictions/quality-score').then(r => r.data);
export const fetchRecommendations = () => api.get('/api/recommendations/').then(r => r.data);
export const submitDecision = (recId, action, engineer, notes) =>
  api.post(`/api/recommendations/${recId}/decision`, { action, engineer_name: engineer, notes }).then(r => r.data);
export const fetchAuditTrail = () => api.get('/api/recommendations/audit-trail/all').then(r => r.data);
export const fetchAgents = () => api.get('/api/agents/').then(r => r.data);
export const fetchAgentWorkflow = () => api.get('/api/agents/workflow').then(r => r.data);
export const generateReport = (params) => api.post('/api/reports/generate', params).then(r => r.data);
export const fetchReportHistory = () => api.get('/api/reports/history').then(r => r.data);
export const runSimulation = (params) => api.post('/api/simulation/run', params).then(r => r.data);
export const fetchSimulationDefaults = () => api.get('/api/simulation/defaults').then(r => r.data);
export const ragQuery = (query) => api.post('/api/rag/query', { query }).then(r => r.data);
export const fetchSuggestedQuestions = () => api.get('/api/rag/suggested-questions').then(r => r.data);
export const fetchKnowledgeBase = () => api.get('/api/rag/knowledge-base').then(r => r.data);
export const fetchHistory = (days = 7) => api.get(`/api/history/?days=${days}`).then(r => r.data);
export const fetchHistorySummary = () => api.get('/api/history/summary').then(r => r.data);
export const fetchDefects = (params = {}) => api.get('/api/defects/', { params }).then(r => r.data);
export const fetchAlerts = () => fetchAnomalies();
