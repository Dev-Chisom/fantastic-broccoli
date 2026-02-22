import { apiClient } from './client';

export interface WorkspaceLimitsResponse {
  plan: string;
  limits: Record<string, number | boolean>;
  canUseAnimatedHook?: boolean;
  maxSocialAccounts?: number;
  maxPremiumEffectsPerVideo?: number;
  maxSeries?: number;
}

export interface CreditTransactionItem {
  id: string;
  type: string;
  amount: number;
  reason?: string;
  createdAt: string;
}

export const workspacesApi = {
  getLimits: async (workspaceId: string): Promise<WorkspaceLimitsResponse> => {
    return apiClient.get<WorkspaceLimitsResponse>(
      `/workspaces/${workspaceId}/limits`
    );
  },

  getCreditTransactions: async (
    workspaceId: string,
    params?: { limit?: number }
  ): Promise<CreditTransactionItem[]> => {
    const limit = params?.limit ?? 50;
    return apiClient.get<CreditTransactionItem[]>(
      `/workspaces/${workspaceId}/credit-transactions?limit=${limit}`
    );
  },
};
