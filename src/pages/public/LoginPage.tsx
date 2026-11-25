import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { GoogleSignInButton } from '@/components/common/GoogleSignInButton';
import logoSvg from '@/assets/logo.svg';
import { Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw, CheckCircle2, Building2, Shield } from 'lucide-react';
import { ApiError } from '@/types/api';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black relative overflow-hidden">
      {/* Centered Auth Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-3xl shadow-xl p-8 sm:p-10 z-10">
        {/* Portal Switcher Tabs */}
        <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800 mb-7">
          <div className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-blue-600 rounded-xl shadow-xs flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-100" />
            <span>Merchant Login</span>
          </div>
          <Link
            to="/admin/login"
            className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <Link to="/" className="flex items-center space-x-2.5 mb-4 group">
            <img src={logoSvg} alt="PayCore" className="h-9 w-9 drop-shadow group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              Pay<span className="text-blue-600 dark:text-blue-500">Core</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Merchant Sign In</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to your merchant account</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Unverified Email Notice */}
        {isUnverified && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5 text-amber-900 text-xs">
            <div className="flex items-center gap-1.5 font-semibold">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span>Email verification pending</span>
            </div>
            <p className="text-amber-700 text-[11px]">
              Check your inbox for the verification link sent to <strong>{email}</strong>.
            </p>
            {resendStatus && (
              <div className="p-2 bg-white rounded border border-amber-200 text-emerald-700 font-medium flex items-center gap-1.5 text-[11px]">
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

        {/* Google Authentication */}
        <div className="mb-5">
          <GoogleSignInButton onError={(err) => setErrorMessage(err)} />
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium text-[11px]">Or continue with email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Business email
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
                placeholder="merchant@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold transition-colors"
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
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me option */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              Remember me on this browser
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
            isLoading={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Merchant Account'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div>
            Don't have a merchant account?{' '}
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">
              Create Merchant Account
            </Link>
          </div>
          <div>
            Admin account?{' '}
            <Link to="/admin/login" className="font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:underline">
              Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
