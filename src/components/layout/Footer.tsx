import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '@/assets/logo.svg';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/90 bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Brand & 7 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
          {/* Column 1: Brand & Identity */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <img src={logoSvg} alt="PayCore" className="h-7 w-7 drop-shadow-sm" />
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                Pay<span className="text-blue-500">Core</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Payment processing infrastructure built for reliable transactions. Complete modular monolith architecture with transactional outbox, Kafka event processing, and multi-source settlement reconciliation.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Engine Operational</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#what-paycore-does" className="hover:text-blue-400 transition-colors">Overview</Link></li>
              <li><Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link></li>
              <li><Link to="/#security" className="hover:text-blue-400 transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Column 3: Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/modules#module-payments" className="hover:text-blue-400 transition-colors">Payments</Link></li>
              <li><Link to="/modules#module-refunds" className="hover:text-blue-400 transition-colors">Refunds</Link></li>
              <li><Link to="/modules#module-transactions" className="hover:text-blue-400 transition-colors">Transactions</Link></li>
              <li><Link to="/modules#module-webhooks" className="hover:text-blue-400 transition-colors">Webhooks</Link></li>
              <li><Link to="/modules#module-reconciliation" className="hover:text-blue-400 transition-colors">Reconciliation</Link></li>
              <li><Link to="/modules#module-audit" className="hover:text-blue-400 transition-colors">Audit Logs</Link></li>
            </ul>
          </div>

          {/* Column 4: Developers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Developers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/docs#api-reference" className="hover:text-blue-400 transition-colors">REST API</Link></li>
              <li><Link to="/docs#authentication" className="hover:text-blue-400 transition-colors">API Keys</Link></li>
              <li><Link to="/docs#webhooks" className="hover:text-blue-400 transition-colors">Webhook HMAC</Link></li>
              <li><Link to="/docs#error-codes" className="hover:text-blue-400 transition-colors">Error Codes</Link></li>
            </ul>
          </div>

          {/* Column 5: Documentation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Documentation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Quickstart</Link></li>
              <li><Link to="/docs#state-machine" className="hover:text-blue-400 transition-colors">State Machine</Link></li>
              <li><Link to="/docs#idempotency" className="hover:text-blue-400 transition-colors">Idempotency</Link></li>
              <li><Link to="/docs#refund-api" className="hover:text-blue-400 transition-colors">Refund API</Link></li>
            </ul>
          </div>

          {/* Column 6: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Company & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#architecture" className="hover:text-blue-400 transition-colors">Architecture</Link></li>
              <li><Link to="/#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/#terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/#contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} PayCore Infrastructure. All rights reserved. Built with Java Spring Boot, MySQL, Redis, Kafka, and React.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Stateless JWT · BCrypt · HMAC Signatures
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
