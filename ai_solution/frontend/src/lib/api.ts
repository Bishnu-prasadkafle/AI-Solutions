import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login/', { username, password }),
  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
};

// ─── SERVICES ────────────────────────────────────────────────────────────────
export const servicesAPI = {
  list: () => api.get('/services/'),
  get: (id: number) => api.get(`/services/${id}/`),
  create: (data: FormData) => api.post('/services/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) => api.put(`/services/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  patch: (id: number, data: FormData) => api.patch(`/services/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/services/${id}/`),
};

// ─── BLOGS ───────────────────────────────────────────────────────────────────
export const blogsAPI = {
  list: (params?: Record<string, string>) => api.get('/blogs/', { params }),
  get: (id: number) => api.get(`/blogs/${id}/`),
  create: (data: FormData) => api.post('/blogs/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) => api.put(`/blogs/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  patch: (id: number, data: FormData) => api.patch(`/blogs/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/blogs/${id}/`),
};

// ─── GALLERY ─────────────────────────────────────────────────────────────────
export const galleryAPI = {
  list: (params?: Record<string, string>) => api.get('/gallery/', { params }),
  get: (id: number) => api.get(`/gallery/${id}/`),
  create: (data: FormData) => api.post('/gallery/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) => api.put(`/gallery/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  patch: (id: number, data: FormData) => api.patch(`/gallery/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/gallery/${id}/`),
};

// ─── CONTACTS ────────────────────────────────────────────────────────────────
export const contactsAPI = {
  list: (params?: Record<string, string>) => api.get('/contacts/', { params }),
  get: (id: number) => api.get(`/contacts/${id}/`),
  create: (data: object) => api.post('/contacts/', data),
  markRead: (id: number) => api.patch(`/contacts/${id}/mark-read/`),
  delete: (id: number) => api.delete(`/contacts/${id}/`),
};

// ─── FEEDBACK ────────────────────────────────────────────────────────────────
export const feedbackAPI = {
  list: (params?: Record<string, string>) => api.get('/feedback/', { params }),
  get: (id: number) => api.get(`/feedback/${id}/`),
  create: (data: FormData | object) => {
    const isForm = data instanceof FormData;
    return api.post('/feedback/', data, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
  },
  update: (id: number, data: FormData) => api.put(`/feedback/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  approve: (id: number) => api.patch(`/feedback/${id}/approve/`),
  delete: (id: number) => api.delete(`/feedback/${id}/`),
};

// ─── SOLUTIONS ──────────────────────────────────────────────────────────────
export const solutionsAPI = {
  list: (params?: Record<string, string>) => api.get('/solutions/', { params }),
  get: (id: number) => api.get(`/solutions/${id}/`),
  create: (data: FormData) => api.post('/solutions/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) => api.put(`/solutions/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  patch: (id: number, data: FormData) => api.patch(`/solutions/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/solutions/${id}/`),
};


// ─── TEAM ────────────────────────────────────────────────────────────────────
export const teamAPI = {
  list: () => api.get('/team/'),
  get: (id: number) => api.get(`/team/${id}/`),
  create: (data: FormData) => api.post('/team/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) => api.put(`/team/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  patch: (id: number, data: FormData) => api.patch(`/team/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/team/${id}/`),
};

// ─── STATS ───────────────────────────────────────────────────────────────────
export const statsAPI = {
  get: () => api.get('/stats/'),
};
