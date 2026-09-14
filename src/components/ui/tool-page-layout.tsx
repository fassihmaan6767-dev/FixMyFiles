'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ToolPageLayout
 * Consistent layout wrapper for all tool pages.
 * Provides a Back button, title, description, privacy banner, and centered content area.
 *
 * Semantic HTML: Uses <article> as the top-level container (self-contained tool content).
 * Accessibility: aria-labels on interactive elements.
 */
export function ToolPageLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <article className="min-h-screen py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Navigation Bar / Back Button */}
        <nav className="mb-8 flex items-center justify-between" aria-label="Tool navigation">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            aria-label="Go back to previous page"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back
          </motion.button>

          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            FixMyFiles Home
          </Link>
        </nav>

        {/* Tool Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            {title}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </header>

        {/* Privacy Banner — reinforces USP for SEO & user trust */}
        <section
          className="mb-8 flex items-center justify-center gap-2 text-xs text-zinc-500"
          aria-label="Privacy information"
        >
          <Shield className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          <h2 className="font-medium text-zinc-400">
            Your files never leave your device — processed 100% in your browser memory
          </h2>
        </section>

        {/* Tool Content */}
        <section aria-label="Tool workspace">{children}</section>
      </div>
    </article>
  );
}
