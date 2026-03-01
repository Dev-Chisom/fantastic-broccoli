import { apiClient } from './client';

export interface ScheduledPostItem {
  episodeId: string;
  seriesId: string;
  seriesName: string;
  episodeNumber: number;
  scheduledAt: string;
}

export const scheduledPostsApi = {
  list: async (): Promise<ScheduledPostItem[]> => {
    return apiClient.get<ScheduledPostItem[]>('/scheduled-posts');
  },
};
