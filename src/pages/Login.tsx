import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/action/authAction'; 
import { FaGoogle, FaLayerGroup } from 'react-icons/fa';
import {loginUser} from '../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
      // 1. Call the Real Backend
      const data = await loginUser(email, password);

      // 2. Save to Redux (using the real data from DB)
      // Note: backend sends 'accessToken', redux expects 'token'. Map it here.
      dispatch(loginSuccess({
        user: data.user,
        token: data.accessToken, // Handle both naming cases safely
        refreshToken: data.refreshToken // Handle both naming cases safely
      }));

      alert("Login Successful! Welcome " + data.user.name);
      
      // Navigate to dashboard 
      navigate('/dashboard'); 

    } catch (err: any) {
      console.error("Login Failed", err);
      // Show the error message from the backend (e.g., "Invalid credentials")
      setError(err.response?.data?.message || 'Login failed. Please check backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden text-white font-sans">
      
      {/* --- BACKGROUND ANIMATION (Updated Colors) --- */}
      {/* 1. Cyan Blob */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      {/* 2. Blue Blob */}
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      {/* 3. Dark Blue/Indigo Blob (Replaced the Pink one) */}
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* --- GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary mb-4 shadow-lg shadow-brand-primary/30">
            <FaLayerGroup className="text-xl text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            StackSift
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            The AI-Powered Tool Directory
          </p>
        </div>

        {/* Form */}
        {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm text-center">
           {error}
        </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-all"
                placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-all"
                placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-lg shadow-brand-primary/25 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase">Or continue with</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Google Button */}
        <button 
          type="button"
          className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <FaGoogle className="text-white" />
          <span>Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <a href="#" className="text-brand-secondary hover:text-white transition-colors">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;