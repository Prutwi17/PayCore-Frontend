import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import logoSvg from '@/assets/logo.svg';
import { Mail, Lock, User, Building, Phone, MapPin, Eye, EyeOff, AlertCircle, ArrowRight, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ApiError } from '@/types/api';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [isMerchantRegistration, setIsMerchantRegistration] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verification pending state after successful registration
  const [isRegistered, setIsRegistered] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Valid email address is required.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,100}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (isMerchantRegistration && !businessName.trim()) {
      setErrorMessage('Business name is required to create a merchant profile.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        phoneNumber: phoneNumber.trim() || undefined,
        businessName: isMerchantRegistration ? businessName.trim() : undefined,
        businessAddress: isMerchantRegistration ? businessAddress.trim() || undefined : undefined,
      });

      setIsRegistered(true);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus(null);
    try {
      const msg = await authService.resendVerification(email.trim());
      setResendStatus(msg || 'A fresh verification link has been sent to your email.');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setResendStatus(apiErr.message || 'If an account exists, a verification link has been dispatched.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <Card className="w-full max-w-lg p-8 relative z-10 shadow-xl border-slate-200">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner">
            <img src={logoSvg} alt="PayCore" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isRegistered ? 'Verify Your Email Address' : 'Create your PayCore Account'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRegistered
              ? 'One more step before accessing your payment gateway'
              : 'Join the developer-first payment infrastructure engine'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {isRegistered ? (
          <div className="py-2 space-y-6">
            <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-sm">
              <Mail className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-slate-900">Verification Link Sent</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We have sent an activation link to <strong className="font-semibold text-slate-800">{email}</strong>.
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security Notice</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                To protect financial transactions and merchant data, account login requires verified email ownership. The link expires in <strong>24 hours</strong>.
              </p>
            </div>

            {resendStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{resendStatus}</span>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
                isLoading={isResending}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Resend Verification Email</span>
              </Button>

              <Link to="/login">
                <Button
                  variant="primary"
                  className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Jane Smith"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

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
                  placeholder="jane@company.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
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
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password
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
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Merchant Options Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMerchantRegistration}
                  onChange={(e) => setIsMerchantRegistration(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Register as a Payment Merchant (Create Business Account)
                </span>
              </label>
            </div>

            {isMerchantRegistration && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Legal Business Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required={isMerchantRegistration}
                      placeholder="Acme Global Inc."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Business Address (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="123 Financial Way, Suite 400"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold shadow-md shadow-blue-500/10 mt-2"
              isLoading={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center text-xs text-slate-600 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
