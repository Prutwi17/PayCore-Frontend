import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { PageLoading } from './PageLoading';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading, isAdmin, isMerchant } = useAuth();

  if (isLoading) {
    return <PageLoading message="Verifying permissions..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = allowedRoles.some((role) => user.roles?.includes(role));

  if (!hasPermission) {
    const fallbackPath = isAdmin ? '/admin' : isMerchant ? '/merchant' : '/';
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-600 max-w-md mb-6">
          You do not have the required permissions ({allowedRoles.map((r) => r.replace('ROLE_', '')).join(', ')}) to view this section.
        </p>
        <Link to={fallbackPath}>
          <Button variant="primary">Return to Your Dashboard</Button>
        </Link>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
