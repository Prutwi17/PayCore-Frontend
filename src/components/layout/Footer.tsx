import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '@/assets/logo.svg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info & Mission */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-2.5 mb-4 group">
              <img src={logoSvg} alt="PayCore" className="h-8 w-8 drop-shadow group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Pay<span className="text-blue-500">Core</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              Powering modern payments and simplifying business operations. One centralized platform to manage transactions, handle refunds, and streamline global settlements.
            </p>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/solutions#payments" className="hover:text-white transition-colors">
                  Payment Management
                </Link>
              </li>
              <li>
                <Link to="/solutions#refunds" className="hover:text-white transition-colors">
                  Refund Operations
                </Link>
              </li>
              <li>
                <Link to="/solutions#transactions" className="hover:text-white transition-colors">
                  Transaction Tracking
                </Link>
              </li>
              <li>
                <Link to="/solutions#merchants" className="hover:text-white transition-colors">
                  Merchant Management
                </Link>
              </li>
              <li>
                <Link to="/solutions#monitoring" className="hover:text-white transition-colors">
                  Payment Monitoring
                </Link>
              </li>
              <li>
                <Link to="/solutions#operations" className="hover:text-white transition-colors">
                  Business Operations
                </Link>
              </li>
            </ul>
          </div>

          {/* Features & Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Features</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Feature Overview
                </Link>
              </li>
              <li>
                <Link to="/features#reconciliation" className="hover:text-white transition-colors">
                  Ledger Reconciliation
                </Link>
              </li>
              <li>
                <Link to="/features#notifications" className="hover:text-white transition-colors">
                  Real-Time Notifications
                </Link>
              </li>
              <li>
                <Link to="/features#audit" className="hover:text-white transition-colors">
                  Immutable Audit Trails
                </Link>
              </li>
              <li>
                <Link to="/features#dashboard" className="hover:text-white transition-colors">
                  Business Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Company & Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About PayCore
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Merchant Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PayCore Financial Technologies Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
