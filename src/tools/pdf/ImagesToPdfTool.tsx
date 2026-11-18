import { ArrowDown, ArrowUp, Download, RotateCcw, Trash2 } from 'lucide-react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';
import { canvasToBlob, loadImageFile } from '../../utils/imageUtils';

interface ImageQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

type PageSizeOption = 'fit' | 'a4' | 'letter';

export default function ImagesToPdfTool() {
  const [items, setItems] = useState<ImageQueueItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [margin, setMargin] = useState<number>(24);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: File[]) => {
    setError('');
    const added: ImageQueueItem[] = [];
    try {
      for (const file of files) {
        const loaded = await loadImageFile(file);
        added.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl: loaded.objectUrl,
          width: loaded.width,
          height: loaded.height,
        });
      }
      setItems((prev) => [...prev, ...added]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load image.');
    }
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleCreatePdf = async () => {
    if (items.length === 0) return;
    setError('');
    setBuilding(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of items) {
        let embeddedImage;
        if (item.file.type === 'image/jpeg') {
          const bytes = await item.file.arrayBuffer();
          embeddedImage = await pdfDoc.embedJpg(bytes);
        } else if (item.file.type === 'image/png') {
          const bytes = await item.file.arrayBuffer();
          embeddedImage = await pdfDoc.embedPng(bytes);
        } else {
          // Convert WebP/GIF/other canvas-readable formats to PNG automatically
          const loaded = await loadImageFile(item.file);
          const canvas = document.createElement('canvas');
          canvas.width = loaded.width;
          canvas.height = loaded.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas unavailable.');
          ctx.drawImage(loaded.img, 0, 0);
          URL.revokeObjectURL(loaded.objectUrl);
          const pngBlob = await canvasToBlob(canvas, 'image/png');
          const bytes = await pngBlob.arrayBuffer();
          embeddedImage = await pdfDoc.embedPng(bytes);
        }

        const imgW = embeddedImage.width;
        const imgH = embeddedImage.height;

        if (pageSize === 'fit') {
          const page = pdfDoc.addPage([imgW, imgH]);
          page.drawImage(embeddedImage, { x: 0, y: 0, width: imgW, height: imgH });
        } else {
          const [pageW, pageH] = pageSize === 'a4' ? PageSizes.A4 : PageSizes.Letter;
          const page = pdfDoc.addPage([pageW, pageH]);
          const availW = Math.max(20, pageW - margin * 2);
          const availH = Math.max(20, pageH - margin * 2);
          const scale = Math.min(availW / imgW, availH / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const x = (pageW - drawW) / 2;
          const y = (pageH - drawH) / 2;
          page.drawImage(embeddedImage, { x, y, width: drawW, height: drawH });
        }
      }

      const outBytes = await pdfDoc.save();
      downloadBlob(new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }), 'toolora-images.pdf');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to build PDF.');
    } finally {
      setBuilding(false);
    }
  };

  const handleReset = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div>
          <label htmlFor="img-pdf-size" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Page Size
          </label>
          <select
            id="img-pdf-size"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="a4">A4 (Portrait)</option>
            <option value="letter">US Letter (Portrait)</option>
            <option value="fit">Fit to Image Dimensions</option>
          </select>
        </div>

        <div>
          <label htmlFor="img-pdf-margin" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Page Margin
          </label>
          <select
            id="img-pdf-margin"
            value={margin}
            disabled={pageSize === 'fit'}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 disabled:opacity-40"
          >
            <option value={0}>No Margin (0 pt)</option>
            <option value={24}>Small Margin (24 pt)</option>
            <option value={48}>Standard Margin (48 pt)</option>
          </select>
        </div>
      </div>

      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={building}
        onFilesSelected={handleFiles}
        title="Drop JPG, PNG, or WebP images to build a PDF"
        subtitle="Add multiple images, arrange their page sequence, and export locally"
      />

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="tabular-nums">{items.length} {items.length === 1 ? 'image' : 'images'} queued</span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear All</span>
            </button>
          </div>

          <ul className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {items.map((item, idx) => (
              <li key={item.id} className="flex items-center justify-between gap-3 p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-11 w-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {idx + 1}. {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.width}×{item.height} px · {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Move up"
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label="Move down"
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove image"
                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleCreatePdf}
            disabled={building}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{building ? 'Generating PDF...' : 'Create & Download PDF'}</span>
          </button>
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
