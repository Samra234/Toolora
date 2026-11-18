import { ArrowDown, ArrowUp, Download, FileText, RotateCcw, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob, formatBytes } from '../../utils/formatters';

interface QueuedPdf {
  id: string;
  file: File;
  pageCount: number;
}

export default function PdfMergeTool() {
  const [queue, setQueue] = useState<QueuedPdf[]>([]);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: File[]) => {
    setError('');
    setLoading(true);
    const added: QueuedPdf[] = [];

    try {
      for (const file of files) {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
          throw new Error(`"${file.name}" is not a valid PDF file.`);
        }
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        added.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          pageCount: doc.getPageCount(),
        });
      }
      setQueue((prev) => [...prev, ...added]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not read PDF. Encrypted or corrupted PDFs cannot be merged.'
      );
    } finally {
      setLoading(false);
    }
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= queue.length) return;
    setQueue((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMerge = async () => {
    if (queue.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    setError('');
    setMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const item of queue) {
        const bytes = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const outBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' });
      downloadBlob(blob, 'toolora-merged.pdf');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to merge PDFs.');
    } finally {
      setMerging(false);
    }
  };

  const handleReset = () => {
    setQueue([]);
    setError('');
  };

  const totalPages = queue.reduce((acc, item) => acc + item.pageCount, 0);

  return (
    <div className="space-y-6">
      <FileDropzone
        accept=".pdf,application/pdf"
        multiple
        disabled={loading || merging}
        onFilesSelected={handleFiles}
        title={loading ? 'Reading PDF metadata...' : 'Drop PDF files here to combine'}
        subtitle="Add 2 or more PDFs, arrange their order, and merge privately in your browser"
      />

      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="tabular-nums">
              {queue.length} {queue.length === 1 ? 'document' : 'documents'} · {totalPages} total pages
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Queue</span>
            </button>
          </div>

          <ul className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {queue.map((item, idx) => (
              <li key={item.id} className="flex items-center justify-between gap-3 p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {idx + 1}
                  </span>
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    aria-label={`Move ${item.file.name} up`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === queue.length - 1}
                    aria-label={`Move ${item.file.name} down`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleMerge}
              disabled={queue.length < 2 || merging}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>{merging ? 'Merging PDFs...' : 'Merge & Download PDF'}</span>
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
