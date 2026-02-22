'use client';

import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  minLabel?: string;
  maxLabel?: string;
}

export default function Slider({
  label,
  minLabel,
  maxLabel,
  className,
  ...props
}: SliderProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">{label}</span>
          {(minLabel ?? maxLabel) && (
            <span className="text-slate-500">
              {minLabel}
              {minLabel && maxLabel ? ' · ' : ''}
              {maxLabel}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        className={clsx(
          'h-2 w-full appearance-none rounded-full bg-white/10 accent-violet-500',
          '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-violet-500 [&::-webkit-slider-thumb]:to-fuchsia-500 [&::-webkit-slider-thumb]:shadow-md',
          '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-violet-500',
          className
        )}
        {...props}
      />
    </div>
  );
}
