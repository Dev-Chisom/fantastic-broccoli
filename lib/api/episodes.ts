import { apiClient } from './client';

export interface Episode {
  id: string;
  seriesId: string;
  seriesName?: string;
  episodeNumber: number;
  title: string;
  script: string;
  status: 'draft' | 'generating' | 'ready' | 'published' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedPlatforms?: string[];
  views?: number;
  engagement?: number;
}

export interface EpisodeFilters {
  seriesId?: string;
  status?: Episode['status'];
  search?: string;
}

export const episodesApi = {
  list: async (filters?: EpisodeFilters): Promise<Episode[]> => {
    const params = new URLSearchParams();
    if (filters?.seriesId) params.append('seriesId', filters.seriesId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString();
    return apiClient.get<Episode[]>(`/episodes${query ? `?${query}` : ''}`);
  },

  get: async (id: string): Promise<Episode> => {
    return apiClient.get<Episode>(`/episodes/${id}`);
  },

  publishNow: async (id: string): Promise<{ success: boolean; publishedAt: string }> => {
    return apiClient.post<{ success: boolean; publishedAt: string }>(`/episodes/${id}/publish-now`);
  },

  regenerate: async (id: string): Promise<Episode> => {
    return apiClient.post<Episode>(`/episodes/${id}/regenerate`);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/episodes/${id}`);
  },
};
