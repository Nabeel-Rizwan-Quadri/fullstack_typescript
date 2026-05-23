import Link from 'next/link';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="p-6 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <LoginForm />
      <p>
        Need an account? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  );
}
