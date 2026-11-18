import { ArrowDownAZ, CheckCircle2, FileCode, Minimize2, RotateCcw, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { formatBytes } from '../../utils/formatters';

const SAMPLE_JSON = `{
  "service": "Toolora",
  "version": "1.0",
  "features": ["image-tools", "pdf-tools", "calculators"],
  "privacy": {
    "clientSide": true,
    "storesFiles": false
  }
}`;

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

export default function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState<string>('2');

  const parsed = useMemo(() => {
    if (!input.trim()) {
      return { valid: null as boolean | null, value: undefined, error: '' };
    }
    try {
      const value = JSON.parse(input);
      return { valid: true, value, error: '' };
    } catch (err) {
      return {
        valid: false,
        value: undefined,
        error: err instanceof Error ? err.message : 'Invalid JSON syntax.',
      };
    }
  }, [input]);

  const applyFormat = (mode: 'pretty' | 'minify' | 'sort') => {
    if (!parsed.valid) return;
    const space = indent === 'tab' ? '\t' : Number(indent);
    if (mode === 'minify') {
      setInput(JSON.stringify(parsed.value));
    } else if (mode === 'sort') {
      setInput(JSON.stringify(sortObjectKeys(parsed.value), null, space));
    } else {
      setInput(JSON.stringify(parsed.value, null, space));
    }
  };

  const byteSize = new TextEncoder().encode(input).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!parsed.valid}
            onClick={() => applyFormat('pretty')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Format</span>
          </button>
          <button
            type="button"
            disabled={!parsed.valid}
            onClick={() => applyFormat('minify')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Minify</span>
          </button>
          <button
            type="button"
            disabled={!parsed.valid}
            onClick={() => applyFormat('sort')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ArrowDownAZ className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sort Keys</span>
          </button>
          <button
            type="button"
            onClick={() => setInput(SAMPLE_JSON)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Load Sample
          </button>
        </div>

        <select
          aria-label="Indentation"
          value={indent}
          onChange={(e) => setIndent(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200"
        >
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="tab">Tab</option>
        </select>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {parsed.valid === true && (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Valid JSON</span>
              </span>
            )}
            {parsed.valid === false && (
              <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                <XCircle className="w-4 h-4" aria-hidden="true" />
                <span>Invalid JSON</span>
              </span>
            )}
            {parsed.valid === null && (
              <span className="text-slate-500 dark:text-slate-400">Paste JSON below to validate</span>
            )}
          </div>
          <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            {formatBytes(byteSize)}
          </span>
        </div>

        <textarea
          aria-label="JSON Editor"
          rows={12}
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"hello": "world"}'
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {parsed.error && (
        <p role="alert" className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-2.5 font-mono text-xs text-red-700 dark:text-red-300">
          {parsed.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={input} label="Copy JSON" />
        <button
          type="button"
          onClick={() => setInput('')}
          disabled={!input}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
