import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  children,
  ...props
}: Props) {
  const base =
    'inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed';

  const variants: Record<Variant, string> = {
    primary:
      'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-[0_18px_45px_rgba(88,28,135,0.5)] hover:brightness-110',
    secondary:
      'bg-surface text-slate-100 border border-white/5 hover:border-violet-500/60 hover:bg-white/5',
    ghost: 'bg-transparent text-slate-300 hover:bg-white/5'
  };

  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm'
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}

