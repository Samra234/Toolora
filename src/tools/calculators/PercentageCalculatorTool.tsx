import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { formatNumber } from '../../utils/formatters';

export default function PercentageCalculatorTool() {
  // Mode 1: What is X% of Y?
  const [p1, setP1] = useState('20');
  const [v1, setV1] = useState('250');

  // Mode 2: X is what % of Y?
  const [x2, setX2] = useState('45');
  const [y2, setY2] = useState('180');

  // Mode 3: % change from X to Y
  const [from3, setFrom3] = useState('120');
  const [to3, setTo3] = useState('150');

  // Mode 4: Increase/Decrease X by Y%
  const [base4, setBase4] = useState('200');
  const [pct4, setPct4] = useState('15');
  const [op4, setOp4] = useState<'add' | 'sub'>('add');

  const res1 = (Number(p1) / 100) * Number(v1);
  const res2 = Number(y2) !== 0 ? (Number(x2) / Number(y2)) * 100 : NaN;
  const res3 = Number(from3) !== 0 ? ((Number(to3) - Number(from3)) / Math.abs(Number(from3))) * 100 : NaN;
  const res4 =
    op4 === 'add'
      ? Number(base4) * (1 + Number(pct4) / 100)
      : Number(base4) * (1 - Number(pct4) / 100);

  const handleReset = () => {
    setP1('20');
    setV1('250');
    setX2('45');
    setY2('180');
    setFrom3('120');
    setTo3('150');
    setBase4('200');
    setPct4('15');
    setOp4('add');
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            1. What is X% of Y?
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <input
              aria-label="Percentage X"
              type="number"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
            <span className="text-slate-500">% of</span>
            <input
              aria-label="Value Y"
              type="number"
              value={v1}
              onChange={(e) => setV1(e.target.value)}
              className="w-28 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
          </div>
          <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            = {Number.isFinite(res1) ? formatNumber(res1, 4) : '—'}
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            2. X is what % of Y?
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <input
              aria-label="Part X"
              type="number"
              value={x2}
              onChange={(e) => setX2(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
            <span className="text-slate-500">out of</span>
            <input
              aria-label="Total Y"
              type="number"
              value={y2}
              onChange={(e) => setY2(e.target.value)}
              className="w-28 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
          </div>
          <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            = {Number.isFinite(res2) ? `${formatNumber(res2, 4)}%` : 'Cannot divide by 0'}
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            3. Percentage Change (Increase / Decrease)
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <input
              aria-label="From value"
              type="number"
              value={from3}
              onChange={(e) => setFrom3(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
            <span className="text-slate-500">to</span>
            <input
              aria-label="To value"
              type="number"
              value={to3}
              onChange={(e) => setTo3(e.target.value)}
              className="w-28 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
          </div>
          <p
            className={`font-mono text-lg font-bold tabular-nums ${
              !Number.isFinite(res3)
                ? 'text-red-600 dark:text-red-400 text-sm'
                : res3 >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {Number.isFinite(res3)
              ? `${res3 > 0 ? '+' : ''}${formatNumber(res3, 4)}% (${res3 >= 0 ? 'increase' : 'decrease'})`
              : 'Starting value cannot be 0'}
          </p>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            4. Add or Subtract a Percentage
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <input
              aria-label="Base number"
              type="number"
              value={base4}
              onChange={(e) => setBase4(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
            <select
              aria-label="Operation"
              value={op4}
              onChange={(e) => setOp4(e.target.value as 'add' | 'sub')}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs"
            >
              <option value="add">+ Add</option>
              <option value="sub">− Subtract</option>
            </select>
            <input
              aria-label="Percentage adjustment"
              type="number"
              value={pct4}
              onChange={(e) => setPct4(e.target.value)}
              className="w-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono tabular-nums"
            />
            <span className="text-slate-500">%</span>
          </div>
          <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            = {Number.isFinite(res4) ? formatNumber(res4, 4) : '—'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Reset Examples</span>
      </button>
    </div>
  );
}
