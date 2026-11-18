import { AlertCircle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecentTools } from '../../context/RecentToolsContext';
import { getCategoryBySlug } from '../../data/categories';
import { getToolBySlug, ToolDefinition } from '../../data/tools';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { SeoHead } from '../common/SeoHead';
import { ToolCard } from '../common/ToolCard';
import { ToolIcon } from '../common/ToolIcon';

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const { recentSlugs, recordToolUsage } = useRecentTools();
  const category = getCategoryBySlug(tool.category);

  useEffect(() => {
    recordToolUsage(tool.slug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [tool.slug, recordToolUsage]);

  const relatedTools = tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t));

  const recentTools = recentSlugs
    .filter((slug) => slug !== tool.slug)
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => Boolean(t))
    .slice(0, 4);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      description: tool.seoDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    ...(tool.faqs.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <SeoHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        canonicalPath={`/tools/${tool.slug}`}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'All Tools', to: '/tools' },
            ...(category ? [{ label: category.name, to: `/category/${category.slug}` }] : []),
            { label: tool.name },
          ]}
        />

        {/* Tool Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                category?.iconBgClass ?? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
              }`}
            >
              <ToolIcon name={tool.iconName} className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {tool.name}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                {tool.shortDescription}
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Browser-side · Free to use
          </div>
        </div>

        {/* Main Workspace + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Interactive Tool Workspace */}
          <div className="lg:col-span-8 space-y-8">
            <section
              aria-label={`${tool.name} workspace`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs"
            >
              {children}
            </section>

            {/* How to Use + SEO Content + Limitations + FAQ */}
            <article className="space-y-8 pt-2">
              <section>
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  How to Use {tool.name}
                </h2>
                <ol className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  {tool.instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  About This Tool
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {tool.overview}
                </p>
              </section>

              <section className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Notes & Limitations
                    </h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {tool.limitations}
                    </p>
                  </div>
                </div>
              </section>

              {tool.faqs.length > 0 && (
                <section className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                  <div className="mt-4 space-y-4">
                    {tool.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 p-4"
                      >
                        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {faq.question}
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Privacy Guarantee</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {tool.name} executes entirely inside your browser. Files and text inputs are never
                sent to or stored on Toolora servers.
              </p>
            </div>

            {recentTools.length > 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  <span>Recently Used</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {recentTools.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/tools/${item.slug}`}
                        className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <span className="truncate">{item.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Related Tools Grid */}
        {relatedTools.length > 0 && (
          <section className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Related Tools
              </h2>
              {category && (
                <Link
                  to={`/category/${category.slug}`}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Browse {category.name}
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedTools.map((rel) => (
                <ToolCard key={rel.slug} tool={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
