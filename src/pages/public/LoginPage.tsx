import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { GoogleSignInButton } from '@/components/common/GoogleSignInButton';
import { HeroInfrastructureVisual } from '@/assets/visuals/HeroInfrastructureVisual';
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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Premium 2-Column Auth Container */}
      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Column: Brand Hero & Workflow Visual (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <img src={logoSvg} alt="PayCore" className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Pay<span className="text-blue-400">Core</span>
              </span>
            </Link>
            <div className="mt-8">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Payment Infrastructure Built for Reliable Transactions.
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Connect merchant operations, monitor live payment state machines, and automate multi-source settlement reconciliation.
              </p>
            </div>
          </div>

          {/* Middle Architecture Illustration */}
          <div className="my-6 relative z-10 transform scale-95 origin-center">
            <HeroInfrastructureVisual />
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>256-bit AES · TLS 1.3 · HMAC</span>
            <span className="text-emerald-400 font-sans font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> High Availability
            </span>
          </div>
        </div>

        {/* Right Column: Authentication Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6">
              {/* Mobile logo only */}
              <div className="lg:hidden flex items-center space-x-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow">
                  <img src={logoSvg} alt="PayCore" className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-slate-900">PayCore</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your account</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials or authenticate securely with Google
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Unverified Email Resend Notice */}
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

            {/* Google Authentication (Section 6) */}
            <div className="mb-5">
              <GoogleSignInButton onError={(err) => setErrorMessage(err)} />
            </div>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium text-[11px]">Or continue with email</span>
              </div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-xs font-semibold shadow-md shadow-blue-500/10"
                isLoading={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            {/* Registration CTA */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
              Don't have a merchant account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
