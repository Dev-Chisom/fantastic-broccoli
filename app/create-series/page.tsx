'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { CreateSeriesProvider, useCreateSeries, TOTAL_STEPS } from '@/contexts/CreateSeriesContext';
import ContentTypeStep from '@/components/series/ContentTypeStep';
import ScriptPreferencesStep from '@/components/series/ScriptPreferencesStep';
import VoiceLanguageStep from '@/components/series/VoiceLanguageStep';
import MusicSelectionStep from '@/components/series/MusicSelectionStep';
import ArtStyleStep from '@/components/series/ArtStyleStep';
import CaptionStyleStep from '@/components/series/CaptionStyleStep';
import VisualEffectsStep from '@/components/series/VisualEffectsStep';
import SocialConnectStep from '@/components/series/SocialConnectStep';
import SeriesScheduleStep from '@/components/series/SeriesScheduleStep';
import { StepProgress } from '@/components/ui/Progress';

const STEP_COMPONENTS = [
  ContentTypeStep,
  ScriptPreferencesStep,
  VoiceLanguageStep,
  MusicSelectionStep,
  ArtStyleStep,
  CaptionStyleStep,
  VisualEffectsStep,
  SocialConnectStep,
  SeriesScheduleStep,
];

const STEP_NAMES = [
  'Content Type',
  'Script Preferences',
  'Voice & Language',
  'Music',
  'Art Style',
  'Caption Style',
  'Visual Effects',
  'Social Accounts',
  'Schedule',
];

const STEP_NAMES_SHORT = [
  'Content',
  'Script',
  'Voice',
  'Music',
  'Art',
  'Caption',
  'Effects',
  'Social',
  'Schedule',
];

function CreateSeriesWizard() {
  const { step } = useCreateSeries();
  const StepComponent = STEP_COMPONENTS[step - 1];
  if (!StepComponent) return null;
  return <StepComponent />;
}

function CreateSeriesContent() {
  const { step } = useCreateSeries();
  
  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            New series
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl lg:text-3xl">
            Create a fully automated short-form series in minutes.
          </h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-6">
          <StepProgress
            steps={STEP_NAMES}
            shortLabels={STEP_NAMES_SHORT}
            currentStep={step}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-6">
          <CreateSeriesWizard />
        </div>
      </div>
    </AppShell>
  );
}

function CreateSeriesPageContent() {
  return (
    <CreateSeriesProvider>
      <CreateSeriesContent />
    </CreateSeriesProvider>
  );
}

export default function CreateSeriesPage() {
  return (
    <ProtectedRoute>
      <CreateSeriesPageContent />
    </ProtectedRoute>
  );
}
