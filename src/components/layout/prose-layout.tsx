/**
 * ProseLayout
 * A Notion-style reading wrapper for legal/content pages.
 * Centered, max-width prose, beautiful typography for both Light and Dark modes.
 */
export function ProseLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="min-h-screen py-20 sm:py-24 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
          )}
          <div className="mt-6 h-px bg-gradient-to-r from-blue-500/50 via-zinc-300/60 dark:via-white/10 to-transparent" />
        </header>
        {/* Prose Content */}
        <div className="prose-custom">
          {children}
        </div>
      </div>
    </section>
  );
}
