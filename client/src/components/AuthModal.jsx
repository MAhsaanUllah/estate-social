import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../redux/authSlice';
import { X, Mail, Lock, User, Phone, Building2, Eye, EyeOff, AlertCircle, ShieldCheck, Sparkles, Check, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Logo from './ui/Logo';
import { PAKISTAN_CITIES } from '../utils/constants';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Onboarding / Register State
  const [role, setRole] = useState('buyer'); // 'buyer' | 'agent'
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Lahore',
    agencyName: '',
    password: '',
    confirmPassword: '',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (error) dispatch(clearError());

    const result = await dispatch(loginUser(loginData));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back to EstateSocial!');
      onClose();
    } else {
      toast.error(result.payload || 'Invalid email or password');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (error) dispatch(clearError());

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (role === 'agent' && !registerData.agencyName.trim()) {
      toast.error('Please provide your Agency or Realtor Name');
      return;
    }

    const payload = {
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      city: registerData.city,
      role: role,
      agencyName: role === 'agent' ? registerData.agencyName : undefined,
      password: registerData.password,
    };

    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      onClose();
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  // 1-Click Quick Demo Login credentials
  const fillDemoCreds = (demoRole) => {
    if (demoRole === 'owner') {
      setLoginData({ email: 'owner@estatesocial.pk', password: 'password123' });
    } else if (demoRole === 'agent') {
      setLoginData({ email: 'agent@estatesocial.pk', password: 'password123' });
    } else {
      setLoginData({ email: 'admin@estatesocial.pk', password: 'password123' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white dark:bg-[#0B111E] rounded-3xl border border-gray-200/80 dark:border-zinc-800 shadow-2xl max-w-lg w-full overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 text-center border-b border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 dark:bg-zinc-800/80 p-1 rounded-2xl max-w-xs mx-auto mt-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                if (error) dispatch(clearError());
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                if (error) dispatch(clearError());
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 pt-6">
          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2 text-xs font-medium">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================
              1. LOGIN MODE
          ======================================================== */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                    Password
                  </label>
                  <a href="#forgot" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Sign In to Account</span>
              </button>

              {/* Demo Account Fast Shortcuts */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
                <p className="text-[11px] font-semibold text-gray-400 mb-2">QUICK 1-CLICK TEST LOGIN</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('owner')}
                    className="px-2.5 py-1 text-[11px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Owner (0% Fee)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('agent')}
                    className="px-2.5 py-1 text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    Realtor / Agency
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('admin')}
                    className="px-2.5 py-1 text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg font-semibold hover:bg-amber-100 transition-colors"
                  >
                    Admin Console
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ========================================================
               2. ONBOARDING & REGISTER MODE
            ======================================================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                  Choose Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRole('buyer')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      role === 'buyer'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-sm ring-1 ring-emerald-500'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <User className={`h-5 w-5 ${role === 'buyer' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      {role === 'buyer' && <Check className="h-4 w-4 text-emerald-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-zinc-100">Buyer / Owner</p>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">0% Commission deals</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setRole('agent')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      role === 'agent'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-sm ring-1 ring-emerald-500'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Building2 className={`h-5 w-5 ${role === 'agent' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      {role === 'agent' && <Check className="h-4 w-4 text-emerald-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-zinc-100">Realtor / Agency</p>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">Pro CRM & Verified Badge</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm"
                    placeholder="e.g. Tariq Mehmood"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    WhatsApp Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm"
                    placeholder="0300-1234567"
                  />
                </div>
              </div>

              {/* Agency Name (If Agent) */}
              {role === 'agent' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    Agency / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.agencyName}
                    onChange={(e) => setRegisterData({ ...registerData, agencyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-emerald-400 dark:border-emerald-600 rounded-xl text-sm"
                    placeholder="e.g. Al-Haram Real Estate & Builders"
                  />
                </div>
              )}

              {/* City & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">City</label>
                  <select
                    value={registerData.city}
                    onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm"
                  >
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm"
                    placeholder="Min 6 chars"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Confirm</label>
                  <input
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm"
                    placeholder="Repeat"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Create {role === 'agent' ? 'Realtor' : 'Free'} Account</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
