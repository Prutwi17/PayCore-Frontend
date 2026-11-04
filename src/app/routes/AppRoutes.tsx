import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { RoleRoute } from '@/components/common/RoleRoute';
import { PublicOnlyRoute } from '@/components/common/PublicOnlyRoute';

// Merchant Pages
import { MerchantDashboardPlaceholder } from '@/pages/merchant/MerchantDashboardPlaceholder';
import { MerchantProfilePage } from '@/pages/merchant/MerchantProfilePage';
import { MerchantApiKeysPage } from '@/pages/merchant/MerchantApiKeysPage';
import { MerchantPaymentsPage } from '@/pages/merchant/MerchantPaymentsPage';

// Admin Pages
import { AdminDashboardPlaceholder } from '@/pages/admin/AdminDashboardPlaceholder';
import { AdminMerchantsPage } from '@/pages/admin/AdminMerchantsPage';
import { AdminPaymentsPage } from '@/pages/admin/AdminPaymentsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          
          {/* Guest-only routes (redirect authenticated users) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Merchant Portal Routes (Protected + ROLE_MERCHANT or ROLE_ADMIN) */}
        <Route
          path="/merchant"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['ROLE_MERCHANT', 'ROLE_ADMIN']}>
                <DashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/merchant/dashboard" replace />} />
          <Route path="dashboard" element={<MerchantDashboardPlaceholder />} />
          <Route path="settings" element={<MerchantProfilePage />} />
          <Route path="api-keys" element={<MerchantApiKeysPage />} />
          <Route path="payments" element={<MerchantPaymentsPage />} />
          <Route path="refunds" element={<MerchantDashboardPlaceholder />} />
          <Route path="webhooks" element={<MerchantDashboardPlaceholder />} />
          <Route path="reconciliation" element={<MerchantDashboardPlaceholder />} />
        </Route>

        {/* Admin Portal Routes (Protected + ROLE_ADMIN only) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPlaceholder />} />
          <Route path="merchants" element={<AdminMerchantsPage />} />
          <Route path="settings" element={<AdminDashboardPlaceholder />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="refunds" element={<AdminDashboardPlaceholder />} />
          <Route path="reconciliation" element={<AdminDashboardPlaceholder />} />
          <Route path="webhooks" element={<AdminDashboardPlaceholder />} />
          <Route path="audit-logs" element={<AdminDashboardPlaceholder />} />
        </Route>
      </Route>
    </Routes>
  );
};
