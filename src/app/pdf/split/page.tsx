import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { PdfSplitClient } from './pdf-split-client';

const toolConfig = TOOL_SEO_CONFIG['/pdf/split'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function PdfSplitPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/pdf/split" config={toolConfig} />
      <PdfSplitClient />
    </>
  );
}
