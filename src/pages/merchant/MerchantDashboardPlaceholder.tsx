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
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const MerchantDashboardPlaceholder: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageContainer
      title={`Welcome, ${user?.fullName || 'Merchant'}`}
      description="Production payment processing engine active. Manage merchant credentials, initiate charges, and review transaction telemetry."
    >
      {/* Stage 3 Active Features Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-wide">Payment Processing Engine: Live</h3>
              <Badge variant="success">System Operational</Badge>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Merchant Code: <span className="font-mono font-semibold text-white">{user?.merchantCode || 'Unassigned'}</span> | Role: <span className="font-semibold text-white">{user?.roles?.join(', ')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link to="/merchant/payments">
            <Button size="sm" variant="outline" className="bg-white text-blue-700 hover:bg-blue-50 border-transparent text-xs font-semibold">
              <CreditCard className="w-3.5 h-3.5 mr-1" />
              Payment Operations
            </Button>
          </Link>
          <Link to="/merchant/api-keys">
            <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
              <KeyRound className="w-3.5 h-3.5 mr-1" />
              API Credentials
            </Button>
          </Link>
          <Link to="/merchant/settings">
            <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
              <Settings className="w-3.5 h-3.5 mr-1" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Processing</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">Active</span>
            <span className="block text-xs text-emerald-600 font-medium mt-1">State Machine Operational</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Provider Engine</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">SIMULATED</span>
            <span className="block text-xs text-slate-400 mt-1">Zero active DB tx on network I/O</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Attempt Telemetry</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">Audit Enabled</span>
            <span className="block text-xs text-slate-400 mt-1">Full attempt history recorded</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Refunds Module</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">Active</span>
            <span className="block text-xs text-slate-400 mt-1">Full & Partial Processing</span>
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <Link to="/merchant/payments">
              <Button size="sm" variant="primary" className="text-xs flex items-center gap-1">
                Open Payments <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-4">Core Payment Processing</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Create simulated transactions with deterministic test outcomes (Success, Card Decline, Timeout/Unknown, and 3D-Secure action). Inspect attempt logs and verify unconfirmed states.
          </p>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <Link to="/merchant/api-keys">
              <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                Manage Keys <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-4">API Keys & Authentication</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Generate 256-bit secret keys (<code>sk_live_...</code>) for programmatic payment initiation. Salts and SHA-256 hashes protect keys at rest.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
};
