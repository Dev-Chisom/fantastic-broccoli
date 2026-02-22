'use client';

import { TOTAL_STEPS } from '@/contexts/CreateSeriesContext';

interface WizardProgressProps {
  step: number;
  totalSteps?: number;
}

export default function WizardProgress({
  step,
  totalSteps = TOTAL_STEPS,
}: WizardProgressProps) {
  const pct = (step / totalSteps) * 100;
  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>Series setup</span>
        <span className="font-medium text-slate-200">
          Step {step} of {totalSteps}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
