import type { MetadataRoute } from 'next';

/**
 * Dynamic Sitemap
 *
 * Generates a comprehensive sitemap for all 24 routes:
 * - Homepage (priority 1.0)
 * - 4 category hubs (priority 0.9)
 * - 13 individual tool pages (priority 0.8)
 * - 3 informational pages (priority 0.5)
 *
 * @see https://fixmyfiles.app/sitemap.xml
 */

const BASE_URL = 'https://fixmyfiles.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ─── Homepage ───────────────────────────────────────────────
  const homepage: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // ─── Category Hub Pages ─────────────────────────────────────
  const categories = ['/audio', '/image', '/pdf', '/dev'];
  const categoryPages: MetadataRoute.Sitemap = categories.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // ─── Individual Tool Pages ──────────────────────────────────
  const tools = [
    '/audio/trimmer',
    '/audio/merger',
    '/audio/booster',
    '/audio/extract',
    '/audio/mono',
    '/audio/silence-remover',
    '/audio/transcript',
    '/image/resizer',
    '/image/pfp',
    '/pdf/merge',
    '/pdf/split',
    '/dev/glassmorphism',
    '/dev/json',
  ];
  const toolPages: MetadataRoute.Sitemap = tools.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ─── Informational / Legal Pages ────────────────────────────
  const infoRoutes = ['/about', '/privacy', '/terms', '/contact'];
  const infoPages: MetadataRoute.Sitemap = infoRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...homepage, ...categoryPages, ...toolPages, ...infoPages];
}
