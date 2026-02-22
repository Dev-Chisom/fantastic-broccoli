'use client';

import Card from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import WizardLayout from '@/components/wizard/WizardLayout';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';

const EFFECTS: {
  key: string;
  label: string;
  description: string;
  premium?: boolean;
}[] = [
  { key: 'shake', label: 'Shake Effect', description: 'Great for horror and tension.' },
  { key: 'filmGrain', label: 'Film Grain', description: 'Adds a cinematic, nostalgic look.' },
  { key: 'zoomPulse', label: 'Zoom Pulse', description: 'Subtle zoom on key moments.' },
  {
    key: 'animatedHook',
    label: 'Animated Hook',
    description: 'Dynamic opening animation to grab attention.',
    premium: true,
  },
  {
    key: 'sceneTransitions',
    label: 'Scene Transitions',
    description: 'Smooth cuts between scenes.',
  },
  { key: 'glowText', label: 'Glow Text', description: 'Glowing highlight on captions.' },
  { key: 'motionBlur', label: 'Motion Blur', description: 'Emphasize movement and speed.' },
];

export default function VisualEffectsStep() {
  const { state, updateEffects } = useCreateSeries();

  return (
    <WizardLayout
      title="Enhance With Effects"
      description="Optional visual effects to make your videos stand out. Turn on any combination—you can change this later."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {EFFECTS.map((effect) => {
          const current = state.effects[effect.key];
          const enabled = current?.enabled ?? false;
          return (
            <Card
              key={effect.key}
              selected={enabled}
              className="flex flex-row items-center justify-between gap-4"
              onClick={() => updateEffects(effect.key, !enabled)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-50">{effect.label}</h3>
                  {effect.premium && (
                    <Badge variant="premium" className="shrink-0">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs leading-snug text-slate-400">
                  {effect.description}
                </p>
              </div>
              <div
                className="flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
              >
                <Toggle
                  checked={enabled}
                  onCheckedChange={(v) => updateEffects(effect.key, v)}
                  aria-label={`Toggle ${effect.label}`}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </WizardLayout>
  );
}
