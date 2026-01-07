import { createAction } from "@reduxjs/toolkit";

// Define the shape of the User object 
export interface User {
    id: string;
    name: string;
    email: string;
    role: string[];
    avatarUrl?: string;
    coverGradient?: string;
    bio?: string;
}

// Action to save user data when they log in
export const loginSuccess = createAction<{ user: User; accessToken: string; refreshToken: string }>('auth/loginSuccess');

// Action to clear data when they log out
export const logout = createAction('auth/logout');