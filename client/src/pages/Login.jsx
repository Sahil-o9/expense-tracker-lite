import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Dynamically picks up live URL from Render or defaults to local host
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md shadow-indigo-500/30">
            ₹
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to your TrackLite account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 rounded-xl text-xs font-medium border border-red-200 dark:border-red-900 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                ✉️
              </span>
              <input 
                type="email" 
                required 
                placeholder="name@company.com" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                🔒
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-slate-900 dark:text-white"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-transparent p-0 border-0 outline-none focus:outline-none flex items-center justify-center cursor-pointer shadow-none hover:bg-transparent active:bg-transparent"
                style={{ background: 'none', border: 'none', outline: 'none' }}
                aria-label="Toggle password visibility"
              >
                <svg className={`w-5 h-5 transition-colors pointer-events-none ${showPassword ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition active:scale-95 flex items-center justify-center gap-2"
          >
            Sign In →
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}