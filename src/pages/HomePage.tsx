import { ArrowRight, Check, Clock, Lock, Search, Shield, Smartphone, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { ToolCard } from '../components/common/ToolCard';
import { ToolIcon } from '../components/common/ToolIcon';
import { useRecentTools } from '../context/RecentToolsContext';
import { CATEGORIES } from '../data/categories';
import { getToolBySlug, TOOLS, ToolDefinition } from '../data/tools';
import { useToolSearch } from '../hooks/useToolSearch';

const HOME_FAQS = [
  {
    question: 'Are Toolora utilities completely free to use?',
    answer:
      'Yes. All 32 tools across images, PDFs, text, developer utilities, calculators, and unit converters are free with no account registration or usage paywalls.',
  },
  {
    question: 'Does Toolora store my uploaded images or PDFs on a server?',
    answer:
      'No. Image compression, cropping, format conversion, PDF merging, splitting, and text processing run locally in your web browser using JavaScript, Canvas, pdf-lib, and PDF.js.',
  },
  {
    question: 'Do I need to install software or browser extensions?',
    answer:
      'No installation is required. Toolora works directly inside modern desktop and mobile browsers in both light and dark modes.',
  },
  {
    question: 'How accurate are the calculators and unit converters?',
    answer:
      'Converters use exact international standard factors (such as 1 inch = 25.4 mm and 1 lb = 0.45359237 kg). Financial and health calculators provide transparent formula-based estimates for informational reference.',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { recentSlugs } = useRecentTools();

  const quickMatches = useToolSearch(searchQuery, 'all').slice(0, 6);

  const popularTools = useMemo(() => TOOLS.filter((t) => t.popular).slice(0, 8), []);
  const featuredTools = useMemo(() => TOOLS.filter((t) => t.featured).slice(0, 6), []);
  const recentAddedTools = useMemo(() => TOOLS.filter((t) => t.recentlyAdded), []);

  const recentlyUsedTools = useMemo(
    () =>
      recentSlugs
        .map((slug) => getToolBySlug(slug))
        .filter((t): t is ToolDefinition => Boolean(t))
        .slice(0, 4),
    [recentSlugs]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/tools?q=${encodeURIComponent(q)}` : '/tools');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SeoHead
        title="Toolora – Free Online Tools for Everyday Tasks"
        description="Free, fast, privacy-first browser tools for image editing, PDF merging & splitting, text analysis, developer encoding, calculators, and unit conversions."
        canonicalPath="/"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
              32 Free Browser Utilities · Privacy-First Processing
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Free Online Tools for Everyday Tasks
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Compress images, merge and split PDFs, format JSON, generate QR codes, and run
              everyday calculations directly inside your browser without uploading files.
            </p>

            {/* Prominent Hero Search Bar */}
            <div className="relative mt-8 mx-auto max-w-2xl">
              <form onSubmit={handleSearchSubmit} role="search" aria-label="Search all tools">
                <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <Search className="ml-3 w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a tool (e.g., compress image, merge pdf, json, bmi)..."
                    aria-label="Search for a tool"
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Live instant search suggestions */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg text-left overflow-hidden">
                  {quickMatches.length > 0 ? (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {quickMatches.map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            to={`/tools/${tool.slug}`}
                            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <ToolIcon
                                name={tool.iconName}
                                className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                  {tool.name}
                                </p>
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                  {tool.shortDescription}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                      No matching tools found for "{searchQuery}".{' '}
                      <Link to="/tools" className="text-indigo-600 dark:text-indigo-400 underline">
                        Browse all tools
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
              >
                <span>Explore All 32 Tools</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/category/pdf-tools"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>Open PDF Suite</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 py-12">
        {/* Recently Used Tools (if any in localStorage) */}
        {recentlyUsedTools.length > 0 && (
          <section aria-labelledby="recent-used-heading">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <h2 id="recent-used-heading" className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  Jump Back In
                </h2>
              </div>
              <Link to="/tools" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                View directory
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentlyUsedTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Categories Grid */}
        <section aria-labelledby="categories-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <h2 id="categories-heading" className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Browse by Category
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Six focused workspaces built for documents, media, code, and everyday math.
              </p>
            </div>
            <Link
              to="/tools"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
            >
              All 32 tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-150 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cat.iconBgClass}`}>
                      <ToolIcon name={cat.iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                      {count} tools
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {cat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Popular Tools */}
        <section aria-labelledby="popular-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <h2 id="popular-heading" className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Popular Tools
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Most frequently opened utilities across image optimization, PDFs, and coding.
              </p>
            </div>
            <Link
              to="/tools"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
            >
              View all tools →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Featured Tools */}
        <section aria-labelledby="featured-heading">
          <div className="mb-6">
            <h2 id="featured-heading" className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Featured Workspaces
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Deep, interactive tools with live previews, customizable exports, and zero clutter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Recently Added Tools */}
        <section aria-labelledby="new-tools-heading">
          <div className="mb-6">
            <h2 id="new-tools-heading" className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Recently Added
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Newly released utilities ready to use in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {recentAddedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section
          aria-labelledby="benefits-heading"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-6 sm:p-10"
        >
          <div className="max-w-2xl">
            <h2 id="benefits-heading" className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Built for Speed, Clarity, and Local Privacy
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Every Toolora utility is engineered to work directly in your browser without
              requiring accounts, subscriptions, or server file uploads.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Browser-Side Privacy',
                body: 'Files stay on your device. Images and PDFs are processed locally in memory and never uploaded.',
              },
              {
                icon: Zap,
                title: 'Instant Results',
                body: 'No server queues or upload wait times. Live previews and conversions respond immediately.',
              },
              {
                icon: Lock,
                title: 'No Sign-Up Needed',
                body: 'Open any tool and start working right away with zero email gates or paywalls.',
              },
              {
                icon: Smartphone,
                title: 'Desktop & Mobile Ready',
                body: 'Accessible keyboard controls, dark mode support, and responsive layouts on every screen.',
              },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="space-y-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {benefit.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 id="faq-heading" className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOME_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-10 sm:px-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to get your task done faster?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-indigo-100">
              Browse all 32 free utilities or jump straight into image compression, PDF merging, or
              JSON formatting.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-indigo-100">
              <li className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Free forever</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Client-side privacy</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>No account required</span>
              </li>
            </ul>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open All Tools</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
