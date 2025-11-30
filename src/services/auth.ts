import api from './api';
import axios from 'axios';

interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string[];
  };
}



// 3. Register Function (Bonus)
//http://localhost:4000/api/v1/auth/register
export const registerUser = async (name: string, email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return response.data;
};


// 1. Login Function
//http://localhost:4000/api/v1/auth/login
export const loginUser = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

// 2. Refresh Token Function (Called by the Interceptor)
// We use a separate axios instance or direct url to avoid interceptor loops
export const refreshTokens = async (refreshToken: string) => {
  const response = await axios.post('http://localhost:4000/api/v1/auth/refresh-token', { 
    token: refreshToken 
  });
  return response.data; // Should return { accessToken: '...' }
};