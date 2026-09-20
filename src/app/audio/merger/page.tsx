import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { AudioMergerClient } from './audio-merger-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/merger'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function AudioMergerPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/merger" config={toolConfig} />
      <AudioMergerClient />
      <ToolArticleSection
        toolName="Audio Merger"
        whatIs={[
          "Ever tried stitching together a podcast intro and an interview, or combining several voice memos into a single clean audio file? Most online joiners force you to upload large sound files to a remote server, wait in slow processing queues, and hand over your email just to download the final result. It feels clunky, slow, and totally unnecessary for a quick task that should take just seconds.",
          "I built this audio merger to solve that exact annoyance. Instead of pushing your audio over the internet, it taps into your browser's Web Audio engine to decode each track directly in memory. You can drop in recordings from different devices, reorder them with a simple drag-and-drop, and join them into one continuous track in seconds.",
          "Whether you are assembling a quick DJ mix, lining up voiceovers for a video, or combining split audiobook chapters, the tool does all the heavy processing right on your machine without any fuss.",
        ]}
        howToSteps={[
          "Drop your audio files into the upload box or click to select them from your device.",
          "Drag and drop tracks up or down to arrange them in your exact playback order.",
          "Review track durations and remove any unwanted files using the delete icon.",
          "Select your export format—choose WAV for lossless quality or MP3 for smaller, shareable files.",
          "Click 'Merge & Export' to stitch the audio together and download your finished file immediately.",
        ]}
        privacyInfo={[
          "Every file you select stays strictly on your computer. The Web Audio API decodes audio data locally in memory, and lamejs encodes your output right inside your browser tab. No sound files ever travel to a cloud server, and no logs or temp files are stored anywhere.",
          "Your personal recordings, confidential interviews, and client voiceover projects remain completely private to you. In fact, you can disconnect your internet connection after loading the page, and the merger will still work flawlessly without sending a single byte.",
        ]}
        faqs={[
          {
            question: "Can I merge files in different formats together?",
            answer:
              "Yes, you can freely mix and match MP3, WAV, and OGG files in the same session. The browser decodes each file into raw audio data before stitching them, so mismatched source formats combine without any glitches.",
          },
          {
            question: "Will there be gaps or silence between merged tracks?",
            answer:
              "No, tracks are concatenated end-to-end at the sample level. As long as your original audio files do not have silent padding at the start or end, the transition between tracks happens instantly.",
          },
          {
            question: "How many audio files can I merge at once?",
            answer:
              "There is no artificial limit on how many files you can add. Merging relies on your device's available RAM, so combining a dozen songs, podcast segments, or lecture clips runs smoothly on virtually any modern computer.",
          },
          {
            question: "Does merging reduce the audio quality?",
            answer:
              "Exporting to WAV keeps your audio completely lossless and uncompressed. If you export to MP3, the built-in lamejs encoder produces high-bitrate output, keeping audible quality crisp without unnecessary generational loss.",
          },
        ]}
      />
    </>
  );
}
