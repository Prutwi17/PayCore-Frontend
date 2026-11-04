import React, { useState, useEffect } from 'react';
import { apiKeyService } from '@/services/api/apiKeyService';
import { ApiKeyItem, ApiKeyCreatedResponse } from '@/types/auth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Info,
  Calendar,
  Lock,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const MerchantApiKeysPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate Key Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyEnv, setKeyEnv] = useState<'TEST' | 'LIVE'>('LIVE');
  const [keyDescription, setKeyDescription] = useState('');

  // Key Created Success Modal State
  const [createdKeyData, setCreatedKeyData] = useState<ApiKeyCreatedResponse | null>(null);
  const [hasCopiedSecret, setHasCopiedSecret] = useState(false);

  // Revoke Key Confirmation State
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyItem | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiKeyService.listApiKeys();
      setKeys(data);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to load merchant API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const result = await apiKeyService.generateApiKey({
        environment: keyEnv,
        description: keyDescription.trim() || undefined,
      });
      setIsGenerateModalOpen(false);
      setKeyDescription('');
      setCreatedKeyData(result);
      setHasCopiedSecret(false);
      await loadKeys();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to generate new API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySecret = () => {
    if (createdKeyData?.secretKey) {
      navigator.clipboard.writeText(createdKeyData.secretKey);
      setHasCopiedSecret(true);
      setTimeout(() => setHasCopiedSecret(false), 2500);
    }
  };

  const handleRevokeKey = async () => {
    if (!keyToRevoke) return;

    setIsRevoking(true);
    try {
      await apiKeyService.revokeApiKey(keyToRevoke.id);
      setKeyToRevoke(null);
      await loadKeys();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to revoke API key');
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-blue-600" />
            API Keys & Credentials
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and manage cryptographic API keys to authenticate server-to-server requests
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Key</span>
        </Button>
      </div>

      {/* Security Guidance Callout */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-xl flex items-start space-x-4 shadow-sm">
        <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-semibold text-white block text-sm">Security Best Practices</span>
          <p className="text-slate-300 leading-relaxed">
            API keys carry full payment initiation and query privileges for your merchant account. Never commit secret keys to public repositories or bundle them in mobile/web frontend applications. Use environment variables on secure servers.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-3 text-rose-700 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* API Keys Table Card */}
      <Card className="overflow-hidden border-slate-200 bg-white">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Active & Historic Credentials
          </h2>
          <span className="text-xs text-slate-400 font-medium">{keys.length} total keys</span>
        </div>

        {isLoading ? (
          <div className="py-12">
            <PageLoading message="Fetching API key registry..." />
          </div>
        ) : keys.length === 0 ? (
          <div className="py-16 text-center">
            <KeyRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No API keys generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Create your first secret key to authenticate integration requests against the PayCore Payment Gateway.
            </p>
            <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Generate API Key
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Key Prefix</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Environment</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created</th>
                  <th className="px-4 py-3.5">Revoked</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {keys.map((key) => {
                  const isRevoked = key.status === 'REVOKED';
                  return (
                    <tr key={key.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">
                        <div className="flex items-center space-x-2">
                          <code className="bg-slate-100 px-2 py-1 rounded text-slate-800 border border-slate-200">
                            {key.keyPrefix}••••••••
                          </code>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-medium">
                        {key.keyType}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            key.environment === 'LIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {key.environment}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {isRevoked ? (
                          <Badge variant="neutral">REVOKED</Badge>
                        ) : (
                          <Badge variant="success">ACTIVE</Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{key.createdAt ? new Date(key.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {key.revokedAt ? (
                          <span className="text-rose-600 font-medium">
                            {new Date(key.revokedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isRevoked ? (
                          <button
                            type="button"
                            onClick={() => setKeyToRevoke(key)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Revoked</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Generate Key Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                Generate New API Key
              </h3>
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setKeyEnv('LIVE')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                      keyEnv === 'LIVE'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    LIVE Environment
                  </button>
                  <button
                    type="button"
                    onClick={() => setKeyEnv('TEST')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                      keyEnv === 'TEST'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    TEST Sandbox
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description / Service Name (Optional)
                </label>
                <input
                  type="text"
                  value={keyDescription}
                  onChange={(e) => setKeyDescription(e.target.value)}
                  placeholder="e.g. Primary Backend Checkout Service"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2 text-amber-800 text-xs">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <span>
                  The full secret key will be revealed only once upon creation. Ensure you copy and store it securely.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Create Key'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Secret Key Revealed Modal (Strictly Once) */}
      {createdKeyData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl space-y-5 border-amber-400">
            <div className="flex items-center space-x-3 text-emerald-600 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">API Key Created Successfully</h3>
                <p className="text-xs text-slate-500">Copy your secret key immediately</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-rose-900">
              <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-rose-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Important Security Warning</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                {createdKeyData.warningMessage || 'Save this secret key now. For your security, PayCore stores only a cryptographic SHA-256 hash and cannot show this value again.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Secret Key
              </label>
              <div className="flex items-center justify-between p-3 bg-slate-900 text-slate-100 rounded-lg border border-slate-800">
                <code className="text-xs font-mono font-bold break-all text-blue-300">
                  {createdKeyData.secretKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="ml-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex-shrink-0 flex items-center space-x-1 text-xs font-semibold"
                  title="Copy Secret Key"
                >
                  {hasCopiedSecret ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setCreatedKeyData(null)}
                className="w-full sm:w-auto"
              >
                I Have Saved My Secret Key
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Revoke Key Confirmation Modal */}
      {keyToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl space-y-5">
            <div className="flex items-start space-x-3 text-rose-600 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Revoke API Key</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is permanent and immediate</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to revoke key prefix{' '}
              <code className="font-mono font-bold text-slate-800 bg-slate-100 px-1 py-0.5 rounded">
                {keyToRevoke.keyPrefix}••••
              </code>
              ? Any services or external systems using this key will immediately fail authentication.
            </p>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setKeyToRevoke(null)}
                disabled={isRevoking}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleRevokeKey}
                isLoading={isRevoking}
              >
                {isRevoking ? 'Revoking...' : 'Confirm Revocation'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
