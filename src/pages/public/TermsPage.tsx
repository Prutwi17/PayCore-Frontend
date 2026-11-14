import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Terms and Conditions</h1>
            <p className="text-xs text-slate-500">Effective Date: November 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-6 pt-6 border-t border-slate-200">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the PayCore Payment Infrastructure Platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you are entering into this agreement on behalf of a business, you represent that you have the authority to bind such entity.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Description of Service</h2>
            <p>
              PayCore provides unified payment processing, transaction tracking, refund orchestration, and automated reconciliation for registered merchants and platform administrators.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Account Security & Responsibilities</h2>
            <p>
              Merchants are responsible for maintaining the confidentiality of login credentials and API secret keys. Any authorized transaction or action executed under your account credentials is your operational responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Discrepancy & Reconciliation Policy</h2>
            <p>
              Our reconciliation module cross-checks internal PayCore records against external provider statements. In the event of ledger variances, merchant administrators must review and resolve discrepancies in accordance with standard financial accounting procedures.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Termination & Access Revocation</h2>
            <p>
              PayCore reserves the right to suspend or terminate accounts that violate system security protocols, engage in unauthorized role elevation, or abuse payment processing limits.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
