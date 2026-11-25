import React from 'react';
import {
  CreditCard,
  RotateCcw,
  TrendingUp,
  Users,
  Bell,
  Scale,
  ScrollText,
  BarChart3,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      id: 'payments',
      title: 'Payment Management',
      desc: 'Accept card and wallet payments.',
      icon: CreditCard,
      color: 'bg-blue-600',
    },
    {
      id: 'refunds',
      title: 'Refund Management',
      desc: 'Issue full or partial customer refunds.',
      icon: RotateCcw,
      color: 'bg-emerald-600',
    },
    {
      id: 'transactions',
      title: 'Transaction Tracking',
      desc: 'Search and filter payment history.',
      icon: TrendingUp,
      color: 'bg-sky-600',
    },
    {
      id: 'merchants',
      title: 'Merchant Accounts',
      desc: 'Manage business workspaces and API keys.',
      icon: Users,
      color: 'bg-violet-600',
    },
    {
      id: 'notifications',
      title: 'Payment Notifications',
      desc: 'Receive webhook updates for payment events.',
      icon: Bell,
      color: 'bg-amber-600',
    },
    {
      id: 'reconciliation',
      title: 'Reconciliation',
      desc: 'Compare payments against settlement records.',
      icon: Scale,
      color: 'bg-rose-600',
    },
    {
      id: 'audit',
      title: 'Audit Logs',
      desc: 'Review chronological records of account actions.',
      icon: ScrollText,
      color: 'bg-indigo-600',
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      desc: 'Track payment volumes and daily activity.',
      icon: BarChart3,
      color: 'bg-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      <section className="pt-14 pb-12 border-b border-slate-200/80 dark:border-zinc-800 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Features
          </h1>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            Core tools for managing payments, refunds, and transactions.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  id={feat.id}
                  className="scroll-mt-24 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className={`w-11 h-11 rounded-xl ${feat.color} text-white flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {feat.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
