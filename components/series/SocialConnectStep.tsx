'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import WizardLayout from '@/components/wizard/WizardLayout';
import Modal from '@/components/ui/Modal';
import ConnectAccountModal from '@/components/social/ConnectAccountModal';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import { socialApi, type SocialProviderResponse, type SocialAccountResponse } from '@/lib/api/social';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/contexts/ToastContext';

const PLATFORM_ICONS: Record<string, string> = {
  tiktok: '♪',
  instagram: '📷',
  youtube: '▶',
  facebook: 'f',
};

export default function SocialConnectStep() {
  const { state, update, stepErrors } = useCreateSeries();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [providers, setProviders] = useState<SocialProviderResponse[]>([]);
  const [accounts, setAccounts] = useState<SocialAccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  const accountError = stepErrors?.connectedAccountIds;

  const loadData = async () => {
    try {
      setLoading(true);
      const [providersList, accountsList] = await Promise.all([
        socialApi.getProviders(),
        socialApi.getAccounts(),
      ]);
      setProviders(providersList);
      setAccounts(accountsList);
      update('connectedAccountIds', accountsList.filter((a) => a.status === 'connected').map((a) => a.id));
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load social data');
      setProviders([]);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const connectedIds = state.connectedAccountIds || [];

  return (
    <WizardLayout
      title="Connect Your Social Platforms"
      description="Auto-post your generated videos to the platforms you choose."
    >
      <div className="space-y-6">
        {accountError && (
          <p className="text-sm text-rose-400" role="alert">
            {accountError}
          </p>
        )}
        <Button onClick={() => setConnectModalOpen(true)} className="w-full sm:w-auto">
          Connect account
        </Button>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <h4 className="mb-3 text-sm font-medium text-slate-200">Connected accounts</h4>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : accounts.length === 0 ? (
            <p className="text-sm text-slate-500">
              No accounts connected yet. Connect at least one to enable auto-posting.
            </p>
          ) : (
            <ul className="space-y-2">
              {accounts.map((acc) => (
                <li
                  key={acc.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {PLATFORM_ICONS[acc.platform.toLowerCase()] ?? '•'}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-slate-50">
                        {acc.displayName || acc.platform}
                      </span>
                      {acc.username && (
                        <span className="ml-2 text-xs text-slate-400">{acc.username}</span>
                      )}
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {acc.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Connect multiple accounts per platform on Pro+ plans.
        </p>
      </div>

      <ConnectAccountModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        providers={providers}
        onConnected={loadData}
      />
    </WizardLayout>
  );
}
