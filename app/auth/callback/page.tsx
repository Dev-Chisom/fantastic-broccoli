'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/contexts/ToastContext';

function AuthCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { error: showError } = useToast();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      return;
    }

    if (!code) {
      setStatus('error');
      return;
    }

    const run = async () => {
      try {
        await authApi.googleCallback(code);
        router.replace('/');
      } catch (err: any) {
        console.error(err);
        showError(err.message || "We couldn't complete Google sign-in. Please try again.");
        setStatus('error');
      }
    };

    run();
  }, [searchParams, router, showError]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 text-center">
        {status === 'loading' ? (
          <>
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-brand-primary" />
            <h1 className="text-lg font-semibold text-slate-50">Signing you in…</h1>
            <p className="mt-2 text-sm text-slate-400">
              Completing Google sign-in. This will only take a moment.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-slate-50">
              We couldn't complete Google sign-in.
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Please try again or continue with email and password.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AuthCallbackFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-brand-primary" />
        <h1 className="text-lg font-semibold text-slate-50">Signing you in…</h1>
        <p className="mt-2 text-sm text-slate-400">Loading sign-in session.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackInner />
    </Suspense>
  );
}

