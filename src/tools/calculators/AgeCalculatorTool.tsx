import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState('1995-06-15');
  const [targetDate, setTargetDate] = useState(todayIso);

  const result = useMemo(() => {
    if (!birthDate || !targetDate) return { error: 'Select both dates to calculate age.' };
    const birth = new Date(`${birthDate}T00:00:00`);
    const target = new Date(`${targetDate}T00:00:00`);

    if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime())) {
      return { error: 'Please enter valid calendar dates.' };
    }
    if (birth > target) {
      return { error: 'Date of birth cannot be after the target date.' };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday from target date
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.round((nextBday.getTime() - target.getTime()) / 86400000);
    const bornDayOfWeek = birth.toLocaleDateString(undefined, { weekday: 'long' });

    return {
      error: '',
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      daysUntilBirthday,
      bornDayOfWeek,
    };
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div>
          <label htmlFor="dob-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Date of Birth
          </label>
          <input
            id="dob-input"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="age-target-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Calculate Age As Of
          </label>
          <input
            id="age-target-input"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {result.error ? (
        <p role="alert" className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {result.error}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 p-5">
            <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Exact Age</p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {result.years} years, {result.months} months, {result.days} days
            </p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Born on a <strong>{result.bornDayOfWeek}</strong> · Next birthday in{' '}
              <strong className="tabular-nums">{result.daysUntilBirthday}</strong>{' '}
              {result.daysUntilBirthday === 1 ? 'day' : 'days'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Months', value: result.totalMonths?.toLocaleString() },
              { label: 'Total Weeks', value: result.totalWeeks?.toLocaleString() },
              { label: 'Total Days', value: result.totalDays?.toLocaleString() },
              { label: 'Total Hours', value: result.totalHours?.toLocaleString() },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-1 font-mono text-base font-semibold text-slate-900 dark:text-white tabular-nums">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setBirthDate('1995-06-15');
          setTargetDate(todayIso());
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Reset</span>
      </button>
    </div>
  );
}
