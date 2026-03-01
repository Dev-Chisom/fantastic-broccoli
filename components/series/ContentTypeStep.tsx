'use client';

import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import WizardLayout from '@/components/wizard/WizardLayout';
import { useCreateSeries } from '@/contexts/CreateSeriesContext';
import type { ContentType } from '@/contexts/CreateSeriesContext';

const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: 'motivation', label: 'Motivation Stories' },
  { id: 'horror', label: 'Horror Stories' },
  { id: 'finance', label: 'Finance & Wealth' },
  { id: 'ai_tech', label: 'AI & Tech News' },
  { id: 'kids', label: "Children's Animated Stories" },
  { id: 'anime', label: 'Anime Stories' },
  { id: 'custom', label: 'Custom Topic' },
];

export default function ContentTypeStep() {
  const { state, update, stepErrors } = useCreateSeries();
  const selected = state.contentType;
  const isCustom = selected === 'custom';

  return (
    <WizardLayout
      title="Choose Your Content Type"
      description="Choose the world your stories live in (horror, anime, kids, etc.). We’ll keep pacing, hooks and visuals consistent for this genre."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTENT_TYPES.map((type) => (
          <Card
            key={type.id}
            selected={selected === type.id}
            onClick={() => update('contentType', type.id)}
          >
            <h3 className="text-sm font-medium text-slate-50">{type.label}</h3>
            <p className="mt-1 text-xs text-slate-400">
              AI-tailored pacing, hooks and visuals for {type.label.toLowerCase()}.
            </p>
          </Card>
        ))}
      </div>

      {isCustom && (
        <div
          className={`mt-6 rounded-2xl border border-dashed p-4 sm:p-6 ${
            Object.keys(stepErrors).length > 0
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-violet-500/40 bg-violet-500/5'
          }`}
        >
          <h4 className="mb-2 text-sm font-medium text-slate-200">Custom topic details</h4>
          <p className="text-xs text-slate-300">
            Describe a very specific lane for this series. Don&apos;t just say &quot;horror&quot; or
            &quot;anime&quot;.
          </p>
          <div className="mt-2 space-y-1 text-xs text-slate-400">
            <p>Examples:</p>
            <p>&quot;Urban legends in Lagos high schools spread through social media&quot;</p>
            <p>&quot;Anime time-loop romance set in a futuristic space academy&quot;</p>
            <p>&quot;Motivational stories about failed startups that later succeeded&quot;</p>
            <p className="mt-2">
              The more specific this is, the more unique each 2-part story will feel.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Topic title"
              placeholder="e.g. Stoic habits for founders"
              value={state.customTopic.topicTitle ?? ''}
              error={stepErrors.topicTitle}
              onChange={(e) =>
                update('customTopic', {
                  ...state.customTopic,
                  topicTitle: e.target.value,
                })
              }
            />
            <Input
              label="Target audience"
              placeholder="e.g. bootstrapped SaaS founders"
              value={state.customTopic.targetAudience ?? ''}
              error={stepErrors.targetAudience}
              onChange={(e) =>
                update('customTopic', {
                  ...state.customTopic,
                  targetAudience: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Input
              label="Tone"
              placeholder="e.g. calm, direct"
              value={state.customTopic.tone ?? ''}
              onChange={(e) =>
                update('customTopic', { ...state.customTopic, tone: e.target.value })
              }
            />
            <Input
              label="Key keywords"
              placeholder="Comma separated"
              value={state.customTopic.keywords ?? ''}
              onChange={(e) =>
                update('customTopic', { ...state.customTopic, keywords: e.target.value })
              }
            />
            <Input
              label="Call-to-action style"
              placeholder="e.g. soft invite"
              value={state.customTopic.ctaStyle ?? ''}
              onChange={(e) =>
                update('customTopic', { ...state.customTopic, ctaStyle: e.target.value })
              }
            />
          </div>
          <Textarea
            className="mt-4"
            label="Extra context (optional)"
            placeholder="Any additional details for this series."
            value=""
          />
        </div>
      )}
    </WizardLayout>
  );
}
