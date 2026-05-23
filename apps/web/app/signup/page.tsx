import Link from 'next/link';
import { SignupForm } from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="app-accent-text text-xs font-semibold uppercase tracking-[0.3em]">
            Sign up
          </p>
          <h1 className="app-text-strong mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Start your Nimbus account
          </h1>
          <p className="app-text-muted mt-4 text-base">
            Create a profile and get your workspace ready in minutes. It is fast, focused,
            and designed to keep your work moving.
          </p>
          <div className="app-text-muted mt-6 grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Simple onboarding with just three details.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Secure password requirements built in.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Access your dashboard the moment you finish.</span>
            </div>
          </div>
        </div>

        <div className="app-card app-card-shadow w-full max-w-md rounded-2xl p-6 backdrop-blur">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="app-text-strong text-xl font-semibold">Create account</h2>
              <p className="app-text-muted mt-1 text-sm">
                Use a username, email, and a secure password.
              </p>
            </div>
            <SignupForm />
            <p className="app-text-muted text-sm">
              Already have an account?{' '}
              <Link
                className="app-accent-text font-semibold underline-offset-4 hover:underline"
                href="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
