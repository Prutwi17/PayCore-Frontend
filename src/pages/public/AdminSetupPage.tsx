import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import logoSvg from '@/assets/logo.svg';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, Send } from 'lucide-react';
import { ApiError } from '@/types/api';

export const AdminSetupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // For initial dispatch if token is not present
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);

  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,100}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Admin setup token is missing.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Master password must be at least 8 characters long.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage('Password must contain uppercase, lowercase, numeric, and special characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.completeAdminSetup({
        token,
        password,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Administrator setup failed. The link may have expired or is invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateSetup = async () => {
    setIsDispatching(true);
    setErrorMessage(null);
    setDispatchMessage(null);
    try {
      const msg = await authService.initiateAdminSetup();
      setDispatchMessage(msg || 'Setup invitation has been sent to omp27614@gmail.com.');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to dispatch setup invitation.');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10 shadow-xl border-slate-200">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-md">
            <img src={logoSvg} alt="PayCore" className="w-10 h-10 brightness-200" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Platform Security
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Initial Administrator Setup</h1>
          <p className="text-sm text-slate-500 mt-1">
            Designated Administrator: <span className="font-semibold text-slate-700">omp27614@gmail.com</span>
          </p>
        </div>

        {isSuccess ? (
          <div className="py-4 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Administrator Configured</h2>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                Your master credentials are set and your email ownership is confirmed. You now have full access to the PayCore administrative suite.
              </p>
            </div>
            <Link to="/login">
              <Button variant="primary" className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Master Admin Password
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
                Confirm Master Password
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
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                Security Standards:
              </span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                This account holds elevated system privileges across reconciliation, audit logs, and merchant configuration. Choose a strong, distinct passphrase.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10"
              isLoading={isLoading}
            >
              Activate Administrator Credentials
            </Button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed space-y-2">
              <p className="font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                One-Time Administrator Activation
              </p>
              <p>
                To configure the initial platform administrator account, an onboarding link must be dispatched to <strong className="font-semibold">omp27614@gmail.com</strong>.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {errorMessage}
              </div>
            )}

            {dispatchMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                {dispatchMessage}
              </div>
            )}

            <Button
              type="button"
              onClick={handleInitiateSetup}
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
              isLoading={isDispatching}
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Setup Invitation Email</span>
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 underline">
                Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
