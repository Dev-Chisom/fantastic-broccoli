'use client';

import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Toggle from '@/components/ui/Toggle';
import WizardLayout from '@/components/wizard/WizardLayout';
import CreditEstimator from '@/components/credits/CreditEstimator';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import type { StoryLength, Tone, HookStrength } from '@/contexts/CreateSeriesContext';

const LENGTH_OPTIONS: { id: StoryLength; label: string }[] = [
  { id: '30_40', label: '30–40 sec' },
  { id: '45_60', label: '45–60 sec' },
];

const TONE_OPTIONS: { id: Tone; label: string }[] = [
  { id: 'inspiring', label: 'Inspiring' },
  { id: 'dark', label: 'Dark' },
  { id: 'educational', label: 'Educational' },
  { id: 'funny', label: 'Funny' },
  { id: 'emotional', label: 'Emotional' },
];

const HOOK_OPTIONS: { id: HookStrength; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'aggressive', label: 'Aggressive' },
];

export default function ScriptPreferencesStep() {
  const { state, update, stepErrors } = useCreateSeries();

  return (
    <WizardLayout
      title="Script Preferences"
      description="Set how each part of your 2-part stories should feel — length, tone, hook strength and call-to-action."
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-medium text-slate-400">Story length</p>
          <p className="mb-2 text-xs text-slate-500">
            Length is per PART. A 2-part story will be roughly 2× this length in total.
          </p>
          <div className="flex flex-wrap gap-2">
            {LENGTH_OPTIONS.map((opt) => (
              <Card
                key={opt.id}
                selected={state.storyLength === opt.id}
                className="flex-1 min-w-[120px]"
                onClick={() => update('storyLength', opt.id)}
              >
                <span className="text-sm font-medium text-slate-50">{opt.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="mb-3 text-xs font-medium text-slate-400">Tone</p>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((opt) => (
              <Card
                key={opt.id}
                selected={state.tone === opt.id}
                className="flex-1 min-w-[100px]"
                onClick={() => update('tone', opt.id)}
              >
                <span className="text-sm font-medium text-slate-50">{opt.label}</span>
              </Card>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Tone and hook strength apply to every part in this series. Pick what you want viewers to
            feel every time.
          </p>
        </div>

        <div className="space-y-3">
          <p className="mb-3 text-xs font-medium text-slate-400">Hook strength</p>
          <div className="flex flex-wrap gap-2">
            {HOOK_OPTIONS.map((opt) => (
              <Card
                key={opt.id}
                selected={state.hookStrength === opt.id}
                className="flex-1 min-w-[90px]"
                onClick={() => update('hookStrength', opt.id)}
              >
                <span className="text-sm font-medium text-slate-50">{opt.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <Toggle
          label="Include CTA?"
          description="Turn on a call-to-action you can reuse across all parts in this series."
          checked={state.includeCta}
          onCheckedChange={(v) => update('includeCta', v)}
        />

        {state.includeCta && (
          <div className="space-y-1.5">
            <Input
              label="CTA text"
              placeholder="e.g. Follow for more"
              value={state.ctaText}
              error={stepErrors.ctaText}
              onChange={(e) => update('ctaText', e.target.value)}
            />
            <p className="text-xs text-slate-500">
              We&apos;ll add this CTA at the end of the final part of each 2-part story.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <CreditEstimator />
        </div>
      </div>
    </WizardLayout>
  );
}
