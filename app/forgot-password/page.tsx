'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { authApi } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { error: showError, success: showSuccess } = useToast();

  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      setSent(true);
      setCooldown(45);
      showSuccess('If an account exists for that email, we sent a reset link.');
    } catch (err: any) {
      showError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canResend = cooldown === 0;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6">
        {!sent ? (
          <>
            <h1 className="text-xl font-semibold text-slate-50">Reset your password</h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter the email associated with your account and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
              />

              <Button type="submit" className="w-full" loading={loading} disabled={loading}>
                Send reset link
              </Button>

              <p className="text-center text-xs text-slate-400">
                Remember your password?{' '}
                <Link href="/login" className="text-brand-primary hover:text-brand-secondary font-medium">
                  Back to Sign In
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-slate-50">Check your email</h1>
            <p className="mt-2 text-sm text-slate-400">
              If an account exists for <span className="font-medium text-slate-200">{email}</span>, we sent a
              password reset link.
            </p>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                className="w-full"
                onClick={handleSubmit}
                disabled={!canResend || loading}
                loading={loading}
              >
                {canResend ? 'Resend link' : `Resend available in ${cooldown}s`}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => (window.location.href = '/login')}
              >
                Back to Sign In
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

