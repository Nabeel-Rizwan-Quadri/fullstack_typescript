'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

type MeResponse = {
  id: string;
  username: string;
  email: string;
};

export function DashboardClient() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await apiFetch('/me', { cache: 'no-store' });
      if (cancelled) return;

      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      if (!res.ok) {
        router.replace('/login');
        return;
      }

      const data = (await res.json()) as MeResponse;
      setMe(data);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!me) return <p>Loading...</p>;

  return <p>{`Welcome ${me.username}`}</p>;
}
