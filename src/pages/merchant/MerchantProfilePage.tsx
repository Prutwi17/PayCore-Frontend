import React, { useState, useEffect } from 'react';
import { merchantService } from '@/services/api/merchantService';
import { MerchantProfile, MerchantStatus } from '@/types/auth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Save,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const MerchantProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await merchantService.getProfile();
      setProfile(data);
      setBusinessName(data.businessName || '');
      setContactNumber(data.contactNumber || '');
      setBusinessAddress(data.businessAddress || '');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to load merchant profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (profile?.merchantCode) {
      navigator.clipboard.writeText(profile.merchantCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!businessName.trim()) {
      setErrorMessage('Business name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await merchantService.updateProfile({
        businessName: businessName.trim(),
        contactNumber: contactNumber.trim() || undefined,
        businessAddress: businessAddress.trim() || undefined,
      });
      setProfile(updated);
      setSuccessMessage('Merchant profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to update merchant profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PageLoading message="Loading merchant details..." />;
  }

  if (!profile) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {errorMessage || 'Unable to load merchant profile.'}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: MerchantStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">ACTIVE</Badge>;
      case 'PENDING':
        return <Badge variant="warning">PENDING APPROVAL</Badge>;
      case 'SUSPENDED':
        return <Badge variant="failed">SUSPENDED</Badge>;
      case 'REJECTED':
        return <Badge variant="failed">REJECTED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your legal entity, contact information, and review compliance status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-500 font-medium">Account Status:</span>
          {getStatusBadge(profile.status)}
        </div>
      </div>

      {/* Status Notice Banner */}
      {profile.status === 'PENDING' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3.5 text-amber-900">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block">Under Compliance Review</span>
            <p className="text-amber-700 mt-0.5 text-xs leading-relaxed">
              Your merchant account is currently in <span className="font-semibold">PENDING</span> status. You may generate API keys and configure test integrations. Production payment endpoints will be unlocked once an administrator approves your verification.
            </p>
          </div>
        </div>
      )}

      {profile.status === 'ACTIVE' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3.5 text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block">Account Fully Verified & Active</span>
            <p className="text-emerald-700 mt-0.5 text-xs leading-relaxed">
              Your business is approved. All REST APIs, webhook subscribers, and payment engines are accessible.
            </p>
          </div>
        </div>
      )}

      {profile.status === 'SUSPENDED' && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3.5 text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block">Account Suspended</span>
            <p className="text-rose-700 mt-0.5 text-xs leading-relaxed">
              Payment processing and API access have been suspended by PayCore administration. Please contact compliance support to resolve outstanding questions.
            </p>
          </div>
        </div>
      )}

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-3 text-emerald-700 text-sm">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Identifiers Card */}
        <Card className="p-6 md:col-span-1 space-y-5 bg-white border-slate-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
            Account Identifiers
          </h2>

          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Merchant Code</span>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <code className="text-xs font-mono font-bold text-slate-800">{profile.merchantCode}</code>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
                title="Copy Merchant Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Use this code to identify your organization in PayCore REST API headers.
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Registered Business Email</span>
            <div className="flex items-center space-x-2 text-xs text-slate-700 font-medium p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{profile.businessEmail}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Created At</span>
            <div className="flex items-center space-x-2 text-xs text-slate-600 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Edit Profile Form */}
        <Card className="p-6 md:col-span-2 space-y-6 bg-white border-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Business Profile Details
            </h2>
            <span className="text-xs text-slate-400">Editable by merchant</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Business Legal Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  placeholder="e.g. Acme Corporation"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Business Address
              </label>
              <div className="relative">
                <div className="absolute top-2.5 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  rows={3}
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="e.g. 100 Enterprise Way, Floor 4, New York, NY 10001"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="flex items-center space-x-2"
                isLoading={isSaving}
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
