import { Download, RotateCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FileDropzone } from '../../components/common/FileDropzone';
import { downloadBlob } from '../../utils/formatters';
import { canvasToBlob, loadImageFile, stripExtension } from '../../utils/imageUtils';

type AspectPreset = 'free' | '1:1' | '16:9' | '4:3' | '3:2';

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [natSize, setNatSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspect, setAspect] = useState<AspectPreset>('free');
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    startCrop: CropRect;
  } | null>(null);

  const handleFiles = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setError('');
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');

    try {
      const loaded = await loadImageFile(selected);
      setFile(selected);
      setImageUrl(loaded.objectUrl);
      setNatSize({ width: loaded.width, height: loaded.height });
      const initW = Math.round(loaded.width * 0.8);
      const initH = Math.round(loaded.height * 0.8);
      setCrop({
        x: Math.round((loaded.width - initW) / 2),
        y: Math.round((loaded.height - initH) / 2),
        w: initW,
        h: initH,
      });
      setAspect('free');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load image.');
    }
  };

  const getAspectRatioValue = (preset: AspectPreset): number | null => {
    if (preset === '1:1') return 1;
    if (preset === '16:9') return 16 / 9;
    if (preset === '4:3') return 4 / 3;
    if (preset === '3:2') return 3 / 2;
    return null;
  };

  const applyAspectPreset = (preset: AspectPreset) => {
    setAspect(preset);
    const ratio = getAspectRatioValue(preset);
    if (!ratio || natSize.width === 0) return;

    let newW = Math.min(crop.w || natSize.width * 0.8, natSize.width);
    let newH = Math.round(newW / ratio);
    if (newH > natSize.height) {
      newH = natSize.height;
      newW = Math.round(newH * ratio);
    }
    const newX = Math.max(0, Math.min(natSize.width - newW, crop.x));
    const newY = Math.max(0, Math.min(natSize.height - newH, crop.y));
    setCrop({ x: Math.round(newX), y: Math.round(newY), w: Math.round(newW), h: Math.round(newH) });
  };

  const handlePointerDown = (e: React.PointerEvent, mode: 'move' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStateRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragStateRef.current;
    const container = containerRef.current;
    if (!drag || !container || natSize.width === 0) return;

    const rect = container.getBoundingClientRect();
    const scaleX = natSize.width / rect.width;
    const scaleY = natSize.height / rect.height;
    const dx = Math.round((e.clientX - drag.startX) * scaleX);
    const dy = Math.round((e.clientY - drag.startY) * scaleY);

    if (drag.mode === 'move') {
      const nextX = Math.max(0, Math.min(natSize.width - drag.startCrop.w, drag.startCrop.x + dx));
      const nextY = Math.max(0, Math.min(natSize.height - drag.startCrop.h, drag.startCrop.y + dy));
      setCrop((prev) => ({ ...prev, x: nextX, y: nextY }));
    } else {
      const ratio = getAspectRatioValue(aspect);
      let nextW = Math.max(20, Math.min(natSize.width - drag.startCrop.x, drag.startCrop.w + dx));
      let nextH = ratio
        ? Math.round(nextW / ratio)
        : Math.max(20, Math.min(natSize.height - drag.startCrop.y, drag.startCrop.h + dy));

      if (ratio && drag.startCrop.y + nextH > natSize.height) {
        nextH = natSize.height - drag.startCrop.y;
        nextW = Math.round(nextH * ratio);
      }
      setCrop((prev) => ({ ...prev, w: Math.max(20, nextW), h: Math.max(20, nextH) }));
    }
  };

  const handlePointerUp = () => {
    dragStateRef.current = null;
  };

  useEffect(() => {
    if (!imageUrl || crop.w <= 0 || crop.h <= 0) return;
    let cancelled = false;

    const generatePreview = async () => {
      const img = new Image();
      img.src = imageUrl;
      await new Promise<void>((res) => {
        img.onload = () => res();
      });

      const canvas = document.createElement('canvas');
      canvas.width = crop.w;
      canvas.height = crop.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, crop.w, crop.h);
      }
      ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);

      const blob = await canvasToBlob(canvas, format, 0.92);
      if (cancelled) return;
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    };

    generatePreview();
    return () => {
      cancelled = true;
    };
  }, [imageUrl, crop, format]);

  const handleDownload = async () => {
    if (!imageUrl || !file || crop.w <= 0 || crop.h <= 0) return;
    const img = new Image();
    img.src = imageUrl;
    await new Promise<void>((res) => {
      img.onload = () => res();
    });

    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, crop.w, crop.h);
    }
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    const blob = await canvasToBlob(canvas, format, 0.92);
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    downloadBlob(blob, `${stripExtension(file.name)}-cropped.${ext}`);
  };

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setImageUrl('');
    setPreviewUrl('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFilesSelected={handleFiles}
          title="Drop an image to crop"
          subtitle="Drag the crop frame or lock 1:1, 16:9, 4:3, and 3:2 ratios"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Aspect ratio presets">
              {(['free', '1:1', '16:9', '4:3', '3:2'] as AspectPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyAspectPreset(preset)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    aspect === preset
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {preset === 'free' ? 'Freeform' : preset}
                </button>
              ))}
            </div>

            <select
              aria-label="Output format"
              value={format}
              onChange={(e) => setFormat(e.target.value as 'image/png' | 'image/jpeg' | 'image/webp')}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-slate-100"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>

          {/* Interactive visual crop canvas */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-3 flex justify-center overflow-hidden">
            <div
              ref={containerRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative inline-block max-w-full select-none touch-none"
            >
              <img
                src={imageUrl}
                alt="Crop source"
                draggable={false}
                className="block max-h-[380px] w-auto object-contain opacity-45"
              />
              {natSize.width > 0 && (
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'move')}
                  style={{
                    left: `${(crop.x / natSize.width) * 100}%`,
                    top: `${(crop.y / natSize.height) * 100}%`,
                    width: `${(crop.w / natSize.width) * 100}%`,
                    height: `${(crop.h / natSize.height) * 100}%`,
                  }}
                  className="absolute border-2 border-indigo-500 bg-indigo-500/10 cursor-move shadow-[0_0_0_1px_rgba(255,255,255,0.6)]"
                >
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'resize')}
                    aria-label="Resize crop frame"
                    className="absolute -bottom-2 -right-2 h-4 w-4 rounded-sm bg-indigo-600 border-2 border-white cursor-nwse-resize"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Numeric Coordinate Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'X (px)', key: 'x', max: natSize.width - crop.w },
              { label: 'Y (px)', key: 'y', max: natSize.height - crop.h },
              { label: 'Width (px)', key: 'w', max: natSize.width - crop.x },
              { label: 'Height (px)', key: 'h', max: natSize.height - crop.y },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  {field.label}
                </label>
                <input
                  type="number"
                  min={field.key === 'w' || field.key === 'h' ? 10 : 0}
                  max={Math.max(10, field.max)}
                  value={crop[field.key as keyof CropRect]}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value) || 0);
                    setCrop((prev) => ({
                      ...prev,
                      [field.key]: Math.min(Math.max(field.key === 'w' || field.key === 'h' ? 10 : 0, val), Math.max(10, field.max)),
                    }));
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100"
                />
              </div>
            ))}
          </div>

          {previewUrl && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                Cropped Output Preview ({crop.w} × {crop.h} px)
              </p>
              <div className="max-h-52 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                <img src={previewUrl} alt="Cropped result preview" className="max-h-48 max-w-full object-contain" />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download Cropped Image</span>
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
