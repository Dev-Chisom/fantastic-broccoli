'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const { register } = useAuth();
  const { error: showError, success: showSuccess } = useToast();

  const handleGoogleSignup = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    window.location.href = `${baseUrl}/api/v1/auth/google`;
  };

  const getPasswordStrength = (pwd: string): { strength: number; label: string } => {
    if (pwd.length === 0) return { strength: 0, label: '' };
    if (pwd.length < 8) return { strength: 1, label: 'Weak' };
    if (pwd.length >= 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { strength: 3, label: 'Strong' };
    }
    if (pwd.length >= 8 && (/[a-z]/.test(pwd) || /[A-Z]/.test(pwd)) && /[0-9]/.test(pwd)) {
      return { strength: 2, label: 'Medium' };
    }
    return { strength: 1, label: 'Weak' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(email, password, name);
      showSuccess('Account created successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-tertiary shadow-soft" />
          <h1 className="text-2xl font-semibold text-slate-50">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Join AI Series Studio in a few clicks. No credit card required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-surface p-6">
          <Button
            type="button"
            variant="secondary"
            className="flex w-full items-center justify-center gap-2"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <path
                  fill="#EA4335"
                  d="M11.988 10.19v3.72h5.18c-.21 1.2-.84 2.22-1.79 2.9l2.9 2.25c1.69-1.56 2.67-3.86 2.67-6.59 0-.63-.06-1.24-.18-1.83z"
                />
                <path
                  fill="#34A853"
                  d="M6.62 14.32l-.73.56-2.32 1.8C5.14 19.9 8.27 21.5 11.99 21.5c2.7 0 4.97-.89 6.63-2.44l-2.9-2.25c-.8.54-1.83.86-3.73.86-2.86 0-5.29-1.9-6.16-4.53z"
                />
                <path
                  fill="#4A90E2"
                  d="M3.57 7.64C2.9 8.94 2.5 10.42 2.5 12s.4 3.06 1.07 4.36c0 .01 3.05-2.37 3.05-2.37-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.99 4.5c1.88 0 3.16.81 3.89 1.49l2.84-2.82C16.94 1.9 14.69 1 11.99 1 8.27 1 5.14 2.6 3.57 4.64L6.9 7.36C7.77 4.83 10.2 3 11.99 3z"
                />
              </svg>
            </span>
            <span>Continue with Google</span>
          </Button>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            <span>or continue with email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="John Doe"
            disabled={loading}
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
            disabled={loading}
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
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
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="••••••••"
            disabled={loading}
            required
          />

          <div>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5 text-brand-primary focus:ring-brand-primary"
                required
              />
              <span className="text-xs text-slate-400">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-primary hover:text-brand-secondary">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-primary hover:text-brand-secondary">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-xs text-error">{errors.terms}</p>}
          </div>

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            Create Account
          </Button>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-primary hover:text-brand-secondary font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
