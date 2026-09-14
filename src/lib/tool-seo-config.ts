/**
 * Tool SEO Configuration Registry
 *
 * Central source of truth for all tool-level SEO metadata.
 * Used by:
 * - Individual tool page `export const metadata` objects
 * - `SoftwareApplication` JSON-LD schema markup
 * - Sitemap generation
 *
 * @note Titles use the root layout `%s | FixMyFiles` template,
 *       so they should NOT include "| FixMyFiles" suffix.
 * @note Descriptions should be ≤160 chars for optimal SERP display.
 */

export interface ToolSeoEntry {
  /** Long-tail SEO title (will be suffixed with " | FixMyFiles" by template) */
  title: string;
  /** Meta description — must include privacy USP */
  description: string;
  /** Schema.org applicationCategory */
  applicationCategory: string;
  /** Feature list for SoftwareApplication JSON-LD */
  featureList: string[];
  /** Additional page-level keywords */
  keywords: string[];
}

export const TOOL_SEO_CONFIG: Record<string, ToolSeoEntry> = {
  // ─── Audio Tools ──────────────────────────────────────────────
  '/audio/trimmer': {
    title: 'Free Audio Trimmer & Cutter | 100% Private',
    description:
      'Trim, cut, and edit MP3 or WAV files directly in your browser. No server uploads. 100% secure, private, and lightning fast.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Interactive waveform editor with multi-region selection',
      'Extract or delete selected regions',
      'Export as WAV or MP3',
      'No signup, no server uploads',
    ],
    keywords: [
      'audio trimmer',
      'mp3 cutter',
      'wav trimmer',
      'trim audio online',
      'cut audio file',
      'free audio editor',
      'private audio trimmer',
      'browser audio cutter',
    ],
  },

  '/audio/merger': {
    title: 'Free Audio Merger | Combine MP3/WAV Files Privately',
    description:
      'Merge multiple audio files into one. Drag to reorder, export as WAV or MP3. Zero server uploads — 100% in-browser.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Drag-and-drop reordering',
      'Combine MP3, WAV, OGG, and more',
      'Export merged audio as WAV or MP3',
      'No signup, no server uploads',
    ],
    keywords: [
      'audio merger',
      'combine audio files',
      'merge mp3 online',
      'join audio files',
      'free audio combiner',
      'private audio merger',
    ],
  },

  '/audio/booster': {
    title: 'Free Volume & Bass Booster | No Upload Required',
    description:
      'Boost audio volume up to 500% and enhance bass frequencies. Real-time preview. No server uploads — processed in your browser.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Boost volume up to 500%',
      'Enhance bass frequencies with presets',
      'Real-time audio preview',
      'No signup, no server uploads',
    ],
    keywords: [
      'volume booster',
      'bass booster online',
      'increase audio volume',
      'mp3 volume booster',
      'free volume enhancer',
      'loud audio tool',
    ],
  },

  '/audio/extract': {
    title: 'Extract Audio from Video | Free, Private & No Upload',
    description:
      'Extract audio tracks from MP4, WebM, and MOV files. Export as MP3 or WAV. Processed entirely in your browser — zero uploads.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Extract audio from MP4, WebM, MOV videos',
      'Powered by FFmpeg.wasm',
      'Export as MP3 or WAV',
      'No signup, no server uploads',
    ],
    keywords: [
      'extract audio from video',
      'video to audio converter',
      'mp4 to mp3',
      'free audio extractor',
      'private video converter',
      'rip audio from video',
    ],
  },

  '/audio/mono': {
    title: 'Free Stereo to Mono Converter | Browser-Based',
    description:
      'Convert stereo audio files to mono instantly in your browser. Zero server uploads. 100% private and secure.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Convert stereo to mono by averaging channels',
      'Supports MP3, WAV, OGG formats',
      'Instant browser-based conversion',
      'No signup, no server uploads',
    ],
    keywords: [
      'stereo to mono converter',
      'convert stereo to mono online',
      'mono audio converter',
      'free channel converter',
      'browser audio converter',
    ],
  },

  '/audio/silence-remover': {
    title: 'Free Silence Remover | Auto-Detect & Remove Silence',
    description:
      'Automatically detect and remove silent sections from audio files. Adjustable threshold. No uploads — 100% in-browser.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Auto-detect silent sections',
      'Adjustable silence threshold',
      'Preview before export',
      'No signup, no server uploads',
    ],
    keywords: [
      'silence remover',
      'remove silence from audio',
      'auto trim silence',
      'audio silence detector',
      'free silence remover online',
      'podcast silence remover',
    ],
  },

  '/audio/transcript': {
    title: 'Free Audio Transcription | AI-Powered, 100% Private',
    description:
      'Transcribe audio to text using AI (Whisper). Runs locally in your browser — no servers, no API keys, 100% private.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side AI processing with Whisper',
      'Runs entirely in your browser — no API keys needed',
      'Export as TXT, SRT, or VTT subtitles',
      'Supports MP3, WAV, OGG, and more',
      'No signup, no server uploads',
    ],
    keywords: [
      'audio transcription',
      'speech to text',
      'transcribe audio online',
      'free audio to text',
      'whisper transcription',
      'private transcription tool',
      'ai transcription browser',
    ],
  },

  // ─── Image Tools ──────────────────────────────────────────────
  '/image/resizer': {
    title: 'Free Image Resizer & Converter | No Upload, 100% Private',
    description:
      'Resize images to any dimension and convert between PNG, JPG, WEBP. No server uploads — processed in your browser.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Resize to custom dimensions with aspect ratio lock',
      'Convert between PNG, JPG, and WEBP',
      'Batch processing support',
      'No signup, no server uploads',
    ],
    keywords: [
      'image resizer',
      'resize image online',
      'image converter',
      'png to jpg',
      'free image resizer',
      'private image editor',
      'browser image resizer',
    ],
  },

  '/image/pfp': {
    title: 'Free Profile Picture Cropper | Circle Crop Online',
    description:
      'Crop images into a perfect circle for profile pictures. Export as transparent PNG. No uploads — 100% browser-based.',
    applicationCategory: 'MultimediaApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Perfect circle cropping for profile pictures',
      'Export as transparent PNG',
      'Works with any image format',
      'No signup, no server uploads',
    ],
    keywords: [
      'profile picture cropper',
      'circle crop image',
      'pfp maker',
      'round profile picture',
      'free pfp cropper online',
      'avatar cropper',
    ],
  },

  // ─── PDF Tools ────────────────────────────────────────────────
  '/pdf/merge': {
    title: 'Free PDF Merger | Combine PDFs Privately in Browser',
    description:
      'Merge multiple PDF files into one document. Drag to reorder pages. Zero server uploads — 100% private, in-browser processing.',
    applicationCategory: 'UtilitiesApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Merge unlimited PDF files',
      'Drag-and-drop reordering',
      'Instant download of merged PDF',
      'No signup, no server uploads',
    ],
    keywords: [
      'pdf merger',
      'merge pdf files',
      'combine pdfs online',
      'free pdf combiner',
      'private pdf merger',
      'join pdf files',
    ],
  },

  '/pdf/split': {
    title: 'Free PDF Splitter & Page Extractor | 100% Private',
    description:
      'Split PDFs and extract specific pages with thumbnail preview. Zero server uploads — processed entirely in your browser.',
    applicationCategory: 'UtilitiesApplication',
    featureList: [
      '100% client-side processing — files never leave your device',
      'Visual page thumbnail preview',
      'Select specific pages to extract',
      'Split into multiple documents',
      'No signup, no server uploads',
    ],
    keywords: [
      'pdf splitter',
      'split pdf online',
      'extract pdf pages',
      'free pdf extractor',
      'private pdf splitter',
      'pdf page selector',
    ],
  },

  // ─── Dev Tools ────────────────────────────────────────────────
  '/dev/glassmorphism': {
    title: 'Free CSS Glassmorphism Generator | Live Preview',
    description:
      'Design frosted glass effects with live preview and copy production-ready CSS code. No signup — free and instant.',
    applicationCategory: 'DeveloperApplication',
    featureList: [
      'Live visual preview of glassmorphism effects',
      'Adjustable blur, transparency, and border radius',
      'Copy production-ready CSS with one click',
      'No signup required',
    ],
    keywords: [
      'glassmorphism generator',
      'css glass effect',
      'frosted glass css',
      'glassmorphism css tool',
      'free css generator',
      'glass ui generator',
    ],
  },

  '/dev/json': {
    title: 'Free JSON Formatter & Validator | Instant, Private',
    description:
      'Validate and beautifully format JSON data with syntax highlighting. See exact error locations instantly. 100% browser-based.',
    applicationCategory: 'DeveloperApplication',
    featureList: [
      '100% client-side processing',
      'JSON validation with exact error locations',
      'Syntax highlighting and pretty printing',
      'Minify and format modes',
      'No signup, no server uploads',
    ],
    keywords: [
      'json formatter',
      'json validator',
      'format json online',
      'json beautifier',
      'free json formatter',
      'validate json online',
      'json lint',
    ],
  },
};

/**
 * Category hub SEO metadata.
 * Used by category index pages for enhanced titles/descriptions.
 */
export const CATEGORY_SEO_CONFIG: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  '/audio': {
    title: 'Free Online Audio Tools | Trim, Merge, Boost & More',
    description:
      'Free browser-based audio tools — trim, merge, boost volume, extract from video, and transcribe. Zero server uploads. 100% private.',
    keywords: [
      'free audio tools',
      'online audio editor',
      'browser audio tools',
      'private audio editing',
      'no upload audio tools',
    ],
  },
  '/image': {
    title: 'Free Online Image Tools | Resize, Crop & Convert',
    description:
      'Free browser-based image tools — resize, convert, and crop profile pictures. No server uploads. 100% private and secure.',
    keywords: [
      'free image tools',
      'online image editor',
      'browser image tools',
      'private image editing',
      'no upload image tools',
    ],
  },
  '/pdf': {
    title: 'Free Online PDF Tools | Split, Merge & Extract Pages',
    description:
      'Free browser-based PDF tools — split, merge, and extract pages from PDFs. Zero server uploads. 100% private.',
    keywords: [
      'free pdf tools',
      'online pdf editor',
      'browser pdf tools',
      'private pdf editing',
      'no upload pdf tools',
    ],
  },
  '/dev': {
    title: 'Free Online Developer Tools | JSON Formatter, CSS Generator',
    description:
      'Free browser-based developer tools — format JSON, generate glassmorphism CSS, and more. Fast, private, no signup.',
    keywords: [
      'free dev tools',
      'online developer tools',
      'browser dev utilities',
      'json formatter',
      'css generator',
    ],
  },
};
