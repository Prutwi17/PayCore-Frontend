import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageContainer } from '@/components/common/PageContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  CreditCard,
  KeyRound,
  Settings,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const MerchantDashboardPlaceholder: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageContainer
      title={`Welcome, ${user?.fullName || 'Merchant'}`}
      description="Stage 2 Authentication & Merchant Management is active. Manage your business identity and API credentials below."
    >
      {/* Stage 2 Active Features Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-wide">Stage 2 Live: Authentication & Merchant Operations</h3>
              <Badge variant="processing">Stage 2 Verified</Badge>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Merchant Code: <span className="font-mono font-semibold text-white">{user?.merchantCode || 'Unassigned'}</span> | Role: <span className="font-semibold text-white">{user?.roles?.join(', ')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link to="/merchant/api-keys">
            <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
              <KeyRound className="w-3.5 h-3.5 mr-1" />
              API Credentials
            </Button>
          </Link>
          <Link to="/merchant/settings">
            <Button size="sm" variant="outline" className="bg-white text-blue-700 hover:bg-blue-50 border-transparent text-xs font-semibold">
              <Settings className="w-3.5 h-3.5 mr-1" />
              Manage Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Payments</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">₹0.00</span>
            <span className="block text-xs text-slate-400 mt-1">Ready for Stage 3 Integration</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Successful</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">0</span>
            <span className="block text-xs text-slate-400 mt-1">Ready for Stage 3 Integration</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Failed</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">0</span>
            <span className="block text-xs text-slate-400 mt-1">Ready for Stage 3 Integration</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Refunds</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">₹0.00</span>
            <span className="block text-xs text-slate-400 mt-1">Ready for Stage 4 Integration</span>
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <Link to="/merchant/api-keys">
              <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-4">API Keys & Authentication</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Generate 256-bit cryptographically secure keys (<code>sk_live_...</code>) for server-to-server payment requests. Raw secrets are shown once and stored as salted SHA-256 hashes.
          </p>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <Link to="/merchant/settings">
              <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-4">Merchant Profile & Compliance</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Review your merchant verification state (PENDING, ACTIVE, SUSPENDED), copy your unique merchant code, and update your company details.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
};
