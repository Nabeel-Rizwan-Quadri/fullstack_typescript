import Link from 'next/link';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="app-accent-text text-xs font-semibold uppercase tracking-[0.3em]">
            Log in
          </p>
          <h1 className="app-text-strong mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome back to Nimbus
          </h1>
          <p className="app-text-muted mt-4 text-base">
            Pick up where you left off. Your workspace is synced, secure, and ready for
            another great session.
          </p>
          <div className="app-text-muted mt-6 grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Signed-in sessions stay active across tabs.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Fast access to your profile and recent activity.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Built with care for modern, secure logins.</span>
            </div>
          </div>
        </div>

        <div className="app-card app-card-shadow w-full max-w-md rounded-2xl p-6 backdrop-blur">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="app-text-strong text-xl font-semibold">Sign in</h2>
              <p className="app-text-muted mt-1 text-sm">
                Use your email and password to continue.
              </p>
            </div>
            <LoginForm />
            <p className="app-text-muted text-sm">
              Need an account?{' '}
              <Link
                className="app-accent-text font-semibold underline-offset-4 hover:underline"
                href="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
