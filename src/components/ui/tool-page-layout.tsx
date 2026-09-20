'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';

interface ToolPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}

/**
 * ToolPageLayout
 * Consistent layout wrapper for all tool pages.
 * Provides a universal sleek Back button pointing to the category hub,
 * title, description, privacy banner, and centered content area.
 */
export function ToolPageLayout({
  children,
  title,
  description,
  backHref,
  backLabel,
}: ToolPageLayoutProps) {
  const pathname = usePathname();

  // Determine category hub link automatically if not provided
  let resolvedHref = backHref;
  let resolvedLabel = backLabel;

  if (!resolvedHref) {
    if (pathname.startsWith('/audio')) {
      resolvedHref = '/audio';
      resolvedLabel = resolvedLabel || 'Audio Tools';
    } else if (pathname.startsWith('/image')) {
      resolvedHref = '/image';
      resolvedLabel = resolvedLabel || 'Image Tools';
    } else if (pathname.startsWith('/pdf')) {
      resolvedHref = '/pdf';
      resolvedLabel = resolvedLabel || 'PDF Tools';
    } else if (pathname.startsWith('/dev')) {
      resolvedHref = '/dev';
      resolvedLabel = resolvedLabel || 'Dev Tools';
    } else {
      resolvedHref = '/#tools';
      resolvedLabel = resolvedLabel || 'All Tools';
    }
  }

  return (
    <article className="min-h-screen py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Navigation Bar / Universal Back Button */}
        <nav className="mb-8 flex items-center justify-between" aria-label="Tool navigation">
          <BackButton href={resolvedHref} label={resolvedLabel} />

          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
          >
            FixMyFiles Home
          </Link>
        </nav>

        {/* Tool Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            {title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </header>

        {/* Privacy Banner — reinforces USP for SEO & user trust */}
        <section
          className="mb-8 flex items-center justify-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
          aria-label="Privacy information"
        >
          <Shield className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          <h2 className="font-medium">
            Your files never leave your device — processed 100% in your browser memory
          </h2>
        </section>

        {/* Tool Content */}
        <section aria-label="Tool workspace">{children}</section>
      </div>
    </article>
  );
}
