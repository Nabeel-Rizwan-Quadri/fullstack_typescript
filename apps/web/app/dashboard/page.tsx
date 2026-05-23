import { DashboardClient } from '@/components/DashboardClient';

export default function DashboardPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="app-accent-text text-xs font-semibold uppercase tracking-[0.3em]">
            Dashboard
          </p>
          <h1 className="app-text-strong text-3xl font-semibold tracking-tight sm:text-4xl">
            Your workspace
          </h1>
          <p className="app-text-muted text-sm">
            A quick look at your account and profile details.
          </p>
        </div>
        <div className="app-card app-card-shadow mt-8 rounded-2xl p-6 backdrop-blur">
          <DashboardClient />
        </div>
      </div>
    </main>
  );
}
