import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      
      // Handle 401 Unauthorized
      if (status === 401) {
        // Clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // window.location.href = '/login';
        }
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

