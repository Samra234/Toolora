import { Download, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';
import { canvasToBlob, loadImageFile, stripExtension } from '../../utils/imageUtils';

export default function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [quality, setQuality] = useState<number>(78);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFiles = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setError('');
    setCompressedBlob(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalUrl('');
    setCompressedUrl('');

    try {
      const loaded = await loadImageFile(selected);
      setFile(selected);
      setOriginalUrl(loaded.objectUrl);
      setDimensions({ width: loaded.width, height: loaded.height });
      if (selected.type === 'image/webp') {
        setFormat('image/webp');
      } else {
        setFormat('image/jpeg');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load image.');
    }
  };

  useEffect(() => {
    if (!file || !originalUrl || !dimensions) return;
    let cancelled = false;

    const compress = async () => {
      setProcessing(true);
      setError('');
      try {
        const img = new Image();
        img.src = originalUrl;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to decode image for compression.'));
        });

        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context is unavailable.');

        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const blob = await canvasToBlob(canvas, format, quality / 100);
        if (cancelled) return;

        const nextUrl = URL.createObjectURL(blob);
        setCompressedBlob(blob);
        setCompressedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return nextUrl;
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Compression failed.');
        }
      } finally {
        if (!cancelled) setProcessing(false);
      }
    };

    compress();
    return () => {
      cancelled = true;
    };
  }, [file, originalUrl, dimensions, format, quality]);

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setCompressedBlob(null);
    setDimensions(null);
    setError('');
    setQuality(78);
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    downloadBlob(compressedBlob, `${stripExtension(file.name)}-compressed.${ext}`);
  };

  const savingsPercent =
    file && compressedBlob
      ? Math.round(((file.size - compressedBlob.size) / file.size) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFiles}
          title="Drop a JPG, PNG, or WebP image to compress"
          subtitle="Runs 100% locally via HTML5 Canvas — zero server uploads"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
            <div>
              <label htmlFor="compress-format" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Output Format
              </label>
              <select
                id="compress-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as 'image/jpeg' | 'image/webp' | 'image/png')}
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="image/jpeg">JPEG (.jpg) — Best compatibility</option>
                <option value="image/webp">WebP (.webp) — Smallest size</option>
                <option value="image/png">PNG (.png) — Lossless</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="compress-quality" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Quality
                </label>
                <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {format === 'image/png' ? 'Lossless' : `${quality}%`}
                </span>
              </div>
              <input
                id="compress-quality"
                type="range"
                min={10}
                max={100}
                value={quality}
                disabled={format === 'image/png'}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="mt-3 w-full accent-indigo-600 disabled:opacity-40"
              />
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Original Size</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                {formatBytes(file.size)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Compressed Size</p>
              <p className="mt-1 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {processing ? 'Processing...' : compressedBlob ? formatBytes(compressedBlob.size) : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Size Change</p>
              <p
                className={`mt-1 font-mono text-sm font-semibold tabular-nums ${
                  savingsPercent > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {compressedBlob
                  ? savingsPercent >= 0
                    ? `-${savingsPercent}% saved`
                    : `+${Math.abs(savingsPercent)}% larger`
                  : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Dimensions</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                {dimensions ? `${dimensions.width} × ${dimensions.height}` : '—'}
              </p>
            </div>
          </div>

          {/* Preview */}
          {compressedUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">Original</p>
                <div className="aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img src={originalUrl} alt="Original upload preview" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">Compressed Output</p>
                <div className="aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img src={compressedUrl} alt="Compressed output preview" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!compressedBlob || processing}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download Compressed Image</span>
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
