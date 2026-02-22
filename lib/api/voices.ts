import { apiClient, buildQuery } from './client';

export interface VoiceItem {
  id: string;
  name: string;
  languageCode: string;
  gender: string;
  style?: string;
  isPremium?: boolean;
  previewUrl?: string;
}

export interface VoicePreviewRequest {
  text: string;
  languageCode: string;
  voiceId?: string;
  gender?: string;
  style?: string;
  speed?: number;
  pitch?: number;
}

export interface VoicePreviewResponse {
  previewUrl: string;
}

export const voicesApi = {
  list: async (params?: { languageCode?: string }): Promise<VoiceItem[]> => {
    const query = buildQuery(params ?? {});
    return apiClient.get<VoiceItem[]>(`/voices${query}`);
  },

  preview: async (body: VoicePreviewRequest): Promise<VoicePreviewResponse> => {
    return apiClient.post<VoicePreviewResponse>('/voices/preview', body);
  },
};
