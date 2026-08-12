import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const resumeApi = {
  uploadResume: (formData) => api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getResumes: () => api.get('/resumes'),
  getResumeById: (id) => api.get(`/resumes/${id}`),
};

export const jobDescriptionApi = {
  create: (jdData) => api.post('/job-descriptions', jdData),
  getAll: () => api.get('/job-descriptions'),
  getById: (id) => api.get(`/job-descriptions/${id}`),
};

export const matchApi = {
  analyze: (matchRequest) => api.post('/match/analyze', matchRequest),
  getApplications: () => api.get('/match/applications'),
  getApplicationById: (id) => api.get(`/match/applications/${id}`),
};

export const interviewApi = {
  createSession: (sessionData) => api.post('/interviews/sessions', sessionData),
  submitAnswer: (answerData) => api.post('/interviews/answers', answerData),
  getSessions: () => api.get('/interviews/sessions'),
  getSessionById: (id) => api.get(`/interviews/sessions/${id}`),
};

export const ragApi = {
  uploadDocument: (formData) => api.post('/rag/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDocuments: () => api.get('/rag/documents'),
  deleteDocument: (id) => api.delete(`/rag/documents/${id}`),
  queryContext: (queryData) => api.post('/rag/query', queryData),
};

export default api;
