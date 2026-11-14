import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: November 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-6 pt-6 border-t border-slate-200">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Information We Collect</h2>
            <p>
              We collect information necessary to facilitate business payment processing, including merchant contact information, billing coordinates, authorized identity tokens (via email authentication or Google OpenID Connect), and transaction reference parameters.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. How We Use Financial Data</h2>
            <p>
              Data processed through PayCore is used strictly to execute payment transactions, disburse refunds, deliver signed webhooks, and compile automated reconciliation audits. We do not sell or monetize merchant transaction histories.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Data Security & Storage</h2>
            <p>
              All customer and merchant credentials are cryptographically protected using BCrypt hashing, TLS 1.3 in-transit encryption, and role-based data isolation partitions. Sensitive API keys and signing secrets are stored strictly on backend servers and never exposed to client browsers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Third-Party Identity Providers</h2>
            <p>
              When utilizing Google Sign-In, PayCore verifies OpenID Connect identity tokens securely on the backend. We collect only verified profile details (name, email) and never request access to private Google services or passwords.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
