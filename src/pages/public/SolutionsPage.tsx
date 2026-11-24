import React from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  RotateCcw,
  TrendingUp,
  Users,
  Activity,
  Scale,
  CheckCircle2,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const solutions = [
    {
      id: 'payments',
      title: 'Online Payment Management',
      subtitle: 'Fast, secure multi-currency card and wallet checkout experiences.',
      icon: CreditCard,
      color: 'bg-blue-600',
      description:
        'Deliver a frictionless checkout experience for your customers. PayCore routes payment authorizations with sub-second response times, intelligent fallback logic, and built-in fraud prevention.',
      benefits: [
        'Multi-currency processing across major global card networks',
        'Idempotent payment initiation preventing duplicate charges',
        'Instant authorization status with real-time feedback',
        'Comprehensive payment metadata and order cross-referencing',
      ],
    },
    {
      id: 'refunds',
      title: 'Refund Management',
      subtitle: 'Automated full and partial balance returns with complete transparency.',
      icon: RotateCcw,
      color: 'bg-emerald-600',
      description:
        'Handle customer refunds with confidence. PayCore supports partial and full balance releases, automatic balance reservations, and instant email notifications for cardholders.',
      benefits: [
        'Two-phase reservation protocol safeguarding merchant balances',
        'Flexible partial refunds against settled transactions',
        'Automated refund status tracking and failure recovery',
        'Direct customer notification updates upon settlement',
      ],
    },
    {
      id: 'transactions',
      title: 'Transaction Tracking',
      subtitle: 'Complete visibility across the entire payment lifecycle.',
      icon: TrendingUp,
      color: 'bg-sky-600',
      description:
        'Gain total clarity over your financial flow. Search, filter, and inspect every payment and refund record across date ranges, settlement statuses, and customer references.',
      benefits: [
        'Instant multi-parameter search across payments and refunds',
        'Complete chronological audit trail for every transaction state',
        'Exportable transaction histories for bookkeeping and accounting',
        'Detailed payment method breakdown and currency analytics',
      ],
    },
    {
      id: 'merchants',
      title: 'Merchant Management',
      subtitle: 'Granular access controls, multi-tenant security, and credential management.',
      icon: Users,
      color: 'bg-violet-600',
      description:
        'Safely manage your merchant organization. PayCore provides isolated workspaces, role-based access permissions, API key generation, and webhook endpoint configuration.',
      benefits: [
        'Dedicated merchant workspaces with isolated data partitions',
        'Role-based permissions separating staff, finance, and admins',
        'Secure API key provisioning with granular permission scopes',
        'Self-service merchant profile and preference management',
      ],
    },
    {
      id: 'monitoring',
      title: 'Payment Monitoring',
      subtitle: 'Real-time operational dashboards displaying processing telemetry.',
      icon: Activity,
      color: 'bg-amber-600',
      description:
        'Keep a pulse on your business performance. Live charts display transaction volume velocity, approval ratios, and operational health without manual calculation.',
      benefits: [
        'Real-time gross payment volume and net revenue calculation',
        'Instant detection of authorization drops or elevated refund rates',
        'Live system availability and payment gateway responsiveness',
        'Customizable timeframe views from 24 hours to 30 days',
      ],
    },
    {
      id: 'operations',
      title: 'Business Operations',
      subtitle: 'Automated reconciliation, immutable audit logs, and compliance reporting.',
      icon: Scale,
      color: 'bg-rose-600',
      description:
        'Automate your end-of-day financial closing. PayCore cross-checks internal ledgers against independent provider settlement statements, identifying any discrepancies automatically.',
      benefits: [
        'Automated reconciliation runs comparing internal and provider ledgers',
        'Instant detection of mismatched amounts, missing fees, or unrecorded charges',
        'Forensic-grade immutable audit logs tracking every administrative action',
        'Simplified financial audits with tamper-evident record keeping',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Payment Solutions for Business
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Simple tools to accept payments, manage refunds, and keep clear transaction records.
          </p>
        </div>
      </section>

      {/* Solutions Detailed List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={sol.id}
                id={sol.id}
                className="scroll-mt-24 p-8 sm:p-12 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  <div className="lg:col-span-7">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${sol.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">{sol.title}</h2>
                        <p className="text-xs font-medium text-slate-500">{sol.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                      {sol.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {sol.benefits.map((b, i) => (
                        <div key={i} className="flex items-start space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-xs font-medium text-slate-700 leading-snug">{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4">
                      <Link
                        to="/register"
                        className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full shadow-md transition-all"
                      >
                        <span>Get Started with {sol.title.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-center space-y-3">
                      <div className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                        Operational Scope
                      </div>
                      <div className="text-xs text-slate-600 space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Processing:</span>
                          <span className="font-semibold text-slate-800">Cards & Wallets</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Currencies:</span>
                          <span className="font-semibold text-slate-800">USD, EUR, GBP, INR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Access:</span>
                          <span className="font-semibold text-slate-800">Merchant Portal & API</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Records:</span>
                          <span className="font-semibold text-emerald-600">Audit Logged</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to simplify your payment operations?</h2>
          <p className="text-sm text-slate-400 mb-6">Join merchants worldwide processing with PayCore today.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-md"
            >
              Create Account
            </Link>
            <Link
              to="/contact"
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-6 py-3 rounded-full border border-slate-700"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
