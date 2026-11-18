import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet',
]);

function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .split(/(\s+)/)
    .map((token, idx, arr) => {
      if (/^\s+$/.test(token)) return token;
      const isFirst = idx === 0;
      const isLast = idx === arr.length - 1;
      if (!isFirst && !isLast && MINOR_WORDS.has(token)) {
        return token;
      }
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join('');
}

function toSentenceCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export default function CaseConverterTool() {
  const [text, setText] = useState('');
  const [lastMode, setLastMode] = useState('');

  const applyTransform = (label: string, fn: (val: string) => string) => {
    setText((prev) => fn(prev));
    setLastMode(label);
  };

  const transforms = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'Title Case', fn: toTitleCase },
    { label: 'Sentence case', fn: toSentenceCase },
    {
      label: 'camelCase',
      fn: (s: string) => {
        const w = splitWords(s);
        return w
          .map((word, i) =>
            i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join('');
      },
    },
    {
      label: 'PascalCase',
      fn: (s: string) =>
        splitWords(s)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(''),
    },
    {
      label: 'snake_case',
      fn: (s: string) => splitWords(s).map((w) => w.toLowerCase()).join('_'),
    },
    {
      label: 'kebab-case',
      fn: (s: string) => splitWords(s).map((w) => w.toLowerCase()).join('-'),
    },
    {
      label: 'aLtErNaTiNg',
      fn: (s: string) =>
        Array.from(s)
          .map((ch, idx) => (idx % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase()))
          .join(''),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="case-converter-input" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Text Input / Output
          </label>
          {lastMode && (
            <span className="text-xs text-indigo-600 dark:text-indigo-400">
              Applied: {lastMode}
            </span>
          )}
        </div>
        <textarea
          id="case-converter-input"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text, then select a case transformation below..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {transforms.map((t) => (
          <button
            key={t.label}
            type="button"
            disabled={!text}
            onClick={() => applyTransform(t.label, t.fn)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 disabled:opacity-40 transition-colors"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <CopyButton text={text} label="Copy Result" />
        <button
          type="button"
          onClick={() => {
            setText('');
            setLastMode('');
          }}
          disabled={!text}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
