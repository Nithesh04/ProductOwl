// src/services/api.js
import axios from 'axios';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://productowl.onrender.com';
const API_TIMEOUT = 15000; // 15 seconds timeout

// Initialize axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth and logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Attach auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    const errorData = {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      timestamp: new Date().toISOString(),
    };

    console.error('[API] Response error:', errorData);

    // Handle specific error cases
    if (error.response?.data?.includes('<html')) {
      error.message = 'Server returned HTML error page. Check API configuration.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Check your connection.';
    } else {
      error.message = error.response.data?.message || error.message;
    }

    // Store last 5 errors for debugging
    const errors = JSON.parse(localStorage.getItem('apiErrors') || '[]');
    localStorage.setItem('apiErrors', JSON.stringify([errorData, ...errors].slice(0, 5)));

    return Promise.reject(error);
  }
);

// API Endpoints
const API = {
  // Products
  products: {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    scrape: (amazonUrl) => api.post('/products/scrape', { amazonUrl }),
    updatePrice: (id) => api.put(`/products/${id}/price`),
    delete: (id) => api.delete(`/products/${id}`),
  },

  // Auth
  auth: {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    profile: () => api.get('/auth/profile'),
    updateProfile: (userData) => api.put('/auth/profile', userData),
    changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  },

  // Tracking
  tracking: {
    getAll: () => api.get('/tracking'),
    getByUser: (userId) => api.get(`/tracking/user/${userId}`),
    create: (data) => api.post('/tracking', data),
    update: (id, data) => api.put(`/tracking/${id}`, data),
    delete: (id) => api.delete(`/tracking/${id}`),
  },

  // System
  health: () => api.get('/health'),
  debug: () => api.get('/debug'),
};

// Test connection on app startup
if (import.meta.env.PROD) {
  API.health()
    .then(() => console.log('[API] Connection successful'))
    .catch(() => console.warn('[API] Connection test failed'));
}

export default API;
