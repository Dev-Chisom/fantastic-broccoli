import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  workspace: Workspace;
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

export interface Workspace {
  id: string;
  plan: string; // e.g. 'free', 'pro', 'scale'
  creditsBalance: number;
  limits: WorkspaceLimits;
}

export interface WorkspaceLimits {
  maxSeries: number;
  maxConnectedAccounts: number;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    apiClient.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    apiClient.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  },

  logout: () => {
    apiClient.clearTokens();
  },

  getCurrentUser: async (): Promise<{ user: User; workspace: Workspace }> => {
    return apiClient.get<{ user: User; workspace: Workspace }>('/me');
  },

  googleCallback: async (code: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google/callback', { code });
    apiClient.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post<void>('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post<void>('/auth/reset-password', { token, newPassword });
  },

  updateProfile: async (data: { name?: string }): Promise<{ user: User }> => {
    return apiClient.patch<{ user: User }>('/me', data);
  },
};
