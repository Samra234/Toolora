import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { TOOLS } from '../../data/tools';

export function Footer() {
  const popularTools = TOOLS.filter((t) => t.popular).slice(0, 6);

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              to="/"
              className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Toolora
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Free, fast, browser-based online utilities for everyday image editing, PDF tasks,
              text formatting, developer encoding, and calculations.
            </p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Client-side processing · No file storage
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Categories
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Popular Tools
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={`/tools/${tool.slug}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Company & Legal
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Toolora. All rights reserved.</p>
          <p>All tools run locally in your web browser.</p>
        </div>
      </div>
    </footer>
  );
}
