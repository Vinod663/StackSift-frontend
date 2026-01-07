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
  (response) => {
    return response;
  },
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    // Check if error is 401 (Unauthorized) 
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried
      
      try {
        // Stop looking in localStorage. Just call the API.
        // The browser automatically includes the 'jwt' cookie here.
        const { data } = await api.post('/auth/refresh-token');

        // Save new Access Token (Use 'accessToken' key for consistency)
        localStorage.setItem('accessToken', data.accessToken); 
        
        // Update header for the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        // Update default headers for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        // Retry the original request
        return api(originalRequest);

      } catch (refreshErr) {
        console.error("Session expired. Logging out.");
        // If refresh fails (cookie expired/invalid), log them out completely
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to Login page (Use /login, not /)
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;