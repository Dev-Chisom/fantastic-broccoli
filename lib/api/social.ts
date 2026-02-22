import { apiClient } from './client';

export interface SocialProviderResponse {
  platform: string;
  authUrl: string;
  displayName: string;
  connectUrlPath?: string;
}

export interface ConnectRedirectResponse {
  url: string;
}

export interface SocialAccountResponse {
  id: string;
  workspaceId: string;
  platform: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatchSocialAccountRequest {
  displayName?: string;
  status?: string;
}

function normalizeConnectPath(connectUrlPath: string): string {
  const path = connectUrlPath.replace(/^\/api\/v1\/?/, '');
  return path.startsWith('/') ? path : `/${path}`;
}

export const socialApi = {
  getProviders: async (): Promise<SocialProviderResponse[]> => {
    return apiClient.get<SocialProviderResponse[]>('/social/providers');
  },

  getConnectRedirectUrl: async (connectUrlPath: string): Promise<ConnectRedirectResponse> => {
    const path = normalizeConnectPath(connectUrlPath);
    return apiClient.get<ConnectRedirectResponse>(path);
  },

  getAccounts: async (): Promise<SocialAccountResponse[]> => {
    return apiClient.get<SocialAccountResponse[]>('/social/accounts');
  },

  patchAccount: async (
    id: string,
    data: PatchSocialAccountRequest
  ): Promise<SocialAccountResponse> => {
    return apiClient.patch<SocialAccountResponse>(`/social/accounts/${id}`, data);
  },

  deleteAccount: async (id: string): Promise<{ ok: boolean }> => {
    return apiClient.delete<{ ok: boolean }>(`/social/accounts/${id}`);
  },
};
