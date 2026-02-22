'use client';

import { useState, useEffect, useRef } from 'react';
import Select from '@/components/ui/Select';
import Slider from '@/components/ui/Slider';
import WizardLayout from '@/components/wizard/WizardLayout';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import type { VoiceStyle } from '@/contexts/CreateSeriesContext';
import { voicesApi, type VoiceItem } from '@/lib/api/voices';
import { useToast } from '@/contexts/ToastContext';

const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'hi-IN', label: 'Hindi' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'ar-SA', label: 'Arabic' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'nl-NL', label: 'Dutch' },
  { value: 'pl-PL', label: 'Polish' },
  { value: 'ru-RU', label: 'Russian' },
];

const VOICE_STYLES: { id: VoiceStyle; label: string }[] = [
  { id: 'calm', label: 'Calm' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'storytelling', label: 'Storytelling' },
];

const PREVIEW_SAMPLE_TEXT = 'This is a short sample of how your video will sound.';

export default function VoiceLanguageStep() {
  const { state, update } = useCreateSeries();
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { error: showError } = useToast();

  useEffect(() => {
    let cancelled = false;
    setVoicesLoading(true);
    voicesApi
      .list({ languageCode: state.languageCode })
      .then((list) => {
        if (!cancelled) setVoices(list);
      })
      .catch(() => {
        if (!cancelled) setVoices([]);
      })
      .finally(() => {
        if (!cancelled) setVoicesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [state.languageCode]);

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const { previewUrl } = await voicesApi.preview({
        text: PREVIEW_SAMPLE_TEXT,
        languageCode: state.languageCode,
        voiceId: state.voiceId || undefined,
        gender: state.voiceGender,
        style: state.voiceStyle,
        speed: state.voiceSpeed,
        pitch: state.voicePitch,
      });
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = previewUrl;
        await audioRef.current.play();
      } else {
        const audio = new Audio(previewUrl);
        audioRef.current = audio;
        await audio.play();
        audio.onended = () => {
          audioRef.current = null;
        };
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Preview failed');
    } finally {
      setPreviewLoading(false);
    }
  };

  const voiceOptions = [
    { value: '', label: 'Auto (use gender & style)' },
    ...voices.map((v) => ({
      value: v.id,
      label: `${v.name}${v.isPremium ? ' (Premium)' : ''}`,
    })),
  ];

  return (
    <WizardLayout
      title="Select Voice & Language"
      description="Choose the voice that will narrate your videos."
    >
      <div className="space-y-6">
        <Select
          label="Language"
          options={LANGUAGES}
          value={state.languageCode}
          onChange={(e) => update('languageCode', e.target.value)}
        />

        {voices.length > 0 && (
          <Select
            label="Voice"
            options={voiceOptions}
            value={state.voiceId ?? ''}
            onChange={(e) => update('voiceId', e.target.value || null)}
            disabled={voicesLoading}
          />
        )}

        <div>
          <p className="mb-3 text-xs font-medium text-slate-400">Voice gender</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => update('voiceGender', 'male')}
              className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                state.voiceGender === 'male'
                  ? 'border-violet-500/60 bg-violet-500/20 text-slate-50'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => update('voiceGender', 'female')}
              className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                state.voiceGender === 'female'
                  ? 'border-violet-500/60 bg-violet-500/20 text-slate-50'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-slate-400">Voice style</p>
          <div className="flex flex-wrap gap-2">
            {VOICE_STYLES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update('voiceStyle', opt.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  state.voiceStyle === opt.id
                    ? 'bg-violet-500/30 text-slate-50 ring-1 ring-violet-500/50'
                    : 'bg-white/[0.02] text-slate-400 hover:bg-white/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Slider
          label="Speed"
          minLabel="Slower"
          maxLabel="Faster"
          min={0.5}
          max={2}
          step={0.1}
          value={state.voiceSpeed}
          onChange={(e) => update('voiceSpeed', parseFloat(e.target.value))}
        />

        <Slider
          label="Pitch"
          minLabel="Lower"
          maxLabel="Higher"
          min={0.5}
          max={2}
          step={0.1}
          value={state.voicePitch}
          onChange={(e) => update('voicePitch', parseFloat(e.target.value))}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
          >
            <span className="text-lg">▶</span>
            {previewLoading ? 'Loading…' : 'Preview voice'}
          </button>
          <span className="text-xs text-slate-500">Short sample with your settings</span>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </WizardLayout>
  );
}
