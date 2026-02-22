'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { assetsApi, type AssetResponse } from '@/lib/api/assets';
import { musicApi } from '@/lib/api/music';
import { SkeletonPageHeader, SkeletonBlock, Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

function formatDuration(seconds?: number): string {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function ContentLibraryContent() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { error: showError, success: showSuccess } = useToast();

  const loadData = useCallback(() => {
    const params: { type?: string } = {};
    if (typeFilter) params.type = typeFilter;
    setLoading(true);
    assetsApi
      .list(params)
      .then(setAssets)
      .catch((err) => {
        showError(err instanceof Error ? err.message : 'Failed to load assets');
        setAssets([]);
      })
      .finally(() => setLoading(false));
  }, [typeFilter, showError]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, loadData]);

  const handleDeleteMusic = async (id: string) => {
    if (!confirm('Remove this track from your library?')) return;
    try {
      setDeletingId(id);
      await musicApi.delete(id);
      showSuccess('Track removed');
      loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Content library
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                All generated videos and episodes across your series.
              </p>
            </div>
            <Link href="/create-series">
              <Button>Create series</Button>
            </Link>
          </div>

          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-100"
            >
              <option value="">All types</option>
              <option value="music">Music</option>
              <option value="video">Video</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-6">
              <SkeletonPageHeader />
              <Skeleton className="h-10 w-40 rounded-xl" />
              <SkeletonBlock rows={6} />
            </div>
          ) : assets.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
              <p className="text-slate-400">No content yet.</p>
              <p className="mt-1 text-sm text-slate-500">
                Create a series to start generating videos.
              </p>
              <Link href="/create-series" className="mt-4 inline-block">
                <Button variant="secondary">Create your first series</Button>
              </Link>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <li
                  key={asset.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <p className="text-xs text-slate-500 uppercase">{asset.type}</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">{asset.source}</p>
                  {asset.durationSeconds != null && (
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDuration(asset.durationSeconds)}
                    </p>
                  )}
                  <div className="mt-2 flex gap-2">
                    {asset.url && (
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-primary hover:underline"
                      >
                        Open
                      </a>
                    )}
                    {asset.type === 'music' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMusic(asset.id)}
                        disabled={deletingId === asset.id}
                        className="text-xs text-slate-400 hover:text-error disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>
    </AppShell>
  );
}

export default function ContentLibraryPage() {
  return (
    <ProtectedRoute>
      <ContentLibraryContent />
    </ProtectedRoute>
  );
}
