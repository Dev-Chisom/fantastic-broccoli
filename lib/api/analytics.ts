import { apiClient, buildQuery } from './client';

export interface AnalyticsOverviewResponse {
  totalViews: number;
  totalEpisodes: number;
  activeSeries: number;
  creditsUsedThisMonth: number;
}

export interface SeriesAnalyticsResponse {
  seriesId: string;
  views: number;
  likes: number;
  ctr: number;
  postsCount: number;
  byPlatform?: Record<string, { views?: number; likes?: number }>;
}

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverviewResponse> => {
    return apiClient.get<AnalyticsOverviewResponse>('/analytics/overview');
  },

  getSeries: async (
    seriesId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<SeriesAnalyticsResponse> => {
    const query = buildQuery(params ?? {});
    return apiClient.get<SeriesAnalyticsResponse>(
      `/analytics/series/${seriesId}${query}`
    );
  },
};
