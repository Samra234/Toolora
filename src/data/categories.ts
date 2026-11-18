export type CategorySlug =
  | 'image-tools'
  | 'pdf-tools'
  | 'text-tools'
  | 'developer-tools'
  | 'calculators'
  | 'converters';

export interface ToolCategory {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  iconName: 'Image' | 'FileText' | 'Type' | 'Code2' | 'Calculator' | 'ArrowLeftRight';
  accentClass: string;
  iconBgClass: string;
}

export const CATEGORIES: ToolCategory[] = [
  {
    slug: 'image-tools',
    name: 'Image Tools',
    shortName: 'Images',
    description:
      'Compress, resize, crop, convert formats, and encode images locally using the HTML5 Canvas API.',
    seoTitle: 'Free Online Image Tools – Compress, Resize, Crop & Convert | Toolora',
    seoDescription:
      'Browser-based image tools to compress, resize, crop, convert JPG and PNG files, and generate Base64 strings privately without uploading files.',
    iconName: 'Image',
    accentClass: 'text-indigo-600 dark:text-indigo-400',
    iconBgClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    shortName: 'PDFs',
    description:
      'Merge multiple PDFs, split pages, export PDF pages to images, or bundle images into a single PDF.',
    seoTitle: 'Free Online PDF Tools – Merge, Split & Convert PDFs | Toolora',
    seoDescription:
      'Merge, split, and convert PDF documents directly in your browser. Fast client-side PDF processing with zero server storage.',
    iconName: 'FileText',
    accentClass: 'text-blue-600 dark:text-blue-400',
    iconBgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    shortName: 'Text',
    description:
      'Count words and characters, switch letter cases, strip extra spaces, reverse text, and generate placeholder copy.',
    seoTitle: 'Free Online Text Tools – Word Counter, Case Converter & Formatting | Toolora',
    seoDescription:
      'Clean, analyze, and transform text instantly with Toolora word counters, character meters, case converters, and Lorem Ipsum generators.',
    iconName: 'Type',
    accentClass: 'text-violet-600 dark:text-violet-400',
    iconBgClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    shortName: 'Developer',
    description:
      'Format JSON, generate QR codes and secure passwords, and encode or decode URLs, Base64, and HTML entities.',
    seoTitle: 'Free Online Developer Tools – JSON Formatter, QR Code & Encoders | Toolora',
    seoDescription:
      'Essential web developer utilities including JSON formatter, QR code generator, cryptographic password generator, URL, Base64, and HTML encoders.',
    iconName: 'Code2',
    accentClass: 'text-indigo-600 dark:text-indigo-400',
    iconBgClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
  },
  {
    slug: 'calculators',
    name: 'Calculators',
    shortName: 'Calculators',
    description:
      'Accurate calculators for exact age, percentages, BMI health metrics, retail discounts, and amortized loans.',
    seoTitle: 'Free Online Calculators – Age, Loan, BMI, Discount & Percentage | Toolora',
    seoDescription:
      'Run instant calculations for exact age, loan amortization schedules, body mass index, retail discounts, and percentage changes.',
    iconName: 'Calculator',
    accentClass: 'text-blue-600 dark:text-blue-400',
    iconBgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    slug: 'converters',
    name: 'Converters',
    shortName: 'Converters',
    description:
      'Convert temperatures, lengths, weights, time units, Unix timestamps, and everyday measurement scales.',
    seoTitle: 'Free Online Unit Converters – Length, Weight, Temp & Time | Toolora',
    seoDescription:
      'Precision unit converters for length, weight, temperature, time, area, volume, speed, and digital storage in your browser.',
    iconName: 'ArrowLeftRight',
    accentClass: 'text-violet-600 dark:text-violet-400',
    iconBgClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400',
  },
];

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
