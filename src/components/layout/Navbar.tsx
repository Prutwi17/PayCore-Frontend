import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logoSvg from '@/assets/logo.svg';
import { LogOut, Shield, Building, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isMerchant, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const dashboardPath = isAdmin ? '/admin/dashboard' : isMerchant ? '/merchant/dashboard' : '/';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
    }`;

  const scrollToSection = (hash: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <img src={logoSvg} alt="PayCore" className="h-8 w-8 drop-shadow-sm group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Pay<span className="text-blue-600">Core</span>
          </span>
        </Link>

        {/* Desktop Navigation Links: Product, Features, Modules, How It Works, Developers, Documentation */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm">
          <NavLink to="/" end className={navLinkClass}>
            Product
          </NavLink>
          <NavLink to="/features" className={navLinkClass}>
            Features
          </NavLink>
          <NavLink to="/modules" className={navLinkClass}>
            Modules
          </NavLink>
          <a
            href="/#how-it-works"
            onClick={() => scrollToSection('#how-it-works')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="/#developers"
            onClick={() => scrollToSection('#developers')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Developers
          </a>
          <NavLink to="/docs" className={navLinkClass}>
            Documentation
          </NavLink>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={dashboardPath}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                {isAdmin ? (
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Portal ({isAdmin ? 'Admin' : 'Merchant'})</span>
              </Link>
              <button
                onClick={() => logout()}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-xl border border-transparent hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
          >
            Product
          </NavLink>
          <NavLink
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
          >
            Features
          </NavLink>
          <NavLink
            to="/modules"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
          >
            Modules
          </NavLink>
          <a
            href="/#how-it-works"
            onClick={() => scrollToSection('#how-it-works')}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
          >
            How It Works
          </a>
          <a
            href="/#developers"
            onClick={() => scrollToSection('#developers')}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
          >
            Developers
          </a>
          <NavLink
            to="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
          >
            Documentation
          </NavLink>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center text-xs font-semibold text-white bg-blue-600 py-2.5 rounded-xl"
                >
                  Enter Portal ({isAdmin ? 'Admin' : 'Merchant'})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center text-xs font-semibold text-rose-600 bg-rose-50 py-2 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center text-xs font-semibold text-slate-700 bg-slate-100 py-2.5 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center text-xs font-semibold text-white bg-blue-600 py-2.5 rounded-xl shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
