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


// http://localhost:4000/api/v1/auth/google
export const googleAuthenticate = async (idToken: string) => {
  const response = await api.post<AuthResponse>('/auth/google', { token: idToken });
  return response.data;
};

// Update Text Details
// http://localhost:4000/api/v1/user/profile
export const updateUserProfile = async (name: string, bio: string, password?: string) => {
    const payload: any = { name, bio };
    if (password && password.trim() !== "") {
        payload.password = password;
    }
    const response = await api.put('/user/profile', payload);
    return response.data; 
};

// Upload Avatar
// http://localhost:4000/api/v1/user/avatar
export const uploadUserAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // returns { message, user }
};

// Get Stats
// http://localhost:4000/api/v1/user/stats
export const fetchUserStats = async () => {
    const response = await api.get('/user/stats');
    return response.data; // returns { tools: number, collections: number }
};


// Verify Password
// http://localhost:4000/api/v1/auth/verify-password
export const checkPassword = async (password: string) => {
    const response = await api.post('/auth/verify-password', { password });
    return response.data;
};