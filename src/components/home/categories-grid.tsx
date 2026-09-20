'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Music, Image, FileText, Code, ArrowRight } from 'lucide-react';
import { getToolsByCategory, ToolEntry } from '@/lib/tools-registry';

/**
 * CategoriesGrid
 * 4 premium interactive cards for tool categories with automated tool pill mapping from tools-registry.
 * Features:
 * - Automated tool pill mapping from tools-registry
 * - Direct deep-links from tool pills to individual tool pages
 * - Dual-theme styling with gradient glow and hover lifts
 */

interface CategoryDefinition {
  title: string;
  categoryKey: ToolEntry['category'];
  description: string;
  href: string;
  icon: typeof Music;
  gradient: string;
  borderGlow: string;
  iconColor: string;
}

const categories: CategoryDefinition[] = [
  {
    title: 'Audio Tools',
    categoryKey: 'audio',
    description: 'Trim, merge, transcribe, and convert audio files with waveform precision.',
    href: '/audio',
    icon: Music,
    gradient: 'from-violet-500/15 to-fuchsia-500/15 dark:from-violet-500/20 dark:to-fuchsia-500/20',
    borderGlow: 'hover:shadow-violet-500/15 dark:hover:shadow-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: 'Image Tools',
    categoryKey: 'image',
    description: 'Resize, crop, and convert images with pixel-perfect control.',
    href: '/image',
    icon: Image,
    gradient: 'from-emerald-500/15 to-teal-500/15 dark:from-emerald-500/20 dark:to-teal-500/20',
    borderGlow: 'hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'PDF Tools',
    categoryKey: 'pdf',
    description: 'Split, merge, and extract PDF pages without any uploads.',
    href: '/pdf',
    icon: FileText,
    gradient: 'from-orange-500/15 to-amber-500/15 dark:from-orange-500/20 dark:to-amber-500/20',
    borderGlow: 'hover:shadow-orange-500/15 dark:hover:shadow-orange-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    title: 'Dev Tools',
    categoryKey: 'dev',
    description: 'Format JSON, generate CSS, and streamline your workflow.',
    href: '/dev',
    icon: Code,
    gradient: 'from-blue-500/15 to-cyan-500/15 dark:from-blue-500/20 dark:to-cyan-500/20',
    borderGlow: 'hover:shadow-blue-500/15 dark:hover:shadow-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function CategoriesGrid() {
  return (
    <section id="tools" className="py-24 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
            Four powerful categories, dozens of tools — all running locally in your browser.
          </p>
        </motion.div>

        {/* Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {categories.map((cat) => {
            const categoryTools = getToolsByCategory(cat.categoryKey);

            return (
              <motion.div key={cat.title} variants={cardVariants}>
                <div
                  className={`relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 p-8 h-full
                    backdrop-blur-md shadow-xs
                    transition-all duration-500 ease-out
                    hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-2xl ${cat.borderGlow}
                    hover:-translate-y-1`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Icon */}
                      <div className="mb-6">
                        <Link
                          href={cat.href}
                          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-xs hover:scale-105 transition-transform"
                        >
                          <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
                        </Link>
                      </div>

                      {/* Title + Category Page Link */}
                      <Link href={cat.href} className="group/title block">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover/title:text-blue-500 transition-colors">
                            {cat.title}
                          </h3>
                          <ArrowRight
                            className="h-5 w-5 text-zinc-400 group-hover/title:text-blue-500 group-hover/title:translate-x-1 transition-all duration-300"
                          />
                        </div>
                      </Link>

                      {/* Description */}
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                        {cat.description}
                      </p>
                    </div>

                    {/* Automated Tool Tags Mapped from Registry */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {categoryTools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={tool.path}
                          className="group/pill inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-zinc-100/90 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                        >
                          <span>{tool.shortName}</span>
                          {tool.badge && (
                            <span
                              className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                                tool.badge === 'AI'
                                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                                  : tool.badge === 'Popular'
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                                  : 'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                              }`}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
