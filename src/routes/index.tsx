import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import PrivateRoute from "../components/PrivateRoute"; 
import Layout from "../components/Layout";


// --- LAZY LOADS ---
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));


const SubmitPage = lazy(() => import('../pages/SubmitTool')); 

const BookmarksPage = lazy(() => import('../pages/Bookmarks'));
const DocsPage = lazy(() => import('../pages/Docs'));
const SupportPage = lazy(() => import('../pages/Support'));

const ProfilePage = lazy(() => import('../pages/Profile'));


const Placeholder = ({ title }: { title: string }) => (
  <div className="text-center py-20 text-gray-400">
    <h1 className="text-3xl text-white font-bold mb-4">{title}</h1>
    <p>This feature is coming soon!</p>
  </div>
);

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

                    <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

                    {/* --- PROTECTED ROUTES --- */}
                    {/* Wrapped in Layout (Navbar) & PrivateRoute (Security) */}
                    <Route element={<PrivateRoute><Layout /></PrivateRoute>}>

                        <Route 
                            path="/admin" 
                            element={
                                <PrivateRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard /> 
                                </PrivateRoute>
                            } 
                        />
                        
                        
                        <Route path="/dashboard" element={<Dashboard />} /> //http://localhost:5173/dashboard
                        <Route path="/submit" element={<SubmitPage />} />   //http://localhost:5173/submit


                        <Route path="/help" element={<DocsPage />} /> //http://localhost:5173/help
                        <Route path="/contact" element={<SupportPage />} /> //http://localhost:5173/contact
                        <Route path="/bookmarks" element={<BookmarksPage />} /> //http://localhost:5173/bookmarks
                        <Route path="/profile" element={<ProfilePage />} /> //http://localhost:5173/profile
                        
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