import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const UNESCAPE_MAP: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
  copy: '©',
  reg: '®',
  trade: '™',
};

function encodeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch] ?? ch);
}

function decodeHtml(str: string): string {
  return str.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (full, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = parseInt(entity.slice(2), 16);
      return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : full;
    }
    if (entity.startsWith('#')) {
      const code = parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : full;
    }
    return UNESCAPE_MAP[entity] ?? full;
  });
}

export default function HtmlEncoderDecoderTool() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');

  const output = useMemo(() => {
    if (!input) return '';
    return direction === 'encode' ? encodeHtml(input) : decodeHtml(input);
  }, [input, direction]);

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setDirection((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 w-fit">
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
            {mode === 'encode' ? 'Encode (Escape)' : 'Decode (Unescape)'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="html-input" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Input
          </label>
          <textarea
            id="html-input"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === 'encode'
                ? '<div class="card">Hello & welcome!</div>'
                : '&lt;div class=&quot;card&quot;&gt;Hello &amp; welcome!&lt;/div&gt;'
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="html-output" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Output
          </label>
          <textarea
            id="html-output"
            readOnly
            rows={8}
            value={output}
            placeholder="Result appears here..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={output} label="Copy Result" />
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
    </div>
  );
}
