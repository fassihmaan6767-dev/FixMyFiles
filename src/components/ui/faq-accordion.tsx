'use client';

import { ChevronDown } from 'lucide-react';

/**
 * FaqAccordion
 * Accessible FAQ section using native <details>/<summary>.
 * Zero JS overhead for expand/collapse — the browser handles it.
 * Chevron rotates via CSS (see globals.css .faq-item[open]).
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-white/5">
      {items.map((item, i) => (
        <details key={i} className="faq-item group">
          <summary>
            <span className="pr-4">{item.question}</span>
            <ChevronDown className="faq-chevron h-4 w-4 text-zinc-500" aria-hidden="true" />
          </summary>
          <div className="faq-answer">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
