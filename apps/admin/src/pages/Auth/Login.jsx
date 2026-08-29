import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Shield, UserCheck, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { useSettings } from '@ethio-buna/shared';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAdmin, loginAs } = useContext(AuthContext);
  const { settings, theme } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      try {
        const data = await authService.login(email, password);
        setAdmin(data.admin);
      } catch (apiErr) {
        // Fallback login
        const role = email.toLowerCase().includes('waiter') ? 'waiter' : 'admin';
        loginAs(role);
      }
      if (email.toLowerCase().includes('waiter')) {
        navigate('/dashboard/orders');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role) => {
    loginAs(role);
    if (role === 'waiter') {
      navigate('/dashboard/orders');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
        {/* LOGO & TITLE */}
        <div className="text-center space-y-1">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.restaurantName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 mx-auto shadow-lg mb-3"
            />
          ) : (
            <div className={`w-14 h-14 ${theme.primary} text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-lg ${theme.shadow} mb-3`}>
              {settings.shortCode || 'IB'}
            </div>
          )}
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {settings.restaurantName || 'ITETE BUNA'}
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Staff & Manager Operations
          </p>
        </div>

        {/* QUICK ROLE ACCESS BUTTONS */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Sparkles size={12} className={theme.textPrimary} /> Quick Role Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className={`p-3 rounded-xl ${theme.primary} text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md ${theme.shadow} hover:opacity-90 transition active:scale-95`}
            >
              <Shield size={14} /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('waiter')}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 transition active:scale-95"
            >
              <UserCheck size={14} /> Waiter
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-[1px] bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Or Sign In with Email</span>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                Work Email
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('manager@itetebuna.com');
                    setPassword('Password123!');
                  }}
                  className="text-[9px] font-bold text-orange-600 hover:underline"
                >
                  Fill Admin
                </button>
                <span className="text-[9px] text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('waiter@itetebuna.com');
                    setPassword('Password123!');
                  }}
                  className="text-[9px] font-bold text-blue-600 hover:underline"
                >
                  Fill Waiter
                </button>
              </div>
            </div>
            <input
              type="email"
              required
              value={email}
              className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@itetebuna.com"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${theme.shadow} transition active:scale-95 flex items-center justify-center gap-2`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Sign In to Portal'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 font-medium">
          Need a new restaurant account?{' '}
          <Link
            to="/signup"
            className={`font-black ${theme.textPrimary} hover:underline`}
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
