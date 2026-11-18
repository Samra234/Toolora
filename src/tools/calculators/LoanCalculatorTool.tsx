import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ScheduleRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState('25000');
  const [annualRate, setAnnualRate] = useState('6.5');
  const [termYears, setTermYears] = useState('5');
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');

  const loan = useMemo(() => {
    const P = Math.max(0, Number(principal) || 0);
    const rate = Math.max(0, Number(annualRate) || 0);
    const years = Math.max(0.25, Math.min(50, Number(termYears) || 1));
    const n = Math.round(years * 12);
    const r = rate / 100 / 12;

    if (P <= 0 || n <= 0) return null;

    const monthlyPayment = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - P;

    const monthlyRows: ScheduleRow[] = [];
    const yearlyRows: ScheduleRow[] = [];
    let balance = P;
    let yrPayment = 0;
    let yrPrincipal = 0;
    let yrInterest = 0;

    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principalPart = Math.min(balance, monthlyPayment - interest);
      balance = Math.max(0, balance - principalPart);

      monthlyRows.push({
        period: m,
        payment: monthlyPayment,
        principal: principalPart,
        interest,
        balance,
      });

      yrPayment += monthlyPayment;
      yrPrincipal += principalPart;
      yrInterest += interest;

      if (m % 12 === 0 || m === n) {
        yearlyRows.push({
          period: Math.ceil(m / 12),
          payment: yrPayment,
          principal: yrPrincipal,
          interest: yrInterest,
          balance,
        });
        yrPayment = 0;
        yrPrincipal = 0;
        yrInterest = 0;
      }
    }

    return {
      monthlyPayment,
      totalPaid,
      totalInterest,
      principalPct: totalPaid > 0 ? (P / totalPaid) * 100 : 100,
      monthlyRows,
      yearlyRows,
    };
  }, [principal, annualRate, termYears]);

  const rows = loan ? (viewMode === 'yearly' ? loan.yearlyRows : loan.monthlyRows) : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div>
          <label htmlFor="loan-amount" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Loan Amount ($)
          </label>
          <input
            id="loan-amount"
            type="number"
            min={1}
            step="100"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="loan-rate" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Annual Interest Rate (%)
          </label>
          <input
            id="loan-rate"
            type="number"
            min={0}
            max={60}
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="loan-term" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Loan Term (Years)
          </label>
          <input
            id="loan-term"
            type="number"
            min={0.5}
            max={50}
            step="0.5"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>
      </div>

      {loan && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 p-4">
              <p className="text-xs text-indigo-700 dark:text-indigo-300">Monthly Payment</p>
              <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                ${loan.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Interest</p>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                ${loan.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Cost of Loan</p>
              <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                ${loan.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 tabular-nums">
              <span>Principal ({loan.principalPct.toFixed(1)}%)</span>
              <span>Interest ({(100 - loan.principalPct).toFixed(1)}%)</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-amber-400 dark:bg-amber-500">
              <div className="h-full bg-indigo-600 dark:bg-indigo-500" style={{ width: `${loan.principalPct}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Amortization Schedule
              </h3>
              <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                {(['yearly', 'monthly'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setViewMode(m)}
                    className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      viewMode === m
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-semibold">
                      {viewMode === 'yearly' ? 'Year' : 'Month'}
                    </th>
                    <th className="px-3 py-2.5 font-semibold">Payment</th>
                    <th className="px-3 py-2.5 font-semibold">Principal</th>
                    <th className="px-3 py-2.5 font-semibold">Interest</th>
                    <th className="px-3 py-2.5 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono tabular-nums">
                  {rows.map((row) => (
                    <tr key={row.period} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50">
                      <td className="px-3 py-2 text-left text-slate-700 dark:text-slate-300">{row.period}</td>
                      <td className="px-3 py-2">${row.payment.toFixed(2)}</td>
                      <td className="px-3 py-2 text-indigo-600 dark:text-indigo-400">${row.principal.toFixed(2)}</td>
                      <td className="px-3 py-2 text-amber-600 dark:text-amber-400">${row.interest.toFixed(2)}</td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-200">${row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setPrincipal('25000');
          setAnnualRate('6.5');
          setTermYears('5');
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Reset</span>
      </button>
    </div>
  );
}
