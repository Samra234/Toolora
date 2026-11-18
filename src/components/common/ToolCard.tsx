import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoryBySlug } from '../../data/categories';
import { ToolDefinition } from '../../data/tools';
import { ToolIcon } from './ToolIcon';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const category = getCategoryBySlug(tool.category);

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-150 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              category?.iconBgClass ?? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
            }`}
          >
            <ToolIcon name={tool.iconName} className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {category?.shortName ?? 'Tool'}
            {tool.recentlyAdded ? ' · New' : ''}
          </span>
        </div>

        <h3 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400">
        <span>Open tool</span>
        <ArrowRight
          className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
