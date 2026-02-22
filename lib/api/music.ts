import { apiClient, buildQuery } from './client';

export interface MusicPresetItem {
  id: string;
  mood: string;
  name: string;
  sampleUrl?: string;
}

export interface MusicLibraryItem {
  id: string;
  mood: string;
  name: string;
  durationSeconds?: number;
  url?: string;
}

export interface MusicUploadResponse {
  id: string;
  url: string;
}

export const musicApi = {
  getPresets: async (): Promise<MusicPresetItem[]> => {
    return apiClient.get<MusicPresetItem[]>('/music/presets');
  },

  getLibrary: async (params?: {
    mood?: string;
    skip?: number;
    limit?: number;
  }): Promise<MusicLibraryItem[]> => {
    const query = buildQuery(params ?? {});
    return apiClient.get<MusicLibraryItem[]>(`/music/library${query}`);
  },

  upload: async (file: File): Promise<MusicUploadResponse> => {
    return apiClient.upload<MusicUploadResponse>('/music/upload', file);
  },

  delete: async (id: string): Promise<{ ok: boolean }> => {
    return apiClient.delete<{ ok: boolean }>(`/music/${id}`);
  },
};
