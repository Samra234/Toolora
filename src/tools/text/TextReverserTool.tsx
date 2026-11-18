import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

type ReverseMode = 'chars' | 'wordOrder' | 'eachWord' | 'lines';

export default function TextReverserTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ReverseMode>('chars');

  const output = useMemo(() => {
    if (!input) return '';
    if (mode === 'chars') {
      return Array.from(input).reverse().join('');
    }
    if (mode === 'wordOrder') {
      return input
        .split('\n')
        .map((line) => line.trim().split(/\s+/).reverse().join(' '))
        .join('\n');
    }
    if (mode === 'eachWord') {
      return input.replace(/\S+/g, (word) => Array.from(word).reverse().join(''));
    }
    return input.split('\n').reverse().join('\n');
  }, [input, mode]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        {[
          { id: 'chars', label: 'All Characters' },
          { id: 'wordOrder', label: 'Word Order' },
          { id: 'eachWord', label: 'Each Word' },
          { id: 'lines', label: 'Line Order' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id as ReverseMode)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === item.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="reverse-input" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Input Text
          </label>
          <textarea
            id="reverse-input"
            rows={7}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or lines to reverse..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="reverse-output" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Reversed Output
          </label>
          <textarea
            id="reverse-output"
            readOnly
            rows={7}
            value={output}
            placeholder="Reversed result appears here..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={output} label="Copy Reversed Text" />
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
