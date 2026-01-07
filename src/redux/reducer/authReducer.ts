import { createReducer } from "@reduxjs/toolkit";
import { loginSuccess, logout } from "../action/authAction";
import type { User } from "../action/authAction";

// Define the State Interface
interface AuthState {
    user: User | null;
    accessToken: string | null; 
    isAuthenticated: boolean;
    
}

// Load initial state from LocalStorage
const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('accessToken'), 
    isAuthenticated: !!localStorage.getItem('accessToken'),
};

export const authReducer = createReducer(initialState, (builder) => {
    
    builder
        // Handle Login
        .addCase(loginSuccess, (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken; 
            state.isAuthenticated = true;

            // Save to browser storage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            
            localStorage.setItem('accessToken', action.payload.accessToken); 
        })
        
        // Handle Logout
        .addCase(logout, (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;

            // Clear browser storage
            localStorage.removeItem('user');
            
            localStorage.removeItem('accessToken'); 
        });

});