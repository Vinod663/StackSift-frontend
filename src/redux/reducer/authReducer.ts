import { createReducer } from "@reduxjs/toolkit";
import { loginSuccess, logout } from "../action/authAction";
import type { User } from "../action/authAction";

// Define the State Interface
interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

// Load initial state from LocalStorage (so refreshing doesn't log them out)
const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),
};

export const authReducer = createReducer(initialState, (builder) => {
    
    builder
        // Handle Login
        .addCase(loginSuccess, (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;

            // Save to browser storage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
            //localStorage.setItem('refreshToken', action.payload.refreshToken);
        })
        
        // Handle Logout
        .addCase(logout, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            // Clear browser storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
           // localStorage.removeItem('refreshToken');
        });

});