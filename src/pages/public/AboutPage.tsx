import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Award,
  ArrowRight,
} from 'lucide-react';
import logoSvg from '@/assets/logo.svg';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>About PayCore</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            Simple, Reliable Payment Operations
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            PayCore brings payment processing, transaction tracking, refund management, and payment monitoring together in one platform.
          </p>
        </div>
      </section>

      {/* Main Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                Our Purpose
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Empowering businesses with dependable financial tools
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Modern commerce moves quickly, but disconnected payment tools and records slow businesses down.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                PayCore gives you a single dashboard for accepting payments, issuing refunds, and tracking transactions.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-md transition-all"
                >
                  <span>Open an Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800">
                <div className="flex items-center space-x-3 mb-6">
                  <img src={logoSvg} alt="PayCore" className="w-10 h-10" />
                  <div>
                    <h3 className="text-lg font-bold">PayCore Standards</h3>
                    <p className="text-xs text-slate-400">Built into every transaction</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Clear Records', desc: 'Every transaction is deterministically recorded and verifiable.' },
                    { title: 'Instant Status', desc: 'Real-time payment authorization and refund status updates.' },
                    { title: 'Data Isolation', desc: 'Strict workspace separation between merchant accounts.' },
                    { title: 'Audit Trail', desc: 'Chronological activity logs for every administrative action.' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">{p.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Manage your payments with PayCore</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Create your PayCore business account in minutes.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-full"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
