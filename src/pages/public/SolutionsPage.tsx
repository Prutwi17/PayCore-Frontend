import React from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  RotateCcw,
  TrendingUp,
  Users,
  Activity,
  Scale,
  ArrowRight,
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const solutions = [
    {
      id: 'payments',
      title: 'Online Payment Management',
      desc: 'Accept cards and wallets with real-time status tracking.',
      icon: CreditCard,
      color: 'bg-blue-600',
    },
    {
      id: 'refunds',
      title: 'Refund Management',
      desc: 'Handle full and partial refunds with balance checks.',
      icon: RotateCcw,
      color: 'bg-emerald-600',
    },
    {
      id: 'transactions',
      title: 'Transaction Tracking',
      desc: 'Search and filter every payment and refund record.',
      icon: TrendingUp,
      color: 'bg-sky-600',
    },
    {
      id: 'merchants',
      title: 'Merchant Management',
      desc: 'Manage merchant profiles, roles, and API keys.',
      icon: Users,
      color: 'bg-violet-600',
    },
    {
      id: 'monitoring',
      title: 'Payment Monitoring',
      desc: 'View payment volumes and delivery status.',
      icon: Activity,
      color: 'bg-amber-600',
    },
    {
      id: 'operations',
      title: 'Business Operations',
      desc: 'Compare settlement records and audit logs.',
      icon: Scale,
      color: 'bg-rose-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      <section className="pt-14 pb-12 border-b border-slate-200/80 dark:border-zinc-800 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Solutions
          </h1>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            Simple tools to accept payments, manage refunds, and track transactions.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.id}
                  id={sol.id}
                  className="scroll-mt-24 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-xl ${sol.color} text-white flex items-center justify-center mb-4`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                      {sol.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-5">
                      {sol.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <Link
                      to="/register"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
