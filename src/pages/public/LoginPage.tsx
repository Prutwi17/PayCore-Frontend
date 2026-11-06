import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import logoSvg from '@/assets/logo.svg';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ApiError } from '@/types/api';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsUnverified(false);
    setResendStatus(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const authData = await login({ email: email.trim(), password });

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      const roles = authData.user.roles || [];
      if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (roles.includes('ROLE_MERCHANT')) {
        navigate('/merchant/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === 'EMAIL_NOT_VERIFIED' || apiErr.message?.toLowerCase().includes('not been verified')) {
        setIsUnverified(true);
        setErrorMessage('Your email address has not been verified. Please verify your email before signing in.');
      } else {
        setErrorMessage(apiErr.message || 'Invalid email or password. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive a verification link.');
      return;
    }

    setIsResending(true);
    setResendStatus(null);
    try {
      const msg = await authService.resendVerification(email.trim());
      setResendStatus(msg || 'A fresh verification link has been dispatched to your email.');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setResendStatus(apiErr.message || 'If an account exists with this email, a verification link has been sent.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient lighting matching PayCore brand */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10 shadow-xl border-slate-200">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner">
            <img src={logoSvg} alt="PayCore" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to PayCore</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your payment infrastructure and merchant operations
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {isUnverified && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3 text-amber-900 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Need a new verification link?</span>
            </div>
            <p className="text-amber-700">
              Check your inbox or click below to receive a new link at <strong className="font-semibold">{email}</strong>.
            </p>
            {resendStatus && (
              <div className="p-2 bg-white/80 rounded border border-amber-200 text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{resendStatus}</span>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerification}
              className="w-full py-1.5 text-xs font-semibold bg-white"
              isLoading={isResending}
            >
              Resend Verification Link
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
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
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10"
            isLoading={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        {/* Initial Administrator Setup Callout */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Initial Platform Admin
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">omp27614@gmail.com</span>
            </div>
            <Link
              to="/admin-setup"
              className="text-blue-600 font-semibold hover:underline text-xs bg-white px-2.5 py-1 border border-slate-200 rounded shadow-sm"
            >
              Admin Setup
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-600">
          New to PayCore?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Register your merchant account
          </Link>
        </div>
      </Card>
    </div>
  );
};
