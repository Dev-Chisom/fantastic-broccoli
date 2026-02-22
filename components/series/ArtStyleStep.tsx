'use client';

import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import WizardLayout from '@/components/wizard/WizardLayout';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import type { ArtStyle, ColorTheme } from '@/contexts/CreateSeriesContext';

const ART_STYLES: {
  id: ArtStyle;
  label: string;
  image: string;
}[] = [
  {
    id: 'minimal_text',
    label: 'Minimal Text + Background',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: 'stock',
    label: 'Stock Footage',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop',
  },
  {
    id: 'cinematic_ai',
    label: 'Cinematic AI Art',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop',
  },
  {
    id: 'anime',
    label: 'Anime Style',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop',
  },
  {
    id: 'cartoon',
    label: 'Cartoon / Kids Animation',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=400&fit=crop',
  },
  {
    id: 'comic',
    label: 'Comic Book Style',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop',
  },
  {
    id: 'realistic',
    label: 'Realistic AI',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
  },
  {
    id: 'abstract',
    label: 'Abstract Motion',
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
  },
];

const COLOR_THEME_PRESETS: { id: string; label: string; theme: ColorTheme }[] = [
  { id: 'violet', label: 'Violet', theme: { primary: '#4c1d95', accent: '#a855f7', background: '#f5f3ff' } },
  { id: 'emerald', label: 'Emerald', theme: { primary: '#064e3b', accent: '#10b981', background: '#ecfdf5' } },
  { id: 'amber', label: 'Amber', theme: { primary: '#78350f', accent: '#f59e0b', background: '#fffbeb' } },
  { id: 'rose', label: 'Rose', theme: { primary: '#881337', accent: '#f43f5e', background: '#fff1f2' } },
  { id: 'cyan', label: 'Cyan', theme: { primary: '#164e63', accent: '#06b6d4', background: '#ecfeff' } },
  { id: 'neutral', label: 'Neutral', theme: { primary: '#333333', accent: '#0066cc', background: '#ffffff' } },
];

export default function ArtStyleStep() {
  const { state, update } = useCreateSeries();

  return (
    <WizardLayout
      title="Art Style"
      description="Choose the visual style for your video."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ART_STYLES.map((style) => {
            const selected = state.artStyle === style.id;
            return (
              <Card
                key={style.id}
                selected={selected}
                onClick={() => update('artStyle', style.id)}
                className="overflow-hidden p-0"
              >
                <div className="relative aspect-square w-full bg-white/5">
                  <img
                    src={style.image}
                    alt=""
                    className="h-full w-full object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {selected && (
                    <span
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg"
                      aria-hidden
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-slate-50">{style.label}</h3>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
          <h4 className="mb-4 text-sm font-medium text-slate-200">Refine your style</h4>
          <div className="space-y-6">
            <Slider
              label="Intensity"
              minLabel="Subtle"
              maxLabel="Bold"
              min={0}
              max={1}
              step={0.1}
              value={state.artIntensity}
              onChange={(e) => update('artIntensity', parseFloat(e.target.value))}
            />
            <div>
              <p className="mb-3 text-xs font-medium text-slate-400">Color theme</p>
              <div className="flex flex-wrap gap-2">
                {COLOR_THEME_PRESETS.map((preset) => {
                  const isSelected =
                    state.colorTheme.primary === preset.theme.primary &&
                    state.colorTheme.accent === preset.theme.accent &&
                    state.colorTheme.background === preset.theme.background;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => update('colorTheme', preset.theme)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-violet-500/60 bg-violet-500/20 text-slate-50'
                          : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
}
