'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import type { SocialProviderResponse } from '@/lib/api/social';
import { socialApi } from '@/lib/api/social';

const PLATFORM_ICONS: Record<string, string> = {
  tiktok: '♪',
  instagram: '📷',
  youtube: '▶',
  facebook: 'f',
};

const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
};

interface ConnectAccountModalProps {
  open: boolean;
  onClose: () => void;
  providers: SocialProviderResponse[];
  onConnected?: () => void;
}

export default function ConnectAccountModal({
  open,
  onClose,
  providers,
}: ConnectAccountModalProps) {
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const { error: showError } = useToast();

  const handleConnect = async (provider: SocialProviderResponse) => {
    if (provider.connectUrlPath) {
      try {
        setConnectingPlatform(provider.platform);
        const { url } = await socialApi.getConnectRedirectUrl(provider.connectUrlPath);
        window.location.href = url;
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Failed to get connect URL');
        setConnectingPlatform(null);
      }
    } else {
      window.location.href = provider.authUrl;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect account"
      description="Choose a platform to connect. You'll be redirected to sign in securely."
    >
      <div className="space-y-3">
        {providers.length === 0 ? (
          <p className="text-sm text-slate-500">No providers available.</p>
        ) : (
          providers.map((p) => (
            <button
              key={p.platform}
              type="button"
              disabled={connectingPlatform !== null}
              onClick={() => handleConnect(p)}
              className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.06] disabled:opacity-50"
            >
              <span className="text-2xl">
                {PLATFORM_ICONS[p.platform.toLowerCase()] ?? '•'}
              </span>
              <span className="font-medium text-slate-50">
                {p.displayName || PLATFORM_DISPLAY_NAMES[p.platform.toLowerCase()] || p.platform}
              </span>
              <span className="ml-auto text-xs text-slate-400">
                {connectingPlatform === p.platform ? 'Redirecting…' : 'Connect'}
              </span>
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}
