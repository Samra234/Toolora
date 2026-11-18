import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { MULTI_UNIT_CATEGORIES, convertLinearUnit } from '../../utils/conversionData';
import { formatNumber } from '../../utils/formatters';

export default function UnitConverterTool() {
  const [categoryId, setCategoryId] = useState(MULTI_UNIT_CATEGORIES[0].id);
  const category = MULTI_UNIT_CATEGORIES.find((c) => c.id === categoryId) ?? MULTI_UNIT_CATEGORIES[0];

  const [fromId, setFromId] = useState(category.units[2].id);
  const [toId, setToId] = useState(category.units[6].id);
  const [valueStr, setValueStr] = useState('10');

  const handleCategoryChange = (nextCatId: string) => {
    const nextCat = MULTI_UNIT_CATEGORIES.find((c) => c.id === nextCatId) ?? MULTI_UNIT_CATEGORIES[0];
    setCategoryId(nextCat.id);
    setFromId(nextCat.units[0].id);
    setToId(nextCat.units[1]?.id ?? nextCat.units[0].id);
    setValueStr('1');
  };

  const fromUnit = category.units.find((u) => u.id === fromId) ?? category.units[0];
  const toUnit = category.units.find((u) => u.id === toId) ?? category.units[1] ?? category.units[0];

  const numericValue = Number(valueStr);
  const isValid = valueStr.trim() !== '' && Number.isFinite(numericValue);

  const converted = useMemo(() => {
    if (!isValid) return 0;
    return convertLinearUnit(numericValue, fromUnit, toUnit);
  }, [isValid, numericValue, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromId(toUnit.id);
    setToId(fromUnit.id);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
        {MULTI_UNIT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              category.id === cat.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Converter */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div className="md:col-span-5 space-y-2">
          <label htmlFor="unit-from-val" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            From Value
          </label>
          <input
            id="unit-from-val"
            type="number"
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
          <select
            aria-label="From unit"
            value={fromUnit.id}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1 flex justify-center pb-1">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap units"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-5 space-y-2">
          <label htmlFor="unit-to-val" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Converted Result
          </label>
          <input
            id="unit-to-val"
            readOnly
            value={isValid ? formatNumber(converted, 6) : '—'}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums"
          />
          <select
            aria-label="To unit"
            value={toUnit.id}
            onChange={(e) => setToId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
          >
            {category.units.map((u) => (
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
          onClick={() => setValueStr('1')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Full Comparison Grid */}
      {isValid && (
        <div>
          <h3 className="mb-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            All {category.label} Equivalents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {category.units.map((u) => (
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
        </div>
      )}
    </div>
  );
}
