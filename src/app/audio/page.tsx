import type { Metadata } from 'next';
import Link from 'next/link';
import { Music, Scissors, Merge, Volume2, Headphones, VolumeX, Film, FileAudio, ArrowRight } from 'lucide-react';
import { CATEGORY_SEO_CONFIG } from '@/lib/tool-seo-config';

const categoryConfig = CATEGORY_SEO_CONFIG['/audio'];

export const metadata: Metadata = {
  title: categoryConfig.title,
  description: categoryConfig.description,
  keywords: categoryConfig.keywords,
};

const audioTools = [
  {
    title: 'Audio Trimmer',
    description: 'Trim and cut audio files with precision using an interactive waveform editor. Supports multi-region selection.',
    href: '/audio/trimmer',
    icon: Scissors,
  },
  {
    title: 'Audio Merger',
    description: 'Merge multiple audio files into one. Drag and drop to reorder tracks before combining.',
    href: '/audio/merger',
    icon: Merge,
  },
  {
    title: 'Extract Audio from Video',
    description: 'Strip the audio track from MP4, WebM, and MOV video files. Powered by FFmpeg.wasm.',
    href: '/audio/extract',
    icon: Film,
  },
  {
    title: 'Volume & Bass Booster',
    description: 'Boost volume up to 500% and enhance bass frequencies. Real-time preview with presets.',
    href: '/audio/booster',
    icon: Volume2,
  },
  {
    title: 'Stereo to Mono Converter',
    description: 'Convert stereo audio to mono by averaging left and right channels.',
    href: '/audio/mono',
    icon: Headphones,
  },
  {
    title: 'Silence Remover',
    description: 'Automatically detect and remove silent sections from audio files with adjustable threshold.',
    href: '/audio/silence-remover',
    icon: VolumeX,
  },
  {
    title: 'Audio to Transcript',
    description: 'Transcribe audio to text using browser AI. Export as TXT, SRT, or VTT subtitles.',
    href: '/audio/transcript',
    icon: FileAudio,
  },
];

export default function AudioPage() {
  return (
    <section className="min-h-screen py-24 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-6">
            <Music className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Audio Tools</h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Professional audio editing in your browser. No uploads, no software installs.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid gap-4">
          {audioTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group block">
              <div className="flex items-center gap-6 p-6 rounded-2xl border border-white/10 bg-zinc-900/50 hover:border-violet-500/30 hover:bg-zinc-900/80 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <tool.icon className="h-5 w-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{tool.title}</h3>
                  <p className="text-sm text-zinc-400">{tool.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
