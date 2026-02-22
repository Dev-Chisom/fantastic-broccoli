'use client';

import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export default function Card({ selected, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'group relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all duration-200',
        'border-white/5 bg-white/[0.02] hover:border-violet-500/50 hover:bg-white/[0.04]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        selected &&
          'border-violet-500/70 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.4)]',
        className
      )}
      {...props}
    />
  );
}
