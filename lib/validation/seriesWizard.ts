import type { CreateSeriesState } from '@/contexts/CreateSeriesContext';

export type StepErrors = Record<string, string>;

export type StepValidator = (state: CreateSeriesState) => StepErrors;

export const stepValidators: Record<number, StepValidator> = {
  1: (state) => {
    const errors: StepErrors = {};
    if (state.contentType === 'custom') {
      const topicTitle = (state.customTopic?.topicTitle ?? '').trim();
      const targetAudience = (state.customTopic?.targetAudience ?? '').trim();
      if (!topicTitle) errors.topicTitle = 'Topic title is required for custom topics';
      if (!targetAudience) errors.targetAudience = 'Target audience is required for custom topics';
    }
    return errors;
  },

  2: (state) => {
    const errors: StepErrors = {};
    if (state.includeCta && !(state.ctaText ?? '').trim()) {
      errors.ctaText = 'CTA text is required when including a call-to-action';
    }
    return errors;
  },

  3: () => ({}),

  4: (state) => {
    const errors: StepErrors = {};
    if (state.musicMode === 'preset' && !state.presetMood) {
      errors.presetMood = 'Please select a preset mood';
    }
    if (state.musicMode === 'library' && !state.libraryTrackId) {
      errors.libraryTrackId = 'Please select a track from your library';
    }
    if (state.musicMode === 'custom') {
      const hasCustom = !!(state.customUploadUrl ?? '').trim() || !!(state.tiktokSoundUrl ?? '').trim();
      if (!hasCustom) {
        errors.customUploadUrl = 'Upload a file or paste a TikTok sound URL';
      }
    }
    return errors;
  },

  5: () => ({}),

  6: () => ({}),

  7: () => ({}),

  8: (state) => {
    const errors: StepErrors = {};
    const ids = state.connectedAccountIds ?? [];
    if (ids.length === 0) {
      errors.connectedAccountIds = 'Connect at least one social account to continue.';
    }
    return errors;
  },

  9: (state) => {
    const errors: StepErrors = {};
    const seriesName = (state.seriesName ?? '').trim();
    const startDate = (state.startDate ?? '').trim();
    if (!seriesName) errors.seriesName = 'Series name is required';
    if (!startDate) errors.startDate = 'Start date is required';
    return errors;
  },
};

export function validateStep(step: number, state: CreateSeriesState): StepErrors {
  const validator = stepValidators[step];
  if (!validator) return {};
  return validator(state);
}

export function isStepValid(step: number, state: CreateSeriesState): boolean {
  const errors = validateStep(step, state);
  return Object.keys(errors).length === 0;
}
