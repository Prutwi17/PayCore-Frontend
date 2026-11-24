import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '@/assets/logo.svg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-black text-slate-600 dark:text-zinc-400 border-t border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-2.5 mb-4 group">
              <img src={logoSvg} alt="PayCore" className="h-8 w-8 drop-shadow group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                Pay<span className="text-blue-600 dark:text-blue-500">Core</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
              Manage payments, refunds, and transactions in one place.
            </p>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/solutions#payments" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Payments
                </Link>
              </li>
              <li>
                <Link to="/solutions#refunds" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Refunds
                </Link>
              </li>
              <li>
                <Link to="/solutions#transactions" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/solutions#merchants" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Merchants
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Features</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/features" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link to="/features#reconciliation" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Reconciliation
                </Link>
              </li>
              <li>
                <Link to="/features#notifications" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/features#dashboard" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Merchant Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} PayCore. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
