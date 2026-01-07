import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import { loginSuccess } from '../redux/action/authAction'; 
import { FaLayerGroup } from 'react-icons/fa';
import { loginUser, googleAuthenticate } from '../services/auth'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Standard Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      
      dispatch(loginSuccess({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      }));

      navigate('/dashboard'); 

    } catch (err: any) {
      console.error("Login Failed", err);
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
      try {
          setIsLoading(true);
          // Send the ID Token to backend
          const data = await googleAuthenticate(credentialResponse.credential);
          
          // Save to Redux
          dispatch(loginSuccess({
              user: data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken
          }));
          
          navigate('/dashboard');
      } catch (err: any) {
          console.error("Google Auth Failed", err);
          setError(err.response?.data?.message || 'Google Login failed.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden text-white font-sans p-4">
      
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* --- GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        
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

        {/* REAL GOOGLE BUTTON */}
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-In Failed")}
                theme="filled_black"
                size="large"
                shape="pill"
                width="320"
                text="signin_with"
            />
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-brand-secondary hover:text-white transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;