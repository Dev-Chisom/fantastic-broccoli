'use client';

import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

type StatusVariant = 'success' | 'warning' | 'error' | 'info';
type PlanVariant = 'free' | 'pro';
type BadgeVariant = StatusVariant | PlanVariant | 'default' | 'count' | 'premium';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium';
  
  const variants: Record<BadgeVariant, string> = {
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
    info: 'bg-info/20 text-info border border-info/30',
    free: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    pro: 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-brand-primary border border-brand-primary/30',
    premium:
      'bg-gradient-to-r from-amber-500/15 to-yellow-500/15 text-amber-300 border border-amber-500/30',
    default: 'bg-white/10 text-slate-300 border border-white/10',
    count: 'bg-brand-primary text-white border border-brand-primary',
  };

  return (
    <span
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
