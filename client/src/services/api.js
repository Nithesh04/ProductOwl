import axios from 'axios';

// Use VITE_API_URL (with underscore, not hyphen)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and better error handling
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  // Get all products
  getAll: () => api.get('/products'),
  
  // Get a specific product
  getById: (id) => api.get(`/products/${id}`),
  
  // Scrape and add new product
  scrapeProduct: (amazonUrl) => api.post('/products/scrape', { amazonUrl }),
  
  // Update product price
  updatePrice: (id) => api.put(`/products/${id}/price`),
  
  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
};

// Tracking API
export const trackingAPI = {
  // Subscribe to tracking
  subscribe: (email, productId) => api.post('/tracking/subscribe', { email, productId }),
  
  // Get user's tracking subscriptions
  getUserTracking: (email) => api.get(`/tracking/user/${email}`),
  
  // Unsubscribe from tracking
  unsubscribe: (id) => api.put(`/tracking/unsubscribe/${id}`),
  
  // Delete tracking subscription
  delete: (id) => api.delete(`/tracking/${id}`),
  
  // Get all tracking (admin)
  getAll: () => api.get('/tracking'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 
