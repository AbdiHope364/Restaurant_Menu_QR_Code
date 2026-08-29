import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Loader2, CheckCircle2, Shield, UserCheck, Sparkles, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { useSettings } from '@ethio-buna/shared';
import toast from 'react-hot-toast';

const Signup = () => {
  const { settings, theme } = useSettings();
  const { setAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'admin', // 'admin' | 'waiter'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fillDemoData = (role = 'admin') => {
    if (role === 'admin') {
      setFormData({
        fullName: 'Dawit Bekele (Manager)',
        email: 'manager@itetebuna.com',
        password: 'Password123!',
        role: 'admin',
      });
      toast('Filled Demo Manager Credentials', { icon: '👑' });
    } else {
      setFormData({
        fullName: 'Alex Tadesse (Floor Waiter)',
        email: 'waiter@itetebuna.com',
        password: 'Password123!',
        role: 'waiter',
      });
      toast('Filled Demo Waiter Credentials', { icon: '🛎️' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      try {
        await authService.register(formData);
      } catch (apiErr) {
        // Local demo mode registration
        const mockUser = {
          id: 'usr-' + Date.now().toString(36),
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
        };
        localStorage.setItem('admin_user_session', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock-token-' + mockUser.id);
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantSignIn = () => {
    const mockUser = {
      id: 'usr-' + Date.now().toString(36),
      fullName: formData.fullName || 'Manager',
      email: formData.email || 'manager@itetebuna.com',
      role: formData.role || 'admin',
    };
    setAdmin(mockUser);
    localStorage.setItem('admin_user_session', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token-' + mockUser.id);
    toast.success(`Welcome to ${settings.restaurantName}!`, { icon: '🎉' });
    if (mockUser.role === 'waiter') {
      navigate('/dashboard/orders');
    } else {
      navigate('/dashboard');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-green-100">
            <CheckCircle2 size={44} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Account Created!
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Registered <span className="font-black text-slate-800">{formData.fullName}</span> as{' '}
              <span className={`font-black uppercase ${formData.role === 'waiter' ? 'text-blue-600' : theme.textPrimary}`}>
                {formData.role}
              </span>.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Account Summary</p>
            <p className="font-bold text-slate-800">Email: {formData.email}</p>
            <p className="font-bold text-slate-800">Role: {formData.role.toUpperCase()}</p>
          </div>

          <button
            onClick={handleInstantSignIn}
            className={`w-full py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${theme.shadow} transition flex items-center justify-center gap-2 active:scale-95`}
          >
            <span>Enter Management Portal</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

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
            Staff & Manager Registration
          </p>
        </div>

        {/* DEMO QUICK FILL BUTTONS */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Sparkles size={12} className={theme.textPrimary} /> Quick Demo Auto-Fill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoData('admin')}
              className={`p-2.5 rounded-xl ${theme.bgLight} ${theme.textPrimary} border ${theme.borderLight} hover:opacity-80 font-black text-[11px] uppercase transition flex items-center justify-center gap-1`}
            >
              <Shield size={13} /> Demo Manager
            </button>
            <button
              type="button"
              onClick={() => fillDemoData('waiter')}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-black text-[11px] uppercase transition flex items-center justify-center gap-1"
            >
              <UserCheck size={13} /> Demo Waiter
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-xs border border-red-100 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FULL NAME */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Dawit Bekele"
              required
              value={formData.fullName}
              className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Work Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="manager@itetebuna.com"
                required
                value={formData.email}
                className="w-full border border-slate-200 bg-slate-50 p-3.5 pl-10 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            </div>
          </div>

          {/* ROLE SELECTOR */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={`p-3 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition border ${
                  formData.role === 'admin'
                    ? `${theme.primary} text-white ${theme.shadow} shadow-md border-transparent`
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Shield size={14} /> Admin / Manager
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'waiter' })}
                className={`p-3 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition border ${
                  formData.role === 'waiter'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 border-transparent'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <UserCheck size={14} /> Floor Waiter
              </button>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={formData.password}
                className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
            className={`w-full py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${theme.shadow} transition active:scale-95 flex items-center justify-center gap-2 mt-2`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-black ${theme.textPrimary} hover:underline`}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
