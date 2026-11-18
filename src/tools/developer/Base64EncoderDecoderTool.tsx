import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

function encodeUtf8Base64(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64;
}

function decodeUtf8Base64(b64Input: string): string {
  let normalized = b64Input.trim().replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4;
  if (pad === 2) normalized += '==';
  else if (pad === 3) normalized += '=';
  else if (pad === 1) throw new Error('Invalid Base64 string length.');

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export default function Base64EncoderDecoderTool() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      const result =
        direction === 'encode' ? encodeUtf8Base64(input, urlSafe) : decodeUtf8Base64(input);
      return { output: result, error: '' };
    } catch {
      return {
        output: '',
        error: 'Invalid Base64 input or non-UTF-8 byte sequence.',
      };
    }
  }, [input, direction, urlSafe]);

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

        {direction === 'encode' && (
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            <span>URL-Safe Base64 (- and _)</span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="b64-input" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            {direction === 'encode' ? 'Plain UTF-8 Text' : 'Base64 String'}
          </label>
          <textarea
            id="b64-input"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === 'encode'
                ? 'Enter text to encode to Base64...'
                : 'Paste Base64 string to decode...'
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="b64-output" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            {direction === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </label>
          <textarea
            id="b64-output"
            readOnly
            rows={8}
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
    </div>
  );
}
