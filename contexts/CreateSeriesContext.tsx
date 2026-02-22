'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const TOTAL_STEPS = 9;

export type ContentType =
  | 'motivation'
  | 'horror'
  | 'finance'
  | 'ai_tech'
  | 'kids'
  | 'anime'
  | 'custom';

export type StoryLength = '30_40' | '45_60';
export type Tone = 'inspiring' | 'dark' | 'educational' | 'funny' | 'emotional';
export type HookStrength = 'low' | 'medium' | 'aggressive';
export type VoiceStyle = 'calm' | 'energetic' | 'dramatic' | 'storytelling';
export type MusicMood =
  | 'inspirational'
  | 'cinematic'
  | 'horror'
  | 'emotional'
  | 'kids_fun'
  | 'anime_style';
export type ArtStyle =
  | 'minimal_text'
  | 'stock'
  | 'cinematic_ai'
  | 'anime'
  | 'cartoon'
  | 'comic'
  | 'realistic'
  | 'abstract';
export type CaptionStyle =
  | 'bold_pop'
  | 'minimal'
  | 'karaoke'
  | 'animated'
  | 'classic';
export type CaptionPosition = 'top' | 'middle' | 'bottom';
export type Frequency = 'daily' | '3x_week' | 'custom';

export interface ColorTheme {
  primary: string;
  accent: string;
  background: string;
}

export interface CustomTopic {
  topicTitle: string;
  targetAudience: string;
  tone: string;
  keywords: string;
  ctaStyle: string;
}

export interface CreateSeriesState {
  contentType: ContentType;
  customTopic: Partial<CustomTopic>;
  storyLength: StoryLength;
  tone: Tone;
  hookStrength: HookStrength;
  includeCta: boolean;
  ctaText: string;
  languageCode: string;
  voiceId: string | null;
  voiceGender: 'male' | 'female';
  voiceStyle: VoiceStyle;
  voiceSpeed: number;
  voicePitch: number;
  musicMode: 'preset' | 'library' | 'custom';
  presetMood: string;
  libraryTrackId: string | null;
  customUploadUrl: string;
  tiktokSoundUrl: string;
  artStyle: ArtStyle;
  artIntensity: number;
  colorTheme: ColorTheme;
  captionStyle: CaptionStyle;
  captionFont: string;
  captionFontColor: string;
  captionHighlightColor: string;
  captionPosition: CaptionPosition;
  captionBackground: boolean;
  effects: Record<string, { enabled: boolean; isPremium?: boolean }>;
  connectedAccountIds: string[];
  seriesName: string;
  videoDuration: StoryLength;
  frequency: Frequency;
  publishTime: string;
  startDate: string;
}

const defaultState: CreateSeriesState = {
  contentType: 'motivation',
  customTopic: {},
  storyLength: '30_40',
  tone: 'inspiring',
  hookStrength: 'medium',
  includeCta: true,
  ctaText: 'Follow for more',
  languageCode: 'en-US',
  voiceId: null,
  voiceGender: 'female',
  voiceStyle: 'calm',
  voiceSpeed: 1,
  voicePitch: 1,
  musicMode: 'preset',
  presetMood: 'inspirational',
  libraryTrackId: null,
  customUploadUrl: '',
  tiktokSoundUrl: '',
  artStyle: 'cinematic_ai',
  artIntensity: 0.5,
  colorTheme: {
    primary: '#333333',
    accent: '#0066cc',
    background: '#ffffff',
  },
  captionStyle: 'bold_pop',
  captionFont: 'Inter',
  captionFontColor: '#ffffff',
  captionHighlightColor: '#a855f7',
  captionPosition: 'bottom',
  captionBackground: true,
  effects: {
    shake: { enabled: false },
    filmGrain: { enabled: false },
    zoomPulse: { enabled: false },
    animatedHook: { enabled: false, isPremium: true },
    sceneTransitions: { enabled: true },
    glowText: { enabled: false },
    motionBlur: { enabled: false },
  },
  connectedAccountIds: [],
  seriesName: '',
  videoDuration: '30_40',
  frequency: 'daily',
  publishTime: '12:00',
  startDate: '',
};

export type StepErrors = Record<string, string>;

type CreateSeriesContextValue = {
  step: number;
  setStep: (s: number) => void;
  state: CreateSeriesState;
  update: <K extends keyof CreateSeriesState>(
    key: K,
    value: CreateSeriesState[K]
  ) => void;
  updateEffects: (effectKey: string, enabled: boolean) => void;
  estimatedCreditsPerVideo: number;
  nextStep: () => void;
  prevStep: () => void;
  launchConfirmOpen: boolean;
  setLaunchConfirmOpen: (v: boolean) => void;
  stepErrors: StepErrors;
  setStepErrors: (errors: StepErrors) => void;
};

const CreateSeriesContext = createContext<CreateSeriesContextValue | null>(null);

function estimateCredits(state: CreateSeriesState): number {
  let base = 8;
  if (state.storyLength === '45_60') base += 4;
  if (state.artStyle === 'cinematic_ai' || state.artStyle === 'realistic') base += 2;
  const premiumEffects = Object.values(state.effects).filter(
    (e) => e.enabled && e.isPremium
  ).length;
  return base + premiumEffects * 2;
}

export function CreateSeriesProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<CreateSeriesState>(defaultState);
  const [launchConfirmOpen, setLaunchConfirmOpen] = useState(false);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  const update = useCallback(
    <K extends keyof CreateSeriesState>(key: K, value: CreateSeriesState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateEffects = useCallback((effectKey: string, enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectKey]: { ...prev.effects[effectKey], enabled },
      },
    }));
  }, []);

  const estimatedCreditsPerVideo = useMemo(() => estimateCredits(state), [state]);

  const nextStep = useCallback(() => {
    setStepErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);
  const prevStep = useCallback(() => {
    setStepErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const value = useMemo<CreateSeriesContextValue>(
    () => ({
      step,
      setStep,
      state,
      update,
      updateEffects,
      estimatedCreditsPerVideo,
      nextStep,
      prevStep,
      launchConfirmOpen,
      setLaunchConfirmOpen,
      stepErrors,
      setStepErrors,
    }),
    [
      step,
      state,
      update,
      updateEffects,
      estimatedCreditsPerVideo,
      nextStep,
      prevStep,
      launchConfirmOpen,
      stepErrors,
    ]
  );

  return (
    <CreateSeriesContext.Provider value={value}>
      {children}
    </CreateSeriesContext.Provider>
  );
}

export function useCreateSeries() {
  const ctx = useContext(CreateSeriesContext);
  if (!ctx) throw new Error('useCreateSeries must be used within CreateSeriesProvider');
  return ctx;
}
