import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

const LIMITS = [
  { label: 'SEO Meta Title', max: 60 },
  { label: 'SEO Meta Description', max: 160 },
  { label: 'X / Twitter Post', max: 280 },
  { label: 'LinkedIn Summary Intro', max: 300 },
];

export default function CharacterCounterTool() {
  const [text, setText] = useState('');

  const metrics = useMemo(() => {
    const total = text.length;
    const withoutSpaces = text.replace(/\s/g, '').length;
    const spaces = total - withoutSpaces;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const bytes = new TextEncoder().encode(text).length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { total, withoutSpaces, spaces, lines, bytes, words };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Characters', value: metrics.total },
          { label: 'No Spaces', value: metrics.withoutSpaces },
          { label: 'Spaces', value: metrics.spaces },
          { label: 'Lines', value: metrics.lines },
          { label: 'UTF-8 Bytes', value: metrics.bytes },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white tabular-nums">
              {item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="char-counter-input" className="block mb-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          Text to measure
        </label>
        <textarea
          id="char-counter-input"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste copy to check character length and platform limits..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={text} label="Copy Text" />
        <button
          type="button"
          onClick={() => setText('')}
          disabled={!text}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Platform & SEO Length Checks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LIMITS.map((limit) => {
            const pct = Math.min(100, Math.round((metrics.total / limit.max) * 100));
            const over = metrics.total > limit.max;
            return (
              <div key={limit.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300">{limit.label}</span>
                  <span
                    className={`font-mono tabular-nums ${
                      over ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {metrics.total} / {limit.max}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full transition-all duration-150 ${
                      over ? 'bg-red-500' : 'bg-indigo-600 dark:bg-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
