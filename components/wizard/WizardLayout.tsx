'use client';

import WizardFooter from './WizardFooter';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import { TOTAL_STEPS } from '@/contexts/CreateSeriesContext';

interface WizardLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function WizardLayout({
  title,
  description,
  children,
}: WizardLayoutProps) {
  const { step, nextStep, prevStep, state } = useCreateSeries();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <span className="text-xs text-slate-400">Autosaved · Draft</span>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.5)] backdrop-blur sm:rounded-3xl sm:p-6 lg:p-8">
        <header className="mb-4 space-y-1 sm:mb-6 sm:space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl lg:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-xl text-sm text-slate-400">{description}</p>
          )}
        </header>

        <div className="space-y-6">{children}</div>
      </div>

      <WizardFooter
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={prevStep}
        onNext={nextStep}
        state={state}
      />
    </div>
  );
}
