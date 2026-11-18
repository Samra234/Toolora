import JSZip from 'jszip';
import { Download, RotateCcw, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';
import { stripExtension } from '../../utils/imageUtils';

type SplitMode = 'range' | 'burst';

function parsePageRange(input: string, maxPages: number): number[] {
  const indices = new Set<number>();
  const parts = input
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error('Enter at least one page number or range (e.g., 1-3, 5).');
  }

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Number(startStr);
      const end = Number(endStr);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > maxPages || start > end) {
        throw new Error(`Invalid range "${part}". Valid pages are 1 to ${maxPages}.`);
      }
      for (let p = start; p <= end; p++) {
        indices.add(p - 1);
      }
    } else {
      const pageNum = Number(part);
      if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > maxPages) {
        throw new Error(`Invalid page "${part}". Valid pages are 1 to ${maxPages}.`);
      }
      indices.add(pageNum - 1);
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}

export default function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>('range');
  const [rangeText, setRangeText] = useState('1');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setError('');
    try {
      const bytes = await selected.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      setFile(selected);
      setPageCount(count);
      setRangeText(count > 1 ? `1-${Math.min(3, count)}` : '1');
    } catch {
      setError('Unable to read PDF. Ensure the file is valid and not password-protected.');
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setError('');
    setProcessing(true);

    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const baseName = stripExtension(file.name);

      if (mode === 'range') {
        const selectedIndices = parsePageRange(rangeText, pageCount);
        const outDoc = await PDFDocument.create();
        const pages = await outDoc.copyPages(srcDoc, selectedIndices);
        pages.forEach((p) => outDoc.addPage(p));
        const outBytes = await outDoc.save();
        downloadBlob(new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }), `${baseName}-extracted.pdf`);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < pageCount; i++) {
          const singleDoc = await PDFDocument.create();
          const [page] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(page);
          const singleBytes = await singleDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, singleBytes);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, `${baseName}-split-pages.zip`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not split PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setRangeText('1');
    setError('');
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept=".pdf,application/pdf"
          onFilesSelected={handleFiles}
          title="Drop a PDF file to split or extract pages"
          subtitle="Extract specific page ranges or burst every page into a ZIP archive"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'} · {formatBytes(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Change File</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('range')}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === 'range'
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Extract Page Range</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Save specific pages (e.g., 1-3, 5) into one PDF
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('burst')}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === 'burst'
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Split Every Page</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Export all {pageCount} pages as individual PDFs in a ZIP
              </p>
            </button>
          </div>

          {mode === 'range' && (
            <div>
              <label htmlFor="pdf-page-range" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Pages to Extract (1 to {pageCount})
              </label>
              <input
                id="pdf-page-range"
                type="text"
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                placeholder="e.g. 1-3, 5"
                className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSplit}
            disabled={processing}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {mode === 'range' ? (
              <Scissors className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {processing
                ? 'Splitting PDF...'
                : mode === 'range'
                ? 'Extract & Download PDF'
                : 'Split All & Download ZIP'}
            </span>
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
