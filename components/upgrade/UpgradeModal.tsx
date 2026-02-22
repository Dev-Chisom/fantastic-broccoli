'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { workspacesApi, type WorkspaceLimitsResponse } from '@/lib/api/workspaces';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
  requiredPlan?: string;
  workspaceId?: string | null;
}

export default function UpgradeModal({
  open,
  onClose,
  feature = 'This feature',
  requiredPlan = 'Pro',
  workspaceId,
}: UpgradeModalProps) {
  const [limits, setLimits] = useState<WorkspaceLimitsResponse | null>(null);

  useEffect(() => {
    if (!open || !workspaceId) return;
    let cancelled = false;
    workspacesApi
      .getLimits(workspaceId)
      .then((data) => {
        if (!cancelled) setLimits(data);
      })
      .catch(() => {
        if (!cancelled) setLimits(null);
      });
    return () => {
      cancelled = true;
    };
  }, [open, workspaceId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upgrade to unlock"
      description={`${feature} is available on the ${requiredPlan} plan.`}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-300">
          Upgrade your plan to use premium effects, more connected accounts, and higher limits.
        </p>
        {limits && (
          <ul className="text-sm text-slate-400">
            {limits.maxSocialAccounts != null && (
              <li>Connect up to {limits.maxSocialAccounts} accounts on Pro</li>
            )}
            {limits.maxSeries != null && (
              <li>Create up to {limits.maxSeries} series</li>
            )}
          </ul>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Maybe later
          </Button>
          <Link href="/billing-plans">
            <Button onClick={onClose}>View plans</Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
