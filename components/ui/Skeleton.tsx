'use client';

import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-pulse rounded-lg bg-white/10 ${className ?? ''}`}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-2 h-8 w-16" />
    </div>
  );
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <Skeleton className="h-4 w-full" style={{ maxWidth: i === 0 ? 48 : undefined }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonContentCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface p-6">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mb-4 h-4 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function SkeletonPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  );
}

export function SkeletonFilters() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Skeleton className="h-10 flex-1 rounded-xl" />
      <Skeleton className="h-10 w-36 rounded-xl" />
    </div>
  );
}

export function SkeletonBlock({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/5 bg-surface p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
