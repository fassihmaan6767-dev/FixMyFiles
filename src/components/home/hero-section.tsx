'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Shield, Zap, Globe } from 'lucide-react';
import { MagneticButton } from '@/components/ui/magnetic-button';

/**
 * HeroSection
 * The showstopper landing hero with:
 * - Animated mesh gradient background
 * - Massive headline with staggered reveal
 * - Feature badges
 * - Pulsing CTA button
 */

const features = [
  { icon: Zap, label: 'Lightning Fast' },
  { icon: Shield, label: '100% Private' },
  { icon: Globe, label: 'No Uploads' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* --- Animated Mesh Gradient Background --- */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* --- Radial Overlay for Depth --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#09090b_70%)]" />

      {/* --- Subtle Grid Pattern --- */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* --- Content --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            100% Client-Side Processing
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-6"
        >
          Solve File Problems.
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Zero Server Uploads.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Trim audio, resize images, merge PDFs, and format code — all instantly
          in your browser. No signups. No uploads. Just results.
        </motion.p>

        {/* Feature Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300"
            >
              <feature.icon className="h-4 w-4 text-blue-400" />
              {feature.label}
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <MagneticButton href="#tools" pulse>
            Explore Tools
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
