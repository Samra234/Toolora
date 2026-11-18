import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

export default function UrlEncoderDecoderTool() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [scope, setScope] = useState<'component' | 'fullUri'>('component');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      if (direction === 'encode') {
        const res = scope === 'component' ? encodeURIComponent(input) : encodeURI(input);
        return { output: res, error: '' };
      } else {
        const res = scope === 'component' ? decodeURIComponent(input) : decodeURI(input);
        return { output: res, error: '' };
      }
    } catch {
      return { output: '', error: 'Malformed percent-encoding sequence in input URL.' };
    }
  }, [input, direction, scope]);

  const queryParams = useMemo(() => {
    const candidate = direction === 'decode' && output ? output : input;
    const qIndex = candidate.indexOf('?');
    if (qIndex === -1) return [];
    try {
      const params = new URLSearchParams(candidate.slice(qIndex + 1));
      return Array.from(params.entries());
    } catch {
      return [];
    }
  }, [input, output, direction]);

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setDirection((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
          {(['encode', 'decode'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setDirection(mode)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                direction === mode
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <select
          aria-label="URL encoding scope"
          value={scope}
          onChange={(e) => setScope(e.target.value as 'component' | 'fullUri')}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200"
        >
          <option value="component">Component (encodeURIComponent)</option>
          <option value="fullUri">Full URL (encodeURI)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="url-input" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Input
          </label>
          <textarea
            id="url-input"
            rows={7}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://toolora.app/search?q=hello world&ref=home"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="url-output" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Output
          </label>
          <textarea
            id="url-output"
            readOnly
            rows={7}
            value={output}
            placeholder="Converted output appears here..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-2.5 text-xs text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={output} label="Copy Output" />
        <button
          type="button"
          onClick={handleSwap}
          disabled={!output}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Swap & Invert</span>
        </button>
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

      {queryParams.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            Parsed Query Parameters ({queryParams.length})
          </div>
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {queryParams.map(([key, val], idx) => (
                <tr key={`${key}-${idx}`}>
                  <td className="px-4 py-2 font-mono font-medium text-indigo-600 dark:text-indigo-400 w-1/3">
                    {key}
                  </td>
                  <td className="px-4 py-2 font-mono text-slate-700 dark:text-slate-300 break-all">
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
