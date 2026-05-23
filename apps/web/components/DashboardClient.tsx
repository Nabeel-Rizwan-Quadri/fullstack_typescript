'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, readApiError } from '@/lib/api';

type MeResponse = {
  id: string;
  username: string;
  email: string;
};

export function DashboardClient() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch('/me', { cache: 'no-store' });
        if (cancelled) return;

        if (res.status === 401) {
          router.replace('/login');
          return;
        }

        if (!res.ok) {
          setError(await readApiError(res));
          return;
        }

        const data = (await res.json()) as MeResponse;
        setMe(data);
      } catch {
        if (!cancelled) {
          setError('Unable to load your profile.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="app-shell-skeleton h-6 w-48 animate-pulse rounded-lg" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="app-shell-skeleton h-20 animate-pulse rounded-xl" />
          <div className="app-shell-skeleton h-20 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-alert rounded-xl px-4 py-3 text-sm">
        {error}
      </div>
    );
  }

  if (!me) {
    return (
      <div className="app-card app-text-muted rounded-xl px-4 py-3 text-sm">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="app-accent-text text-xs font-semibold uppercase tracking-[0.3em]">
          Welcome
        </p>
        <h2 className="app-text-strong mt-2 text-2xl font-semibold">
          {`Hello ${me.username}`}
        </h2>
        <p className="app-text-muted mt-1 text-sm">
          You are signed in and ready to move.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="app-card rounded-xl px-4 py-3 shadow-sm">
          <p className="app-text-muted text-xs font-semibold uppercase tracking-[0.25em]">
            Email
          </p>
          <p className="app-text-strong mt-2 text-sm font-semibold">{me.email}</p>
        </div>
        <div className="app-card rounded-xl px-4 py-3 shadow-sm">
          <p className="app-text-muted text-xs font-semibold uppercase tracking-[0.25em]">
            User ID
          </p>
          <p className="app-text-strong mt-2 break-all text-sm font-semibold font-mono">
            {me.id}
          </p>
        </div>
      </div>
    </div>
  );
}
