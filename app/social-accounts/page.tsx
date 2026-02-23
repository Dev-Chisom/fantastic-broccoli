'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import ConnectAccountModal from '@/components/social/ConnectAccountModal';
import { SkeletonPageHeader, SkeletonBlock } from '@/components/ui/Skeleton';
import { socialApi, type SocialProviderResponse, type SocialAccountResponse } from '@/lib/api/social';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

const PLATFORM_ICONS: Record<string, string> = {
  tiktok: '♪',
  instagram: '📷',
  youtube: '▶',
  facebook: 'f',
};

function SocialAccountsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<SocialProviderResponse[]>([]);
  const [accounts, setAccounts] = useState<SocialAccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const { error: showError, success: showSuccess } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [providersList, accountsList] = await Promise.all([
        socialApi.getProviders(),
        socialApi.getAccounts(),
      ]);
      setProviders(providersList);
      setAccounts(accountsList);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load social accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (!errorParam) return;

    let decoded = errorParam;
    try {
      decoded = decodeURIComponent(errorParam);
    } catch {
      // ignore decode errors and fall back to raw value
    }

    // Try to extract a nested "message" field if present in a JSON-like payload
    const messageMatch = decoded.match(/"message"\s*:\s*"([^"]+)"/);
    let message = messageMatch?.[1] ?? decoded;

    if (decoded.includes('YouTube Data API v3')) {
      message =
        'YouTube Data API v3 is not enabled for your Google project. Enable it in Google Cloud Console (APIs & Services → Library → YouTube Data API v3) and try again.';
    }

    showError(message);
  }, [searchParams, showError]);

  const handleDisconnect = async (id: string) => {
    if (!confirm('Disconnect this account?')) return;
    try {
      await socialApi.deleteAccount(id);
      showSuccess('Account disconnected');
      loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to disconnect');
    }
  };

  const handleToggleStatus = async (acc: SocialAccountResponse) => {
    const newStatus = acc.status === 'connected' ? 'paused' : 'connected';
    try {
      setPatchingId(acc.id);
      await socialApi.patchAccount(acc.id, { status: newStatus });
      showSuccess(newStatus === 'connected' ? 'Account enabled' : 'Account paused');
      loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setPatchingId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Social accounts
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage connected platforms for auto-posting.
              </p>
            </div>
            <Button onClick={() => setConnectModalOpen(true)}>Connect account</Button>
          </div>

          {loading ? (
            <div className="space-y-6">
              <SkeletonPageHeader />
              <SkeletonBlock rows={4} />
            </div>
          ) : accounts.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
              <p className="text-slate-400">No accounts connected.</p>
              <p className="mt-1 text-sm text-slate-500">
                Connect TikTok, Instagram, YouTube, or Facebook to auto-post your videos.
              </p>
              <Button className="mt-4" onClick={() => setConnectModalOpen(true)}>
                Connect your first account
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {accounts.map((acc) => (
                <li
                  key={acc.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {PLATFORM_ICONS[acc.platform.toLowerCase()] ?? '•'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-50">
                        {acc.displayName || acc.platform}
                      </p>
                      {acc.username && (
                        <p className="text-xs text-slate-400">{acc.username}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs ${
                        acc.status === 'connected' ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {acc.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={patchingId === acc.id}
                      onClick={() => handleToggleStatus(acc)}
                    >
                      {acc.status === 'connected' ? 'Pause' : 'Enable'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-error"
                      onClick={() => handleDisconnect(acc.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ConnectAccountModal
          open={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
          providers={providers}
          onConnected={loadData}
        />
    </AppShell>
  );
}

export default function SocialAccountsPage() {
  return (
    <ProtectedRoute>
      <SocialAccountsContent />
    </ProtectedRoute>
  );
}
