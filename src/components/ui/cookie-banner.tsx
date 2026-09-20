'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'fixmyfiles-cookie-consent';

/**
 * CookieBanner
 * GDPR/CCPA compliant cookie consent banner with dual-theme styling.
 * Checks localStorage on mount — if consent was already given, stays hidden.
 * "Accept" saves consent and closes. "Manage" links to Google Ads Settings.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't already consented
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-banner-enter fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl transition-colors">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              We use cookies to serve personalized ads and analyze traffic. Since our tools process
              files locally in your browser, <strong className="text-zinc-900 dark:text-zinc-100">your files are
              never tracked or uploaded</strong>. By continuing to use this site, you consent to
              our use of cookies.{' '}
              <a
                href="/privacy"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAccept}
                className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-xs"
              >
                Accept All
              </button>
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors"
              >
                Manage Preferences
              </a>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss cookie banner"
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
