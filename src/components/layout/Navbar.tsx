import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import logoSvg from '@/assets/logo.svg';
import {
  CreditCard,
  RotateCcw,
  History,
  Users,
  Activity,
  Briefcase,
  ChevronDown,
  LogOut,
  Shield,
  Building,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isMerchant, logout } = useAuth();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const dashboardPath = isAdmin ? '/admin/dashboard' : isMerchant ? '/merchant/dashboard' : '/';

  // Close dropdown on outside click or route change
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target as Node)) {
        setAuthDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSolutionsOpen(false);
    setAuthDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
    }`;

  const solutionsList = [
    {
      title: 'Online Payment Management',
      desc: 'Accept card and wallet payments.',
      to: '/solutions#payments',
      icon: CreditCard,
    },
    {
      title: 'Refund Management',
      desc: 'Full and partial customer refunds.',
      to: '/solutions#refunds',
      icon: RotateCcw,
    },
    {
      title: 'Transaction Tracking',
      desc: 'Search and filter payment history.',
      to: '/solutions#transactions',
      icon: History,
    },
    {
      title: 'Merchant Management',
      desc: 'Account controls and API keys.',
      to: '/solutions#merchants',
      icon: Users,
    },
    {
      title: 'Payment Monitoring',
      desc: 'Monitor payment activity and status.',
      to: '/solutions#monitoring',
      icon: Activity,
    },
    {
      title: 'Business Operations',
      desc: 'Reconciliation and activity logs.',
      to: '/solutions#operations',
      icon: Briefcase,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Bitcoin Icon */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <img src={logoSvg} alt="PayCore" className="h-8 w-8 drop-shadow-sm group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            Pay<span className="text-blue-600 dark:text-blue-500">Core</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {/* Solutions Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              onMouseEnter={() => setSolutionsOpen(true)}
              className="inline-flex items-center space-x-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none py-2"
            >
              <span>Solutions</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
            </button>

            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onMouseLeave={() => setSolutionsOpen(false)}
                  className="absolute top-full -left-28 mt-1 w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-50"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5">
                    Solutions
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {solutionsList.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          to={item.to}
                          className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3 py-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">View all</span>
                    <Link to="/solutions" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                      Solutions <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/features" className={navLinkClass}>
            Features
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={dashboardPath}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              >
                {isAdmin ? (
                  <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                )}
                <span>{isAdmin ? 'Admin' : 'Dashboard'}</span>
              </Link>
              <button
                onClick={() => logout()}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-2 rounded-xl border border-transparent hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Separate Sign In Portals Dropdown */}
              <div className="relative" ref={authDropdownRef}>
                <button
                  type="button"
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  onMouseEnter={() => setAuthDropdownOpen(true)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-2 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <span>Sign In</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${authDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                <AnimatePresence>
                  {authDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setAuthDropdownOpen(false)}
                      className="absolute right-0 mt-1 w-60 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50"
                    >
                      <Link
                        to="/login"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-start space-x-2.5 p-2.5 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Merchant Sign In</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Merchant dashboard</div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/login"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-start space-x-2.5 p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Admin Login</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Admin dashboard</div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex flex-col space-y-2">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/solutions" className={navLinkClass}>
                Solutions
              </NavLink>
              <NavLink to="/features" className={navLinkClass}>
                Features
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="flex items-center justify-center space-x-2 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl"
                  >
                    <span>Go to Dashboard</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="w-full py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Merchant Sign In
                  </Link>
                  <Link
                    to="/admin/login"
                    className="w-full text-center py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Admin Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
