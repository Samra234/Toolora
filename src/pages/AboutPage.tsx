import { ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Us – Privacy-First Online Tools | Toolora"
        description="Learn how Toolora builds fast, browser-based utilities for images, PDFs, text, developer workflows, calculators, and unit conversions without storing your files."
        canonicalPath="/about"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div>
          <Breadcrumbs items={[{ label: 'About Us' }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            About Toolora
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Toolora is an all-in-one collection of 32 everyday browser utilities designed around one
            practical principle: simple tasks should be fast, free, and private.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: 'Client-Side Execution',
              text: 'Image editing, PDF merging and splitting, encoding, and calculations run locally in your browser. Files never touch external storage.',
            },
            {
              icon: Wrench,
              title: 'Focused Utility Suite',
              text: 'Instead of bloated dashboards or paywalled downloads, every tool opens into a clean, single-purpose workspace.',
            },
            {
              icon: Sparkles,
              title: 'Open Access',
              text: 'No account registration, no software installers, and consistent keyboard-friendly layouts across desktop and mobile.',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            How Our Tools Work
          </h2>
          <p>
            Modern web browsers include powerful built-in APIs such as HTML5 Canvas, Web Workers,
            Web Crypto, and FileReader alongside client-side libraries like pdf-lib and PDF.js.
            Toolora pairs those capabilities with clean React interfaces so you can compress photos,
            split PDF pages, format JSON, or calculate loan amortization schedules immediately.
          </p>
          <p>
            Have a tool suggestion or spotted an edge case? Visit our{' '}
            <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 underline">
              Contact page
            </Link>{' '}
            to share feedback, or explore the{' '}
            <Link to="/tools" className="text-indigo-600 dark:text-indigo-400 underline">
              complete tools directory
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
