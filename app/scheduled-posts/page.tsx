'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { SkeletonPageHeader, SkeletonBlock } from '@/components/ui/Skeleton';
import { scheduledPostsApi, type ScheduledPostItem } from '@/lib/api/scheduled-posts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

function formatScheduledAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function ScheduledPostsContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ScheduledPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    scheduledPostsApi
      .list()
      .then((list) => {
        if (!cancelled) setPosts(list);
      })
      .catch((err) => {
        if (!cancelled) {
          showError(err instanceof Error ? err.message : 'Failed to load scheduled posts');
          setPosts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <AppShell>
      <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Scheduled posts
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Upcoming and past publish schedule by platform.
              </p>
            </div>
            <Link href="/create-series">
              <Button>Create series</Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-6">
              <SkeletonPageHeader />
              <SkeletonBlock rows={5} />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
              <p className="text-slate-400">No scheduled posts.</p>
              <p className="mt-1 text-sm text-slate-500">
                Launch a series to see scheduled episodes here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {(() => {
                const grouped = posts.reduce(
                  (acc, post) => {
                    const key = post.seriesId;
                    if (!acc[key]) acc[key] = { seriesName: post.seriesName, episodes: [] };
                    acc[key].episodes.push(post);
                    return acc;
                  },
                  {} as Record<string, { seriesName: string; episodes: ScheduledPostItem[] }>
                );
                const seriesEntries = Object.entries(grouped).map(([id, { seriesName, episodes }]) => ({
                  seriesId: id,
                  seriesName,
                  episodes: [...episodes].sort(
                    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
                  ),
                }));
                seriesEntries.sort(
                  (a, b) =>
                    new Date(a.episodes[0]?.scheduledAt ?? 0).getTime() -
                    new Date(b.episodes[0]?.scheduledAt ?? 0).getTime()
                );
                return seriesEntries.map(({ seriesId, seriesName, episodes }) => (
                  <section key={seriesId} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                    <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3">
                      <h3 className="font-semibold text-slate-50">{seriesName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {episodes.length} episode{episodes.length !== 1 ? 's' : ''} scheduled
                      </p>
                    </div>
                    <ul className="divide-y divide-white/5">
                      {episodes.map((post) => (
                        <li key={`${post.episodeId}-${post.scheduledAt}`}>
                          <Link
                            href={`/episodes/${post.episodeId}`}
                            className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-50">
                                Episode {post.episodeNumber}
                              </p>
                              <p className="text-xs text-slate-400">
                                Scheduled: {formatScheduledAt(post.scheduledAt)}
                              </p>
                            </div>
                            <span className="text-xs text-slate-400">View episode →</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ));
              })()}
            </div>
          )}
        </div>
    </AppShell>
  );
}

export default function ScheduledPostsPage() {
  return (
    <ProtectedRoute>
      <ScheduledPostsContent />
    </ProtectedRoute>
  );
}
