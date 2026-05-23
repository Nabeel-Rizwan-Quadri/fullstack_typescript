import type { Metadata } from 'next';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { JetBrains_Mono, Newsreader, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nimbus Auth',
  description: 'A clean authentication starter with a focused workspace UI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col">
          <header className="app-shell-header">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white shadow-lg shadow-teal-700/30">
                  N
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-lg font-semibold">Nimbus</span>
                  <span className="app-shell-muted text-[11px] uppercase tracking-[0.35em]">
                    Studio
                  </span>
                </span>
              </Link>
              <HeaderNav />
            </div>
          </header>
          <div className="flex-1">{children}</div>
          <footer className="app-shell-footer">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center">
              <span>Nimbus Auth, built for focused sessions.</span>
              <span>(c) 2026 Nimbus Studio</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
