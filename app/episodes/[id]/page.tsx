'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { episodesApi, type Episode } from '@/lib/api/episodes';
import { useToast } from '@/contexts/ToastContext';

function EpisodeDetailContent() {
  const params = useParams();
  const episodeId = params.id as string;
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  useEffect(() => {
    loadEpisode();
  }, [episodeId]);

  const loadEpisode = async () => {
    try {
      setLoading(true);
      const data = await episodesApi.get(episodeId);
      setEpisode(data);
    } catch (err: any) {
      showError(err.message || 'Failed to load episode');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async () => {
    if (!episode) return;
    try {
      setPublishing(true);
      await episodesApi.publishNow(episodeId);
      showSuccess('Episode published successfully!');
      await loadEpisode();
    } catch (err: any) {
      showError(err.message || 'Failed to publish episode');
    } finally {
      setPublishing(false);
    }
  };

  const getStatusBadgeVariant = (status: Episode['status']) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'ready':
        return 'info';
      case 'generating':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="rounded-2xl border border-white/5 bg-surface p-6 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!episode) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/5 bg-surface p-12 text-center">
          <p className="text-slate-400">Episode not found</p>
          <Link href="/episodes" className="mt-4 inline-block">
            <Button>Back to Episodes</Button>
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
              <Link href="/episodes" className="text-sm text-slate-400 hover:text-slate-300">
                Episodes
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-sm text-slate-300">Episode #{episode.episodeNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-50">{episode.title}</h1>
              <Badge variant={getStatusBadgeVariant(episode.status)}>
                {episode.status.charAt(0).toUpperCase() + episode.status.slice(1)}
              </Badge>
            </div>
          </div>
          {episode.status === 'ready' && (
            <Button onClick={handlePublishNow} loading={publishing} disabled={publishing}>
              Publish Now
            </Button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-slate-50">Video Preview</h2>
              {episode.videoUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <video src={episode.videoUrl} controls className="h-full w-full" />
                </div>
              ) : episode.status === 'generating' ? (
                <div className="aspect-video flex items-center justify-center rounded-lg bg-white/5">
                  <div className="text-center">
                    <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-brand-primary"></div>
                    <p className="text-sm text-slate-400">Generating video...</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center rounded-lg bg-white/5">
                  <p className="text-sm text-slate-400">Video not available</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-slate-50">Script</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(episode.script);
                    showSuccess('Script copied to clipboard!');
                  }}
                >
                  Copy
                </Button>
              </div>
              <div className="whitespace-pre-wrap rounded-lg bg-white/5 p-4 text-sm text-slate-300">
                {episode.script}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-slate-50">Episode Information</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-400">Series</dt>
                  <dd className="mt-1">
                    <Link
                      href={`/series/${episode.seriesId}`}
                      className="text-brand-primary hover:text-brand-secondary"
                    >
                      {episode.seriesName || 'Unknown'}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Episode Number</dt>
                  <dd className="mt-1 text-slate-200">#{episode.episodeNumber}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Created</dt>
                  <dd className="mt-1 text-slate-200">
                    {new Date(episode.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                {episode.publishedAt && (
                  <div>
                    <dt className="text-slate-400">Published</dt>
                    <dd className="mt-1 text-slate-200">
                      {new Date(episode.publishedAt).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </Card>

            {episode.publishedPlatforms && episode.publishedPlatforms.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 font-semibold text-slate-50">Published Platforms</h2>
                <div className="flex flex-wrap gap-2">
                  {episode.publishedPlatforms.map((platform) => (
                    <Badge key={platform} variant="info">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {(episode.views != null || episode.engagement != null) && (
              <Card className="p-6">
                <h2 className="mb-4 font-semibold text-slate-50">Analytics</h2>
                <dl className="space-y-3 text-sm">
                  {episode.views != null && (
                    <div>
                      <dt className="text-slate-400">Views</dt>
                      <dd className="mt-1 text-xl font-semibold text-slate-200">
                        {(episode.views ?? 0).toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {episode.engagement != null && (
                    <div>
                      <dt className="text-slate-400">Engagement</dt>
                      <dd className="mt-1 text-xl font-semibold text-slate-200">
                        {(episode.engagement ?? 0).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function EpisodeDetailPage() {
  return (
    <ProtectedRoute>
      <EpisodeDetailContent />
    </ProtectedRoute>
  );
}
