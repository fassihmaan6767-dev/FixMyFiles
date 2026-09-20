import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { AudioBoosterClient } from './audio-booster-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/booster'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function AudioBoosterPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/booster" config={toolConfig} />
      <AudioBoosterClient />
      <ToolArticleSection
        toolName="Audio Booster"
        whatIs={[
          'Have you ever recorded a voice memo, video clip, or lecture only to find the sound barely audible at maximum volume? It happens constantly. Standard media players can only play files as loud as their original baseline, leaving quiet recordings muffled and hard to understand on laptops or phones.',
          'This free audio booster fixes that by amplifying audio gain directly in your browser. Push weak tracks up to five times their original volume, or add warmth with a bass boost filter. Whether tuning a quiet podcast or beefing up a flat bassline, you can adjust everything in real time and download a clean, punchy file.',
        ]}
        howToSteps={[
          'Drop your audio file into the box above or click to select a track (MP3, WAV, FLAC, and OGG supported).',
          'Drag the Volume Boost slider past 100% to amplify quiet audio, up to 500% for faint recordings.',
          'Move the Bass Boost slider or click a preset like "Bass Heavy" to add low-end warmth.',
          'Hit play to preview changes live and tweak sliders until the sound is loud without buzzing.',
          'Choose your output format (WAV, MP3, WebM, or OGG) and click Export to save your file.',
        ]}
        privacyInfo={[
          "Most online audio tools require uploading files to remote servers, where your audio sits on someone else's drive. I built this tool to process everything directly inside your browser with the Web Audio API. Your files never leave your computer, so there is no waiting for uploads and no chance of anyone hearing your private recordings.",
          'Because processing happens entirely offline on your device, you can even disconnect from Wi-Fi once the page loads. Your audio remains completely private.',
        ]}
        faqs={[
          {
            question: 'Will boosting volume cause clipping or distortion?',
            answer:
              'Pushing volume too high can cause digital clipping if the waveform exceeds 0 dBFS, which sounds like harsh crackling. We recommend previewing at 150% to 200% first and turning it down slightly if you hear any crackle.',
          },
          {
            question: 'What is the maximum boost available?',
            answer:
              "You can amplify volume up to 500% (5x baseline) and increase bass by up to +20 dB. Quick presets like 'Loud' and 'Club Mode' give you fast, one-click starting points.",
          },
          {
            question: 'Can I boost bass without changing the volume?',
            answer:
              'Yes. Leave the volume slider at 100% and raise the bass control. The filter targets frequencies below 200 Hz, adding low-end punch while leaving vocals and high tones untouched.',
          },
          {
            question: 'Is the audio preview played in real time?',
            answer:
              'Yes. The preview plays through live Web Audio nodes. Any adjustment to the sliders updates the sound immediately so you can test before exporting.',
          },
        ]}
      />
    </>
  );
}
