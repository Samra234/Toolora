import { RefreshCw, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

const CLASSIC_SENTENCE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non',
  'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

function buildSentence(wordCount: number, seedOffset: number): string {
  const picked: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = (seedOffset * 7 + i * 13) % WORDS.length;
    picked.push(WORDS[idx]);
  }
  const first = picked[0].charAt(0).toUpperCase() + picked[0].slice(1);
  return `${[first, ...picked.slice(1)].join(' ')}.`;
}

export default function LoremIpsumGeneratorTool() {
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [htmlTags, setHtmlTags] = useState(false);
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const safeCount = Math.max(1, Math.min(50, count || 1));

    if (unit === 'words') {
      const resultWords: string[] = [];
      const classicWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
      for (let i = 0; i < safeCount; i++) {
        if (startClassic && i < classicWords.length) {
          resultWords.push(classicWords[i]);
        } else {
          resultWords.push(WORDS[(seed * 5 + i * 11) % WORDS.length]);
        }
      }
      return resultWords.join(' ');
    }

    if (unit === 'sentences') {
      const list: string[] = [];
      for (let i = 0; i < safeCount; i++) {
        if (startClassic && i === 0) {
          list.push(CLASSIC_SENTENCE);
        } else {
          list.push(buildSentence(10 + ((i + seed) % 6), seed + i + 1));
        }
      }
      return list.join(' ');
    }

    const paragraphs: string[] = [];
    for (let p = 0; p < safeCount; p++) {
      const sList: string[] = [];
      const sentenceCount = 4 + ((p + seed) % 2);
      for (let s = 0; s < sentenceCount; s++) {
        if (startClassic && p === 0 && s === 0) {
          sList.push(CLASSIC_SENTENCE);
        } else {
          sList.push(buildSentence(9 + ((p + s + seed) % 7), seed + p * 10 + s + 1));
        }
      }
      const paragraphText = sList.join(' ');
      paragraphs.push(htmlTags ? `<p>${paragraphText}</p>` : paragraphText);
    }
    return paragraphs.join('\n\n');
  }, [unit, count, startClassic, htmlTags, seed]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div>
          <label htmlFor="lorem-unit" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Generate Type
          </label>
          <select
            id="lorem-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'paragraphs' | 'sentences' | 'words')}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <div>
          <label htmlFor="lorem-count" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Count (1–50)
          </label>
          <input
            id="lorem-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-col justify-center gap-2 pt-2 sm:pt-4 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={startClassic}
              onChange={(e) => setStartClassic(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            <span>Start with "Lorem ipsum..."</span>
          </label>
          {unit === 'paragraphs' && (
            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={htmlTags}
                onChange={(e) => setHtmlTags(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <span>Wrap in &lt;p&gt; HTML tags</span>
            </label>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="lorem-output" className="sr-only">
          Generated placeholder text
        </label>
        <textarea
          id="lorem-output"
          readOnly
          rows={10}
          value={output}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm leading-relaxed text-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={output} label="Copy Placeholder Text" />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Shuffle Copy</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setUnit('paragraphs');
            setCount(3);
            setStartClassic(true);
            setHtmlTags(false);
            setSeed(1);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
