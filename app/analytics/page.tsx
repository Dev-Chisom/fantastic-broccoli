'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import Card from '@/components/ui/Card';
import { SkeletonCard, Skeleton } from '@/components/ui/Skeleton';
import { analyticsApi } from '@/lib/api/analytics';
import { useToast } from '@/contexts/ToastContext';

function AnalyticsContent() {
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof analyticsApi.getOverview>> | null>(null);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    analyticsApi
      .getOverview()
      .then((data) => {
        if (!cancelled) setOverview(data);
      })
      .catch((err) => {
        if (!cancelled) showError(err instanceof Error ? err.message : 'Failed to load analytics');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const avgViews = overview && overview.totalEpisodes > 0
    ? Math.round(overview.totalViews / overview.totalEpisodes)
    : 0;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Analytics</h1>
            <p className="mt-1 text-sm text-slate-400">
              Performance and engagement across series and platforms.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <Card className="p-4">
                <p className="text-xs text-slate-400">Total Views</p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  {(overview?.totalViews ?? 0).toLocaleString()}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-slate-400">Total Episodes</p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  {(overview?.totalEpisodes ?? 0).toLocaleString()}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-slate-400">Active Series</p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  {(overview?.activeSeries ?? 0).toLocaleString()}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-slate-400">Credits used this month</p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  {(overview?.creditsUsedThisMonth ?? 0).toLocaleString()}
                </p>
              </Card>
            </>
          )}
        </div>

        {loading ? (
          <SkeletonCard />
        ) : (
          <Card className="p-4">
            <p className="text-xs text-slate-400">Avg. views per episode</p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">
              {avgViews.toLocaleString()}
            </p>
          </Card>
        )}

        <Card className="p-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <p className="text-center text-slate-400">
              Connect accounts and publish episodes to see detailed analytics charts.
            </p>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
