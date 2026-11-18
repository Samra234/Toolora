import { Download, RotateCcw } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { downloadBlob, downloadDataUrl } from '../../utils/formatters';

type EcLevel = 'L' | 'M' | 'Q' | 'H';

export default function QrCodeGeneratorTool() {
  const [text, setText] = useState('https://toolora.app');
  const [size, setSize] = useState(280);
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ecLevel, setEcLevel] = useState<EcLevel>('M');
  const [pngUrl, setPngUrl] = useState('');
  const [svgMarkup, setSvgMarkup] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      setPngUrl('');
      setSvgMarkup('');
      setError('');
      return;
    }
    let cancelled = false;

    const generate = async () => {
      try {
        const opts = {
          width: size,
          margin: 2,
          errorCorrectionLevel: ecLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        };
        const [dataUrl, svg] = await Promise.all([
          QRCode.toDataURL(trimmed, opts),
          QRCode.toString(trimmed, { ...opts, type: 'svg' }),
        ]);
        if (!cancelled) {
          setPngUrl(dataUrl);
          setSvgMarkup(svg);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Input is too long for a QR code.');
        }
      }
    };

    generate();
    return () => {
      cancelled = true;
    };
  }, [text, size, fgColor, bgColor, ecLevel]);

  const handleDownloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, 'toolora-qrcode.svg');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-7 space-y-5">
        <div>
          <label htmlFor="qr-input" className="block mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            URL, Text, Email, or Payload
          </label>
          <textarea
            id="qr-input"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com or any plain text..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4">
          <div>
            <label htmlFor="qr-size" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Size (px)
            </label>
            <select
              id="qr-size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value={200}>200 × 200</option>
              <option value={280}>280 × 280</option>
              <option value={400}>400 × 400</option>
              <option value={600}>600 × 600</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-ec" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Error Correction
            </label>
            <select
              id="qr-ec"
              value={ecLevel}
              onChange={(e) => setEcLevel(e.target.value as EcLevel)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="L">L (7% recovery)</option>
              <option value="M">M (15% recovery)</option>
              <option value="Q">Q (25% recovery)</option>
              <option value="H">H (30% recovery)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-fg" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Foreground Color
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                id="qr-fg"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-11 cursor-pointer rounded border border-slate-300 dark:border-slate-700"
              />
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{fgColor}</span>
            </div>
          </div>

          <div>
            <label htmlFor="qr-bg" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Background Color
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                id="qr-bg"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-11 cursor-pointer rounded border border-slate-300 dark:border-slate-700"
              />
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{bgColor}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setText('https://toolora.app');
            setSize(280);
            setFgColor('#0f172a');
            setBgColor('#ffffff');
            setEcLevel('M');
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Defaults</span>
        </button>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-5 flex flex-col items-center gap-4">
        {pngUrl ? (
          <>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-3 shadow-xs">
              <img src={pngUrl} alt="Generated QR Code" className="h-52 w-52 object-contain" />
            </div>
            <div className="flex flex-wrap justify-center gap-2 w-full">
              <button
                type="button"
                onClick={() => downloadDataUrl(pngUrl, 'toolora-qrcode.png')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>PNG</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>SVG</span>
              </button>
              <CopyButton text={svgMarkup} label="Copy SVG" />
            </div>
          </>
        ) : (
          <p className="py-16 text-xs text-slate-500 dark:text-slate-400 text-center">
            Enter text or a URL to generate a QR code
          </p>
        )}
      </div>
    </div>
  );
}
