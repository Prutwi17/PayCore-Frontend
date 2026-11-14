import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
  Award,
} from 'lucide-react';
import logoSvg from '@/assets/logo.svg';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Company & Vision</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Making Payment Operations Simpler
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            PayCore brings payment processing, transaction tracking, refund management, and payment monitoring together in one platform.
          </p>
        </div>
      </section>

      {/* Main Mission Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                Our Purpose
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Empowering businesses with dependable financial infrastructure
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Modern commerce moves quickly, but legacy payment reconciliation, disconnected tools, and opaque billing records create friction that slows companies down.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                At PayCore, we believe running a business should be straightforward. Whether you process hundreds of payments daily or thousands of global transactions across currencies, your payment infrastructure should be transparent, verifiable, and unified.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <div className="text-2xl font-black text-blue-600">99.99%</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Operational Uptime SLA</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="text-2xl font-black text-emerald-600">&lt; 150ms</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Average Authorization Latency</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800">
                <div className="flex items-center space-x-3 mb-6">
                  <img src={logoSvg} alt="PayCore" className="w-10 h-10" />
                  <div>
                    <h3 className="text-lg font-bold">PayCore Principles</h3>
                    <p className="text-xs text-slate-400">Our foundation for every transaction</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Zero Data Loss', desc: 'Every transaction is deterministically recorded and verifiable.' },
                    { title: 'Instant Transparency', desc: 'No hidden status delays or ambiguous settlement states.' },
                    { title: 'Multi-Tenant Security', desc: 'Strict data boundary separation between merchant workspaces.' },
                    { title: 'Continuous Auditability', desc: 'Immutable forensic audit logs for regulatory confidence.' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
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

      {/* Values Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Our Core Values
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">How We Operate</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Uncompromising Security</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Security is embedded in every layer of PayCore. From tokenized credentials to cryptographic ID token verification, merchant assets are protected at all times.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Operational Precision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Payment operations require exact accounting. Our automated reconciliation engine cross-checks statements down to the penny to ensure zero discrepancies.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Global Accessibility</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Empowering businesses regardless of geography. We support standard fiat currencies and digital asset settlements to enable borderless growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">Join the future of payment processing</h2>
          <p className="text-sm text-slate-600 mb-6">Create your PayCore business workspace in minutes.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 px-6 py-3 rounded-full"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
