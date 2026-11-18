import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { ToolPageLayout } from '../components/layout/ToolPageLayout';
import { getToolBySlug } from '../data/tools';
import NotFoundPage from './NotFoundPage';

const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  'image-compressor': lazy(() => import('../tools/image/ImageCompressorTool')),
  'image-resizer': lazy(() => import('../tools/image/ImageResizerTool')),
  'image-cropper': lazy(() => import('../tools/image/ImageCropperTool')),
  'jpg-to-png': lazy(() => import('../tools/image/JpgToPngTool')),
  'png-to-jpg': lazy(() => import('../tools/image/PngToJpgTool')),
  'image-to-base64': lazy(() => import('../tools/image/ImageToBase64Tool')),
  'pdf-merge': lazy(() => import('../tools/pdf/PdfMergeTool')),
  'pdf-split': lazy(() => import('../tools/pdf/PdfSplitTool')),
  'pdf-to-images': lazy(() => import('../tools/pdf/PdfToImagesTool')),
  'images-to-pdf': lazy(() => import('../tools/pdf/ImagesToPdfTool')),
  'word-counter': lazy(() => import('../tools/text/WordCounterTool')),
  'character-counter': lazy(() => import('../tools/text/CharacterCounterTool')),
  'case-converter': lazy(() => import('../tools/text/CaseConverterTool')),
  'remove-extra-spaces': lazy(() => import('../tools/text/RemoveExtraSpacesTool')),
  'text-reverser': lazy(() => import('../tools/text/TextReverserTool')),
  'lorem-ipsum-generator': lazy(() => import('../tools/text/LoremIpsumGeneratorTool')),
  'qr-code-generator': lazy(() => import('../tools/developer/QrCodeGeneratorTool')),
  'password-generator': lazy(() => import('../tools/developer/PasswordGeneratorTool')),
  'url-encoder-decoder': lazy(() => import('../tools/developer/UrlEncoderDecoderTool')),
  'base64-encoder-decoder': lazy(() => import('../tools/developer/Base64EncoderDecoderTool')),
  'json-formatter': lazy(() => import('../tools/developer/JsonFormatterTool')),
  'html-encoder-decoder': lazy(() => import('../tools/developer/HtmlEncoderDecoderTool')),
  'age-calculator': lazy(() => import('../tools/calculators/AgeCalculatorTool')),
  'percentage-calculator': lazy(() => import('../tools/calculators/PercentageCalculatorTool')),
  'bmi-calculator': lazy(() => import('../tools/calculators/BmiCalculatorTool')),
  'discount-calculator': lazy(() => import('../tools/calculators/DiscountCalculatorTool')),
  'loan-calculator': lazy(() => import('../tools/calculators/LoanCalculatorTool')),
  'unit-converter': lazy(() => import('../tools/converters/UnitConverterTool')),
  'temperature-converter': lazy(() => import('../tools/converters/TemperatureConverterTool')),
  'length-converter': lazy(() => import('../tools/converters/LengthConverterTool')),
  'weight-converter': lazy(() => import('../tools/converters/WeightConverterTool')),
  'time-converter': lazy(() => import('../tools/converters/TimeConverterTool')),
};

function ToolSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading tool">
      <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-44 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-10 w-40 rounded-lg bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default function ToolDetailPage() {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  const ToolComponent = toolSlug ? TOOL_COMPONENTS[toolSlug] : undefined;

  if (!tool || !ToolComponent) {
    return <NotFoundPage />;
  }

  return (
    <ToolPageLayout tool={tool}>
      <Suspense fallback={<ToolSkeleton />}>
        <ToolComponent />
      </Suspense>
    </ToolPageLayout>
  );
}
