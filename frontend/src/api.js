import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civicflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const complaintAPI = {
  analyze: (data) => api.post('/complaints/ai-analyze', data),
  checkDuplicates: (data) => api.post('/complaints/check-duplicates', data),
  create: (data) => api.post('/complaints', data),
  list: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
};

export const adminAPI = {
  getMetrics: () => api.get('/admin/metrics'),
  getAnalytics: () => api.get('/admin/analytics'),
  getHeatmap: () => api.get('/admin/heatmap'),
  getDuplicateClusters: () => api.get('/admin/duplicate-clusters'),
};

export const departmentAPI = {
  list: () => api.get('/departments'),
};

export const notificationAPI = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

export const feedbackAPI = {
  submit: (complaintId, data) => api.post(`/feedback/${complaintId}`, data),
};

export default api;
