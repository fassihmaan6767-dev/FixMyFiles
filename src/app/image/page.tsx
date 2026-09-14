import type { Metadata } from 'next';
import Link from 'next/link';
import { Image as ImageIcon, Maximize, CircleUser, ArrowRight } from 'lucide-react';
import { CATEGORY_SEO_CONFIG } from '@/lib/tool-seo-config';

const categoryConfig = CATEGORY_SEO_CONFIG['/image'];

export const metadata: Metadata = {
  title: categoryConfig.title,
  description: categoryConfig.description,
  keywords: categoryConfig.keywords,
};

const imageTools = [
  {
    title: 'Image Resizer & Converter',
    description: 'Resize images to any dimension with aspect ratio lock. Export as PNG, JPG, or WEBP.',
    href: '/image/resizer',
    icon: Maximize,
  },
  {
    title: 'Profile Picture Cropper',
    description: 'Crop images into a perfect circle for profile pictures. Export as transparent PNG.',
    href: '/image/pfp',
    icon: CircleUser,
  },
];

export default function ImagePage() {
  return (
    <section className="min-h-screen py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <ImageIcon className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Image Tools</h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Pixel-perfect image editing with zero quality loss. All processing stays local.
          </p>
        </div>
        <div className="grid gap-4">
          {imageTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group block">
              <div className="flex items-center gap-6 p-6 rounded-2xl border border-white/10 bg-zinc-900/50 hover:border-emerald-500/30 hover:bg-zinc-900/80 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <tool.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{tool.title}</h3>
                  <p className="text-sm text-zinc-400">{tool.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
