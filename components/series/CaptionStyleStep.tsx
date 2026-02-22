'use client';

import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import WizardLayout from '@/components/wizard/WizardLayout';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import type { CaptionStyle, CaptionPosition } from '@/contexts/CreateSeriesContext';

const CAPTION_STYLES: { id: CaptionStyle; label: string }[] = [
  { id: 'bold_pop', label: 'Bold Pop Captions' },
  { id: 'minimal', label: 'Minimal Clean' },
  { id: 'karaoke', label: 'Karaoke Word-by-Word' },
  { id: 'animated', label: 'Animated Emphasis' },
  { id: 'classic', label: 'Subtitle Classic' },
];

const FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
];

const POSITIONS: { value: CaptionPosition; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'middle', label: 'Middle' },
  { value: 'bottom', label: 'Bottom' },
];

export default function CaptionStyleStep() {
  const { state, update } = useCreateSeries();

  return (
    <WizardLayout
      title="Choose Caption Style"
      description="How text appears on screen during your videos."
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CAPTION_STYLES.map((style) => (
            <Card
              key={style.id}
              selected={state.captionStyle === style.id}
              onClick={() => update('captionStyle', style.id)}
            >
              <h3 className="text-sm font-medium text-slate-50">{style.label}</h3>
              <p className="mt-1 text-xs text-slate-400">
                {style.id === 'karaoke'
                  ? 'Words highlight as spoken'
                  : style.id === 'bold_pop'
                    ? 'Large, punchy text'
                    : 'Clean and readable'}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Font style"
            options={FONTS}
            value={state.captionFont}
            onChange={(e) => update('captionFont', e.target.value)}
          />
          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Position</p>
            <div className="flex gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  onClick={() => update('captionPosition', pos.value)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-all ${
                    state.captionPosition === pos.value
                      ? 'border-violet-500/60 bg-violet-500/20 text-slate-50'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <p className="mb-1 text-xs text-slate-400">Font color</p>
            <div className="flex gap-2">
              {['#ffffff', '#fbbf24', '#a855f7', '#22d3ee'].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => update('captionFontColor', hex)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    state.captionFontColor === hex ? 'border-white scale-110' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Color ${hex}`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs text-slate-400">Highlight color</p>
            <div className="flex gap-2">
              {['#a855f7', '#f97316', '#ec4899', '#22d3ee'].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => update('captionHighlightColor', hex)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    state.captionHighlightColor === hex ? 'border-white scale-110' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Highlight ${hex}`}
                />
              ))}
            </div>
          </div>
        </div>

        <Toggle
          label="Caption background"
          description="Subtle background behind text for readability"
          checked={state.captionBackground}
          onCheckedChange={(v) => update('captionBackground', v)}
        />
      </div>
    </WizardLayout>
  );
}
