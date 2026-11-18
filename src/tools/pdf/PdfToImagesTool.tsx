import JSZip from 'jszip';
import { Archive, Download, RotateCcw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';
import { canvasToBlob, stripExtension } from '../../utils/imageUtils';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface RenderedPage {
  pageNumber: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export default function PdfToImagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [scale, setScale] = useState<1 | 2>(1);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const handleFiles = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setPages([]);
    setError('');
    setFile(selected);
    await renderPdfPages(selected, format, scale);
  };

  const renderPdfPages = async (
    targetFile: File,
    outFormat: 'image/png' | 'image/jpeg',
    renderScale: 1 | 2
  ) => {
    setRendering(true);
    setError('');
    setProgress('Loading PDF...');
    const rendered: RenderedPage[] = [];

    try {
      const buffer = await targetFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const pdfDoc = await loadingTask.promise;

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        setProgress(`Rendering page ${pageNum} of ${pdfDoc.numPages}...`);
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: renderScale * 1.35 });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context unavailable.');

        if (outFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const blob = await canvasToBlob(canvas, outFormat, 0.92);
        const url = URL.createObjectURL(blob);

        rendered.push({
          pageNumber: pageNum,
          blob,
          url,
          width: canvas.width,
          height: canvas.height,
        });
      }

      setPages((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return rendered;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to render PDF pages. Ensure the PDF is valid and unencrypted.'
      );
    } finally {
      setRendering(false);
      setProgress('');
    }
  };

  const handleDownloadAllZip = async () => {
    if (!file || pages.length === 0) return;
    const zip = new JSZip();
    const ext = format === 'image/png' ? 'png' : 'jpg';
    const base = stripExtension(file.name);
    pages.forEach((p) => {
      zip.file(`${base}-page-${p.pageNumber}.${ext}`, p.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${base}-images.zip`);
  };

  const handleReset = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setPages([]);
    setFile(null);
    setError('');
    setProgress('');
  };

  const ext = format === 'image/png' ? 'png' : 'jpg';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
        <div>
          <label htmlFor="pdf-img-format" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Image Format
          </label>
          <select
            id="pdf-img-format"
            value={format}
            disabled={rendering}
            onChange={(e) => {
              const nextFmt = e.target.value as 'image/png' | 'image/jpeg';
              setFormat(nextFmt);
              if (file) renderPdfPages(file, nextFmt, scale);
            }}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="image/png">PNG (Lossless)</option>
            <option value="image/jpeg">JPG (Compact)</option>
          </select>
        </div>

        <div>
          <label htmlFor="pdf-img-scale" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Resolution Scale
          </label>
          <select
            id="pdf-img-scale"
            value={scale}
            disabled={rendering}
            onChange={(e) => {
              const nextScale = Number(e.target.value) as 1 | 2;
              setScale(nextScale);
              if (file) renderPdfPages(file, format, nextScale);
            }}
            className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value={1}>1x Standard (Fast)</option>
            <option value={2}>2x High-DPI (Crisp text)</option>
          </select>
        </div>
      </div>

      {!file ? (
        <FileDropzone
          accept=".pdf,application/pdf"
          disabled={rendering}
          onFilesSelected={handleFiles}
          title="Drop a PDF document to render pages as images"
          subtitle="Powered by local PDF.js Web Worker — pages render directly in your browser"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {rendering ? progress : `${pages.length} rendered ${pages.length === 1 ? 'page' : 'pages'} · ${formatBytes(file.size)}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {pages.length > 1 && !rendering && (
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
                disabled={rendering}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {pages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 flex flex-col justify-between gap-3"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                    <img
                      src={p.url}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-full max-w-full object-contain shadow-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                      Page {p.pageNumber} · {formatBytes(p.blob.size)}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadBlob(p.blob, `${stripExtension(file.name)}-page-${p.pageNumber}.${ext}`)
                      }
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                      <Download className="w-3 h-3" aria-hidden="true" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
