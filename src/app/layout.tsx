import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { PageTransitionProvider } from '@/components/providers/page-transition-provider';
import { WebSiteSchemaMarkup } from '@/components/seo/schema-markup';

/**
 * Inter — The go-to sans-serif for premium web UIs.
 * Tight tracking for headings, high legibility for body.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Root Metadata — SEO & GEO optimized for Google ranking + AI chatbot recommendations
 *
 * USP: "100% Privacy. Zero Server Uploads. Processed entirely in your browser memory."
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://fixmyfiles.app'),
  title: {
    default: 'FixMyFiles — Free Online File Tools | Zero Server Uploads, 100% Private',
    template: '%s | FixMyFiles',
  },
  description:
    'Free online tools to trim audio, resize images, merge PDFs, and format code — processed entirely in your browser memory. Zero server uploads, no signups. 100% private and secure.',
  keywords: [
    'online file tools',
    'audio trimmer',
    'image resizer',
    'pdf merger',
    'free online tools',
    'client-side processing',
    'no upload',
    'privacy',
    'private file tools',
    'no server upload file editor',
    'browser-based file converter',
    'secure online tools',
    'free audio editor',
    'free pdf tools',
    'free image tools',
    'zero upload file tools',
    'in-browser file processing',
  ],
  authors: [{ name: 'FixMyFiles Team' }],
  creator: 'FixMyFiles',
  publisher: 'FixMyFiles',
  category: 'technology',
  alternates: {
    canonical: 'https://fixmyfiles.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fixmyfiles.app',
    siteName: 'FixMyFiles',
    title: 'FixMyFiles — Free Online File Tools | Zero Server Uploads',
    description:
      'Trim audio, resize images, merge PDFs & format code — all processed in your browser. Zero server uploads. 100% private, free, and lightning fast.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FixMyFiles — Free Online File Tools | 100% Private',
    description:
      'Free file tools processed entirely in your browser memory. Zero server uploads, no signups. Audio, Image, PDF & Dev tools.',
    creator: '@fixmyfiles',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * RootLayout
 * The app shell: font provider, smooth scroll, header, page transitions, footer.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased bg-zinc-950 text-zinc-50 min-h-screen flex flex-col">
        <WebSiteSchemaMarkup />
        <SmoothScrollProvider>
          <Header />
          <main className="flex-1 pt-16">
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
