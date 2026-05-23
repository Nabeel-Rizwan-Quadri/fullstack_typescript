'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch, readApiError } from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await apiFetch('/me', { cache: 'no-store' });
        if (!cancelled && res.ok) {
          router.replace('/dashboard');
        }
      } catch {
        if (!cancelled) {
          return;
        }
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError(await readApiError(res));
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Unable to reach the server. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" autoComplete="on">
      <label className="flex flex-col gap-2 text-sm">
        <span className="app-text-muted font-medium">Email</span>
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="email"
          disabled={submitting}
          className="app-input rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-teal-500 focus-visible:ring-4 focus-visible:ring-teal-200/40 disabled:cursor-not-allowed"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="app-text-muted font-medium">Password</span>
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          autoComplete="current-password"
          disabled={submitting}
          className="app-input rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-teal-500 focus-visible:ring-4 focus-visible:ring-teal-200/40 disabled:cursor-not-allowed"
          placeholder="Enter your password"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200/50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? 'Signing in...' : 'Log in'}
      </button>

      {error ? (
        <div
          role="alert"
          aria-live="polite"
          className="app-alert rounded-xl px-3 py-2 text-sm"
        >
          {error}
        </div>
      ) : null}
    </form>
  );
}
