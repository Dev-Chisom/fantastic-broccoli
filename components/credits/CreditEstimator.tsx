'use client';

import { useCreateSeries } from '@/contexts/CreateSeriesContext';

interface CreditEstimatorProps {
  compact?: boolean;
  estimatedPerVideo?: number;
}

export default function CreditEstimator({
  compact,
  estimatedPerVideo: propEstimate,
}: CreditEstimatorProps) {
  const ctx = useCreateSeries();
  const estimatedPerVideo = propEstimate ?? ctx.estimatedCreditsPerVideo;

  const display = estimatedPerVideo ?? 0;
  const monthlyEstimate = display * 30; // rough

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
        <span>
          ~{display} credits/video
          {monthlyEstimate > 0 && (
            <span className="ml-1 text-slate-500">
              · ~{monthlyEstimate}/mo
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="text-xs text-slate-400">Estimated credit usage</div>
      <div className="mt-1 text-lg font-semibold text-slate-50">
        ~{display} <span className="text-sm font-normal text-slate-400">per video</span>
      </div>
      {monthlyEstimate > 0 && (
        <div className="mt-1 text-xs text-slate-500">
          ~{monthlyEstimate} credits/month at daily posting
        </div>
      )}
    </div>
  );
}
