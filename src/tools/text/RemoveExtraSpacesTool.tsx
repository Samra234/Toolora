import { RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

export default function RemoveExtraSpacesTool() {
  const [input, setInput] = useState('');
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [tabsToSpaces, setTabsToSpaces] = useState(true);
  const [singleLine, setSingleLine] = useState(false);

  const output = useMemo(() => {
    let result = input.replace(/\r\n/g, '\n');
    if (tabsToSpaces) {
      result = result.replace(/\t+/g, ' ');
    }
    if (singleLine) {
      result = result.replace(/\n+/g, ' ');
    }
    let lines = result.split('\n');
    if (trimLines) {
      lines = lines.map((line) => line.trim());
    }
    if (collapseSpaces) {
      lines = lines.map((line) => line.replace(/ {2,}/g, ' '));
    }
    if (removeEmptyLines) {
      lines = lines.filter((line) => line.length > 0);
    }
    return lines.join('\n');
  }, [input, collapseSpaces, trimLines, removeEmptyLines, tabsToSpaces, singleLine]);

  const removedChars = Math.max(0, input.length - output.length);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-xs">
        {[
          { label: 'Collapse multiple spaces', checked: collapseSpaces, onChange: setCollapseSpaces },
          { label: 'Trim line edges', checked: trimLines, onChange: setTrimLines },
          { label: 'Remove blank lines', checked: removeEmptyLines, onChange: setRemoveEmptyLines },
          { label: 'Convert tabs to spaces', checked: tabsToSpaces, onChange: setTabsToSpaces },
          { label: 'Flatten into single line', checked: singleLine, onChange: setSingleLine },
        ].map((opt) => (
          <label key={opt.label} className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={opt.checked}
              onChange={(e) => opt.onChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="spaces-input" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Original Text ({input.length} chars)
          </label>
          <textarea
            id="spaces-input"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste messy text with extra   spaces   and blank lines..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="spaces-output" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Cleaned Output ({output.length} chars)
            </label>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {removedChars} removed
            </span>
          </div>
          <textarea
            id="spaces-output"
            readOnly
            rows={8}
            value={output}
            placeholder="Cleaned text appears here..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={output} label="Copy Cleaned Text" />
        <button
          type="button"
          onClick={() => setInput(output)}
          disabled={!output || output === input}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Apply to Input</span>
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
