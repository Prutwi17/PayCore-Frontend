import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import logoSvg from '@/assets/logo.svg';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Building2 } from 'lucide-react';
import { ApiError } from '@/types/api';

export const AdminLoginPage: React.FC = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const authData = await login({ email: email.trim(), password });

      const roles = authData.user?.roles || [];
      if (!roles.includes('ROLE_ADMIN')) {
        await logout();
        setErrorMessage('Access denied. Please use the Merchant Login page.');
        return;
      }

      if (from && from.startsWith('/admin')) {
        navigate(from, { replace: true });
        return;
      }

      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 relative overflow-hidden text-slate-100">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl p-8 sm:p-10 z-10">
        {/* Portal Switcher Tabs */}
        <div className="flex items-center justify-between p-1 bg-slate-800/80 rounded-2xl border border-slate-700/60 mb-8">
          <Link
            to="/login"
            className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Merchant Login</span>
          </Link>
          <div className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-blue-600 rounded-xl shadow-sm flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-200" />
            <span>Admin</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <Link to="/" className="flex items-center space-x-2.5 mb-4 group">
            <img src={logoSvg} alt="PayCore" className="h-8 w-8 drop-shadow group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-bold tracking-tight text-white font-sans">
              Pay<span className="text-blue-500">Core</span>
            </span>
          </Link>

          <h1 className="text-xl font-bold text-white tracking-tight">Admin Login</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to the admin dashboard.</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-800/60 rounded-xl flex items-start space-x-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter admin email"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-xs text-slate-400">Remember me</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            isLoading={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Merchant Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
