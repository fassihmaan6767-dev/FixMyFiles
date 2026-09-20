import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { ImageResizerClient } from './image-resizer-client';

const toolConfig = TOOL_SEO_CONFIG['/image/resizer'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function ImageResizerPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/image/resizer" config={toolConfig} />
      <ImageResizerClient />
      <ToolArticleSection
        toolName="Image Resizer"
        whatIs={[
          'Ever tried uploading a photo to a website, only to get an error saying your image is too large or the wrong dimensions? Or maybe you needed pictures scaled down for an email, but opening desktop editors felt like overkill. Most online tools force you to upload private files to remote servers, wait in queues, or slap ugly watermarks on your work.',
          'I built this image resizer so you can scale photos in seconds right in your browser. Set exact pixel dimensions, lock the aspect ratio so pictures never stretch awkwardly, and convert between PNG, JPG, and WEBP. It is fast, clean, and handles your files without any hassle.',
        ]}
        howToSteps={[
          'Drop your image into the box above, or click to choose a file from your device.',
          'Enter your target width or height in pixels. Keep the aspect ratio locked to preserve natural proportions.',
          'Choose your export format: PNG for lossless quality, or JPG and WEBP for smaller downloads.',
          'Adjust the quality slider for JPG or WEBP to balance clarity against file size.',
          'Click "Download Resized Image" to save your scaled picture directly to your device.',
        ]}
        privacyInfo={[
          'Your photos never leave your device. Most web converters upload images to remote cloud servers, creating privacy risks for personal snapshots, sensitive documents, or client assets.',
          'This tool runs 100% locally in your browser using the HTML5 Canvas API. Your device\'s processor handles all the decoding, scaling, and compression directly in memory. There are no server uploads, no cloud logs, and zero tracking. Once loaded, you can even disconnect your internet and resize photos offline.',
        ]}
        faqs={[
          {
            question: 'Will resizing reduce image quality?',
            answer:
              'Downscaling large images keeps them sharp if you maintain the original aspect ratio. Upscaling smaller pictures can cause blurriness because the browser must estimate missing pixel details. For JPG and WEBP, setting quality around 85% yields crisp results with compact file sizes.',
          },
          {
            question: 'What formats can I convert between?',
            answer:
              'You can upload PNG, JPG, or WEBP images and export to PNG, JPG, or WEBP. PNG preserves transparency, while JPG and WEBP offer adjustable compression for smaller files.',
          },
          {
            question: 'Can I resize multiple images at once?',
            answer:
              'Yes, you can process multiple images in succession. Since scaling runs directly in your browser memory without server queues or upload limits, each picture resizes almost instantaneously.',
          },
          {
            question: 'Does resizing preserve EXIF metadata?',
            answer:
              'No. When images pass through the Canvas API, metadata like camera details, timestamps, and GPS coordinates are stripped. This provides a helpful privacy boost before you share photos online.',
          },
        ]}
      />
    </>
  );
}
