'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/contexts/ToastContext';

function getPasswordStrength(pwd: string): { strength: number; label: string } {
  if (pwd.length === 0) return { strength: 0, label: '' };
  if (pwd.length < 8) return { strength: 1, label: 'Weak' };
  if (pwd.length >= 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
    return { strength: 3, label: 'Strong' };
  }
  if (pwd.length >= 8 && (/[a-z]/.test(pwd) || /[A-Z]/.test(pwd)) && /[0-9]/.test(pwd)) {
    return { strength: 2, label: 'Medium' };
  }
  return { strength: 1, label: 'Weak' };
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-brand-primary" />
        <h1 className="text-lg font-semibold text-slate-50">Loading…</h1>
        <p className="mt-2 text-sm text-slate-400">Preparing password reset form.</p>
      </div>
    </div>
  );
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-50">Invalid reset link</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your password reset link is missing or invalid. Request a new one to continue.
          </p>
          <button
            onClick={() => router.push('/forgot-password')}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      showSuccess('Password updated successfully.');
    } catch (err: any) {
      setError(err.message || 'This reset link is invalid or has expired.');
      showError(err.message || 'Unable to reset password. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-50">Password updated</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6">
        <h1 className="text-xl font-semibold text-slate-50">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-400">
          Choose a strong password you don&apos;t use elsewhere.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
            {password && (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Password strength</span>
                  <span
                    className={
                      passwordStrength.strength === 3
                        ? 'text-success'
                        : passwordStrength.strength === 2
                        ? 'text-warning'
                        : 'text-error'
                    }
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        level <= passwordStrength.strength
                          ? passwordStrength.strength === 3
                            ? 'bg-success'
                            : passwordStrength.strength === 2
                            ? 'bg-warning'
                            : 'bg-error'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            required
          />

          {error && <p className="text-xs text-error">{error}</p>}

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}

