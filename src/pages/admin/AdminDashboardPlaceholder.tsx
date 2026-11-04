import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { Card } from '@/components/common/Card';
import { Users, CreditCard, Shield, Scale } from 'lucide-react';

export const AdminDashboardPlaceholder: React.FC = () => {
  return (
    <PageContainer
      title="Platform Overview"
      description="Administrative monitoring portal for PayCore gateway infrastructure."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Volume</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">₹0.00</span>
            <span className="block text-xs text-slate-400 mt-1">Platform-wide metric</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Merchants</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">0</span>
            <span className="block text-xs text-slate-400 mt-1">Active registrations</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Reconciliations</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">0</span>
            <span className="block text-xs text-slate-400 mt-1">Settlement audits</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Platform Health</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">Healthy</span>
            <span className="block text-xs text-slate-400 mt-1">Actuator online</span>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-8 text-center border-dashed">
        <h3 className="text-base font-semibold text-slate-800">Admin Control Center Ready</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Admin portal foundation connected to base layouts and routing structure.
        </p>
      </Card>
    </PageContainer>
  );
};
