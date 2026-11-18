import { UploadCloud } from 'lucide-react';
import React, { useId, useRef, useState } from 'react';

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export function FileDropzone({
  accept,
  multiple = false,
  onFilesSelected,
  title = 'Drop your file here or click to browse',
  subtitle = 'Processed locally in your browser — nothing is uploaded',
  disabled = false,
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    onFilesSelected(Array.from(fileList));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30'
          : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 hover:border-indigo-400 dark:hover:border-indigo-500'
      } ${disabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
        <UploadCloud className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}
