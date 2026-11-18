import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';

function roundTemp(n: number): string {
  if (!Number.isFinite(n)) return '';
  return String(Number(n.toFixed(4)));
}

export default function TemperatureConverterTool() {
  const [celsius, setCelsius] = useState('25');
  const [fahrenheit, setFahrenheit] = useState('77');
  const [kelvin, setKelvin] = useState('298.15');
  const [rankine, setRankine] = useState('536.67');

  const updateFromCelsius = (cVal: string) => {
    setCelsius(cVal);
    const c = Number(cVal);
    if (cVal.trim() === '' || !Number.isFinite(c)) {
      setFahrenheit('');
      setKelvin('');
      setRankine('');
      return;
    }
    setFahrenheit(roundTemp((c * 9) / 5 + 32));
    setKelvin(roundTemp(c + 273.15));
    setRankine(roundTemp(((c + 273.15) * 9) / 5));
  };

  const updateFromFahrenheit = (fVal: string) => {
    setFahrenheit(fVal);
    const f = Number(fVal);
    if (fVal.trim() === '' || !Number.isFinite(f)) {
      setCelsius('');
      setKelvin('');
      setRankine('');
      return;
    }
    const c = ((f - 32) * 5) / 9;
    setCelsius(roundTemp(c));
    setKelvin(roundTemp(c + 273.15));
    setRankine(roundTemp(f + 459.67));
  };

  const updateFromKelvin = (kVal: string) => {
    setKelvin(kVal);
    const k = Number(kVal);
    if (kVal.trim() === '' || !Number.isFinite(k)) {
      setCelsius('');
      setFahrenheit('');
      setRankine('');
      return;
    }
    const c = k - 273.15;
    setCelsius(roundTemp(c));
    setFahrenheit(roundTemp((c * 9) / 5 + 32));
    setRankine(roundTemp((k * 9) / 5));
  };

  const updateFromRankine = (rVal: string) => {
    setRankine(rVal);
    const r = Number(rVal);
    if (rVal.trim() === '' || !Number.isFinite(r)) {
      setCelsius('');
      setFahrenheit('');
      setKelvin('');
      return;
    }
    const k = (r * 5) / 9;
    const c = k - 273.15;
    setCelsius(roundTemp(c));
    setFahrenheit(roundTemp(r - 459.67));
    setKelvin(roundTemp(k));
  };

  const kelvinNum = Number(kelvin);
  const belowAbsoluteZero = kelvin.trim() !== '' && Number.isFinite(kelvinNum) && kelvinNum < 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Water Freezing (0°C)', c: '0' },
          { label: 'Room Temp (22°C)', c: '22' },
          { label: 'Body Temp (37°C)', c: '37' },
          { label: 'Water Boiling (100°C)', c: '100' },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => updateFromCelsius(preset.c)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { id: 'temp-c', label: 'Celsius (°C)', value: celsius, onChange: updateFromCelsius },
          { id: 'temp-f', label: 'Fahrenheit (°F)', value: fahrenheit, onChange: updateFromFahrenheit },
          { id: 'temp-k', label: 'Kelvin (K)', value: kelvin, onChange: updateFromKelvin },
          { id: 'temp-r', label: 'Rankine (°R)', value: rankine, onChange: updateFromRankine },
        ].map((field) => (
          <div key={field.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={field.id} className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {field.label}
              </label>
              <CopyButton text={field.value} label="Copy" />
            </div>
            <input
              id={field.id}
              type="number"
              step="any"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 font-mono text-base font-semibold tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>

      {belowAbsoluteZero && (
        <p role="alert" className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
          Warning: This value is below absolute zero (0 K / -273.15 °C), which is physically unreachable.
        </p>
      )}

      <button
        type="button"
        onClick={() => updateFromCelsius('25')}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Reset</span>
      </button>
    </div>
  );
}
