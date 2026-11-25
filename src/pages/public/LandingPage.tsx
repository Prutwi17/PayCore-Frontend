import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoldenCoin3D } from '@/components/common/GoldenCoin3D';
import {
  CreditCard,
  RotateCcw,
  Webhook,
  Scale,
  ShoppingBag,
  Store,
  Plane,
  GraduationCap,
  Cloud,
  Repeat,
  ArrowRight,
  TrendingUp,
  Activity,
  Users,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const industries = [
    { title: 'E-commerce', desc: 'Online checkouts & card payments', icon: ShoppingBag },
    { title: 'Retail', desc: 'In-store & digital payments', icon: Store },
    { title: 'Travel', desc: 'Multi-currency bookings', icon: Plane },
    { title: 'Education', desc: 'Tuition & installment payments', icon: GraduationCap },
    { title: 'Digital Services', desc: 'Usage billing & digital sales', icon: Cloud },
    { title: 'Subscriptions', desc: 'Recurring billing cycles', icon: Repeat },
  ];

  const solutions = [
    {
      title: 'Online Payment Management',
      desc: 'Accept cards and digital wallets with live status updates.',
      icon: CreditCard,
      highlight: 'Checkout',
      to: '/solutions#payments',
      visualGradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Refund Management',
      desc: 'Process full and partial refunds with balance checks.',
      icon: RotateCcw,
      highlight: 'Refunds',
      to: '/solutions#refunds',
      visualGradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Transaction Tracking',
      desc: 'Search and filter payment records across date ranges.',
      icon: TrendingUp,
      highlight: 'Ledger',
      to: '/solutions#transactions',
      visualGradient: 'from-sky-500 to-blue-600',
    },
    {
      title: 'Merchant Management',
      desc: 'Manage merchant workspaces and API credentials.',
      icon: Users,
      highlight: 'Workspaces',
      to: '/solutions#merchants',
      visualGradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Payment Monitoring',
      desc: 'Track payment volumes and status from your dashboard.',
      icon: Activity,
      highlight: 'Monitoring',
      to: '/solutions#monitoring',
      visualGradient: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Business Operations',
      desc: 'Compare settlement records and review audit logs.',
      icon: Scale,
      highlight: 'Operations',
      to: '/solutions#operations',
      visualGradient: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white selection:bg-blue-100 selection:text-blue-700 transition-colors">
      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-white dark:bg-black">
        <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-blue-50/40 via-white/0 to-transparent dark:from-blue-950/15 dark:via-black/0 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
            {/* Left Hero Copy - 4 Lines */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-6 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-5">
                <span className="block">Powering</span>
                <span className="block">Payments.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-400">
                  Simplifying
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-400">
                  Business.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto lg:mx-0 mb-7 leading-relaxed">
                One platform to manage payments, transactions, and refunds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/solutions"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-zinc-900 border border-slate-300 dark:border-zinc-700 px-7 py-3.5 rounded-full transition-all shadow-2xs"
                >
                  <span>Explore Solutions</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Hero Visual: 3D Rotating Coin with Orbital Rings & Design Spheres */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-6 flex justify-center lg:justify-end"
            >
              <GoldenCoin3D />
            </motion.div>
          </div>

          {/* 4 Quick Feature Boxes */}
          <div className="mt-14 lg:mt-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                { title: 'Payments', desc: 'Card & wallet checkout', icon: CreditCard, to: '/solutions#payments' },
                { title: 'Refunds', desc: 'Full & partial returns', icon: RotateCcw, to: '/solutions#refunds' },
                { title: 'Webhooks', desc: 'Event notifications', icon: Webhook, to: '/features#notifications' },
                { title: 'Reconciliation', desc: 'Ledger matching', icon: Scale, to: '/features#reconciliation' },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    to={card.to}
                    className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group flex flex-col items-center text-center sm:items-start sm:text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.desc}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SECTION */}
      <section className="py-16 bg-white dark:bg-black border-y border-slate-200/70 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Designed for businesses across industries
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all text-center flex flex-col items-center justify-center group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 flex items-center justify-center mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOLUTIONS GRID */}
      <section id="solutions" className="py-16 lg:py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Solutions
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2">
              Manage payments, refunds, and transactions in one place.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.title}
                  className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${sol.visualGradient} text-white flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300">
                        {sol.highlight}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <Link
                      to={sol.to}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
