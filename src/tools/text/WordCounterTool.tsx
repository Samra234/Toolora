import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'it', 'this', 'that', 'by', 'as', 'from',
]);

export default function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = wordsArray.length;
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? text.split(/\n+/).filter((p) => p.trim().length > 0).length
      : 0;
    const readingMinutes = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;
    const speakingMinutes = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 130)) : 0;

    const freq = new Map<string, number>();
    for (const raw of wordsArray) {
      const clean = raw.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (clean.length >= 2 && !STOP_WORDS.has(clean)) {
        freq.set(clean, (freq.get(clean) ?? 0) + 1);
      }
    }
    const topKeywords = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        pct: wordCount > 0 ? ((count / wordCount) * 100).toFixed(1) : '0.0',
      }));

    return {
      wordCount,
      charCount,
      charNoSpaces,
      sentences,
      paragraphs,
      readingMinutes,
      speakingMinutes,
      topKeywords,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: stats.wordCount },
          { label: 'Characters', value: stats.charCount },
          { label: 'No Spaces', value: stats.charNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: stats.readingMinutes > 0 ? `${stats.readingMinutes} min` : '0 min' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white tabular-nums">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="word-counter-input" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Enter or paste your text
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Speaking time: ~{stats.speakingMinutes} min
          </span>
        </div>
        <textarea
          id="word-counter-input"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste an article, essay, or script..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {stats.topKeywords.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Top Keywords (excluding common stop words)
          </h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {stats.topKeywords.map((kw) => (
              <div
                key={kw.word}
                className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
              >
                <span className="truncate font-medium text-slate-800 dark:text-slate-200">{kw.word}</span>
                <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {kw.count} ({kw.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
