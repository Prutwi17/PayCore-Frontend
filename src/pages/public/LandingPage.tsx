import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, RotateCcw, Webhook, Scale, CheckCircle2 } from 'lucide-react';
import logoSvg from '@/assets/logo.svg';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient circular blue glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-50/60 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Independent Payment Processing Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Payment Processing <br />
              <span className="text-blue-600">Engine for Businesses</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Integrate payments, manage transactions, and handle refunds from a single platform.
              Built with idempotent APIs, strict state machines, and resilient provider abstractions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href="#docs"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                View Documentation
              </a>
            </div>
          </div>

          {/* Hero Visual Card (Coin/Card illustration inspired by reference image) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl text-white transform hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-3">
                  <img src={logoSvg} alt="PayCore" className="h-10 w-10 filter drop-shadow" />
                  <span className="text-xl font-bold">PayCore</span>
                </div>
                <span className="text-xs font-mono uppercase tracking-widest bg-white/20 px-2 py-1 rounded">
                  Gateway
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-wider text-blue-200 font-medium">Core Capabilities</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/10 rounded-lg p-3">Idempotent Charges</div>
                  <div className="bg-white/10 rounded-lg p-3">Partial Refunds</div>
                  <div className="bg-white/10 rounded-lg p-3">Kafka Webhooks</div>
                  <div className="bg-white/10 rounded-lg p-3">Reconciliation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip matching design-reference */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Payments</h4>
                <p className="text-xs text-slate-500">Idempotent charge initiation</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Refunds</h4>
                <p className="text-xs text-slate-500">Full and partial refund tracking</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <Webhook className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Webhooks</h4>
                <p className="text-xs text-slate-500">Signed event dispatching</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Reconciliation</h4>
                <p className="text-xs text-slate-500">Settlement audit reports</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
