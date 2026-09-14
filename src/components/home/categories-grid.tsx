'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Music, Image, FileText, Code, ArrowRight } from 'lucide-react';

/**
 * CategoriesGrid
 * 4 premium interactive cards for tool categories.
 * Features:
 * - Hover: lift, border glow, description fade-in, arrow slide
 * - Staggered entrance animation
 * - Gradient overlays per category
 */

const categories = [
  {
    title: 'Audio Tools',
    description: 'Trim, merge, and convert audio files with waveform precision.',
    href: '/audio',
    icon: Music,
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    borderGlow: 'group-hover:shadow-violet-500/20',
    iconColor: 'text-violet-400',
    tools: ['Audio Trimmer', 'Audio Merger'],
  },
  {
    title: 'Image Tools',
    description: 'Resize, crop, and convert images with pixel-perfect control.',
    href: '/image',
    icon: Image,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderGlow: 'group-hover:shadow-emerald-500/20',
    iconColor: 'text-emerald-400',
    tools: ['Image Resizer', 'Profile Cropper'],
  },
  {
    title: 'PDF Tools',
    description: 'Split, merge, and extract PDF pages without any uploads.',
    href: '/pdf',
    icon: FileText,
    gradient: 'from-orange-500/20 to-amber-500/20',
    borderGlow: 'group-hover:shadow-orange-500/20',
    iconColor: 'text-orange-400',
    tools: ['PDF Splitter', 'PDF Merger'],
  },
  {
    title: 'Dev Tools',
    description: 'Format JSON, generate CSS, and streamline your workflow.',
    href: '/dev',
    icon: Code,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderGlow: 'group-hover:shadow-blue-500/20',
    iconColor: 'text-blue-400',
    tools: ['JSON Formatter', 'CSS Generator'],
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
  hidden: { opacity: 0, y: 40 },
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Four powerful categories, dozens of tools — all running locally in your browser.
          </p>
        </motion.div>

        {/* Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.title} variants={cardVariants}>
              <Link href={cat.href} className="group block">
                <div
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-8 h-full
                    transition-all duration-500 ease-out
                    hover:border-white/20 hover:shadow-2xl ${cat.borderGlow}
                    hover:-translate-y-1`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                        <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
                      </div>
                    </div>

                    {/* Title + Arrow */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">
                        {cat.title}
                      </h3>
                      <ArrowRight
                        className="h-5 w-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                      />
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      {cat.description}
                    </p>

                    {/* Tool Tags */}
                    <div className="flex flex-wrap gap-2">
                      {cat.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-zinc-500 border border-white/5"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
