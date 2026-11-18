import JSZip from 'jszip';
import { Download, Archive, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';
import { canvasToBlob, loadImageFile, stripExtension } from '../../utils/imageUtils';

interface ConvertedItem {
  id: string;
  originalName: string;
  outputName: string;
  originalSize: number;
  outputSize: number;
  width: number;
  height: number;
  blob: Blob;
  previewUrl: string;
}

export default function JpgToPngTool() {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: File[]) => {
    setError('');
    setProcessing(true);
    const nextItems: ConvertedItem[] = [];

    try {
      for (const file of files) {
        const loaded = await loadImageFile(file);
        const canvas = document.createElement('canvas');
        canvas.width = loaded.width;
        canvas.height = loaded.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context unavailable.');
        ctx.drawImage(loaded.img, 0, 0);
        URL.revokeObjectURL(loaded.objectUrl);

        const pngBlob = await canvasToBlob(canvas, 'image/png');
        const previewUrl = URL.createObjectURL(pngBlob);

        nextItems.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          originalName: file.name,
          outputName: `${stripExtension(file.name)}.png`,
          originalSize: file.size,
          outputSize: pngBlob.size,
          width: loaded.width,
          height: loaded.height,
          blob: pngBlob,
          previewUrl,
        });
      }
      setItems((prev) => [...prev, ...nextItems]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();
    items.forEach((item) => {
      zip.file(item.outputName, item.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'toolora-png-images.zip');
  };

  const handleReset = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept=".jpg,.jpeg,image/jpeg,image/webp"
        multiple
        disabled={processing}
        onFilesSelected={handleFiles}
        title={processing ? 'Converting images...' : 'Drop JPG or JPEG images to convert to PNG'}
        subtitle="Supports single or multiple images — instant lossless conversion"
      />

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums">
              {items.length} converted {items.length === 1 ? 'file' : 'files'} ready
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
                  <span>Download PNG</span>
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
