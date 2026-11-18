import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function BmiCalculatorTool() {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('9');
  const [weightLbs, setWeightLbs] = useState('154');

  const analysis = useMemo(() => {
    let meters = 0;
    let kg = 0;

    if (unitSystem === 'metric') {
      meters = Number(heightCm) / 100;
      kg = Number(weightKg);
    } else {
      const totalInches = Number(feet) * 12 + Number(inches);
      meters = totalInches * 0.0254;
      kg = Number(weightLbs) * 0.45359237;
    }

    if (!Number.isFinite(meters) || !Number.isFinite(kg) || meters <= 0 || kg <= 0) {
      return null;
    }

    const bmi = kg / (meters * meters);
    const minHealthyKg = 18.5 * meters * meters;
    const maxHealthyKg = 24.9 * meters * meters;

    let category = 'Normal Weight';
    let colorClass = 'text-emerald-600 dark:text-emerald-400';
    if (bmi < 18.5) {
      category = 'Underweight';
      colorClass = 'text-blue-600 dark:text-blue-400';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      colorClass = 'text-amber-600 dark:text-amber-400';
    } else if (bmi >= 30) {
      category = 'Obesity';
      colorClass = 'text-red-600 dark:text-red-400';
    }

    const markerPct = Math.max(2, Math.min(98, ((bmi - 12) / (40 - 12)) * 100));

    return {
      bmi: bmi.toFixed(1),
      category,
      colorClass,
      markerPct,
      healthyRange:
        unitSystem === 'metric'
          ? `${minHealthyKg.toFixed(1)} – ${maxHealthyKg.toFixed(1)} kg`
          : `${(minHealthyKg / 0.45359237).toFixed(1)} – ${(maxHealthyKg / 0.45359237).toFixed(1)} lbs`,
    };
  }, [unitSystem, heightCm, weightKg, feet, inches, weightLbs]);

  const handleReset = () => {
    setHeightCm('175');
    setWeightKg('70');
    setFeet('5');
    setInches('9');
    setWeightLbs('154');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        {(['metric', 'imperial'] as const).map((sys) => (
          <button
            key={sys}
            type="button"
            onClick={() => setUnitSystem(sys)}
            className={`rounded-md px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              unitSystem === sys
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {sys === 'metric' ? 'Metric (cm / kg)' : 'Imperial (ft, in / lbs)'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        {unitSystem === 'metric' ? (
          <>
            <div>
              <label htmlFor="bmi-cm" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Height (cm)
              </label>
              <input
                id="bmi-cm"
                type="number"
                min={50}
                max={260}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label htmlFor="bmi-kg" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Weight (kg)
              </label>
              <input
                id="bmi-kg"
                type="number"
                min={10}
                max={350}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="bmi-ft" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Height (ft)
                </label>
                <input
                  id="bmi-ft"
                  type="number"
                  min={1}
                  max={8}
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="bmi-in" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Inches (in)
                </label>
                <input
                  id="bmi-in"
                  type="number"
                  min={0}
                  max={11}
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
                />
              </div>
            </div>
            <div>
              <label htmlFor="bmi-lbs" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Weight (lbs)
              </label>
              <input
                id="bmi-lbs"
                type="number"
                min={20}
                max={800}
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
          </>
        )}
      </div>

      {analysis ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your BMI Score</p>
              <p className="mt-1 font-mono text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {analysis.bmi}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className={`text-base font-semibold ${analysis.colorClass}`}>{analysis.category}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Reference normal weight range: {analysis.healthyRange}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative h-3 w-full rounded-full overflow-hidden flex">
              <div className="bg-blue-400 h-full" style={{ width: '23%' }} title="Underweight (<18.5)" />
              <div className="bg-emerald-500 h-full" style={{ width: '23%' }} title="Normal (18.5–24.9)" />
              <div className="bg-amber-400 h-full" style={{ width: '18%' }} title="Overweight (25–29.9)" />
              <div className="bg-red-500 h-full" style={{ width: '36%' }} title="Obesity (30+)" />
            </div>
            <div className="relative h-4">
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${analysis.markerPct}%` }}
              >
                <span className="h-2.5 w-0.5 bg-slate-900 dark:bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-4 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Under &lt;18.5</span>
              <span>Normal 18.5–24.9</span>
              <span>Over 25–29.9</span>
              <span className="text-right">Obese 30+</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-amber-600 dark:text-amber-400">Enter positive height and weight values.</p>
      )}

      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Reset</span>
      </button>
    </div>
  );
}
