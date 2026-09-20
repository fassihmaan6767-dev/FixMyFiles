import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { AudioTrimmerClient } from './audio-trimmer-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/trimmer'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function AudioTrimmerPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/trimmer" config={toolConfig} />
      <AudioTrimmerClient />
      <ToolArticleSection
        toolName="Audio Trimmer"
        whatIs={[
          'Ever tried cutting a voice note or trimming silence from a podcast, only to get stuck uploading files to some clunky online editor? Most audio tools make you wait in server queues, register an account, or dodge intrusive ads just to snip a few seconds. It shouldn\'t be that complicated.',
          'I built this audio trimmer to make quick cuts fast and painless. Drop any track in, and your browser instantly renders the sound wave so you can see every beat, breath, and pause. Easily isolate your favorite chorus for a ringtone, slice out noise, or grab multiple clips in one pass.',
          'You get total control over how cuts are handled. Switch between extracting selected sections or deleting unwanted mistakes cleanly, then export your final audio directly as a WAV or MP3.',
        ]}
        howToSteps={[
          'Drop your audio file into the box above, or click to choose a track from your device.',
          'Pick your mode: "Extract Selected" to keep your highlighted sections, or "Delete Selected" to snip parts out.',
          'Drag the region handles across the waveform, or enter exact start and end timestamps.',
          'Use zoom controls for millisecond precision, then press play to preview your selection.',
          'Select your output format (WAV or MP3) and click "Export Audio" to save your file.',
        ]}
        privacyInfo={[
          'Your files never leave your computer. Standard web converters send your audio across the internet to remote servers, which eats up bandwidth and creates privacy concerns for private recordings, interviews, or unfinished songs.',
          'This tool works 100% locally inside your browser using the Web Audio API. Your device\'s processor handles the audio decoding, slicing, and MP3 encoding directly in memory. No uploads, no server logs, and zero tracking. In fact, you can turn off your internet after the page loads and it keeps running without an issue.',
        ]}
        faqs={[
          {
            question: 'Will trimming reduce my MP3 audio quality?',
            answer:
              'Exporting to WAV is completely lossless. For MP3 exports, audio is re-encoded at 128 kbps using the LAME library. It sounds crisp for podcasts and music clips, but pick WAV if you plan to do further audio editing.',
          },
          {
            question: 'What audio formats can I edit?',
            answer:
              'Any format your browser can play. That includes MP3, WAV, AAC, M4A, OGG, and WebM. Just drag it in and the waveform generates automatically.',
          },
          {
            question: 'Can I cut out multiple sections at once?',
            answer:
              'Yes. Click "Add Region" to create extra markers. In Extract mode, all regions are stitched into one file. In Delete mode, marked parts are removed and remaining audio is joined together.',
          },
          {
            question: 'Is there a file size or duration limit?',
            answer:
              'No server limits exist because nothing uploads to the cloud. You are only limited by your device\'s memory. Even hour-long recordings and voice memos process smoothly on modern hardware.',
          },
        ]}
      />
    </>
  );
}
