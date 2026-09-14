import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { SilenceRemoverClient } from './silence-remover-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/silence-remover'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function SilenceRemoverPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/silence-remover" config={toolConfig} />
      <SilenceRemoverClient />
    </>
  );
}
