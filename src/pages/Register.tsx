import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginSuccess } from '../redux/action/authAction';
import { registerUser, googleAuthenticate } from '../services/auth';
import { FaLayerGroup, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Standard Register Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await registerUser(formData.name, formData.email, formData.password);
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Success Handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
        const data = await googleAuthenticate(credentialResponse.credential);
        
        dispatch(loginSuccess({
            user: data.user,
            token: data.accessToken,
            refreshToken: data.refreshToken
        }));
        
        navigate('/dashboard');
    } catch (err: any) {
        setError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden text-white font-sans p-4">
      
      {/* --- BACKGROUND ANIMATION (Purple/Green Theme for Register) --- */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* --- GLASS CARD --- */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-brand-primary mb-4 shadow-lg">
            <FaLayerGroup className="text-xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 text-sm mt-2">Join the intelligent developer community.</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm text-center">
               {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="relative group">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
            <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-all"
                placeholder="Full Name"
            />
          </div>

          <div className="relative group">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
            <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-all"
                placeholder="Email Address"
            />
          </div>

          <div className="relative group">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
            <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-all"
                placeholder="Password"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-brand-primary hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase">Or sign up with</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Google Button Wrapper */}
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-In Failed")}
                theme="filled_black"
                shape="circle"
                width="320" 
            />
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-brand-primary hover:text-white transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;