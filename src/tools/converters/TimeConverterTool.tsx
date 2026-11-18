import { ArrowLeftRight, Clock, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { TIME_UNITS, convertLinearUnit } from '../../utils/conversionData';
import { formatNumber } from '../../utils/formatters';

export default function TimeConverterTool() {
  const [tab, setTab] = useState<'duration' | 'unix'>('duration');

  // Duration state
  const [valueStr, setValueStr] = useState('24');
  const [fromId, setFromId] = useState('hr');
  const [toId, setToId] = useState('min');

  // Unix state
  const [epochInput, setEpochInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [epochUnit, setEpochUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  const fromUnit = TIME_UNITS.find((u) => u.id === fromId) ?? TIME_UNITS[3];
  const toUnit = TIME_UNITS.find((u) => u.id === toId) ?? TIME_UNITS[2];
  const numericVal = Number(valueStr);
  const isValidDuration = valueStr.trim() !== '' && Number.isFinite(numericVal);
  const converted = isValidDuration ? convertLinearUnit(numericVal, fromUnit, toUnit) : 0;

  const parsedDate = useMemo(() => {
    const raw = Number(epochInput);
    if (epochInput.trim() === '' || !Number.isFinite(raw)) return null;
    const ms = epochUnit === 'seconds' ? raw * 1000 : raw;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return {
      iso: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString(),
    };
  }, [epochInput, epochUnit]);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab('duration')}
          className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
            tab === 'duration'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Duration Units
        </button>
        <button
          type="button"
          onClick={() => setTab('unix')}
          className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
            tab === 'unix'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Unix Epoch Timestamp
        </button>
      </div>

      {tab === 'duration' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
            <div className="md:col-span-5 space-y-2">
              <label htmlFor="time-from-val" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Input Duration
              </label>
              <input
                id="time-from-val"
                type="number"
                step="any"
                value={valueStr}
                onChange={(e) => setValueStr(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
              />
              <select
                aria-label="From time unit"
                value={fromUnit.id}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              >
                {TIME_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex justify-center pb-1">
              <button
                type="button"
                onClick={() => {
                  setFromId(toUnit.id);
                  setToId(fromUnit.id);
                }}
                aria-label="Swap time units"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <div className="md:col-span-5 space-y-2">
              <label htmlFor="time-to-val" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Converted Duration
              </label>
              <input
                id="time-to-val"
                readOnly
                value={isValidDuration ? formatNumber(converted, 6) : '—'}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums"
              />
              <select
                aria-label="To time unit"
                value={toUnit.id}
                onChange={(e) => setToId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              >
                {TIME_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CopyButton
              text={isValidDuration ? `${formatNumber(converted, 6)} ${toUnit.symbol}` : ''}
              label="Copy Result"
            />
            <button
              type="button"
              onClick={() => {
                setValueStr('24');
                setFromId('hr');
                setToId('min');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>

          {isValidDuration && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {TIME_UNITS.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs"
                >
                  <span className="text-slate-600 dark:text-slate-400">{u.label}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatNumber(convertLinearUnit(numericVal, fromUnit, u), 4)} {u.symbol}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="unix-ts-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Unix Epoch Timestamp
              </label>
              <input
                id="unix-ts-input"
                type="number"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="unix-unit" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Precision
              </label>
              <select
                id="unix-unit"
                value={epochUnit}
                onChange={(e) => setEpochUnit(e.target.value as 'seconds' | 'milliseconds')}
                className="mt-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() =>
                setEpochInput(
                  epochUnit === 'seconds' ? String(Math.floor(Date.now() / 1000)) : String(Date.now())
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Use Current Time</span>
            </button>
          </div>

          {parsedDate ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { label: 'ISO 8601', value: parsedDate.iso },
                { label: 'UTC String', value: parsedDate.utc },
                { label: 'Local Time', value: parsedDate.local },
              ].map((row) => (
                <div key={row.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs">
                  <span className="font-medium text-slate-500 dark:text-slate-400">{row.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-900 dark:text-slate-100">{row.value}</span>
                    <CopyButton text={row.value} label="Copy" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-red-600 dark:text-red-400">Enter a valid numeric Unix timestamp.</p>
          )}
        </div>
      )}
    </div>
  );
}
