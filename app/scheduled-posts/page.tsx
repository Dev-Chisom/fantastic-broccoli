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
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={`${post.episodeId}-${post.scheduledAt}`}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-50">
                      {post.seriesName} · Episode {post.episodeNumber}
                    </p>
                    <p className="text-xs text-slate-400">
                      Scheduled: {formatScheduledAt(post.scheduledAt)}
                    </p>
                  </div>
                  <Link href={`/episodes/${post.episodeId}`}>
                    <Button variant="ghost" size="sm">
                      View episode
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
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
