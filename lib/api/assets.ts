import { apiClient, buildQuery } from './client';

export interface AssetResponse {
  id: string;
  type: string;
  source: string;
  url: string;
  format?: string;
  durationSeconds?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const assetsApi = {
  list: async (params?: {
    type?: string;
    skip?: number;
    limit?: number;
  }): Promise<AssetResponse[]> => {
    const query = buildQuery(params ?? {});
    return apiClient.get<AssetResponse[]>(`/assets${query}`);
  },
};
