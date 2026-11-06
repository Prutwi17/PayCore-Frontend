import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageContainer } from '@/components/common/PageContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Users,
  Shield,
  Activity,
  Server,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardPlaceholder: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageContainer
      title="Platform Administration"
      description="Platform administration and merchant governance. Control system access, audit onboarded merchants, and inspect security parameters."
    >
      {/* RBAC Active Features Banner */}
      <div className="mb-6 p-4 bg-slate-900 text-white rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-wide">
                PayCore Core Security Engine Active
              </h3>
              <Badge variant="success">ROLE_ADMIN</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Signed in as <span className="font-semibold text-white">{user?.email}</span> ({user?.fullName})
            </p>
          </div>
        </div>

        <Link to="/admin/merchants">
          <Button size="sm" variant="primary" className="text-xs">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Merchant Governance
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Merchant Governance</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">Active</span>
            <span className="block text-xs text-emerald-600 font-medium mt-1">Lifecycle Approval Live</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Authentication</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">JWT + BCrypt</span>
            <span className="block text-xs text-slate-400 mt-1">HMAC-SHA256 Encrypted</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Database State</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">MySQL 8.0</span>
            <span className="block text-xs text-slate-400 mt-1">Users & Merchants Seeded</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">System Actuator</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">UP</span>
            <span className="block text-xs text-slate-400 mt-1">/actuator/health verified</span>
          </div>
        </Card>
      </div>

      {/* Main Administrative Action Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <Link to="/admin/merchants">
              <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                Open Directory <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-4">Merchant Lifecycle Management</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Audit merchant applications, approve new business registrations, suspend compromised accounts, and inspect assigned merchant identification codes.
          </p>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <Badge variant="processing">RBAC Active</Badge>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-4">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Spring Security enforces strict method-level and URL-level boundaries between <code>ROLE_ADMIN</code>, <code>ROLE_MERCHANT</code>, and <code>ROLE_CUSTOMER</code>.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
};
