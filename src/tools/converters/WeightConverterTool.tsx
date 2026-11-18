import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { WEIGHT_UNITS, convertLinearUnit } from '../../utils/conversionData';
import { formatNumber } from '../../utils/formatters';

export default function WeightConverterTool() {
  const [valueStr, setValueStr] = useState('10');
  const [fromId, setFromId] = useState('kg');
  const [toId, setToId] = useState('lb');

  const fromUnit = WEIGHT_UNITS.find((u) => u.id === fromId) ?? WEIGHT_UNITS[2];
  const toUnit = WEIGHT_UNITS.find((u) => u.id === toId) ?? WEIGHT_UNITS[5];

  const numericValue = Number(valueStr);
  const isValid = valueStr.trim() !== '' && Number.isFinite(numericValue);
  const converted = isValid ? convertLinearUnit(numericValue, fromUnit, toUnit) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div className="md:col-span-5 space-y-2">
          <label htmlFor="wt-from-val" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Input Weight
          </label>
          <input
            id="wt-from-val"
            type="number"
            step="any"
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
          <select
            aria-label="From weight unit"
            value={fromUnit.id}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
          >
            {WEIGHT_UNITS.map((u) => (
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
            aria-label="Swap weight units"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-5 space-y-2">
          <label htmlFor="wt-to-val" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Converted Weight
          </label>
          <input
            id="wt-to-val"
            readOnly
            value={isValid ? formatNumber(converted, 6) : '—'}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums"
          />
          <select
            aria-label="To weight unit"
            value={toUnit.id}
            onChange={(e) => setToId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
          >
            {WEIGHT_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={isValid ? `${formatNumber(converted, 6)} ${toUnit.symbol}` : ''} label="Copy Result" />
        <button
          type="button"
          onClick={() => {
            setValueStr('10');
            setFromId('kg');
            setToId('lb');
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {isValid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {WEIGHT_UNITS.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs"
            >
              <span className="text-slate-600 dark:text-slate-400">{u.label}</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                {formatNumber(convertLinearUnit(numericValue, fromUnit, u), 5)} {u.symbol}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
