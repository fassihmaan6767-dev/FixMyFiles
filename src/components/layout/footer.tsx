import Link from 'next/link';
import { Wrench } from 'lucide-react';

/**
 * Footer
 * Clean 4-column grid footer with category links, legal links,
 * and brand information. Subtle border-top separator.
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
];

const connectLinks = [
  { href: 'https://github.com', label: 'GitHub' },
  { href: 'https://twitter.com', label: 'Twitter' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* --- Brand Column --- */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Wrench className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-semibold tracking-tight text-white">
                FixMyFiles
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Fast, free, and private file tools.
              Everything runs in your browser.
            </p>
          </div>

          {/* --- Tools Column --- */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4">Tools</h4>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Legal Column --- */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Connect Column --- */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4">Connect</h4>
            <ul className="space-y-2.5">
              {connectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} FixMyFiles. All rights reserved. 100% client-side processing.
          </p>
        </div>
      </div>
    </footer>
  );
}
