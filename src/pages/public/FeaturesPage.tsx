import React from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  RotateCcw,
  TrendingUp,
  Users,
  Bell,
  Scale,
  ScrollText,
  BarChart3,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      id: 'payments',
      title: 'Payment Management',
      subtitle: 'Authorizations, settlements, and status tracking.',
      icon: CreditCard,
      color: 'bg-blue-600',
      description:
        'Initiate and process card and wallet payments with instant state transitions. Maintain total control over currency parameters, order references, and customer checkout sessions.',
      highlights: [
        'Idempotent payment initiation preventing duplicate charges',
        'Real-time state tracking from pending to success or failure',
        'Seamless integration with simulated and live provider stores',
        'Support for major global fiat and digital payment currencies',
      ],
    },
    {
      id: 'refunds',
      title: 'Refund Management',
      subtitle: 'Two-phase balance refund protocol with full or partial returns.',
      icon: RotateCcw,
      color: 'bg-emerald-600',
      description:
        'Handle customer returns and disputed balances with automated two-phase reservation logic. Safeguard cashflow while maintaining excellent customer goodwill.',
      highlights: [
        'Instant balance reservation ensuring sufficient funds',
        'Granular partial refund tracking against original transactions',
        'Automated refund receipts and status email alerts',
        'Clear ledger tracking for full and partial refund auditability',
      ],
    },
    {
      id: 'transactions',
      title: 'Transaction Tracking',
      subtitle: 'Centralized financial history across all payment methods.',
      icon: TrendingUp,
      color: 'bg-sky-600',
      description:
        'Inspect every transaction from inception to final settlement. Filter by date, status, payment method, or transaction reference with sub-second responsiveness.',
      highlights: [
        'Unified transaction log combining payments, refunds, and adjustments',
        'Search across customer IDs, payment references, and order keys',
        'Status indicators highlighting settled, processing, and failed states',
        'One-click export for corporate financial reporting and reconciliation',
      ],
    },
    {
      id: 'merchants',
      title: 'Merchant Management',
      subtitle: 'Granular workspace provisioning and credential isolation.',
      icon: Users,
      color: 'bg-violet-600',
      description:
        'Manage merchant entities with dedicated data isolation, automated account provisioning, tiered transaction limits, and secure API key management.',
      highlights: [
        'Multi-tenant workspace isolation ensuring zero cross-tenant leaks',
        'Role-based permissions separating merchant staff and system admins',
        'Automated merchant onboarding upon verified email or Google sign-in',
        'Granular API secret rotation and webhook destination registration',
      ],
    },
    {
      id: 'notifications',
      title: 'Payment Notifications',
      subtitle: 'Real-time event alerts delivered with guaranteed retry schedules.',
      icon: Bell,
      color: 'bg-amber-600',
      description:
        'Keep internal systems and customers informed at every step of the payment lifecycle with automated event alerts and cryptographic verification.',
      highlights: [
        'Instant alerts for payment successes, authorizations, and refunds',
        'Cryptographic HMAC signature authentication for every delivery',
        'Automated exponential retry schedules for transient endpoint drops',
        'Complete event delivery audit logs with HTTP response status tracking',
      ],
    },
    {
      id: 'reconciliation',
      title: 'Reconciliation',
      subtitle: 'Automated ledger discrepancy detection and dispute resolution.',
      icon: Scale,
      color: 'bg-rose-600',
      description:
        'Eliminate human reconciliation errors. The PayCore reconciliation engine cross-checks internal ledgers against independent provider statement records automatically.',
      highlights: [
        'Automated matching between PayCore transactions and provider records',
        'Instant detection of mismatched amounts, unrecorded fees, or missing records',
        'Interactive administrative resolution console for manual adjustments',
        'Detailed reconciliation run summaries and variance reporting',
      ],
    },
    {
      id: 'activity',
      title: 'Activity Monitoring',
      subtitle: 'Immutable forensic audit trails for administrative accountability.',
      icon: ScrollText,
      color: 'bg-indigo-600',
      description:
        'Track every critical action with immutable audit trails. Every status change, refund initiation, profile edit, and reconciliation event is permanently recorded.',
      highlights: [
        'Tamper-evident audit logging for all privileged user actions',
        'Actor identification, IP addresses, timestamps, and state diffs',
        'Searchable audit records filtered by actor, resource, or date',
        'Compliance-ready logs meeting international regulatory standards',
      ],
    },
    {
      id: 'dashboard',
      title: 'Business Dashboard',
      subtitle: 'Executive intelligence and live payment performance metrics.',
      icon: BarChart3,
      color: 'bg-teal-600',
      description:
        'Visualize your financial performance with real database-backed metrics. Monitor gross processing volume, success ratios, refund velocity, and system health in real time.',
      highlights: [
        'Live gross payment volume and net revenue calculations',
        'Dynamic 7-day and 30-day processing trend visualizations',
        'Immediate insight into pending requests and authorization bottlenecks',
        'Dedicated dashboards tailored for merchants and platform administrators',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Features</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Platform Features
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Core tools for managing payments, refunds, transactions, and reconciliation.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className="scroll-mt-24 p-8 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-12 h-12 rounded-2xl ${feat.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900">{feat.title}</h2>
                      <p className="text-xs text-slate-500 font-medium">{feat.subtitle}</p>
                    </div>
                  </div>
                  <span className="self-start lg:self-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Active Feature
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 max-w-4xl">
                  {feat.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200/60">
                  {feat.highlights.map((h, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to transform your payment operations?</h2>
          <p className="text-sm text-slate-400 mb-6">Create your PayCore account in under two minutes.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-6 py-3 rounded-full border border-slate-700"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
