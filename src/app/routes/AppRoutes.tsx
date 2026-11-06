import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { VerifyEmailPage } from '@/pages/public/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/public/ResetPasswordPage';
import { AdminSetupPage } from '@/pages/public/AdminSetupPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { RoleRoute } from '@/components/common/RoleRoute';
import { PublicOnlyRoute } from '@/components/common/PublicOnlyRoute';

// Merchant Pages
import { MerchantDashboardPlaceholder } from '@/pages/merchant/MerchantDashboardPlaceholder';
import { MerchantProfilePage } from '@/pages/merchant/MerchantProfilePage';
import { MerchantApiKeysPage } from '@/pages/merchant/MerchantApiKeysPage';
import { MerchantPaymentsPage } from '@/pages/merchant/MerchantPaymentsPage';
import { MerchantRefundsPage } from '@/pages/merchant/MerchantRefundsPage';
import { MerchantTransactionsPage } from '@/pages/merchant/MerchantTransactionsPage';
import { MerchantWebhooksPage } from '@/pages/merchant/MerchantWebhooksPage';

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminDashboardPlaceholder } from '@/pages/admin/AdminDashboardPlaceholder';
import { AdminMerchantsPage } from '@/pages/admin/AdminMerchantsPage';
import { AdminPaymentsPage } from '@/pages/admin/AdminPaymentsPage';
import { AdminRefundsPage } from '@/pages/admin/AdminRefundsPage';
import { AdminTransactionsPage } from '@/pages/admin/AdminTransactionsPage';
import { AdminWebhooksPage } from '@/pages/admin/AdminWebhooksPage';
import { AdminReconciliationPage } from '@/pages/admin/AdminReconciliationPage';
import { AdminReconciliationDetailPage } from '@/pages/admin/AdminReconciliationDetailPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';

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
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin-setup" element={<AdminSetupPage />} />
          </Route>

          {/* Email verification is accessible to both guests and users */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />

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
          <Route path="refunds" element={<MerchantRefundsPage />} />
          <Route path="transactions" element={<MerchantTransactionsPage />} />
          <Route path="webhooks" element={<MerchantWebhooksPage />} />
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
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="merchants" element={<AdminMerchantsPage />} />
          <Route path="settings" element={<AdminDashboardPlaceholder />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="refunds" element={<AdminRefundsPage />} />
          <Route path="transactions" element={<AdminTransactionsPage />} />
          <Route path="reconciliation" element={<AdminReconciliationPage />} />
          <Route path="reconciliation/:reference" element={<AdminReconciliationDetailPage />} />
          <Route path="webhooks" element={<AdminWebhooksPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
