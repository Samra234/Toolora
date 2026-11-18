import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { ToolCard } from '../components/common/ToolCard';
import { CATEGORIES, CategorySlug } from '../data/categories';
import { TOOLS } from '../data/tools';
import { useToolSearch } from '../hooks/useToolSearch';

export default function AllToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const filteredTools = useToolSearch(query, selectedCategory);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <>
      <SeoHead
        title="All Free Online Tools Directory (32 Tools) | Toolora"
        description="Browse and search all 32 free browser-based utilities on Toolora: image tools, PDF tools, text formatting, developer tools, calculators, and converters."
        canonicalPath="/tools"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <Breadcrumbs items={[{ label: 'All Tools' }]} />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                All Online Tools
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Search by tool name or keyword, or filter across all {TOOLS.length} browser-based utilities.
              </p>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
              Showing {filteredTools.length} of {TOOLS.length} tools
            </p>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          <div className="relative max-w-xl">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Filter tools by name or keyword..."
              aria-label="Filter tools"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.slug
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              No tools matched "{query}"
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try a different keyword or reset the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                handleQueryChange('');
                setSelectedCategory('all');
              }}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Show All Tools
            </button>
          </div>
        )}
      </div>
    </>
  );
}
