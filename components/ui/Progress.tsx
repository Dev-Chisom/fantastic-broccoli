'use client';

import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export default function Progress({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'default',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={clsx('w-full', className)} {...props}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx('w-full overflow-hidden rounded-full bg-white/5', heights[size])}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface StepProgressProps {
  steps: string[];
  shortLabels?: string[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, shortLabels, currentStep, className }: StepProgressProps) {
  const labels = shortLabels && shortLabels.length === steps.length ? shortLabels : steps;

  return (
    <div
      className={clsx('w-full min-w-0', className)}
      role="navigation"
      aria-label="Series setup steps"
    >
      <p className="mb-2 text-xs font-medium text-slate-400 sm:hidden">
        Step {currentStep} of {steps.length}
      </p>
      <div className="w-full min-w-0 -mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:pb-0 [scrollbar-gutter:stable]">
        <div className="flex w-full min-w-0 flex-nowrap items-end gap-0 sm:items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;
            const label = labels[index] ?? step;

            return (
              <div
                key={step}
                className="flex flex-shrink-0 items-center"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-all sm:h-9 sm:w-9',
                      isCompleted &&
                        'border-brand-primary bg-brand-primary text-white',
                      isCurrent &&
                        'border-brand-primary bg-brand-primary/20 text-brand-primary ring-2 ring-brand-primary/20',
                      isPending &&
                        'border-white/10 bg-white/5 text-slate-400'
                    )}
                  >
                    {isCompleted ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={clsx(
                      'mt-1.5 max-w-[4rem] truncate text-center text-[10px] font-medium leading-tight sm:mt-2 sm:max-w-none sm:text-xs',
                      isCompleted || isCurrent ? 'text-slate-200' : 'text-slate-500'
                    )}
                    title={step}
                  >
                    {label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      'mx-0.5 h-0.5 w-3 flex-shrink-0 transition-colors sm:mx-1 sm:h-1 sm:min-w-[12px] sm:w-0 sm:flex-1',
                      isCompleted ? 'bg-brand-primary' : 'bg-white/10'
                    )}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
