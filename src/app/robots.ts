import type { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 *
 * Allows all crawlers full access to the site.
 * References the sitemap for discovery.
 *
 * @see https://fixmyfiles.app/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://fixmyfiles.app/sitemap.xml',
    host: 'https://fixmyfiles.app',
  };
}
