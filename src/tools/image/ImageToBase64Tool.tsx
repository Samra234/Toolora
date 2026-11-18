import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { FileDropzone } from '../../components/common/FileDropzone';
import { formatBytes } from '../../utils/formatters';

type SnippetMode = 'dataUri' | 'raw' | 'html' | 'css';

export default function ImageToBase64Tool() {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [dataUri, setDataUri] = useState('');
  const [mode, setMode] = useState<SnippetMode>('dataUri');
  const [error, setError] = useState('');

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, GIF, or SVG).');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileInfo({ name: file.name, size: file.size, type: file.type });
        setDataUri(reader.result);
      }
    };
    reader.onerror = () => setError('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  const getOutput = (): string => {
    if (!dataUri) return '';
    if (mode === 'dataUri') return dataUri;
    if (mode === 'raw') {
      const idx = dataUri.indexOf('base64,');
      return idx >= 0 ? dataUri.slice(idx + 7) : dataUri;
    }
    if (mode === 'html') {
      return `<img src="${dataUri}" alt="${fileInfo?.name ?? 'image'}" />`;
    }
    return `background-image: url('${dataUri}');`;
  };

  const output = getOutput();

  const handleReset = () => {
    setFileInfo(null);
    setDataUri('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {!dataUri ? (
        <FileDropzone
          accept="image/*"
          onFilesSelected={handleFiles}
          title="Drop an image to encode as Base64"
          subtitle="Supports PNG, JPG, WebP, GIF, and SVG"
        />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={dataUri}
                alt={fileInfo?.name ?? 'Uploaded image'}
                className="h-14 w-14 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-1 shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {fileInfo?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {fileInfo ? formatBytes(fileInfo.size) : ''} · Output length: {output.length.toLocaleString()} chars
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Upload Another</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              {[
                { id: 'dataUri', label: 'Data URI' },
                { id: 'raw', label: 'Raw Base64' },
                { id: 'html', label: 'HTML <img>' },
                { id: 'css', label: 'CSS Background' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id as SnippetMode)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    mode === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <CopyButton text={output} label="Copy Base64" />
          </div>

          <div>
            <label htmlFor="base64-image-output" className="sr-only">
              Generated Base64 String
            </label>
            <textarea
              id="base64-image-output"
              readOnly
              rows={7}
              value={output}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
