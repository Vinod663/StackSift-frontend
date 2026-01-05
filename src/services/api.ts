import axios, { AxiosError } from 'axios';
import { refreshTokens } from './auth';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1', // 
  headers: {
    'Content-Type': 'application/json',
  },
});


// Endpoints that don't need the Token
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/google'];


api.interceptors.request.use((config) => {
  // Check both 'token' and 'accessToken' 
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh function
        const res = await refreshTokens(refreshToken);
        
        // Save new token
        localStorage.setItem('token', res.accessToken); // Update storage
        
        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // If refresh fails, log them out completely
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/'; // Redirect to Login page
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;