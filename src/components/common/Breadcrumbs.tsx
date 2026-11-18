import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <Link
        to="/"
        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
      >
        Home
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-800 dark:text-slate-200" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
