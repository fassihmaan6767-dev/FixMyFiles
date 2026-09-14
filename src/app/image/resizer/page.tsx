import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
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
    </>
  );
}
