import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/';
const AMBIGUOUS = new Set(['0', 'O', '1', 'l', 'I']);

function secureRandomIndex(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let rand = 0;
  do {
    crypto.getRandomValues(arr);
    rand = arr[0];
  } while (rand >= limit);
  return rand % max;
}

function generateSecurePassword(
  length: number,
  opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; excludeAmbiguous: boolean }
): { password: string; poolSize: number } {
  const sets: string[] = [];
  const filterAmbiguous = (s: string) =>
    opts.excludeAmbiguous ? Array.from(s).filter((c) => !AMBIGUOUS.has(c)).join('') : s;

  if (opts.upper) sets.push(filterAmbiguous(UPPER));
  if (opts.lower) sets.push(filterAmbiguous(LOWER));
  if (opts.numbers) sets.push(filterAmbiguous(NUMBERS));
  if (opts.symbols) sets.push(SYMBOLS);

  const validSets = sets.filter((s) => s.length > 0);
  if (validSets.length === 0) return { password: '', poolSize: 0 };

  const pool = validSets.join('');
  const chars: string[] = [];

  // Ensure at least one char from each selected character class
  for (const s of validSets) {
    if (chars.length < length) {
      chars.push(s[secureRandomIndex(s.length)]);
    }
  }
  while (chars.length < length) {
    chars.push(pool[secureRandomIndex(pool.length)]);
  }

  // Fisher-Yates shuffle with Web Crypto
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return { password: chars.join(''), poolSize: pool.length };
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [poolSize, setPoolSize] = useState(0);
  const [batch, setBatch] = useState<string[]>([]);

  const regenerate = useCallback(() => {
    const opts = { upper, lower, numbers, symbols, excludeAmbiguous };
    const main = generateSecurePassword(length, opts);
    setPassword(main.password);
    setPoolSize(main.poolSize);

    const list: string[] = [];
    for (let i = 0; i < 4; i++) {
      list.push(generateSecurePassword(length, opts).password);
    }
    setBatch(list.filter(Boolean));
  }, [length, upper, lower, numbers, symbols, excludeAmbiguous]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const entropyBits = poolSize > 1 ? Math.round(length * Math.log2(poolSize)) : 0;
  const strengthLabel =
    entropyBits >= 80
      ? { text: 'Very Strong', color: 'text-emerald-600 dark:text-emerald-400' }
      : entropyBits >= 60
      ? { text: 'Strong', color: 'text-indigo-600 dark:text-indigo-400' }
      : entropyBits >= 40
      ? { text: 'Moderate', color: 'text-amber-600 dark:text-amber-400' }
      : { text: 'Weak', color: 'text-red-600 dark:text-red-400' };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">Generated Password</p>
            <p
              aria-live="polite"
              className="mt-1 break-all font-mono text-lg sm:text-xl font-semibold text-slate-900 dark:text-white select-all"
            >
              {password || 'Select at least one character set'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CopyButton text={password} label="Copy" />
            <button
              type="button"
              onClick={regenerate}
              disabled={!poolSize}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
          <span className={`inline-flex items-center gap-1.5 font-semibold ${strengthLabel.color}`}>
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>{strengthLabel.text}</span>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            ~{entropyBits} bits of entropy · Pool size {poolSize}
          </span>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <label htmlFor="pw-length">Password Length</label>
            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {length} characters
            </span>
          </div>
          <input
            id="pw-length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-2 w-full accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-2">
          {[
            { label: 'Uppercase (A-Z)', checked: upper, set: setUpper },
            { label: 'Lowercase (a-z)', checked: lower, set: setLower },
            { label: 'Numbers (0-9)', checked: numbers, set: setNumbers },
            { label: 'Symbols (!@#$...)', checked: symbols, set: setSymbols },
            { label: 'Exclude ambiguous (0, O, 1, l, I)', checked: excludeAmbiguous, set: setExcludeAmbiguous },
          ].map((opt) => (
            <label key={opt.label} className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.set(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {batch.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Additional Options
          </h3>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {batch.map((pw, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="truncate font-mono text-xs text-slate-800 dark:text-slate-200">{pw}</span>
                <CopyButton text={pw} label="Copy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
