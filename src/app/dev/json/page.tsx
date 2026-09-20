import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { JsonFormatterClient } from './json-formatter-client';

const toolConfig = TOOL_SEO_CONFIG['/dev/json'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function JsonFormatterPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/dev/json" config={toolConfig} />
      <JsonFormatterClient />
      <ToolArticleSection
        toolName="JSON Formatter & Validator"
        whatIs={[
          'We\'ve all stared at a massive blob of unformatted JSON returned by an API or dumped into a log file. It is an unreadable wall of curly brackets, escaped quotes, and missing indentation. Trying to find a specific key or debug an unexpected null value inside raw text gives you an instant headache.',
          'I created this formatter to clean up that mess in a single click. Paste your payload, choose whether you want 2 spaces, 4 spaces, or tabs, and immediately see clean, readable data with syntax highlighting. If there is a syntax error like a trailing comma or missing bracket, the validator tells you the exact problem so you can fix it fast.',
          'You can also flip the script and minify bloated JSON payloads to reduce payload sizes for production requests or config files. It gives you quick, clean formatting without distracting clutter.',
        ]}
        howToSteps={[
          'Paste your raw JSON text directly into the input editor.',
          'Pick your preferred indentation spacing, such as 2 spaces, 4 spaces, or 8-space tabs.',
          'Click "Format" to pretty-print your data, or hit "Minify" to strip out all unnecessary whitespace.',
          'Check the validation badge. A green banner confirms valid syntax, while red points out parsing errors.',
          'Click "Copy" to put the clean JSON onto your clipboard for your code or configuration files.',
        ]}
        privacyInfo={[
          'Your data stays entirely on your computer. Many popular online JSON formatters send your text to remote servers for processing. If you are formatting customer payloads, API tokens, database records, or private environment variables, sending that data over the network poses serious privacy risks.',
          'This tool runs 100% inside your browser using native JavaScript parsing (JSON.parse and JSON.stringify). Nothing gets uploaded to a server, saved to a database, or logged anywhere. You could disconnect your Wi-Fi right now and format gigabytes of confidential config files without leaking a single byte.',
        ]}
        faqs={[
          {
            question: 'Will this tool fix broken or invalid JSON automatically?',
            answer:
              'It identifies syntax errors like trailing commas, unquoted keys, or missing brackets, showing the parser message. However, it will not guess your intentions to alter broken data. You can fix the flagged line manually, then format again.',
          },
          {
            question: 'What is the maximum JSON file size I can format?',
            answer:
              'Because processing happens client-side in memory, there is no strict server limit. Most modern browsers easily handle payloads between 20 MB and 50 MB without stuttering.',
          },
          {
            question: 'Can I minify JSON for production use?',
            answer:
              'Yes. Click the "Minify" button to strip every newline, indentation space, and trailing break. You get a single compact line ready for network transfers or environment variables.',
          },
          {
            question: 'Does it handle deeply nested objects and arrays?',
            answer:
              'Absolutely. The engine handles arbitrarily deep nesting levels, arrays of complex objects, Unicode characters, and standard primitive types accurately with clear indentation.',
          },
        ]}
      />
    </>
  );
}
