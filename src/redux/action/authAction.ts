import { createAction } from "@reduxjs/toolkit";

// Define the shape of the User object so TypeScript knows what data we have
export interface User {
    id: string;
    name: string;
    email: string;
    role: string[];
    avatarUrl?: string;
}

// 1. Action to save user data when they log in
// We expect a payload containing { user, token }
export const loginSuccess = createAction<{ user: User; token: string }>('auth/loginSuccess');

// 2. Action to clear data when they log out
export const logout = createAction('auth/logout');