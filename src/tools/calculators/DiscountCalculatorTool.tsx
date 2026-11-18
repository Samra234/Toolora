import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function DiscountCalculatorTool() {
  const [price, setPrice] = useState('120');
  const [discount1, setDiscount1] = useState('25');
  const [discount2, setDiscount2] = useState('0');
  const [taxRate, setTaxRate] = useState('0');

  const calc = useMemo(() => {
    const p = Math.max(0, Number(price) || 0);
    const d1 = Math.max(0, Math.min(100, Number(discount1) || 0));
    const d2 = Math.max(0, Math.min(100, Number(discount2) || 0));
    const tax = Math.max(0, Math.min(100, Number(taxRate) || 0));

    const afterFirst = p * (1 - d1 / 100);
    const afterSecond = afterFirst * (1 - d2 / 100);
    const saved = p - afterSecond;
    const taxAmount = afterSecond * (tax / 100);
    const finalTotal = afterSecond + taxAmount;
    const effectiveDiscountPct = p > 0 ? (saved / p) * 100 : 0;

    return {
      afterSecond,
      saved,
      taxAmount,
      finalTotal,
      effectiveDiscountPct,
    };
  }, [price, discount1, discount2, taxRate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div>
          <label htmlFor="disc-price" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Original Price ($)
          </label>
          <input
            id="disc-price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="disc-1" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Discount (%)
          </label>
          <input
            id="disc-1"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={discount1}
            onChange={(e) => setDiscount1(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="disc-2" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Extra Coupon (%)
          </label>
          <input
            id="disc-2"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={discount2}
            onChange={(e) => setDiscount2(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="disc-tax" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Sales Tax (%)
          </label>
          <input
            id="disc-tax"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 p-4">
          <p className="text-xs text-indigo-700 dark:text-indigo-300">Final Price</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            ${calc.finalTotal.toFixed(2)}
          </p>
          {Number(taxRate) > 0 && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Includes ${calc.taxAmount.toFixed(2)} tax
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">You Save</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            ${calc.saved.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {calc.effectiveDiscountPct.toFixed(1)}% total discount
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Pre-Tax Subtotal</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            ${calc.afterSecond.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setPrice('120');
          setDiscount1('25');
          setDiscount2('0');
          setTaxRate('0');
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Reset</span>
      </button>
    </div>
  );
}
