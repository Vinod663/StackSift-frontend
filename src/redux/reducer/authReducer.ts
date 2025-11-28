import { createReducer } from "@reduxjs/toolkit";
import { loginSuccess, logout } from "../action/authAction";
import type { User } from "../action/authAction";

// Define the State Interface
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

// Load initial state from LocalStorage (so refreshing doesn't log them out)
const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
};

export const authReducer = createReducer(initialState, (builder) => {
    
    builder
        // Handle Login
        .addCase(loginSuccess, (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            // Save to browser storage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        })
        
        // Handle Logout
        .addCase(logout, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            // Clear browser storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        });

});