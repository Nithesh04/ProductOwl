import axios from 'axios';

// Use VITE_API_URL (with underscore, not hyphen)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL); // Debug log

// Validate API base URL
if (!API_BASE_URL.includes('http') && !API_BASE_URL.startsWith('/')) {
  console.error('Invalid API_BASE_URL:', API_BASE_URL);
  console.error('Please set VITE_API_URL to a valid URL (e.g., https://your-server.com/api)');
}

// Utility function to validate API responses
const validateResponse = (response) => {
  // Check if response data is a string that looks like HTML
  if (typeof response.data === 'string' && response.data.includes('<html')) {
    throw new Error('Server returned an HTML error page instead of JSON. Please check your API configuration.');
  }
  
  // Check if response data is valid JSON
  if (response.data === null || response.data === undefined) {
    throw new Error('Server returned empty response.');
  }
  
  return response;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and better error handling
  timeout: 15000, // Increased timeout for scraping operations
  // Add retry configuration
  retry: 2,
  retryDelay: 1000,
});

// Add request interceptor for debugging and auth
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    
    // Add Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
    return validateResponse(response);
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Track errors in localStorage for debugging
    const errorInfo = {
      timestamp: new Date().toISOString(),
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    };
    
    const existingErrors = JSON.parse(localStorage.getItem('api_errors') || '[]');
    existingErrors.push(errorInfo);
    localStorage.setItem('api_errors', JSON.stringify(existingErrors.slice(-10))); // Keep last 10 errors
    
    // Handle HTML error responses (like 404 pages)
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<html')) {
      console.error('Received HTML error page instead of JSON');
      error.message = 'Server returned an error page. Please check your API configuration.';
    }
    
    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your internet connection and try again.';
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    }
    
    // Handle CORS errors
    if (error.message && error.message.includes('CORS')) {
      error.message = 'CORS error. Please check your server configuration.';
    }
    
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

// Auth API
export const authAPI = {
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Change password
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
  
  // Test API connectivity
  testConnection: async () => {
    try {
      const response = await api.get('/health');
      console.log('API connection test successful:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        details: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
    }
  }
};

// Test API connection on startup
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    healthAPI.testConnection();
  }, 1000);
}

export default api; 
