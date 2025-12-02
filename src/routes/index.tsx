import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import PrivateRoute from "../components/PrivateRoute"; 
import Layout from "../components/Layout";

// --- LAZY LOADS ---
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));




const SubmitPage = lazy(() => import('../pages/Dashboard')); 

export default function AppRouter() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-primary">
                    Loading StackSift...
                </div>
            }>
                <Routes>
                    
                    {/* --- PUBLIC ROUTES --- */}
                    {/* If logged in, redirect to Dashboard */}
                    
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} /> 
                    <Route path="/login" element={<Navigate to="/" replace />} /> 

                    {/* --- PROTECTED ROUTES --- */}
                    {/* Wrapped in Layout (Navbar) & PrivateRoute (Security) */}
                    <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                        
                        
                        <Route path="/dashboard" element={<Dashboard />} /> //http://localhost:5173/dashboard
                        <Route path="/submit" element={<SubmitPage />} />   //http://localhost:5173/submit
                        
                        {/* Example of Role-Based Route (Admin) */}
                        <Route 
                            path="/admin" 
                            element={
                                <PrivateRoute allowedRoles={['ADMIN']}>
                                    <div>Admin Register Placeholder</div>
                                </PrivateRoute>
                            } 
                        />
                    </Route>

                    {/* 404 Catch-All */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}