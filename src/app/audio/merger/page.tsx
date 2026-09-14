import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
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
    </>
  );
}
