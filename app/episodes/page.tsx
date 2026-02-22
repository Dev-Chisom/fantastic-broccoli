'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { SkeletonPageHeader, SkeletonFilters, Skeleton, SkeletonRow } from '@/components/ui/Skeleton';
import { episodesApi, type Episode } from '@/lib/api/episodes';
import { useToast } from '@/contexts/ToastContext';

function EpisodesListContent() {
  const searchParams = useSearchParams();
  const seriesId = searchParams.get('seriesId') || undefined;
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { error: showError } = useToast();

  useEffect(() => {
    loadEpisodes();
  }, [seriesId]);

  const loadEpisodes = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (seriesId) filters.seriesId = seriesId;
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (searchQuery) filters.search = searchQuery;
      const data = await episodesApi.list(filters);
      setEpisodes(data);
    } catch (err: any) {
      showError(err.message || 'Failed to load episodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEpisodes();
  }, [statusFilter, searchQuery]);

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
          <SkeletonPageHeader />
          <SkeletonFilters />
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Episode', 'Series', 'Title', 'Status', 'Published', 'Views', 'Actions'].map((h) => (
                    <th key={h} className="py-3 pr-4 text-left text-xs font-medium text-slate-400">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonRow key={i} cols={7} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">Episodes</h1>
            <p className="mt-1 text-sm text-slate-400">View and manage your episodes</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-100 focus:border-brand-primary/60 focus:outline-none focus:ring-1 focus:ring-brand-primary/40"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="generating">Generating</option>
            <option value="ready">Ready</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {episodes.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-surface p-12 text-center">
            <p className="text-slate-400">No episodes found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Episode</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes.map((episode) => (
                <TableRow key={episode.id}>
                  <TableCell>#{episode.episodeNumber}</TableCell>
                  <TableCell>
                    <Link
                      href={`/series/${episode.seriesId}`}
                      className="text-brand-primary hover:text-brand-secondary"
                    >
                      {episode.seriesName || 'Unknown'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{episode.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(episode.status)}>
                      {episode.status.charAt(0).toUpperCase() + episode.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {episode.publishedAt
                      ? new Date(episode.publishedAt).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>{episode.views?.toLocaleString() || '-'}</TableCell>
                  <TableCell>
                    <Link href={`/episodes/${episode.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AppShell>
  );
}

export default function EpisodesListPage() {
  return (
    <ProtectedRoute>
      <EpisodesListContent />
    </ProtectedRoute>
  );
}
