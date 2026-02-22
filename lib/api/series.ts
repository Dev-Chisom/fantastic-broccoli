import { apiClient } from './client';

export interface Series {
  id: string;
  name: string;
  contentType: string;
  customTopic?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  episodeCount: number;
  scriptPreferences?: ScriptPreferences;
  voiceId?: string;
  musicId?: string;
  artStyle?: ArtStyle;
  captionStyle?: CaptionStyle;
  visualEffects?: VisualEffects;
  socialAccountIds?: string[];
  schedule?: Schedule;
}

export interface ScriptPreferences {
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational';
  length: 'short' | 'medium' | 'long';
  includeStatistics: boolean;
  useStorytelling: boolean;
  addCallToAction: boolean;
  includeExamples: boolean;
}

export interface ArtStyle {
  style: 'minimalist' | 'modern' | 'vintage' | 'abstract' | 'realistic';
  colorScheme: string[];
  animationStyle: 'static' | 'subtle' | 'dynamic';
}

export interface CaptionStyle {
  position: 'top' | 'bottom' | 'center';
  fontStyle: 'sans-serif' | 'serif' | 'bold' | 'italic';
  textSize: 'small' | 'medium' | 'large';
  color: string;
  animation: 'fade-in' | 'slide' | 'typewriter' | 'none';
}

export interface VisualEffects {
  transitions: string[];
  overlay?: {
    logo?: string;
    text?: string;
    progressBar: boolean;
  };
  speed: number;
}

export interface Schedule {
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  daysOfWeek?: number[]; // For weekly (0-6, Sunday-Saturday)
  timezone: string;
  preferredTime: string; // HH:mm format
  startDate: string;
  endDate?: string;
  autoPost: boolean;
}

export interface CreateSeriesRequest {
  name: string;
  contentType: string;
  customTopic?: string;
}

export interface UpdateSeriesStepRequest {
  step: number;
  data: Record<string, unknown>;
}

export interface CreditEstimate {
  creditsPerEpisode: number;
  totalCredits: number;
  totalEpisodes: number;
}

export const seriesApi = {
  create: async (data: CreateSeriesRequest): Promise<Series> => {
    return apiClient.post<Series>('/series', data);
  },

  get: async (id: string): Promise<Series> => {
    return apiClient.get<Series>(`/series/${id}`);
  },

  list: async (): Promise<Series[]> => {
    return apiClient.get<Series[]>('/series');
  },

  updateStep: async (id: string, step: number, data: Record<string, unknown>): Promise<Series> => {
    const stepNames = [
      '1-content-type',
      '2-script-preferences',
      '3-voice-language',
      '4-music',
      '5-art-style',
      '6-caption-style',
      '7-visual-effects',
      '8-social-accounts',
      '9-schedule',
    ];
    return apiClient.patch<Series>(`/series/${id}/step/${stepNames[step - 1]}`, data);
  },

  estimateCredits: async (id: string): Promise<CreditEstimate> => {
    return apiClient.post<CreditEstimate>(`/series/${id}/estimate-credits`);
  },

  launch: async (id: string): Promise<Series> => {
    return apiClient.post<Series>(`/series/${id}/launch`);
  },

  update: async (id: string, data: Partial<Series>): Promise<Series> => {
    return apiClient.patch<Series>(`/series/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/series/${id}`);
  },
};
