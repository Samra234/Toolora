import { Download, Lock, RotateCcw, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';
import { canvasToBlob, loadImageFile, stripExtension } from '../../utils/imageUtils';

export default function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [natWidth, setNatWidth] = useState(0);
  const [natHeight, setNatHeight] = useState(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState(90);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');

  const handleFiles = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setError('');
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    try {
      const loaded = await loadImageFile(selected);
      setFile(selected);
      setOriginalUrl(loaded.objectUrl);
      setNatWidth(loaded.width);
      setNatHeight(loaded.height);
      setWidth(loaded.width);
      setHeight(loaded.height);
      if (selected.type === 'image/jpeg') setFormat('image/jpeg');
      else if (selected.type === 'image/webp') setFormat('image/webp');
      else setFormat('image/png');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load image.');
    }
  };

  const handleWidthChange = (nextW: number) => {
    const cleanW = Math.max(1, Math.min(8000, Math.round(nextW || 1)));
    setWidth(cleanW);
    if (lockRatio && natWidth > 0) {
      setHeight(Math.max(1, Math.round((cleanW / natWidth) * natHeight)));
    }
  };

  const handleHeightChange = (nextH: number) => {
    const cleanH = Math.max(1, Math.min(8000, Math.round(nextH || 1)));
    setHeight(cleanH);
    if (lockRatio && natHeight > 0) {
      setWidth(Math.max(1, Math.round((cleanH / natHeight) * natWidth)));
    }
  };

  const applyScalePreset = (pct: number) => {
    const w = Math.max(1, Math.round(natWidth * pct));
    const h = Math.max(1, Math.round(natHeight * pct));
    setWidth(w);
    setHeight(h);
  };

  useEffect(() => {
    if (!originalUrl || width <= 0 || height <= 0) return;
    let cancelled = false;

    const renderResized = async () => {
      try {
        const img = new Image();
        img.src = originalUrl;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej(new Error('Failed to decode image.'));
        });

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);

        const blob = await canvasToBlob(canvas, format, quality / 100);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setResultBlob(blob);
        setResultUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Resize failed.');
      }
    };

    renderResized();
    return () => {
      cancelled = true;
    };
  }, [originalUrl, width, height, format, quality]);

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setOriginalUrl('');
    setResultUrl('');
    setResultBlob(null);
    setError('');
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    downloadBlob(resultBlob, `${stripExtension(file.name)}-${width}x${height}.${ext}`);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFilesSelected={handleFiles}
          title="Drop an image to resize"
          subtitle="Resize JPG, PNG, or WebP by pixels or percentage presets"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
              Original dimensions: <strong className="text-slate-900 dark:text-slate-100">{natWidth} × {natHeight} px</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyScalePreset(pct)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
            <div className="sm:col-span-4">
              <label htmlFor="resize-width" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Width (px)
              </label>
              <input
                id="resize-width"
                type="number"
                min={1}
                max={8000}
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 flex justify-center">
              <button
                type="button"
                onClick={() => setLockRatio((prev) => !prev)}
                aria-pressed={lockRatio}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  lockRatio
                    ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{lockRatio ? 'Locked' : 'Unlocked'}</span>
              </button>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="resize-height" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Height (px)
              </label>
              <input
                id="resize-height"
                type="number"
                min={1}
                max={8000}
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="resize-format" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Format
              </label>
              <select
                id="resize-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as 'image/png' | 'image/jpeg' | 'image/webp')}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
          </div>

          {format !== 'image/png' && (
            <div className="max-w-xs">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <label htmlFor="resize-quality">Export Quality</label>
                <span className="font-mono tabular-nums">{quality}%</span>
              </div>
              <input
                id="resize-quality"
                type="range"
                min={20}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="mt-1.5 w-full accent-indigo-600"
              />
            </div>
          )}

          {resultUrl && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Resized Preview ({width} × {height} px)</span>
                <span className="font-mono tabular-nums">{resultBlob ? formatBytes(resultBlob.size) : ''}</span>
              </div>
              <div className="max-h-80 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                <img src={resultUrl} alt="Resized preview" className="max-h-72 max-w-full object-contain" />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!resultBlob}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download Resized Image</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
