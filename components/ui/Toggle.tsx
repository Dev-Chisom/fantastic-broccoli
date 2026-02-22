'use client';

import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export default function Toggle({
  checked,
  onCheckedChange,
  label,
  description,
  className,
  ...props
}: ToggleProps) {
  return (
    <div className={clsx('flex items-center justify-between gap-4', className)}>
      {(label ?? description) && (
        <div>
          {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
          {description && (
            <p className="mt-0.5 text-xs text-slate-400">{description}</p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          checked
            ? 'border-violet-500/60 bg-violet-500/80'
            : 'border-white/10 bg-white/5'
        )}
        {...props}
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}
