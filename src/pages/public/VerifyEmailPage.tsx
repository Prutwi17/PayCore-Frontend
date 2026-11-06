import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import logoSvg from '@/assets/logo.svg';
import { CheckCircle2, AlertCircle, Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { ApiError } from '@/types/api';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'idle'>(token ? 'verifying' : 'idle');
  const [message, setMessage] = useState<string>('');
  const [resendEmail, setResendEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const performVerification = useCallback(async (tokenToVerify: string) => {
    setStatus('verifying');
    try {
      const msg = await authService.verifyEmail(tokenToVerify);
      setMessage(msg || 'Your email address has been successfully verified.');
      setStatus('success');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message || 'Verification failed. The link may have expired or is invalid.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (token) {
      performVerification(token);
    }
  }, [token, performVerification]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    setResendSuccess(null);
    try {
      const msg = await authService.resendVerification(resendEmail.trim());
      setResendSuccess(msg || 'If an unverified account exists with that email address, a new verification link has been sent.');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setResendSuccess(apiErr.message || 'If an unverified account exists, a link has been dispatched.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10 shadow-xl border-slate-200">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner">
            <img src={logoSvg} alt="PayCore" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Verification</h1>
          <p className="text-sm text-slate-500 mt-1">
            PayCore Payment Processing Engine Security
          </p>
        </div>

        {status === 'verifying' && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-700 font-medium text-sm">Verifying your email address...</p>
            <p className="text-slate-400 text-xs">Please wait while we confirm your security credentials.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Email Verified!</h2>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                {message || 'Your account is now activated. You can now access your payment infrastructure.'}
              </p>
            </div>
            <Link to="/login">
              <Button variant="primary" className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1 font-medium leading-relaxed">{message}</div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                Request a New Verification Link
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Enter your registered email address and we'll send a fresh activation link.
              </p>

              {resendSuccess && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-medium">
                  {resendSuccess}
                </div>
              )}

              <form onSubmit={handleResend} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full py-2 text-xs font-semibold"
                  isLoading={isResending}
                >
                  Resend Verification Email
                </Button>
              </form>
            </div>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 underline">
                Return to Login
              </Link>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600 text-center leading-relaxed">
              To verify your email address, please click the link sent to your inbox.
            </p>

            {resendSuccess && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-medium">
                {resendSuccess}
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Registered Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-sm font-semibold"
                isLoading={isResending}
              >
                Send Verification Link
              </Button>
            </form>

            <div className="text-center pt-2 text-xs text-slate-500">
              Already verified?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
