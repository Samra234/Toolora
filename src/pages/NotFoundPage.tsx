import { ArrowLeft, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/common/SeoHead';
import { CATEGORIES } from '../data/categories';

export default function NotFoundPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/tools?q=${encodeURIComponent(q)}` : '/tools');
  };

  return (
    <>
      <SeoHead
        title="Page Not Found (404) | Toolora"
        description="The page you requested could not be found on Toolora. Search our 32 free browser utilities or browse by category."
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <p className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">404</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          The URL you visited doesn't match a Toolora tool or page. Try searching our directory or
          choose a category below.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex items-center gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </>
  );
}
