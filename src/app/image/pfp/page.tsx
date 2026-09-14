import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { PfpCropperClient } from './pfp-cropper-client';

const toolConfig = TOOL_SEO_CONFIG['/image/pfp'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function PfpPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/image/pfp" config={toolConfig} />
      <PfpCropperClient />
    </>
  );
}
