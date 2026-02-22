'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/contexts/ToastContext';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  useEffect(() => {
    if (user?.name != null) setName(user.name);
  }, [user?.name]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { user: updated } = await authApi.updateProfile({ name: name.trim() || undefined });
      setName(updated.name ?? '');
      await refreshUser();
      showSuccess('Profile updated');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Workspace and account preferences.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-sm font-medium text-slate-200">Profile</h2>
            <Input
              label="Display name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={user?.email ?? ''}
              disabled
              placeholder="you@example.com"
            />
            <Button type="submit" variant="secondary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>

          <div className="max-w-xl space-y-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-sm font-medium text-slate-200">Workspace</h2>
            <Input label="Workspace name" placeholder="My workspace" disabled />
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}