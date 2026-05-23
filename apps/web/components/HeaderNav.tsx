'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeToggle';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type MeResponse = {
  id: string;
  username: string;
  email: string;
};

export function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await apiFetch('/me', { cache: 'no-store' });
        if (cancelled) return;

        if (res.ok) {
          const data = (await res.json()) as MeResponse;
          setUser(data);
          setStatus('authenticated');
          return;
        }

        if (res.status === 401) {
          setUser(null);
          setStatus('unauthenticated');
          return;
        }

        setUser(null);
        setStatus('unauthenticated');
      } catch {
        if (!cancelled) {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setStatus('unauthenticated');
      router.replace('/login');
    }
  }

  return (
    <nav className="app-shell-nav flex items-center gap-3 text-sm">
      <ThemeToggle />

      {status === 'loading' ? (
        <div className="hidden items-center gap-3 sm:flex">
          <div className="app-shell-skeleton h-3 w-16 animate-pulse rounded-full" />
          <div className="app-shell-skeleton h-3 w-20 animate-pulse rounded-full" />
        </div>
      ) : status === 'authenticated' ? (
        <div className="flex items-center gap-3">
          <Link className="app-shell-link transition hover:opacity-80" href="/dashboard">
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="app-shell-outline rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition hover:opacity-80"
          >
            Log out
          </button>
          {user ? (
            <span className="app-shell-muted hidden text-xs sm:inline">
              {user.email}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link className="app-shell-link transition hover:opacity-80" href="/login">
            Login
          </Link>
          <Link
            className="app-shell-accent rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition hover:opacity-80"
            href="/signup"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}
