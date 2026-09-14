'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FAQSection
 * AdSense-friendly FAQ accordion with:
 * - Smooth expand/collapse via Framer Motion AnimatePresence
 * - Chevron rotation animation
 * - Only one item open at a time
 */

const faqs = [
  {
    question: 'Is FixMyFiles really free?',
    answer:
      'Yes, 100%! All tools on FixMyFiles are completely free to use for both personal and commercial purposes. There are no hidden fees, no premium tiers, and no account signups required. We sustain the platform through minimal, non-intrusive advertising.',
  },
  {
    question: 'How is my data kept private?',
    answer:
      "Your files never leave your device. Every tool on FixMyFiles uses client-side processing, meaning all file editing happens directly in your browser using technologies like the Web Audio API, HTML5 Canvas, and pdf-lib. We don't have servers that receive your files — it's technically impossible for us to see them.",
  },
  {
    question: 'What file formats do you support?',
    answer:
      'We support a wide range of formats across categories. Audio tools handle MP3, WAV, OGG, and more. Image tools work with PNG, JPG, WEBP, and SVG. PDF tools process standard PDF files. Our Dev Tools handle JSON, CSS, and various text formats. We are constantly adding support for new formats.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-lg">
            Got questions? We&apos;ve got answers.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className={cn(
                  'rounded-xl border border-white/10 bg-zinc-900/50 overflow-hidden transition-colors duration-300',
                  openIndex === index && 'border-white/20 bg-zinc-900/80'
                )}
              >
                {/* Question Button */}
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="h-5 w-5 text-zinc-400 flex-shrink-0" />
                  </motion.div>
                </button>

                {/* Answer Content */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="px-6 pb-5">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
