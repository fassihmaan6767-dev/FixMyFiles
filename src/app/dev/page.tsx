import type { Metadata } from 'next';
import Link from 'next/link';
import { Code, Braces, Palette, ArrowRight } from 'lucide-react';
import { CATEGORY_SEO_CONFIG } from '@/lib/tool-seo-config';
import { BackButton } from '@/components/ui/back-button';

const categoryConfig = CATEGORY_SEO_CONFIG['/dev'];

export const metadata: Metadata = {
  title: categoryConfig.title,
  description: categoryConfig.description,
  keywords: categoryConfig.keywords,
};

const devTools = [
  {
    title: 'JSON Formatter & Validator',
    description: 'Paste, validate, and beautifully format JSON data. See exact error locations instantly.',
    href: '/dev/json',
    icon: Braces,
  },
  {
    title: 'CSS Glassmorphism Generator',
    description: 'Design frosted glass effects with live preview. Copy production-ready CSS code.',
    href: '/dev/glassmorphism',
    icon: Palette,
  },
];

export default function DevPage() {
  return (
    <section className="min-h-screen py-16 sm:py-20 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Navigation / Back */}
        <div className="mb-10">
          <BackButton href="/#tools" label="All Categories" />
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 shadow-xs">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Dev Tools
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
            Essential developer utilities for your daily workflow. Fast and distraction-free.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid gap-4">
          {devTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group block">
              <div className="flex items-center gap-6 p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 hover:border-blue-500/30 hover:bg-white/95 dark:hover:bg-zinc-900/80 hover:-translate-y-0.5 transition-all duration-300 shadow-xs backdrop-blur-md">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <tool.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">{tool.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-blue-600 dark:text-zinc-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
