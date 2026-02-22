'use client';

import clsx from 'clsx';
import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
}

export default function Input({
  label,
  error,
  className,
  id,
  labelProps,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-400"
          {...labelProps}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500',
          'focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40',
          'transition-colors',
          error && 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/40',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
