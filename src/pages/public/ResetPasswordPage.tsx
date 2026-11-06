import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import logoSvg from '@/assets/logo.svg';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ApiError } from '@/types/api';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,100}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Reset token is missing or invalid. Please check your reset link.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setErrorMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to reset password. The link may have expired or was already used.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Missing Reset Token</h2>
          <p className="text-sm text-slate-600">
            This password reset link is invalid because no security token was provided.
          </p>
          <div className="pt-2">
            <Link to="/forgot-password">
              <Button variant="primary" className="w-full">
                Request New Password Reset Link
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10 shadow-xl border-slate-200">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner">
            <img src={logoSvg} alt="PayCore" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Password</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ensure your new password meets platform security requirements
          </p>
        </div>

        {isSuccess ? (
          <div className="py-4 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Password Reset Complete!</h2>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                Your password has been securely updated and all previous sessions have been revoked.
              </p>
            </div>
            <Link to="/login">
              <Button variant="primary" className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                <span>Sign In With New Password</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
              <span className="font-semibold flex items-center gap-1 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Password Requirements:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
                <li>At least 8 characters in length</li>
                <li>At least 1 uppercase & 1 lowercase letter</li>
                <li>At least 1 number and 1 special symbol</li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10"
              isLoading={isLoading}
            >
              Update Password
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
