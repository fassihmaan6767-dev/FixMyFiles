import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
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
    </>
  );
}
