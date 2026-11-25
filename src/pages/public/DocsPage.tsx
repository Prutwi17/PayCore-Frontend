import React, { useState } from 'react';
import {
  Terminal,
  BookOpen,
  Key,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  FileJson
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const SECTIONS: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">PayCore API Overview</h2>
            <p className="text-slate-600 mt-2 leading-relaxed text-sm">
              The PayCore Payment Processing Engine provides robust RESTful APIs designed for high reliability, non-repudiation, and financial integrity. All API requests must be transmitted over HTTPS and use JSON formatting.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">API Host Endpoints</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <span className="text-slate-400 block mb-1">Local Development Host</span>
                <span className="font-semibold text-blue-600">http://localhost:8080/api/v1</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <span className="text-slate-400 block mb-1">Production Host</span>
                <span className="font-semibold text-slate-800">https://api.paycore.internal/api/v1</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">Quick Testing Resources</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="http://localhost:8080/swagger-ui/index.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Interactive Swagger UI</span>
              </a>
              <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                <FileJson className="w-4 h-4 text-slate-500" />
                <span>Postman Collection: /postman/PayCore.postman_collection.json</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication & Headers',
      badge: 'Security',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">API Authentication</h2>
            <p className="text-slate-600 mt-2 leading-relaxed text-sm">
              PayCore uses two primary authentication schemes depending on the caller type:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm">
                <Key className="w-4 h-4" />
                <span>1. Merchant API Keys (X-Api-Key)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For backend-to-backend programmatic integration. Generated in the Merchant Portal with <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">sk_live_</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">sk_test_</code> prefixes.
              </p>
              <div className="pt-2">
                <code className="text-xs font-mono bg-slate-100 block p-2 rounded text-slate-800">
                  X-Api-Key: sk_live_4f89d9e2a1b7c3d4...
                </code>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <span>2. JWT Bearer Tokens (Authorization)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For authenticated dashboard and interactive portal sessions. Emits 15-minute access tokens paired with 7-day rotatable refresh tokens.
              </p>
              <div className="pt-2">
                <code className="text-xs font-mono bg-slate-100 block p-2 rounded text-slate-800">
                  Authorization: Bearer eyJhbGciOiJIUzM4NCJ9...
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">Mandatory Idempotency Header</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every payment and refund mutation request must supply an <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs font-bold text-slate-800">Idempotency-Key</code> header (UUID v4 recommended). Replaying a request with the exact same key and payload safely returns the cached completed operation with an <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs text-emerald-700 font-bold">Idempotent-Replay: true</code> response header.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'payments-api',
      title: 'Payments API',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create a Payment</h2>
            <p className="text-slate-600 mt-2 leading-relaxed text-sm">
              Initiates an idempotent payment transaction through the payment engine.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 text-slate-100 font-mono text-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
              <span className="text-blue-400 font-bold">POST /api/v1/payments</span>
              <button
                onClick={() => copyToClipboard('curl -X POST http://localhost:8080/api/v1/payments \\\n  -H "Authorization: Bearer <jwt_token>" \\\n  -H "X-Api-Key: <api_key>" \\\n  -H "Idempotency-Key: e4b2d8e4-18c9-42b7-a3f2-892bb59f9e1a" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "amount": 199.00,\n    "currency": "USD",\n    "paymentMethod": "CREDIT_CARD",\n    "customerEmail": "alex@example.com",\n    "description": "Order #4820"\n  }\'', 'curl-payment')}
                className="hover:text-white flex items-center space-x-1"
              >
                {copiedKey === 'curl-payment' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'curl-payment' ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto text-blue-300 leading-relaxed">
{`curl -X POST http://localhost:8080/api/v1/payments \\
  -H "Authorization: Bearer <jwt_token>" \\
  -H "X-Api-Key: sk_live_4f89d9e2a1b7..." \\
  -H "Idempotency-Key: e4b2d8e4-18c9-42b7-a3f2-892bb59f9e1a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 199.00,
    "currency": "USD",
    "paymentMethod": "CREDIT_CARD",
    "customerEmail": "alex@example.com",
    "description": "Order #4820"
  }'`}
            </pre>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Response 201 Created</h4>
            <div className="bg-slate-900 rounded-2xl p-5 text-slate-100 font-mono text-xs overflow-x-auto text-emerald-400">
{`{
  "status": "success",
  "message": "Payment processed successfully",
  "data": {
    "paymentReference": "pay_9f82d1c4b7",
    "amount": 199.00,
    "currency": "USD",
    "status": "SUCCESS",
    "providerTransactionId": "sim_txn_7a9c2b4d",
    "createdAt": "2026-11-06T15:20:00Z"
  }
}`}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'refunds-api',
      title: 'Refunds API',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create a Refund</h2>
            <p className="text-slate-600 mt-2 leading-relaxed text-sm">
              Initiates a full or partial refund against an eligible settled payment with two-phase balance reservations.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 text-slate-100 font-mono text-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
              <span className="text-blue-400 font-bold">POST /api/v1/refunds</span>
              <button
                onClick={() => copyToClipboard('curl -X POST http://localhost:8080/api/v1/refunds \\\n  -H "Authorization: Bearer <jwt_token>" \\\n  -H "Idempotency-Key: 7c9a2d4b-3b7d-4bad-9bdd-2b0d7b3dcb6d" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "paymentReference": "pay_9f82d1c4b7",\n    "amount": 50.00,\n    "reason": "Customer return request"\n  }\'', 'curl-refund')}
                className="hover:text-white flex items-center space-x-1"
              >
                {copiedKey === 'curl-refund' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'curl-refund' ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto text-blue-300 leading-relaxed">
{`curl -X POST http://localhost:8080/api/v1/refunds \\
  -H "Authorization: Bearer <jwt_token>" \\
  -H "Idempotency-Key: 7c9a2d4b-3b7d-4bad-9bdd-2b0d7b3dcb6d" \\
  -H "Content-Type: application/json" \\
  -d '{
    "paymentReference": "pay_9f82d1c4b7",
    "amount": 50.00,
    "reason": "Customer return request"
  }'`}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'webhooks-api',
      title: 'Webhooks & HMAC Verification',
      badge: 'Integration',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Webhook Signature Verification</h2>
            <p className="text-slate-600 mt-2 leading-relaxed text-sm">
              All webhook requests sent by PayCore include an <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-700">X-PayCore-Signature</code> header formatted as <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">t=timestamp,v1=hash</code>. Use constant-time comparison to prevent timing attacks.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 text-slate-100 font-mono text-xs overflow-x-auto text-blue-300 leading-relaxed">
{`// Node.js Webhook Signature Verifier
import crypto from 'crypto';

export function verifyPayCoreWebhook(rawBody: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(',').map((pair) => pair.split('=')));
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) return false;

  // Enforce 5-minute replay tolerance window
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (age > 300) return false;

  const payload = timestamp + '.' + rawBody;
  const expectedHash = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHash));
}`}
          </div>
        </div>
      )
    },
    {
      id: 'error-codes',
      title: 'Uniform Error Codes',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Standard Error Model</h2>
            <p className="text-slate-600 mt-2 leading-relaxed text-sm">
              PayCore returns structured JSON error responses with consistent machine-readable error codes.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Error Code</th>
                  <th className="py-3 px-4">HTTP Status</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                <tr>
                  <td className="py-3 px-4 font-bold text-rose-600">IDEMPOTENCY_CONFLICT</td>
                  <td className="py-3 px-4">409 Conflict</td>
                  <td className="py-3 px-4 font-sans text-slate-600">Same idempotency key supplied with altered request parameters.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-amber-600">IDEMPOTENCY_PROCESSING</td>
                  <td className="py-3 px-4">202 Accepted</td>
                  <td className="py-3 px-4 font-sans text-slate-600">Operation currently in flight on another thread.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-rose-600">EMAIL_NOT_VERIFIED</td>
                  <td className="py-3 px-4">403 Forbidden</td>
                  <td className="py-3 px-4 font-sans text-slate-600">Merchant account email ownership is unconfirmed.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-rose-600">INSUFFICIENT_REFUNDABLE_BALANCE</td>
                  <td className="py-3 px-4">400 Bad Request</td>
                  <td className="py-3 px-4 font-sans text-slate-600">Requested refund exceeds settled available amount.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-amber-600">EMAIL_DELIVERY_UNAVAILABLE</td>
                  <td className="py-3 px-4">503 Service Unavailable</td>
                  <td className="py-3 px-4 font-sans text-slate-600">Gmail OAuth credentials not configured on the server.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  ];

  const currentSection = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="border-b border-slate-200 bg-slate-50/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>DEVELOPER DOCUMENTATION</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            PayCore API Reference & Guides
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Everything you need to integrate idempotent payments, refunds, and signed webhooks.
          </p>
        </div>
      </div>

      {/* Docs Body with Left Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3 space-y-1 sticky top-24">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">API Topics</h4>
            {SECTIONS.map((sec) => {
              const isActive = sec.id === activeSection;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{sec.title}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm min-h-[500px]">
            {currentSection.content}
          </main>
        </div>
      </div>
    </div>
  );
};
