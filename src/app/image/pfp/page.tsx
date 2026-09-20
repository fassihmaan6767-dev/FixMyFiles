import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { PfpCropperClient } from './pfp-cropper-client';

const toolConfig = TOOL_SEO_CONFIG['/image/pfp'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function PfpCropperPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/image/pfp" config={toolConfig} />
      <PfpCropperClient />
      <ToolArticleSection
        toolName="Profile Picture Cropper"
        whatIs={[
          'Ever tried setting a new profile picture on Discord, Slack, or Twitter, only to find half your head cut off or awkwardly off-center? Most apps expect circular avatars these days. But guessing how a square photo will look inside a round frame is frustrating, and booting up Photoshop just to cut out a circle feels like overkill.',
          'I built this circular profile picture cropper to make avatar framing quick and completely painless. Drop your photo into the circle, zoom in or out until the composition feels right, and drag your face directly into the sweet spot. What you see inside the preview ring is exactly what gets saved to your disk.',
          'When you hit download, the tool clips the photo using an HTML5 canvas arc and leaves the outer corners completely transparent. No ugly white boxes, no weird stretching, and zero watermarks stamped over your face.',
        ]}
        howToSteps={[
          'Drop your photo into the upload box or click to choose an image from your computer or phone.',
          'Click and drag inside the circle to pan your photo until your face or logo is centered.',
          'Use the zoom slider to dial in the crop — zoom in for a close headshot or zoom out for context.',
          'Select an output size from 128x128 for small forum badges up to 1024x1024 for sharp avatars.',
          'Click "Download PNG" to export your circular picture with true transparent corners.',
        ]}
        privacyInfo={[
          'Your personal photos and selfies never leave your device. Many web croppers upload your images to remote servers for processing, where files might sit in temporary storage or get indexed in server logs. That always felt unnecessary and invasive for simple image edits.',
          "This tool works 100% client-side inside your browser using the HTML5 Canvas API. Your device's processor does all the work locally in memory — from the circular clipping path to the final PNG compression. No data touches our servers, no files are stored, and you can even use the cropper offline.",
        ]}
        faqs={[
          {
            question: 'Will the corners outside the circle be completely transparent?',
            answer:
              'Yes. The image exports as a 32-bit PNG file with full alpha channel support. The background outside the circle is completely transparent, so your avatar blends cleanly against both dark and light modes on any app.',
          },
          {
            question: 'What size should I choose for Discord, Twitter, or LinkedIn?',
            answer:
              '512x512 pixels is the sweet spot for almost all social platforms. It looks crisp on Retina screens without creating an overly bulky file. For small chat badges, 256x256 is plenty, while 1024x1024 is ideal for high-resolution portfolio websites.',
          },
          {
            question: 'Can I crop high-resolution photos taken on my phone?',
            answer:
              'Yes. Whether you shot a portrait on an iPhone or an Android device, the canvas handles full-resolution photos smoothly. Just drop the file in, frame your face, and download your ready-to-use profile pic.',
          },
          {
            question: 'What image formats are supported?',
            answer:
              'You can upload standard formats including JPG, PNG, WebP, GIF, and SVG. Whatever format you start with, the output always downloads as a PNG to maintain the transparent circular cutout.',
          },
        ]}
      />
    </>
  );
}
