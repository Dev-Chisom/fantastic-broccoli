'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { analyticsApi } from '@/lib/api/analytics';

function DashboardContent() {
  const { user, workspace } = useAuth();
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof analyticsApi.getOverview>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    analyticsApi
      .getOverview()
      .then((data) => {
        if (!cancelled) setOverview(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = {
    totalSeries: overview?.activeSeries ?? 0,
    totalEpisodes: overview?.totalEpisodes ?? 0,
    creditsRemaining: workspace?.creditsBalance ?? 0,
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-2xl border border-white/5 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/5 to-brand-tertiary/5 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Launch faceless short-form video series that auto-post to your social platforms.
              </p>
            </div>
            <Link href="/create-series">
              <Button>Create new series</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-white/5 bg-surface p-4">
                <div className="text-xs text-slate-400">Total Series</div>
                <div className="mt-2 text-2xl font-semibold">{stats.totalSeries}</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-4">
                <div className="text-xs text-slate-400">Total Episodes</div>
                <div className="mt-2 text-2xl font-semibold">{stats.totalEpisodes}</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Credits Remaining</div>
                    <div className="mt-2 text-2xl font-semibold text-success">
                      {stats.creditsRemaining.toLocaleString()}
                    </div>
                  </div>
              {workspace && (
                <Badge variant={workspace.plan === 'pro' ? 'pro' : 'free'}>
                  {workspace.plan === 'pro' ? 'Pro' : workspace.plan === 'scale' ? 'Scale' : 'Free'}
                </Badge>
              )}
                </div>
                {workspace && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary"
                      style={{ width: '67%' }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-50">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/create-series">
              <div className="rounded-2xl border border-white/5 bg-surface p-6 transition-all hover:border-brand-primary/50 hover:bg-white/5">
                <div className="mb-2 text-2xl">🎬</div>
                <h3 className="font-semibold text-slate-50">Create Series</h3>
                <p className="mt-1 text-sm text-slate-400">Start a new automated video series</p>
              </div>
            </Link>
            <Link href="/social-accounts">
              <div className="rounded-2xl border border-white/5 bg-surface p-6 transition-all hover:border-brand-primary/50 hover:bg-white/5">
                <div className="mb-2 text-2xl">🔗</div>
                <h3 className="font-semibold text-slate-50">Connect Social Account</h3>
                <p className="mt-1 text-sm text-slate-400">Link your social media platforms</p>
              </div>
            </Link>
            <Link href="/analytics">
              <div className="rounded-2xl border border-white/5 bg-surface p-6 transition-all hover:border-brand-primary/50 hover:bg-white/5">
                <div className="mb-2 text-2xl">📊</div>
                <h3 className="font-semibold text-slate-50">View Analytics</h3>
                <p className="mt-1 text-sm text-slate-400">Track your series performance</p>
              </div>
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">Your Series</h2>
            <Link href="/series">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>
          <div className="rounded-2xl border border-white/5 bg-surface p-12 text-center">
            <p className="text-slate-400">No series yet. Create your first one to get started!</p>
            <Link href="/create-series" className="mt-4 inline-block">
              <Button>Create Series</Button>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

