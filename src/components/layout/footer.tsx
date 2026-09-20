import Link from 'next/link';
import { Wrench } from 'lucide-react';

/**
 * Footer
 * Clean 4-column grid footer with category links, legal links,
 * and brand information. Beautiful dual-theme styling.
 */

const toolLinks = [
  { href: '/audio', label: 'Audio Tools' },
  { href: '/image', label: 'Image Tools' },
  { href: '/pdf', label: 'PDF Tools' },
  { href: '/dev', label: 'Dev Tools' },
];

const legalLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact Us' },
];

const connectLinks = [
  { href: 'https://github.com', label: 'GitHub' },
  { href: 'https://twitter.com', label: 'Twitter' },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* --- Brand Column --- */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                FixMyFiles
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Fast, free, and private file tools.
              Everything runs locally in your browser memory.
            </p>
          </div>

          {/* --- Tools Column --- */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-4">Tools</h4>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Legal Column --- */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Connect Column --- */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-4">Connect</h4>
            <ul className="space-y-2.5">
              {connectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="mt-12 pt-8 border-t border-zinc-200/60 dark:border-white/5">
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} FixMyFiles. All rights reserved. 100% client-side processing.
          </p>
        </div>
      </div>
    </footer>
  );
}
