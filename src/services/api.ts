import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  withCredentials: true, // CRITICAL: This allows the browser to send the 'jwt' cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints that don't need the Token
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/google'];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    // 1. Check if the error is from the Refresh Endpoint itself
    // If /refresh-token fails, Don't retry. LOGOUT.
    if (originalRequest.url?.includes('/auth/refresh-token')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
    }

    // 2. Standard 401 handling (Token Expired)
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      
      try {
        const { data } = await api.post('/auth/refresh-token');

        localStorage.setItem('accessToken', data.accessToken); 
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        return api(originalRequest);

      } catch (refreshErr) {
        // If refresh fails, the "if" block at the top will catch the next 401
        // But strictly, we should just logout here too.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;