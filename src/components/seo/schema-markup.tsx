/**
 * SchemaMarkup — Reusable JSON-LD Structured Data Component
 *
 * Renders `<script type="application/ld+json">` for search engines & AI bots.
 * This is a Server Component — safe to use in layout.tsx and page.tsx.
 *
 * Uses XSS-safe serialization per Next.js docs:
 * @see node_modules/next/dist/docs/01-app/02-guides/json-ld.md
 */

import type { ToolSeoEntry } from '@/lib/tool-seo-config';

// ─── Base URL ─────────────────────────────────────────────────
const SITE_URL = 'https://fixmyfiles.app';
const SITE_NAME = 'FixMyFiles';
const PRIVACY_USP =
  '100% Privacy. Zero Server Uploads. All files are processed entirely in your browser memory and never leave your device.';

// ─── Type definitions for JSON-LD schemas ─────────────────────

interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface SoftwareApplicationSchema {
  '@context': string;
  '@type': 'SoftwareApplication';
  name: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  description: string;
  featureList: string[];
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
}

interface FAQPageSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

type JsonLdSchema = WebSiteSchema | SoftwareApplicationSchema | FAQPageSchema;

// ─── Safe serializer ──────────────────────────────────────────

function safeJsonLd(data: JsonLdSchema): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

// ─── Generic renderer ─────────────────────────────────────────

function JsonLdScript({ data }: { data: JsonLdSchema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

// ─── WebSite Schema (for root layout) ─────────────────────────

export function WebSiteSchemaMarkup() {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: `Free online file tools — trim audio, resize images, merge PDFs, and format code. ${PRIVACY_USP}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLdScript data={schema} />;
}

// ─── SoftwareApplication Schema (for individual tool pages) ───

export function SoftwareAppSchemaMarkup({
  toolPath,
  config,
}: {
  toolPath: string;
  config: ToolSeoEntry;
}) {
  const schema: SoftwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${config.title} - ${SITE_NAME}`,
    url: `${SITE_URL}${toolPath}`,
    applicationCategory: config.applicationCategory,
    operatingSystem: 'All (Browser-based — works on Windows, macOS, Linux, iOS, Android)',
    description: `${config.description} ${PRIVACY_USP}`,
    featureList: config.featureList,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return <JsonLdScript data={schema} />;
}

// ─── FAQPage Schema (for homepage & category pages) ───────────

export function FAQSchemaMarkup({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema: FAQPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLdScript data={schema} />;
}
