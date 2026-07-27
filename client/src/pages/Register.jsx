import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      // Save token and active user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user || { name: formData.name, email: formData.email }));

      navigate('/dashboard');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || '';
      
      // Check for duplicate user/email errors
      if (serverMsg.toLowerCase().includes('exist') || serverMsg.toLowerCase().includes('already') || err.response?.status === 400) {
        setError('This email address is already registered. Try logging in instead.');
      } else {
        setError(serverMsg || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-3 sm:p-6 md:p-8">
      
      {/* Dynamic Container Card */}
      <div className="w-full max-w-4xl bg-slate-800/80 border border-slate-700/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-2 backdrop-blur-xl transition-all">
        
        {/* BRANDING PANEL: Top Banner on Mobile, Left Column on Desktop */}
        <div className="relative p-6 sm:p-8 md:p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex flex-col justify-between overflow-hidden">
          
          {/* Decorative Background Glows */}
          <div className="absolute -top-16 -left-16 w-36 h-36 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 sm:w-48 sm:h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-inner">
              ₹
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-wide text-white">TrackLite</span>
          </div>

          {/* Middle Pitch (Condensed on Mobile for Better UX) */}
          <div className="relative z-10 my-6 md:my-10 space-y-2 sm:space-y-4">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 border border-white/20 rounded-full text-[10px] sm:text-xs font-semibold text-indigo-100 uppercase tracking-widest inline-block">
              Get Started Free
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Master your money without the complexity.
            </h2>
            <p className="hidden sm:block text-indigo-100/80 text-xs sm:text-sm leading-relaxed">
              Track daily expenses, filter categories seamlessly, and manage multiple accounts in one central workspace.
            </p>
          </div>

          {/* Bottom Social Proof Badge */}
          <div className="relative z-10 pt-3 sm:pt-4 border-t border-white/10 flex items-center gap-3 text-[11px] sm:text-xs text-indigo-100">
            <div className="flex -space-x-2 shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-400 border-2 border-indigo-700 flex items-center justify-center font-bold text-[9px] sm:text-[10px]">A</div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-400 border-2 border-indigo-700 flex items-center justify-center font-bold text-[9px] sm:text-[10px]">S</div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-400 border-2 border-indigo-700 flex items-center justify-center font-bold text-[9px] sm:text-[10px]">M</div>
            </div>
            <span className="truncate">Smart financial management for everyone.</span>
          </div>
        </div>

        {/* REGISTRATION FORM: Responsive Spacing & Touch Friendly */}
        <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-center bg-slate-800/90">
          
          <div className="mb-5 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Create an Account</h3>
            <p className="text-slate-400 text-xs mt-1">Enter your details below to get started</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 sm:p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl sm:rounded-2xl text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 sm:px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 sm:px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password Field with Mobile-Friendly Touch Area */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pr-20 pl-3.5 sm:pl-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-2.5 px-2 py-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 cursor-pointer select-none transition-colors flex items-center justify-center"
                >
                  {showPassword ? '🙈 Hide' : '👁️ Show'}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Get Started Now ➔'}
            </button>
          </form>

          {/* Already have an account link */}
          <div className="mt-6 sm:mt-8 text-center border-t border-slate-700/50 pt-5 sm:pt-6">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition inline-block py-1">
                Sign In
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}