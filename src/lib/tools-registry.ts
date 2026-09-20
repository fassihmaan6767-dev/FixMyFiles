/**
 * Centralized Tools Registry
 * FixMyFiles.app — 100% Client-Side Privacy Tools
 *
 * Source of truth for navigation, homepage category cards, SEO metadata, and search.
 */

export interface ToolEntry {
  id: string;
  name: string;
  shortName: string;
  path: string;
  category: 'audio' | 'image' | 'pdf' | 'dev';
  description: string;
  badge?: 'Popular' | 'New' | 'AI' | 'Updated';
  keywords: string[];
}

export const TOOLS_REGISTRY: ToolEntry[] = [
  // ─── Audio Tools ──────────────────────────────────────────────
  {
    id: 'audio-trimmer',
    name: 'Audio Trimmer & Cutter',
    shortName: 'Audio Trimmer',
    path: '/audio/trimmer',
    category: 'audio',
    description: 'Cut, trim, and split audio files with interactive waveform precision.',
    badge: 'Popular',
    keywords: ['trim', 'cut', 'crop', 'mp3', 'wav', 'editor'],
  },
  {
    id: 'audio-transcript',
    name: 'Audio & Video Transcriber',
    shortName: 'Spotify-Style Transcriber',
    path: '/audio/transcript',
    category: 'audio',
    description: 'Transcribe speech to text using Whisper AI with synced Spotify-style lyrics viewer.',
    badge: 'AI',
    keywords: ['transcribe', 'speech to text', 'whisper', 'subtitles', 'srt', 'vtt'],
  },
  {
    id: 'audio-merger',
    name: 'Audio Merger & Combiner',
    shortName: 'Audio Merger',
    path: '/audio/merger',
    category: 'audio',
    description: 'Combine multiple audio tracks into a single seamless audio file.',
    keywords: ['merge', 'combine', 'join', 'audio joiner'],
  },
  {
    id: 'audio-extract',
    name: 'Extract Audio from Video',
    shortName: 'Audio Extractor',
    path: '/audio/extract',
    category: 'audio',
    description: 'Strip and extract high-bitrate MP3 or WAV audio tracks from any video.',
    badge: 'Updated',
    keywords: ['video to audio', 'extract audio', 'mp4 to mp3', 'video converter'],
  },
  {
    id: 'audio-silence-remover',
    name: 'Silence Remover',
    shortName: 'Silence Remover',
    path: '/audio/silence-remover',
    category: 'audio',
    description: 'Detect and auto-trim dead air and pauses from podcasts and recordings.',
    keywords: ['silence', 'podcast', 'dead air', 'remove pauses'],
  },
  {
    id: 'audio-booster',
    name: 'Volume Booster',
    shortName: 'Volume Booster',
    path: '/audio/booster',
    category: 'audio',
    description: 'Boost low-volume audio recordings up to 300% without distortion.',
    keywords: ['amplify', 'boost volume', 'louder audio', 'gain'],
  },
  {
    id: 'audio-mono',
    name: 'Stereo to Mono Converter',
    shortName: 'Stereo to Mono',
    path: '/audio/mono',
    category: 'audio',
    description: 'Downmix stereo recordings into a balanced single mono audio track.',
    keywords: ['mono', 'stereo', 'downmix', 'channel splitter'],
  },

  // ─── Image Tools ──────────────────────────────────────────────
  {
    id: 'image-resizer',
    name: 'Image Resizer & Optimizer',
    shortName: 'Image Resizer',
    path: '/image/resizer',
    category: 'image',
    description: 'Resize images by pixel dimensions or percentage with aspect ratio lock.',
    badge: 'Popular',
    keywords: ['resize', 'scale', 'dimensions', 'png', 'jpg', 'webp'],
  },
  {
    id: 'image-pfp',
    name: 'Profile Picture Cropper',
    shortName: 'Profile Cropper',
    path: '/image/pfp',
    category: 'image',
    description: 'Crop circular avatars and profile pictures with zoom and pan previews.',
    badge: 'New',
    keywords: ['avatar', 'profile picture', 'pfp', 'circular crop', 'crop image'],
  },

  // ─── PDF Tools ────────────────────────────────────────────────
  {
    id: 'pdf-merge',
    name: 'PDF Merger',
    shortName: 'PDF Merger',
    path: '/pdf/merge',
    category: 'pdf',
    description: 'Merge multiple PDF documents into one cleanly organized document.',
    badge: 'Popular',
    keywords: ['merge pdf', 'combine pdf', 'join pdf'],
  },
  {
    id: 'pdf-split',
    name: 'PDF Splitter & Page Extractor',
    shortName: 'PDF Splitter',
    path: '/pdf/split',
    category: 'pdf',
    description: 'Split PDFs by range or extract individual pages into separate files.',
    keywords: ['split pdf', 'extract pages', 'separate pdf'],
  },

  // ─── Dev Tools ────────────────────────────────────────────────
  {
    id: 'dev-json',
    name: 'JSON Formatter & Validator',
    shortName: 'JSON Formatter',
    path: '/dev/json',
    category: 'dev',
    description: 'Prettify, minify, validate, and inspect JSON payloads with syntax highlighting.',
    badge: 'Popular',
    keywords: ['json', 'format', 'prettify', 'minify', 'validator'],
  },
  {
    id: 'dev-glassmorphism',
    name: 'Glassmorphism CSS Generator',
    shortName: 'CSS Generator',
    path: '/dev/glassmorphism',
    category: 'dev',
    description: 'Design modern frosted glass UI cards with real-time blur and border CSS output.',
    keywords: ['glassmorphism', 'css generator', 'backdrop blur', 'ui generator'],
  },
];

/**
 * Get all tools belonging to a specific category
 */
export function getToolsByCategory(category: ToolEntry['category']): ToolEntry[] {
  return TOOLS_REGISTRY.filter((tool) => tool.category === category);
}

/**
 * Find tool by its pathname
 */
export function getToolByPath(path: string): ToolEntry | undefined {
  return TOOLS_REGISTRY.find((tool) => tool.path === path);
}
