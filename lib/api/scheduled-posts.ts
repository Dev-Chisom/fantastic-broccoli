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
    // Simple client-side logging to help trace scheduled posts fetches
    // eslint-disable-next-line no-console
    console.log('[scheduledPostsApi] Fetching scheduled posts...');
    try {
      const result = await apiClient.get<ScheduledPostItem[]>('/scheduled-posts');
      // eslint-disable-next-line no-console
      console.log('[scheduledPostsApi] Fetched scheduled posts', {
        count: Array.isArray(result) ? result.length : 'unknown',
      });
      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[scheduledPostsApi] Failed to fetch scheduled posts', err);
      throw err;
    }
  },
};
