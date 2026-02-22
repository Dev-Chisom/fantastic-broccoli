'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { seriesApi, type Series } from '@/lib/api/series';
import { useToast } from '@/contexts/ToastContext';

function SeriesDetailContent() {
  const params = useParams();
  const seriesId = params.id as string;
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { error: showError } = useToast();

  useEffect(() => {
    loadSeries();
  }, [seriesId]);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const data = await seriesApi.get(seriesId);
      setSeries(data);
    } catch (err: any) {
      showError(err.message || 'Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: Series['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <div className="flex gap-2 border-b border-white/5 pb-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
          <div className="rounded-2xl border border-white/5 bg-surface p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!series) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/5 bg-surface p-12 text-center">
          <p className="text-slate-400">Series not found</p>
          <Link href="/series" className="mt-4 inline-block">
            <Button>Back to Series</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link href="/series" className="text-sm text-slate-400 hover:text-slate-300">
                Series
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-sm text-slate-300">{series.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-50">{series.name}</h1>
              <Badge variant={getStatusBadgeVariant(series.status)}>
                {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/series/${seriesId}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            {series.status === 'active' ? (
              <Button variant="secondary">Pause</Button>
            ) : series.status === 'paused' ? (
              <Button variant="secondary">Resume</Button>
            ) : null}
          </div>
        </div>

        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'episodes', label: 'Episodes' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="mb-4 font-semibold text-slate-50">Series Information</h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-slate-400">Content Type</dt>
                    <dd className="mt-1 text-sm text-slate-200">{series.contentType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-400">Episodes</dt>
                    <dd className="mt-1 text-sm text-slate-200">{series.episodeCount}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-400">Created</dt>
                    <dd className="mt-1 text-sm text-slate-200">
                      {new Date(series.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-400">Last Updated</dt>
                    <dd className="mt-1 text-sm text-slate-200">
                      {new Date(series.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </Card>

              {series.scriptPreferences && (
                <Card className="p-6">
                  <h2 className="mb-4 font-semibold text-slate-50">Configuration Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-400">Tone: </span>
                      <span className="text-slate-200">{series.scriptPreferences.tone}</span>
                    </div>
                    {series.voiceId && (
                      <div>
                        <span className="text-slate-400">Voice: </span>
                        <span className="text-slate-200">{series.voiceId}</span>
                      </div>
                    )}
                    {series.musicId && (
                      <div>
                        <span className="text-slate-400">Music: </span>
                        <span className="text-slate-200">{series.musicId}</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'episodes' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-slate-50">Episodes</h2>
                <Link href={`/episodes?seriesId=${seriesId}`}>
                  <Button variant="secondary" size="sm">
                    View All Episodes
                  </Button>
                </Link>
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface p-12 text-center">
                <p className="text-slate-400">No episodes yet. Episodes will appear here once generated.</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="mb-4 font-semibold text-slate-50">Analytics</h2>
              <div className="rounded-2xl border border-white/5 bg-surface p-12 text-center">
                <p className="text-slate-400">Analytics data will appear here once episodes are published.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="mb-4 font-semibold text-slate-50">Settings</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-50">Series Configuration</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Edit series settings and configuration
                    </p>
                    <Link href={`/series/${seriesId}/edit`} className="mt-2 inline-block">
                      <Button variant="secondary" size="sm">
                        Edit Configuration
                      </Button>
                    </Link>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <h3 className="font-medium text-red-400">Danger Zone</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Permanently delete this series and all its episodes
                    </p>
                    <Button variant="secondary" size="sm" className="mt-2 border-error/50 text-error hover:bg-error/10">
                      Delete Series
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function SeriesDetailPage() {
  return (
    <ProtectedRoute>
      <SeriesDetailContent />
    </ProtectedRoute>
  );
}
