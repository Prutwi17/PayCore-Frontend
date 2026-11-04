import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logoSvg from '@/assets/logo.svg';
import { LogOut, Shield, Building } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isMerchant, logout } = useAuth();

  const dashboardPath = isAdmin ? '/admin/dashboard' : isMerchant ? '/merchant/dashboard' : '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logoSvg} alt="PayCore Logo" className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Pay<span className="text-blue-600">Core</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#modules" className="hover:text-blue-600 transition-colors">Modules</a>
          <a href="#docs" className="hover:text-blue-600 transition-colors">Docs</a>
        </nav>

        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={dashboardPath}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                {isAdmin ? (
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Portal ({isAdmin ? 'Admin' : 'Merchant'})</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent"
                title="Sign out of PayCore"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
