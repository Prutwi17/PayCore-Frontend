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
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Users,
  Bell,
  ScrollText,
  BarChart3,
  Layers,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  // Industries list for brand trust showcase
  const industries = [
    { title: 'E-commerce', desc: 'Frictionless checkouts & instant authorizations', icon: ShoppingBag },
    { title: 'Retail', desc: 'Unified digital point of sale & in-store payments', icon: Store },
    { title: 'Travel & Hospitality', desc: 'Multi-currency booking & dynamic card settlement', icon: Plane },
    { title: 'Education', desc: 'Structured installment plans & automated receipts', icon: GraduationCap },
    { title: 'Digital Services', desc: 'Flexible recurring usage & instant digital delivery', icon: Cloud },
    { title: 'Subscription Business', desc: 'Automated billing cycles & dunning management', icon: Repeat },
  ];

  // Solutions list
  const solutions = [
    {
      title: 'Online Payment Management',
      desc: 'Seamless multi-currency card and wallet checkout processing with intelligent routing and fraud protection.',
      icon: CreditCard,
      highlight: '99.99% Availability',
      to: '/solutions#payments',
      visualGradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Refund Management',
      desc: 'Automated full and partial balance refunds with instant verification and transparent customer status updates.',
      icon: RotateCcw,
      highlight: 'Instant Balance Releases',
      to: '/solutions#refunds',
      visualGradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Transaction Tracking',
      desc: 'Unified transaction lifecycle monitoring with comprehensive filtering, order cross-referencing, and export capabilities.',
      icon: TrendingUp,
      highlight: 'Unified Ledger Search',
      to: '/solutions#transactions',
      visualGradient: 'from-sky-500 to-blue-600',
    },
    {
      title: 'Merchant Management',
      desc: 'Rapid onboarding, merchant workspace provisioning, granular role controls, and secure credential isolation.',
      icon: Users,
      highlight: 'Multi-Tenant Security',
      to: '/solutions#merchants',
      visualGradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Payment Monitoring',
      desc: 'Real-time telemetry, transaction volume trends, success rate metrics, and intelligent operational anomaly detection.',
      icon: Activity,
      highlight: 'Sub-second Telemetry',
      to: '/solutions#monitoring',
      visualGradient: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Business Operations',
      desc: 'Automated ledger reconciliation against provider statements, immutable audit logs, and compliance reporting.',
      icon: Scale,
      highlight: 'Zero-Discrepancy Engine',
      to: '/solutions#operations',
      visualGradient: 'from-rose-500 to-pink-600',
    },
  ];

  // Features list
  const features = [
    {
      title: 'Payment Management',
      desc: 'Manage payment requests, process customer authorizations, and monitor real-time transaction outcomes with zero friction.',
      icon: CreditCard,
      badge: 'Core Engine',
    },
    {
      title: 'Refund Management',
      desc: 'Handle full and partial refunds with balance reservations, automated workflows, and customer email confirmations.',
      icon: RotateCcw,
      badge: 'Two-Phase Protocol',
    },
    {
      title: 'Transaction Tracking',
      desc: 'View comprehensive payment and refund history in one centralized dashboard with instant search and status filtering.',
      icon: TrendingUp,
      badge: 'Unified History',
    },
    {
      title: 'Merchant Management',
      desc: 'Provision merchant workspaces, manage business profiles, and maintain strict role-based access control.',
      icon: Users,
      badge: 'Role Isolation',
    },
    {
      title: 'Payment Notifications',
      desc: 'Receive instant notifications regarding payment completions, authorization failures, and refund progress.',
      icon: Bell,
      badge: 'Real-Time Alerts',
    },
    {
      title: 'Reconciliation',
      desc: 'Automatically identify and flag discrepancies between internal payment ledgers and external provider statement records.',
      icon: Scale,
      badge: 'Discrepancy Detection',
    },
    {
      title: 'Activity Monitoring',
      desc: 'Track every important account change, permission update, and transaction modification with complete forensic transparency.',
      icon: ScrollText,
      badge: 'Immutable Trails',
    },
    {
      title: 'Business Dashboard',
      desc: 'Monitor gross payment volume, success rates, pending requests, and operational financial metrics in real time.',
      icon: BarChart3,
      badge: 'Live Analytics',
    },
  ];

  // 4 Steps for How It Works
  const steps = [
    {
      number: '01',
      title: 'Create your PayCore account',
      desc: 'Sign up in seconds using your business email or Google account with enterprise-grade identity protection.',
    },
    {
      number: '02',
      title: 'Set up your business account',
      desc: 'Configure your company profile, specify operational currencies, and assign team access permissions.',
    },
    {
      number: '03',
      title: 'Manage payment operations',
      desc: 'Initiate payments, manage transactions, process customer authorizations, and handle refunds from one dashboard.',
    },
    {
      number: '04',
      title: 'Track transactions and refunds',
      desc: 'Monitor financial performance in real time with comprehensive analytics, reconciliation tools, and audit logs.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* =========================================================================
          SECTION B: HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50/50">
        {/* Ambient background soft waves */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-100/40 via-blue-50/20 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-7 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Next-Generation Payment Infrastructure</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
                Powering Payments. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                  Simplifying Business.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal">
                One platform to manage payments, transactions, refunds, and your business payment operations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/solutions"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-300 px-7 py-3.5 rounded-full transition-all shadow-2xs"
                >
                  <span>Explore Solutions</span>
                </Link>
              </div>

              {/* Security & Reliability Badges */}
              <div className="mt-10 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>99.99% Guaranteed Uptime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Role-Based Data Isolation</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual: 3D Golden Bitcoin-Inspired Coin with Continuous Rotation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <GoldenCoin3D />
            </motion.div>
          </div>

          {/* Connected Wave with 4 Quick Feature Cards matching UI Reference */}
          <div className="mt-16 lg:mt-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: 'Payments', desc: 'Multi-currency checkout', icon: CreditCard, to: '/solutions#payments' },
                { title: 'Refunds', desc: 'Instant balance releases', icon: RotateCcw, to: '/solutions#refunds' },
                { title: 'Webhooks', desc: 'Real-time event alerts', icon: Webhook, to: '/features#notifications' },
                { title: 'Reconciliation', desc: 'Automated ledger audit', icon: Scale, to: '/features#reconciliation' },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    to={card.to}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col items-center text-center sm:items-start sm:text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{card.desc}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: COMPANY TRUST / BRAND SHOWCASE
          ========================================================================= */}
      <section className="py-16 bg-slate-50/80 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Industry Solutions</h2>
            <p className="text-2xl font-extrabold text-slate-900">
              Designed for businesses across industries
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Powering payment processing workflows from digital retailers to global enterprises.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: ABOUT PAYCORE
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">
                About PayCore
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                Making Payment Operations Simpler
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                PayCore brings payment processing, transaction tracking, refund management, and payment monitoring together in one platform.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                Rather than coordinating disconnected payment providers, reconciliations, and reporting spreadsheets, PayCore unifies your complete payment lifecycle into a single command center with role-based visibility.
              </p>

              <div className="space-y-4">
                {[
                  'Unified multi-currency transaction processing',
                  'Frictionless full and partial refund balance handling',
                  'Real-time discrepancy detection and ledger verification',
                  'Dedicated workspace control for merchants and administrators',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700 group"
                >
                  <span>Learn more about our company</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Fintech Illustration */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-700 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-6 border-b border-slate-700/80 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Operations Console</span>
                    <h4 className="text-base font-bold text-white">Live Payment Telemetry</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    System Healthy
                  </span>
                </div>

                {/* Simulated Financial KPIs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-slate-400 font-medium">Daily Processing Volume</div>
                    <div className="text-xl font-extrabold text-white mt-1">$128,450.00</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +14.2% vs last week
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-slate-400 font-medium">Settlement Rate</div>
                    <div className="text-xl font-extrabold text-white mt-1">99.82%</div>
                    <div className="text-[10px] text-blue-400 font-semibold mt-1">0.02s avg latency</div>
                  </div>
                </div>

                {/* Simulated Ledger Activity */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-300">Recent Transactions</div>
                  {[
                    { id: 'TXN-89241', amount: '$420.00', status: 'Settled', time: 'Just now' },
                    { id: 'TXN-89240', amount: '$1,250.00', status: 'Settled', time: '2m ago' },
                    { id: 'TXN-89239', amount: '$85.00', status: 'Refunded', time: '5m ago' },
                  ].map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-mono text-slate-300">{tx.id}</span>
                      </div>
                      <span className="font-bold text-white">{tx.amount}</span>
                      <span className="text-[10px] text-slate-400">{tx.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: SOLUTIONS
          ========================================================================= */}
      <section id="solutions" className="py-20 lg:py-28 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Platform Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Solutions for Modern Businesses
            </h2>
            <p className="text-base text-slate-600 mt-4 leading-relaxed">
              Engineered to simplify financial operations, reduce administrative overhead, and ensure dependable payment processing.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.title}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sol.visualGradient} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {sol.highlight}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {sol.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to={sol.to}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: FEATURES
          ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Precision and Scale
            </h2>
            <p className="text-base text-slate-600 mt-4 leading-relaxed">
              Every feature is built from the ground up to provide clear visibility, fast response times, and dependable records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/features"
              className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              <span>Explore all feature specifications in detail</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G: HOW IT WORKS
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 block">
              Onboarding Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get Started in Four Simple Steps
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Fast, intuitive setup designed to get your business operational without unnecessary delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((st) => (
              <div
                key={st.number}
                className="relative bg-slate-800/60 backdrop-blur-xs p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-black text-blue-400 mb-4">{st.number}</div>
                  <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION H: WHY PAYCORE
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              The PayCore Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Businesses Choose PayCore
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Dependable payment infrastructure built around clarity, speed, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Centralized Payment Operations',
                desc: 'Consolidate multiple payment gateways, settlement accounts, and currency stores into a single manageable portal.',
                icon: Layers,
              },
              {
                title: 'Easy Transaction Monitoring',
                desc: 'Instant lookup for any payment reference, customer ID, or order identifier with real-time status visibility.',
                icon: TrendingUp,
              },
              {
                title: 'Refund Management',
                desc: 'Process full and partial refunds with balance checks, automated status updates, and customer email alerts.',
                icon: RotateCcw,
              },
              {
                title: 'Clear Payment History',
                desc: 'Complete immutable records of every payment lifecycle event, preventing disputes and simplifying audits.',
                icon: ScrollText,
              },
              {
                title: 'Business-Focused Dashboard',
                desc: 'Intuitive analytics and performance summaries giving merchants and administrators actionable insights.',
                icon: BarChart3,
              },
              {
                title: 'Secure Account Access',
                desc: 'Enterprise authentication with Google Sign-In, multi-factor support, and strict role isolation.',
                icon: ShieldCheck,
              },
            ].map((adv) => {
              const Icon = adv.icon;
              return (
                <div key={adv.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{adv.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{adv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION I: FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="py-20 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Take Control of Your Payment Operations
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-normal">
            Manage your payment activities with PayCore.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 px-8 py-4 rounded-full shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-bold text-white bg-blue-800/60 hover:bg-blue-800 border border-white/20 px-8 py-4 rounded-full transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
