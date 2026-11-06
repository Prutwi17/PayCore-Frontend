import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import logoSvg from '@/assets/logo.svg';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ApiError } from '@/types/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please provide your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      // To prevent email enumeration, still display generic confirmation unless client validation failed
      if (apiErr.code === 'VALIDATION_ERROR') {
        setErrorMessage(apiErr.message);
      } else {
        setIsSubmitted(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10 shadow-xl border-slate-200">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner">
            <img src={logoSvg} alt="PayCore" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="text-sm text-slate-500 mt-1">
            We will send you a secure link to reset your account credentials
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-2 text-center space-y-5">
            <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Check Your Inbox</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-800">{email}</span>, you will receive an email with instructions to reset your password within the next few minutes.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 text-left flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                The password reset link is valid for <strong>15 minutes</strong>. If you do not see the email, please check your spam or promotional folders.
              </span>
            </div>

            <div className="pt-2">
              <Link to="/login">
                <Button variant="outline" className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Email Address
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10"
              isLoading={isLoading}
            >
              Send Password Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
