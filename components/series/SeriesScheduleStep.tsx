'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import WizardLayout from '@/components/wizard/WizardLayout';
import CreditEstimator from '@/components/credits/CreditEstimator';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import { useToast } from '@/contexts/ToastContext';
import { seriesApi } from '@/lib/api/series';
import type { CreateSeriesState } from '@/contexts/CreateSeriesContext';
import type { Frequency } from '@/contexts/CreateSeriesContext';

const FREQUENCY_OPTIONS: { id: Frequency; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: '3x_week', label: '3× per week' },
  { id: 'custom', label: 'Custom' },
];

function buildStepPayloads(state: CreateSeriesState): Record<number, Record<string, unknown>> {
  return {
    2: {
      tone: state.tone,
      hookStrength: state.hookStrength,
      includeCta: state.includeCta,
      ctaText: state.ctaText,
    },
    3: {
      languageCode: state.languageCode,
      voiceId: state.voiceId || undefined,
      voiceGender: state.voiceGender,
      voiceStyle: state.voiceStyle,
      voiceSpeed: state.voiceSpeed,
      voicePitch: state.voicePitch,
    },
    4: {
      musicMode: state.musicMode,
      presetMood: state.presetMood || undefined,
      libraryTrackId: state.libraryTrackId,
      customUploadUrl: state.customUploadUrl || undefined,
      tiktokSoundUrl: state.tiktokSoundUrl || undefined,
    },
    5: {
      artStyle: state.artStyle,
      artIntensity: state.artIntensity,
      colorTheme: state.colorTheme,
    },
    6: {
      captionStyle: state.captionStyle,
      captionFont: state.captionFont,
      captionFontColor: state.captionFontColor,
      captionHighlightColor: state.captionHighlightColor,
      captionPosition: state.captionPosition,
      captionBackground: state.captionBackground,
    },
    7: { effects: state.effects },
    8: { connectedAccountIds: state.connectedAccountIds },
    9: {
      seriesName: state.seriesName,
      frequency: state.frequency,
      publishTime: state.publishTime,
      startDate: state.startDate,
    },
  };
}

export default function SeriesScheduleStep() {
  const router = useRouter();
  const toast = useToast();
  const { state, update, launchConfirmOpen, setLaunchConfirmOpen, stepErrors } =
    useCreateSeries();
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  const STEP_LABELS: Record<number, string> = {
    2: 'Script preferences',
    3: 'Voice & language',
    4: 'Music',
    5: 'Art style',
    6: 'Caption style',
    7: 'Visual effects',
    8: 'Social accounts',
    9: 'Schedule',
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    setLaunchError(null);
    try {
      const created = await seriesApi.create({
        name: state.seriesName || 'Untitled series',
        contentType: state.contentType,
        customTopic:
          state.contentType === 'custom' && Object.keys(state.customTopic).length > 0
            ? JSON.stringify(state.customTopic)
            : undefined,
      });

      const stepPayloads = buildStepPayloads(state);
      for (let step = 2; step <= 9; step++) {
        const payload = stepPayloads[step];
        if (payload && Object.keys(payload).length > 0) {
          try {
            await seriesApi.updateStep(created.id, step, payload);
          } catch (stepErr) {
            const stepLabel = STEP_LABELS[step] ?? `Step ${step}`;
            const detail = stepErr instanceof Error ? stepErr.message : 'Request failed';
            setLaunchError(`${stepLabel}: ${detail}`);
            toast.error(`${stepLabel}: ${detail}`);
            return;
          }
        }
      }

      await seriesApi.launch(created.id);
      setLaunchConfirmOpen(false);
      toast.success('Series launched successfully!');
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to launch series';
      setLaunchError(message);
      toast.error(message);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <WizardLayout
      title="Finalize Your Series"
      description="Name your series and set when videos are generated and published."
    >
      <div className="space-y-6">
        <Input
          label="Series name"
          placeholder="e.g. Daily Motivation Shorts"
          value={state.seriesName}
          error={stepErrors.seriesName}
          onChange={(e) => update('seriesName', e.target.value)}
        />

        <div>
          <p className="mb-3 text-xs font-medium text-slate-400">Schedule</p>
          <p className="mb-2 text-xs text-slate-500">Posting frequency</p>
          <div className="flex flex-wrap gap-2">
            {FREQUENCY_OPTIONS.map((opt) => (
              <Card
                key={opt.id}
                selected={state.frequency === opt.id}
                className="min-w-[100px]"
                onClick={() => update('frequency', opt.id)}
              >
                <span className="text-sm font-medium text-slate-50">{opt.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Publish time"
            type="time"
            value={state.publishTime}
            onChange={(e) => update('publishTime', e.target.value)}
          />
          <Input
            label="Start date"
            type="date"
            value={state.startDate}
            error={stepErrors.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
        </div>
        <p className="text-xs text-slate-500">
          (Your local time). Videos will be generated 6 hours before scheduled publish time so you
          can review them.
        </p>
        <p className="text-xs text-slate-500">
          Episodes are generated in 2-part stories: (Ep1+Ep2), (Ep3+Ep4), etc. Each part is a
          ~2-minute video. Part 1 sets up the story and ends on a cliffhanger. Part 2 continues
          directly from Part 1 and resolves or escalates it. To get one 2-part story per day,
          schedule or publish two consecutive episodes per day for a series.
        </p>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <CreditEstimator />
        </div>
      </div>

      <Modal
        open={launchConfirmOpen}
        onClose={() => !isLaunching && setLaunchConfirmOpen(false)}
        title="Launch series?"
        description="Confirm your series settings and start generating."
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-white/[0.02] p-4 text-sm text-slate-300">
            <p>
              <strong className="text-slate-50">{state.seriesName || 'Untitled series'}</strong>
            </p>
            <p className="mt-2">
              {state.frequency} · Publish at {state.publishTime} · Start{' '}
              {state.startDate || '—'}
            </p>
          </div>
          {launchError && (
            <p className="text-sm text-red-400" role="alert">
              {launchError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setLaunchConfirmOpen(false)}
              disabled={isLaunching}
            >
              Cancel
            </Button>
            <Button onClick={handleLaunch} disabled={isLaunching}>
              {isLaunching ? 'Launching…' : 'Launch series'}
            </Button>
          </div>
        </div>
      </Modal>
    </WizardLayout>
  );
}
