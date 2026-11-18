import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { ToolCard } from '../components/common/ToolCard';
import { ToolIcon } from '../components/common/ToolIcon';
import { CATEGORIES, getCategoryBySlug } from '../data/categories';
import { getToolsByCategory } from '../data/tools';
import NotFoundPage from './NotFoundPage';

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  if (!category) {
    return <NotFoundPage />;
  }

  const tools = getToolsByCategory(category.slug);
  const otherCategories = CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <>
      <SeoHead
        title={category.seoTitle}
        description={category.seoDescription}
        canonicalPath={`/category/${category.slug}`}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <Breadcrumbs items={[{ label: 'All Tools', to: '/tools' }, { label: category.name }]} />

          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.iconBgClass}`}>
              <ToolIcon name={category.iconName} className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {category.description}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {tools.length} free tools · Client-side browser execution
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        <section className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {otherCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ToolIcon name={cat.iconName} className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
