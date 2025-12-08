import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to clear invalid token (when 401)
const clearInvalidToken = () => {
  if (typeof window !== 'undefined') {
    // Clear auth state in store
    useAuthStore.getState().logout();
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or cookie
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to bypass browser cache for GET requests
    // // Timestamp đã đủ để bypass cache, không cần set headers phức tạp
    // if (config.method === 'get') {
    //   if (config.params) {
    //     config.params._t = Date.now();
    //   } else {
    //     config.params = { _t: Date.now() };
    //   }
    // }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Backend returns { status: "success", data: {...}, meta: {...} }
    return response;
  },
  (error: AxiosError) => {
    // Handle errors
    if (error.response) {
      const status = error.response.status;
      
      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Clear invalid token but don't redirect
        // ProtectedRoute will handle showing login when user accesses protected routes
        clearInvalidToken();
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        // Show error message
        console.error('Forbidden: You do not have permission to access this resource');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

