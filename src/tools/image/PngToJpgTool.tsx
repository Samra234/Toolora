import JSZip from 'jszip';
import { Archive, Download, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';
import { canvasToBlob, loadImageFile, stripExtension } from '../../utils/imageUtils';

interface SourceFile {
  id: string;
  file: File;
}

interface ConvertedItem {
  id: string;
  outputName: string;
  originalSize: number;
  outputSize: number;
  width: number;
  height: number;
  blob: Blob;
  previewUrl: string;
}

export default function PngToJpgTool() {
  const [sources, setSources] = useState<SourceFile[]>([]);
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (files: File[]) => {
    setError('');
    const next = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
    }));
    setSources((prev) => [...prev, ...next]);
  };

  useEffect(() => {
    if (sources.length === 0) {
      setItems([]);
      return;
    }
    let cancelled = false;

    const convertAll = async () => {
      setProcessing(true);
      setError('');
      try {
        const converted: ConvertedItem[] = [];
        for (const src of sources) {
          const loaded = await loadImageFile(src.file);
          const canvas = document.createElement('canvas');
          canvas.width = loaded.width;
          canvas.height = loaded.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D unavailable.');

          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, loaded.width, loaded.height);
          ctx.drawImage(loaded.img, 0, 0);
          URL.revokeObjectURL(loaded.objectUrl);

          const jpgBlob = await canvasToBlob(canvas, 'image/jpeg', quality / 100);
          const previewUrl = URL.createObjectURL(jpgBlob);

          converted.push({
            id: src.id,
            outputName: `${stripExtension(src.file.name)}.jpg`,
            originalSize: src.file.size,
            outputSize: jpgBlob.size,
            width: loaded.width,
            height: loaded.height,
            blob: jpgBlob,
            previewUrl,
          });
        }
        if (!cancelled) {
          setItems((prev) => {
            prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
            return converted;
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Conversion failed.');
      } finally {
        if (!cancelled) setProcessing(false);
      }
    };

    convertAll();
    return () => {
      cancelled = true;
    };
  }, [sources, bgColor, quality]);

  const handleDownloadAllZip = async () => {
    const zip = new JSZip();
    items.forEach((item) => zip.file(item.outputName, item.blob));
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'toolora-jpg-images.zip');
  };

  const handleReset = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setSources([]);
    setItems([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div>
          <label htmlFor="png-bg-color" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Transparency Fill Color
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id="png-bg-color"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-transparent"
            />
            {['#ffffff', '#000000', '#f1f5f9'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBgColor(preset)}
                className="rounded-md border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {preset === '#ffffff' ? 'White' : preset === '#000000' ? 'Black' : 'Light Slate'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <label htmlFor="png-jpg-quality">JPEG Quality</label>
            <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">{quality}%</span>
          </div>
          <input
            id="png-jpg-quality"
            type="range"
            min={20}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="mt-3 w-full accent-indigo-600"
          />
        </div>
      </div>

      <FileDropzone
        accept=".png,image/png,image/webp,image/gif"
        multiple
        disabled={processing}
        onFilesSelected={handleFiles}
        title={processing ? 'Converting to JPG...' : 'Drop PNG images to convert to JPG'}
        subtitle="Transparent pixels are cleanly filled with your chosen background color"
      />

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums">
              {items.length} converted {items.length === 1 ? 'file' : 'files'}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download All (ZIP)</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.previewUrl}
                    alt={item.outputName}
                    className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.outputName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.width}×{item.height} · {formatBytes(item.originalSize)} → {formatBytes(item.outputSize)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadBlob(item.blob, item.outputName)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download JPG</span>
                </button>
              </div>
            ))}
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
