import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { Card } from '@/components/common/Card';
import { CreditCard, TrendingUp, AlertTriangle, RotateCcw } from 'lucide-react';

export const MerchantDashboardPlaceholder: React.FC = () => {
  return (
    <PageContainer
      title="Merchant Dashboard"
      description="Stage 1 foundation established. Telemetry metrics and live transactions will be activated in subsequent milestones."
    >
      {/* Metric Cards Grid Placeholder matching design reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Payments</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">₹0.00</span>
            <span className="block text-xs text-slate-400 mt-1">Ready for Milestone 3</span>
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
            <span className="block text-xs text-slate-400 mt-1">Ready for Milestone 3</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Failed</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">0</span>
            <span className="block text-xs text-slate-400 mt-1">Ready for Milestone 3</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Refunded</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">₹0.00</span>
            <span className="block text-xs text-slate-400 mt-1">Ready for Milestone 5</span>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-8 text-center border-dashed">
        <h3 className="text-base font-semibold text-slate-800">Foundation Workspace Active</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Architecture, routing, design tokens, and CI/CD pipelines are verified and operational.
        </p>
      </Card>
    </PageContainer>
  );
};
