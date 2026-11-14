import React, { useState } from 'react';
import {
  Mail,
  Building,
  CheckCircle2,
  Send,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    volume: '$10k - $50k',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How fast can our business start accepting payments?',
      a: 'Merchant registration and automated workspace provisioning takes under 2 minutes. Once registered, you can immediately initiate sandbox and live payment operations.',
    },
    {
      q: 'Does PayCore support partial refunds?',
      a: 'Yes. PayCore supports flexible partial refunds as well as full transaction refunds with instant balance release verification.',
    },
    {
      q: 'How does automated reconciliation work?',
      a: 'The reconciliation engine cross-checks PayCore internal transaction ledgers against independent provider settlement statements to identify matched, mismatched, or missing records automatically.',
    },
    {
      q: 'Can multiple team members access our merchant workspace?',
      a: 'Yes. PayCore provides granular role-based access control, allowing administrators and team members isolated access based on permitted capabilities.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            We are here to help your business grow
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about integrating PayCore or scaling your payment processing? Our advisory team is ready to assist.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Form */}
            <div className="lg:col-span-7 bg-slate-50/80 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-sm text-slate-600 mb-8">
                Fill out the form below and an operations specialist will respond within 24 hours.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                    Thank you for contacting PayCore. Our team has received your message and will be in touch shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: '', email: '', company: '', volume: '$10k - $50k', message: '' });
                    }}
                    className="mt-4 text-xs font-bold text-emerald-700 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Alex Morgan"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Business Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Company / Business Name</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Enterprises"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimated Monthly Volume</label>
                      <select
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option>&lt; $10k / month</option>
                        <option>$10k - $50k / month</option>
                        <option>$50k - $250k / month</option>
                        <option>&gt; $250k / month</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your payment flow requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full shadow-md transition-all"
                  >
                    <span>Submit Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Right Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Direct Inquiries</h3>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Support & Administration</div>
                    <div className="text-slate-500">omp27614@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Global Operations Center</div>
                    <div className="text-slate-500">Financial Technology District, Suite 400</div>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Frequently Asked Questions</span>
                </div>

                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-200/60 pb-3 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-blue-600 py-1"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-blue-600' : ''}`}
                      />
                    </button>
                    {openFaq === idx && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
