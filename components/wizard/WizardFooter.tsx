'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import CreditEstimator from '@/components/credits/CreditEstimator';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import { validateStep } from '@/lib/validation/seriesWizard';
import type { CreateSeriesState } from '@/contexts/CreateSeriesContext';

interface WizardFooterProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  state: CreateSeriesState;
}

export default function WizardFooter({
  step,
  totalSteps,
  onBack,
  onNext,
  state,
}: WizardFooterProps) {
  const { setLaunchConfirmOpen, setStepErrors, stepErrors } = useCreateSeries();
  const hasErrors = Object.keys(stepErrors).length > 0;
  const isFirst = step === 1;
  const isLast = step === totalSteps;

  const handlePrimary = () => {
    const errors = validateStep(step, state);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    if (isLast) setLaunchConfirmOpen(true);
    else onNext();
  };

  return (
    <div className="sticky bottom-0 z-10 mt-4 flex flex-col gap-3 rounded-xl border border-white/5 bg-background/95 px-3 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {hasErrors && (
          <p className="text-sm text-rose-400" role="alert">
            Please fix the errors above to continue.
          </p>
        )}
        <CreditEstimator compact />
      </div>
      <div className="flex items-center gap-3">
        {isFirst ? (
          <Link href="/create-series">
            <Button variant="ghost">Back</Button>
          </Link>
        ) : (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        )}
        <Button onClick={handlePrimary}>
          {isLast ? 'Launch series' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
