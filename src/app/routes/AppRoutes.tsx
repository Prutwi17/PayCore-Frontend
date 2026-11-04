import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { MerchantDashboardPlaceholder } from '@/pages/merchant/MerchantDashboardPlaceholder';
import { AdminDashboardPlaceholder } from '@/pages/admin/AdminDashboardPlaceholder';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/register" element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Merchant Portal Routes */}
        <Route path="/merchant" element={<DashboardLayout />}>
          <Route path="dashboard" element={<MerchantDashboardPlaceholder />} />
          <Route path="payments" element={<MerchantDashboardPlaceholder />} />
          <Route path="refunds" element={<MerchantDashboardPlaceholder />} />
          <Route path="webhooks" element={<MerchantDashboardPlaceholder />} />
          <Route path="reconciliation" element={<MerchantDashboardPlaceholder />} />
          <Route path="api-keys" element={<MerchantDashboardPlaceholder />} />
          <Route path="settings" element={<MerchantDashboardPlaceholder />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboardPlaceholder />} />
          <Route path="merchants" element={<AdminDashboardPlaceholder />} />
          <Route path="payments" element={<AdminDashboardPlaceholder />} />
          <Route path="refunds" element={<AdminDashboardPlaceholder />} />
          <Route path="reconciliation" element={<AdminDashboardPlaceholder />} />
          <Route path="webhooks" element={<AdminDashboardPlaceholder />} />
          <Route path="audit-logs" element={<AdminDashboardPlaceholder />} />
          <Route path="settings" element={<AdminDashboardPlaceholder />} />
        </Route>
      </Route>
    </Routes>
  );
};
