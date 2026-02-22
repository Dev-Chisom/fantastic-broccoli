'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonPageHeader, SkeletonCard, SkeletonBlock } from '@/components/ui/Skeleton';
import { workspacesApi, type CreditTransactionItem } from '@/lib/api/workspaces';
import { useToast } from '@/contexts/ToastContext';

function ReferralCreditsContent() {
  const { workspace } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    if (!workspace?.id) return;
    let cancelled = false;
    setLoading(true);
    workspacesApi
      .getCreditTransactions(workspace.id, { limit: 50 })
      .then((list) => {
        if (!cancelled) setTransactions(list);
      })
      .catch((err) => {
        if (!cancelled) {
          showError(err instanceof Error ? err.message : 'Failed to load history');
          setTransactions([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [workspace?.id]);

  const balance = workspace?.creditsBalance ?? 0;
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/ref/abc123`
    : 'https://app.aiseries.studio/ref/abc123';

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink);
  };

  return (
    <AppShell>
      <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Referral & credits
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Earn credits by inviting friends. Manage your balance.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-sm font-medium text-slate-200">Your balance</h2>
              <p className="mt-2 text-3xl font-semibold text-emerald-400">
                {balance.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-500">credits</p>
              <Link href="/billing-plans" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">
                  Get more credits
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-sm font-medium text-slate-200">Invite friends</h2>
              <p className="mt-2 text-sm text-slate-400">
                Share your link. You and your friend get bonus credits when they sign up.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400"
                />
                <Button size="sm" onClick={copyLink}>
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-sm font-medium text-slate-200">Credit history</h2>
            {loading ? (
              <div className="mt-4 space-y-3">
                <SkeletonBlock rows={5} />
              </div>
            ) : transactions.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No transactions yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {transactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-300">
                      {tx.type}
                      {tx.reason ? ` · ${tx.reason}` : ''}
                    </span>
                    <span className={tx.amount >= 0 ? 'text-emerald-400' : 'text-slate-400'}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
    </AppShell>
  );
}

export default function ReferralCreditsPage() {
  return (
    <ProtectedRoute>
      <ReferralCreditsContent />
    </ProtectedRoute>
  );
}
