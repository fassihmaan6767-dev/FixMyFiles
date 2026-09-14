/**
 * ProseLayout
 * A Notion-style reading wrapper for legal/content pages.
 * Centered, max-width prose, beautiful typography.
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
    <section className="min-h-screen py-24 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-zinc-500">{subtitle}</p>
          )}
          <div className="mt-6 h-px bg-gradient-to-r from-blue-500/50 via-white/10 to-transparent" />
        </header>
        {/* Prose Content */}
        <div className="prose-custom">
          {children}
        </div>
      </div>
    </section>
  );
}
