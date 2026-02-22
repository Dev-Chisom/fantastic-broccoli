'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown';
import { SkeletonPageHeader, SkeletonFilters, SkeletonContentCard } from '@/components/ui/Skeleton';
import { seriesApi, type Series } from '@/lib/api/series';
import { useToast } from '@/contexts/ToastContext';

function SeriesListContent() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { error: showError } = useToast();

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const data = await seriesApi.list();
      setSeries(data);
    } catch (err: any) {
      showError(err.message || 'Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  const filteredSeries = series.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: DropdownOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Completed', value: 'completed' },
  ];

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
          <SkeletonPageHeader />
          <SkeletonFilters />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonContentCard key={i} />
            ))}
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
            <h1 className="text-2xl font-semibold text-slate-50">Series</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your video series</p>
          </div>
          <Link href="/create-series">
            <Button>Create Series</Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dropdown
            options={statusOptions}
            onSelect={(value) => setStatusFilter(value)}
            trigger={
              <Button variant="secondary">
                Status:{' '}
                {statusOptions.find(
                  (o): o is Extract<DropdownOption, { label: string; value: string }> =>
                    'value' in o && o.value === statusFilter
                )?.label || 'All'}
              </Button>
            }
          />
        </div>

        {filteredSeries.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-surface p-12 text-center">
            <p className="text-slate-400">
              {searchQuery || statusFilter !== 'all'
                ? 'No series match your filters.'
                : 'No series yet. Create your first one to get started!'}
            </p>
            <Link href="/create-series" className="mt-4 inline-block">
              <Button>Create Series</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSeries.map((s) => (
              <Link key={s.id} href={`/series/${s.id}`}>
                <Card className="h-full p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-semibold text-slate-50">{s.name}</h3>
                    <Badge variant={getStatusBadgeVariant(s.status)}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="mb-4 text-sm text-slate-400">{s.contentType}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{s.episodeCount} episodes</span>
                    <span>{new Date(s.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function SeriesListPage() {
  return (
    <ProtectedRoute>
      <SeriesListContent />
    </ProtectedRoute>
  );
}
