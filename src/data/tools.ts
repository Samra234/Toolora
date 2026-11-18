import { CategorySlug } from './categories';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  category: CategorySlug;
  keywords: string[];
  iconName: string;
  popular?: boolean;
  featured?: boolean;
  recentlyAdded?: boolean;
  seoTitle: string;
  seoDescription: string;
  instructions: string[];
  overview: string;
  limitations: string;
  faqs: ToolFaq[];
  relatedSlugs: string[];
}

export const TOOLS: ToolDefinition[] = [
  // IMAGE TOOLS (6)
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Reduce JPG, WebP, or PNG file sizes locally with adjustable compression quality.',
    category: 'image-tools',
    keywords: ['compress image', 'reduce photo size', 'optimize jpg', 'webp compressor', 'shrink image'],
    iconName: 'Minimize2',
    popular: true,
    featured: true,
    seoTitle: 'Free Image Compressor Online – Reduce JPG & WebP Size | Toolora',
    seoDescription:
      'Compress JPG, WebP, and PNG images directly in your browser. Adjust quality, inspect live file size savings, and download without uploading.',
    instructions: [
      'Upload or drag and drop a JPG, PNG, or WebP image into the workspace.',
      'Choose your output format (JPEG or WebP gives the strongest compression) and drag the quality slider.',
      'Compare the original size against the compressed output, then click Download Compressed Image.',
    ],
    overview:
      'Toolora Image Compressor uses the browser HTML5 Canvas API to re-encode photographs and graphics at your chosen compression level. Because everything runs locally on your device, sensitive images never leave your computer.',
    limitations:
      'PNG is a lossless format; compressing a PNG to PNG mainly strips metadata or scales dimensions. For maximum file size reduction on photographs, choose JPEG or WebP output.',
    faqs: [
      {
        question: 'Are my photos uploaded to a server?',
        answer: 'No. All image decoding and re-encoding happens in memory inside your web browser.',
      },
      {
        question: 'Which format achieves the smallest file size?',
        answer: 'WebP typically produces 25–35% smaller files than JPEG at equivalent visual quality.',
      },
    ],
    relatedSlugs: ['image-resizer', 'png-to-jpg', 'image-cropper'],
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Resize images by exact pixel dimensions or percentage with aspect ratio lock.',
    category: 'image-tools',
    keywords: ['resize image', 'change photo dimensions', 'scale image', 'pixel resizer'],
    iconName: 'Scaling',
    popular: true,
    seoTitle: 'Free Image Resizer – Resize Photos by Pixels Online | Toolora',
    seoDescription:
      'Resize PNG, JPG, and WebP images to exact pixel dimensions or percentage presets directly in your browser.',
    instructions: [
      'Select an image file from your device.',
      'Enter custom width and height values or pick a quick scale preset (25%, 50%, 75%). Keep Aspect Ratio Lock enabled to prevent distortion.',
      'Choose your preferred output format and download the resized image.',
    ],
    overview:
      'Whether preparing thumbnails, social media headers, or web assets, the Image Resizer renders crisp downscaled or upscaled graphics using smooth bicubic browser interpolation.',
    limitations:
      'Upscaling small images significantly beyond their native dimensions cannot invent new detail and may appear soft.',
    faqs: [
      {
        question: 'Can I keep the original proportions automatically?',
        answer: 'Yes. With Aspect Ratio Lock turned on, updating either width or height automatically calculates the matching dimension.',
      },
    ],
    relatedSlugs: ['image-cropper', 'image-compressor', 'jpg-to-png'],
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    shortDescription: 'Crop photos visually with freeform handles or locked 1:1, 16:9, and 4:3 ratios.',
    category: 'image-tools',
    keywords: ['crop image', 'photo cropper', 'aspect ratio crop', 'trim image'],
    iconName: 'Crop',
    featured: true,
    seoTitle: 'Free Online Image Cropper – Trim & Aspect Ratio Crop | Toolora',
    seoDescription:
      'Crop images online with interactive selection handles and aspect ratio presets including 1:1, 4:3, 16:9, and freeform.',
    instructions: [
      'Load any JPG, PNG, or WebP image into the interactive canvas.',
      'Select an aspect ratio preset or keep Freeform mode, then drag the crop area or adjust X/Y/Width/Height inputs.',
      'Click Apply & Download Crop to export the trimmed region.',
    ],
    overview:
      'Toolora Image Cropper pairs pointer drag-and-drop framing with exact pixel coordinate inputs so you can quickly frame profile avatars, banners, or product shots.',
    limitations:
      'Animated GIFs and multi-frame WebP files export as a static single frame when cropped via Canvas.',
    faqs: [
      {
        question: 'Can I enter exact pixel coordinates for my crop?',
        answer: 'Yes. The numeric coordinate controls stay synced with the visual crop frame for pixel-accurate trimming.',
      },
    ],
    relatedSlugs: ['image-resizer', 'image-compressor', 'image-to-base64'],
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    shortDescription: 'Convert JPEG images into lossless PNG files directly in your browser.',
    category: 'image-tools',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg', 'image format converter'],
    iconName: 'FileImage',
    seoTitle: 'JPG to PNG Converter – Free Online Image Conversion | Toolora',
    seoDescription:
      'Convert JPG and JPEG files into lossless PNG images locally in your browser with instant preview and download.',
    instructions: [
      'Drop one or more JPG/JPEG files into the converter.',
      'Review the output dimensions and preview.',
      'Download the converted PNG file individually.',
    ],
    overview:
      'Converting a JPG to PNG creates a lossless raster copy suitable for workflows that require PNG inputs, UI mockups, or lossless further editing.',
    limitations:
      'Converting a JPG to PNG preserves current pixel quality without compression artifacts, though it cannot restore detail previously lost during JPEG compression and usually produces a larger file.',
    faqs: [
      {
        question: 'Does converting JPG to PNG make the background transparent?',
        answer: 'No. Standard JPG files do not contain an alpha channel, so the solid background remains opaque.',
      },
    ],
    relatedSlugs: ['png-to-jpg', 'image-compressor', 'image-to-base64'],
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    shortDescription: 'Convert PNG files to compact JPGs with custom background fill for transparency.',
    category: 'image-tools',
    keywords: ['png to jpg', 'png to jpeg', 'transparent png background', 'convert png'],
    iconName: 'ImagePlus',
    seoTitle: 'PNG to JPG Converter – Custom Background Fill | Toolora',
    seoDescription:
      'Convert PNG images to lightweight JPG files with customizable background color for transparent areas and adjustable JPEG quality.',
    instructions: [
      'Upload a PNG image (transparency supported).',
      'Pick a background fill color (defaults to white) to replace transparent pixels and set your JPEG quality.',
      'Click Convert & Download JPG.',
    ],
    overview:
      'Because JPEG does not support alpha transparency, transparent PNG pixels turn black in naive converters. Toolora lets you pick a clean white or custom background color before exporting.',
    limitations:
      'JPEG does not support transparency; any alpha channel in the source PNG is flattened against your chosen background color.',
    faqs: [
      {
        question: 'Why do I need to choose a background color?',
        answer: 'The JPEG format has no transparency channel, so transparent pixels must be filled with a solid color such as white.',
      },
    ],
    relatedSlugs: ['jpg-to-png', 'image-compressor', 'image-resizer'],
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    shortDescription: 'Encode any image into a Data URI, HTML img tag, or CSS background snippet.',
    category: 'image-tools',
    keywords: ['image to base64', 'data uri generator', 'img base64', 'css background base64'],
    iconName: 'Binary',
    recentlyAdded: true,
    seoTitle: 'Image to Base64 Converter – Data URI & CSS Generator | Toolora',
    seoDescription:
      'Convert PNG, JPG, SVG, or WebP images to Base64 Data URIs, HTML image tags, and CSS background snippets privately in your browser.',
    instructions: [
      'Drop or choose an image file.',
      'Switch between Raw Base64, Data URI, HTML <img>, or CSS background-image formats.',
      'Copy the generated string to your clipboard.',
    ],
    overview:
      'Embedding small icons or inline assets as Base64 Data URIs eliminates extra HTTP requests in HTML emails, single-file demos, and CSS stylesheets.',
    limitations:
      'Base64 encoding increases payload size by roughly 33%. Avoid inlining large photographs in production stylesheets.',
    faqs: [
      {
        question: 'Which image formats are supported?',
        answer: 'PNG, JPG, WebP, GIF, and SVG files are all supported directly via the browser FileReader API.',
      },
    ],
    relatedSlugs: ['base64-encoder-decoder', 'image-compressor', 'jpg-to-png'],
  },

  // PDF TOOLS (4)
  {
    slug: 'pdf-merge',
    name: 'PDF Merge',
    shortDescription: 'Combine multiple PDF documents into a single ordered PDF file locally.',
    category: 'pdf-tools',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf binder'],
    iconName: 'Files',
    popular: true,
    featured: true,
    seoTitle: 'Free PDF Merge Online – Combine PDF Files Privately | Toolora',
    seoDescription:
      'Combine and reorder multiple PDF documents into one PDF directly in your browser. No file uploads, no watermarks.',
    instructions: [
      'Add two or more PDF files to the merge queue.',
      'Use the up and down arrow buttons to set the exact document order.',
      'Click Merge PDFs to build and download your combined document.',
    ],
    overview:
      'Toolora PDF Merge uses pdf-lib inside your browser to copy pages from each selected PDF into a unified document without altering vector text or uploading contracts to third-party servers.',
    limitations:
      'Password-protected or DRM-encrypted PDFs cannot be merged unless unlocked first. Extremely large files (100+ MB total) depend on available browser memory.',
    faqs: [
      {
        question: 'Does merging PDFs add watermarks or reduce text sharpness?',
        answer: 'No. Pages are copied directly at full vector fidelity with zero watermarks.',
      },
    ],
    relatedSlugs: ['pdf-split', 'images-to-pdf', 'pdf-to-images'],
  },
  {
    slug: 'pdf-split',
    name: 'PDF Split',
    shortDescription: 'Extract specific page ranges or split every page into separate PDF files.',
    category: 'pdf-tools',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf page extractor'],
    iconName: 'Scissors',
    popular: true,
    seoTitle: 'Free PDF Split Tool – Extract Pages or Split All | Toolora',
    seoDescription:
      'Extract custom page ranges (like 1-3, 5) or burst every page of a PDF into individual files packaged as a ZIP archive.',
    instructions: [
      'Upload a PDF file to inspect its total page count.',
      'Choose Extract Page Range (e.g., 1-3, 5) to download one PDF with selected pages, or Split Every Page to generate a ZIP of single-page PDFs.',
      'Click Process PDF to export.',
    ],
    overview:
      'Quickly pull out relevant chapters from long reports or separate multi-page invoices into individual files using client-side pdf-lib and JSZip packaging.',
    limitations:
      'Encrypted PDFs that restrict page extraction cannot be split without removing password protection first.',
    faqs: [
      {
        question: 'How should I format custom page ranges?',
        answer: 'Use commas and hyphens such as "1-3, 5, 8-10" (1-indexed page numbers).',
      },
    ],
    relatedSlugs: ['pdf-merge', 'pdf-to-images', 'images-to-pdf'],
  },
  {
    slug: 'pdf-to-images',
    name: 'PDF to Images',
    shortDescription: 'Render PDF pages into high-resolution PNG or JPG images and download as ZIP.',
    category: 'pdf-tools',
    keywords: ['pdf to png', 'pdf to jpg', 'pdf to images', 'render pdf pages'],
    iconName: 'FileOutput',
    recentlyAdded: true,
    seoTitle: 'PDF to Images Converter – Export PDF Pages to PNG or JPG | Toolora',
    seoDescription:
      'Convert PDF pages to high-resolution PNG or JPG images right in your browser. Preview every page and download individually or as a ZIP.',
    instructions: [
      'Select a PDF document from your device.',
      'Choose PNG or JPG output format and rendering scale (1x Standard or 2x High-DPI).',
      'Click Render Pages, preview thumbnails, and download individual pages or Download All (ZIP).',
    ],
    overview:
      'Powered by Mozilla PDF.js running locally in a Web Worker, this utility rasterizes each PDF page onto an HTML5 Canvas so you can embed slides or document previews anywhere.',
    limitations:
      'Documents with dozens of high-DPI pages consume significant browser RAM; for very large manuals, render at 1x scale.',
    faqs: [
      {
        question: 'Can I download all pages at once?',
        answer: 'Yes. Click Download All (ZIP) to bundle every rendered page into a single archive.',
      },
    ],
    relatedSlugs: ['images-to-pdf', 'pdf-split', 'image-compressor'],
  },
  {
    slug: 'images-to-pdf',
    name: 'Images to PDF',
    shortDescription: 'Turn JPG and PNG images into a clean, multi-page PDF document.',
    category: 'pdf-tools',
    keywords: ['images to pdf', 'jpg to pdf', 'png to pdf', 'photos to pdf'],
    iconName: 'FilePlus2',
    seoTitle: 'Images to PDF Converter – JPG & PNG to PDF Online | Toolora',
    seoDescription:
      'Convert multiple JPG and PNG images into a multi-page PDF document with customizable page size (A4, Letter, or Fit) and margins.',
    instructions: [
      'Upload one or more JPG or PNG images.',
      'Reorder images as desired and pick a page layout (Fit to Image, A4 Portrait, or US Letter).',
      'Click Create PDF to generate and download your document.',
    ],
    overview:
      'Combine scanned receipts, portfolios, or presentation graphics into a neat multi-page PDF without sending personal documents to external servers.',
    limitations:
      'Supports standard PNG and JPG images directly. Convert WebP files to PNG or JPG first if needed.',
    faqs: [
      {
        question: 'Which page size option should I choose?',
        answer: 'Use A4 or US Letter for printable documents, or Fit to Image to preserve exact original photo dimensions with zero margins.',
      },
    ],
    relatedSlugs: ['pdf-merge', 'pdf-to-images', 'png-to-jpg'],
  },

  // TEXT TOOLS (6)
  {
    slug: 'word-counter',
    name: 'Word Counter',
    shortDescription: 'Analyze words, characters, sentences, reading time, and top keyword frequency.',
    category: 'text-tools',
    keywords: ['word count', 'word counter', 'reading time', 'keyword density', 'essay counter'],
    iconName: 'AlignLeft',
    popular: true,
    featured: true,
    seoTitle: 'Free Word Counter Online – Words, Reading Time & Keywords | Toolora',
    seoDescription:
      'Count words, characters, sentences, paragraphs, estimated reading time, and top keyword density in real time.',
    instructions: [
      'Paste or type your essay, article, or notes into the text area.',
      'Inspect live metrics for words, characters, sentences, paragraphs, and reading/speaking duration.',
      'Review the Top Keywords breakdown to spot repeated terms.',
    ],
    overview:
      'Writers, students, and editors use Toolora Word Counter to hit target length requirements, estimate speaking duration for presentations, and audit word repetition.',
    limitations:
      'Reading time assumes an average adult speed of 200 words per minute; speaking time uses 130 words per minute.',
    faqs: [
      {
        question: 'Is there a character or word limit?',
        answer: 'No artificial limit is imposed; modern browsers smoothly count tens of thousands of words instantaneously.',
      },
    ],
    relatedSlugs: ['character-counter', 'case-converter', 'remove-extra-spaces'],
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    shortDescription: 'Track exact character count, UTF-8 bytes, lines, and social/SEO length limits.',
    category: 'text-tools',
    keywords: ['character counter', 'char count', 'meta description length', 'twitter character limit'],
    iconName: 'Hash',
    seoTitle: 'Character Counter – Live Length & Social Media Limit Checker | Toolora',
    seoDescription:
      'Count characters with and without spaces, UTF-8 byte size, lines, and check against SEO title, meta description, and social limits.',
    instructions: [
      'Type or paste text into the editor.',
      'View total characters, characters excluding spaces, UTF-8 byte size, and line count.',
      'Check the built-in progress meters for SEO titles (60 chars), meta descriptions (160 chars), and X/Twitter posts (280 chars).',
    ],
    overview:
      'Ideal for SEO specialists, copywriters, and social media managers crafting snippets that must fit strict platform character budgets without truncation.',
    limitations:
      'Some social platforms count URLs or certain emoji sequences using specialized normalization rules.',
    faqs: [
      {
        question: 'Why does byte size sometimes differ from character count?',
        answer: 'Standard ASCII letters take 1 byte in UTF-8, while accented characters and emojis take 2 to 4 bytes.',
      },
    ],
    relatedSlugs: ['word-counter', 'case-converter', 'remove-extra-spaces'],
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    shortDescription: 'Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
    category: 'text-tools',
    keywords: ['case converter', 'uppercase to lowercase', 'title case', 'camelCase', 'snake_case'],
    iconName: 'CaseSensitive',
    popular: true,
    seoTitle: 'Case Converter – Title, Upper, Lower, camelCase & snake_case | Toolora',
    seoDescription:
      'Convert text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case.',
    instructions: [
      'Paste the text you want to reformat into the input box.',
      'Click any case transformation button such as Title Case, Sentence case, camelCase, or snake_case.',
      'Copy the transformed output with one click.',
    ],
    overview:
      'Fix accidental Caps Lock paragraphs, format blog headlines into Title Case, or convert variable names between programming conventions in seconds.',
    limitations:
      'Title Case uses standard English minor-word rules; specialized brand names with internal capitals (e.g., iPhone) may need manual touch-ups.',
    faqs: [
      {
        question: 'Can I convert multi-line lists at once?',
        answer: 'Yes. Line breaks are preserved across transformations such as UPPERCASE, lowercase, and Title Case.',
      },
    ],
    relatedSlugs: ['remove-extra-spaces', 'text-reverser', 'word-counter'],
  },
  {
    slug: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    shortDescription: 'Strip duplicate spaces, trailing whitespace, tabs, and blank lines from text.',
    category: 'text-tools',
    keywords: ['remove extra spaces', 'whitespace cleaner', 'trim text', 'remove blank lines'],
    iconName: 'Eraser',
    seoTitle: 'Remove Extra Spaces – Clean Whitespace & Blank Lines | Toolora',
    seoDescription:
      'Clean messy copied text by collapsing multiple spaces, converting tabs, trimming line edges, and removing empty lines.',
    instructions: [
      'Paste messy text copied from PDFs, emails, or web pages.',
      'Toggle the cleanup options you want (collapse multiple spaces, trim lines, remove empty lines, or flatten all line breaks).',
      'Copy the cleaned result and view how many characters were removed.',
    ],
    overview:
      'Copying text from PDF documents often introduces broken spacing and stray blank lines. This cleaner restores crisp, uniform formatting in one click.',
    limitations:
      'If your text contains intentional code indentation, uncheck Trim Leading/Trailing Spaces before cleaning.',
    faqs: [
      {
        question: 'Does it remove single spaces between words?',
        answer: 'No. Collapsing spaces reduces two or more consecutive spaces down to a single space.',
      },
    ],
    relatedSlugs: ['case-converter', 'word-counter', 'text-reverser'],
  },
  {
    slug: 'text-reverser',
    name: 'Text Reverser',
    shortDescription: 'Reverse character order, word order, each word individually, or line order.',
    category: 'text-tools',
    keywords: ['reverse text', 'backwards text', 'reverse words', 'reverse lines'],
    iconName: 'RotateCcw',
    seoTitle: 'Text Reverser – Flip Characters, Words & Lines Online | Toolora',
    seoDescription:
      'Reverse entire strings, flip word order, reverse letters within each word, or invert multi-line lists using Unicode-safe splitting.',
    instructions: [
      'Enter or paste your text in the input panel.',
      'Select a reversal mode: Reverse All Characters, Reverse Word Order, Reverse Each Word, or Reverse Lines.',
      'Copy the reversed output.',
    ],
    overview:
      'Built with Unicode-aware codepoint iteration so accented characters and multi-byte symbols stay intact when reversed.',
    limitations:
      'Complex combined emoji sequences (ZWJ clusters) may split into base symbols in character-by-character reversal mode.',
    faqs: [
      {
        question: 'How do I flip a list from bottom to top?',
        answer: 'Select Reverse Lines mode to invert row order without scrambling the words on each line.',
      },
    ],
    relatedSlugs: ['case-converter', 'remove-extra-spaces', 'character-counter'],
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    shortDescription: 'Generate clean placeholder paragraphs, sentences, or words with optional HTML tags.',
    category: 'text-tools',
    keywords: ['lorem ipsum', 'dummy text', 'placeholder text generator', 'mockup copy'],
    iconName: 'FileText',
    seoTitle: 'Lorem Ipsum Generator – Placeholder Text & HTML Paragraphs | Toolora',
    seoDescription:
      'Generate custom amounts of Lorem Ipsum paragraphs, sentences, or words with optional HTML <p> tags for UI mockups and layouts.',
    instructions: [
      'Choose whether to generate Paragraphs, Sentences, or Words and set the count.',
      'Optionally enable Classic Opening ("Lorem ipsum dolor sit amet...") or HTML <p> tag wrapping.',
      'Copy the generated placeholder text into your design or code.',
    ],
    overview:
      'Quickly populate wireframes, typography tests, and layout prototypes with balanced Latin placeholder copy.',
    limitations:
      'Placeholder text is randomized from classic Latin vocabulary and is intended strictly for layout testing.',
    faqs: [
      {
        question: 'Can I generate ready-to-paste HTML paragraphs?',
        answer: 'Yes. Toggle Wrap in <p> Tags to output clean HTML paragraph markup.',
      },
    ],
    relatedSlugs: ['word-counter', 'character-counter', 'html-encoder-decoder'],
  },

  // DEVELOPER TOOLS (6)
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Create customizable QR codes for URLs, text, or Wi-Fi and export PNG or SVG.',
    category: 'developer-tools',
    keywords: ['qr code generator', 'create qr code', 'svg qr code', 'png qr code'],
    iconName: 'QrCode',
    popular: true,
    featured: true,
    seoTitle: 'Free QR Code Generator – Download PNG & SVG QR Codes | Toolora',
    seoDescription:
      'Generate crisp QR codes for links, text, or contact snippets with custom colors, error correction levels, and PNG/SVG downloads.',
    instructions: [
      'Enter any URL, text message, email, or phone string.',
      'Customize foreground/background colors, pixel size, and error correction level (L, M, Q, H).',
      'Download your QR code as a crisp PNG raster or scalable SVG vector.',
    ],
    overview:
      'Toolora generates static QR codes locally with zero tracking redirects. Your QR codes point directly to your destination forever and never expire.',
    limitations:
      'Ensure high contrast between foreground and background colors (dark foreground on light background) so mobile cameras scan reliably.',
    faqs: [
      {
        question: 'Do these QR codes expire or contain tracking links?',
        answer: 'No. They encode your exact text directly into the matrix with zero intermediary servers.',
      },
    ],
    relatedSlugs: ['url-encoder-decoder', 'base64-encoder-decoder', 'password-generator'],
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    shortDescription: 'Generate cryptographically random passwords with entropy metrics via Web Crypto.',
    category: 'developer-tools',
    keywords: ['password generator', 'strong password', 'random password', 'secure passphrase'],
    iconName: 'KeyRound',
    popular: true,
    seoTitle: 'Secure Password Generator – Web Crypto Randomizer | Toolora',
    seoDescription:
      'Generate strong, unpredictable passwords locally using window.crypto.getRandomValues with custom character sets and entropy meter.',
    instructions: [
      'Adjust the password length slider (8 to 64 characters).',
      'Choose character sets (Uppercase, Lowercase, Numbers, Symbols) and optionally exclude ambiguous characters like 0/O or 1/l.',
      'Click Regenerate or Generate Batch, then copy your chosen password.',
    ],
    overview:
      'Unlike basic pseudo-random scripts, Toolora uses the browser Web Crypto API (crypto.getRandomValues) with rejection sampling to eliminate modulo bias.',
    limitations:
      'Passwords are never saved or transmitted. Store generated credentials in a trusted password manager.',
    faqs: [
      {
        question: 'How is password strength calculated?',
        answer: 'Strength reflects Shannon-style pool entropy in bits: length multiplied by log2 of the active character pool size.',
      },
    ],
    relatedSlugs: ['base64-encoder-decoder', 'qr-code-generator', 'json-formatter'],
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder/Decoder',
    shortDescription: 'Percent-encode or decode URLs and inspect query string parameters.',
    category: 'developer-tools',
    keywords: ['url encode', 'url decode', 'percent encoding', 'query string parser'],
    iconName: 'Link2',
    seoTitle: 'URL Encoder & Decoder – Percent Encoding & Query Parser | Toolora',
    seoDescription:
      'Encode or decode URLs and query parameter values cleanly, plus automatically inspect parsed query parameters in a structured table.',
    instructions: [
      'Choose Encode or Decode mode and select Component (encodeURIComponent) or Full URL (encodeURI).',
      'Paste a URL or query value to see live converted output.',
      'If your input contains query parameters (?key=value), inspect them in the Query Breakdown table below.',
    ],
    overview:
      'Essential for debugging API endpoints, OAuth callback URLs, UTM tracking links, and form submissions containing reserved characters.',
    limitations:
      'Malformed percent sequences such as "%ZZ" will trigger a clear decoding error rather than silently corrupting output.',
    faqs: [
      {
        question: 'When should I use Component vs Full URL mode?',
        answer: 'Use Component mode when encoding a parameter value (it escapes slashes and ?&=). Use Full URL mode when preserving protocol and path separators.',
      },
    ],
    relatedSlugs: ['base64-encoder-decoder', 'html-encoder-decoder', 'json-formatter'],
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    shortDescription: 'Encode and decode UTF-8 text or URL-safe Base64 strings accurately.',
    category: 'developer-tools',
    keywords: ['base64 encode', 'base64 decode', 'utf8 base64', 'url safe base64'],
    iconName: 'Code',
    seoTitle: 'Base64 Encoder & Decoder – UTF-8 & URL-Safe Support | Toolora',
    seoDescription:
      'Convert plain UTF-8 text to Base64 or decode Base64 strings back to readable text with full Unicode and URL-safe support.',
    instructions: [
      'Select Encode to Base64 or Decode from Base64.',
      'Optionally enable URL-Safe mode (- and _ instead of + and /).',
      'Type or paste your text to view live output and copy with one click.',
    ],
    overview:
      'Unlike naive btoa/atob wrappers that crash on accented letters or emojis, Toolora uses TextEncoder/TextDecoder for lossless UTF-8 round-trips.',
    limitations:
      'Base64 is an encoding scheme, not encryption—never use it to hide secrets.',
    faqs: [
      {
        question: 'Does it support Unicode emojis and non-Latin alphabets?',
        answer: 'Yes. Text is encoded to UTF-8 bytes before Base64 conversion so international characters decode cleanly.',
      },
    ],
    relatedSlugs: ['url-encoder-decoder', 'image-to-base64', 'json-formatter'],
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Validate, pretty-print, minify, and sort keys in JSON payloads with line diagnostics.',
    category: 'developer-tools',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'minify json', 'json lint'],
    iconName: 'Braces',
    popular: true,
    featured: true,
    seoTitle: 'JSON Formatter & Validator – Beautify & Minify JSON | Toolora',
    seoDescription:
      'Format, validate, minify, and alphabetize JSON objects in your browser with instant syntax error feedback and byte metrics.',
    instructions: [
      'Paste raw or minified JSON into the editor, or click Load Sample.',
      'Choose Format (2 spaces, 4 spaces, or Tab), Minify, or Sort Keys Alphabetically.',
      'Inspect validity status, key counts, nesting depth, and copy the formatted output.',
    ],
    overview:
      'Built for API debugging and config editing, Toolora JSON Formatter parses payloads strictly per RFC 8259 and highlights parse errors immediately.',
    limitations:
      'Strict JSON does not allow trailing commas, single-quoted strings, or comments.',
    faqs: [
      {
        question: 'Can I sort JSON keys recursively?',
        answer: 'Yes. Clicking Sort Keys alphabetically orders object keys across all nested levels while keeping array order intact.',
      },
    ],
    relatedSlugs: ['base64-encoder-decoder', 'html-encoder-decoder', 'url-encoder-decoder'],
  },
  {
    slug: 'html-encoder-decoder',
    name: 'HTML Encoder/Decoder',
    shortDescription: 'Escape or unescape HTML reserved characters and entities safely.',
    category: 'developer-tools',
    keywords: ['html encode', 'html decode', 'escape html', 'html entities'],
    iconName: 'FileCode2',
    recentlyAdded: true,
    seoTitle: 'HTML Encoder & Decoder – Escape & Unescape HTML Entities | Toolora',
    seoDescription:
      'Safely encode HTML tags into entities (&lt;, &gt;, &amp;) or decode HTML entities back to plain text without executing scripts.',
    instructions: [
      'Pick Encode (Escape HTML) or Decode (Unescape Entities).',
      'Paste HTML markup or entity-encoded strings into the input area.',
      'Copy the converted output safely.',
    ],
    overview:
      'Prevents rendering glitches and XSS issues when embedding code snippets inside HTML pages, documentation, or CMS templates.',
    limitations:
      'Decoding uses a pure lookup map and numeric codepoint parser so pasted scripts are never executed by the DOM.',
    faqs: [
      {
        question: 'Which characters are escaped in Encode mode?',
        answer: 'Reserved characters &, <, >, ", and \' are converted to standard named or numeric entities.',
      },
    ],
    relatedSlugs: ['url-encoder-decoder', 'json-formatter', 'base64-encoder-decoder'],
  },

  // CALCULATORS (5)
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    shortDescription: 'Calculate exact chronological age in years, months, days, and next birthday countdown.',
    category: 'calculators',
    keywords: ['age calculator', 'birthday calculator', 'exact age', 'days lived'],
    iconName: 'Calendar',
    popular: true,
    seoTitle: 'Exact Age Calculator – Years, Months, Days & Birthday | Toolora',
    seoDescription:
      'Calculate your exact age in years, months, days, total weeks, and hours, plus see the day you were born and next birthday countdown.',
    instructions: [
      'Select your Date of Birth using the date picker.',
      'Optionally adjust the "Calculate Age As Of" target date (defaults to today).',
      'View your exact chronological breakdown and next birthday countdown.',
    ],
    overview:
      'Accurately accounts for varying month lengths (28–31 days) and leap years to provide a precise calendar breakdown.',
    limitations:
      'Dates earlier than the target date are required; future birthdates show a validation notice.',
    faqs: [
      {
        question: 'Does the age calculator account for leap years?',
        answer: 'Yes. Exact calendar arithmetic handles leap days (February 29) and varying month lengths accurately.',
      },
    ],
    relatedSlugs: ['time-converter', 'percentage-calculator', 'bmi-calculator'],
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Compute X% of Y, percentage share, percentage change, and markup/markdown.',
    category: 'calculators',
    keywords: ['percentage calculator', 'percent change', 'what percent of', 'percentage increase'],
    iconName: 'Percent',
    popular: true,
    seoTitle: 'Percentage Calculator – Percent Of, Change & Increase | Toolora',
    seoDescription:
      'Solve everyday percentage math across four modes: X% of Y, X is what % of Y, percentage increase/decrease, and adding/subtracting percentages.',
    instructions: [
      'Enter values into any of the four calculator cards depending on your question.',
      'Results update live with the exact formula displayed underneath.',
      'Use Reset to clear all inputs.',
    ],
    overview:
      'Covers every common financial, academic, and statistical percentage calculation on a single scannable workspace.',
    limitations:
      'Percentage change cannot be computed when the starting baseline value is zero.',
    faqs: [
      {
        question: 'How is percentage change calculated?',
        answer: 'Using ((New Value - Original Value) / |Original Value|) × 100.',
      },
    ],
    relatedSlugs: ['discount-calculator', 'loan-calculator', 'age-calculator'],
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    shortDescription: 'Calculate Body Mass Index in Metric or Imperial units with healthy weight range.',
    category: 'calculators',
    keywords: ['bmi calculator', 'body mass index', 'healthy weight range', 'metric imperial bmi'],
    iconName: 'Activity',
    seoTitle: 'BMI Calculator – Metric & Imperial Body Mass Index | Toolora',
    seoDescription:
      'Calculate your Body Mass Index (BMI) in metric (cm/kg) or imperial (ft, in/lbs) units and view the WHO weight category scale.',
    instructions: [
      'Switch between Metric (cm, kg) and Imperial (ft/in, lbs) units.',
      'Enter your height and weight.',
      'Inspect your BMI score, standard WHO category, and healthy weight reference range for your height.',
    ],
    overview:
      'Provides standard adult BMI calculations alongside a clear visual scale bar and target weight range for quick reference.',
    limitations:
      'BMI is a general screening ratio and does not distinguish between muscle mass and body fat. Consult a qualified healthcare professional for medical guidance.',
    faqs: [
      {
        question: 'What is the standard healthy BMI range for adults?',
        answer: 'According to the World Health Organization, an adult BMI between 18.5 and 24.9 is classified as normal weight.',
      },
    ],
    relatedSlugs: ['weight-converter', 'length-converter', 'age-calculator'],
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    shortDescription: 'Find final sale prices, savings amounts, stacked discounts, and optional sales tax.',
    category: 'calculators',
    keywords: ['discount calculator', 'sale price calculator', 'percent off', 'tax after discount'],
    iconName: 'Tag',
    recentlyAdded: true,
    seoTitle: 'Discount Calculator – Final Price, Savings & Sales Tax | Toolora',
    seoDescription:
      'Calculate sale price, total savings, optional second stacked discount, and sales tax instantly before you buy.',
    instructions: [
      'Enter the original sticker price and primary discount percentage.',
      'Optionally add a second stacked coupon percentage or local sales tax rate.',
      'Review the final out-the-door price and total savings breakdown.',
    ],
    overview:
      'Helps shoppers and small-business owners verify stacked coupon discounts (e.g., 20% off plus an extra 10% off) and post-discount sales tax.',
    limitations:
      'Stacked discounts apply sequentially to the reduced subtotal, matching standard retail point-of-sale behavior.',
    faqs: [
      {
        question: 'Is 20% off plus an extra 10% off equal to 30% off?',
        answer: 'No. Retail coupons stack sequentially: 20% off leaves 80%, and 10% off that leaves 72% (28% total savings).',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'loan-calculator', 'unit-converter'],
  },
  {
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    shortDescription: 'Estimate monthly payments, total interest, and full amortization schedules.',
    category: 'calculators',
    keywords: ['loan calculator', 'mortgage calculator', 'amortization schedule', 'monthly payment'],
    iconName: 'Landmark',
    featured: true,
    seoTitle: 'Loan & Amortization Calculator – Monthly Payment & Interest | Toolora',
    seoDescription:
      'Calculate monthly loan payments, total interest paid, principal-to-interest ratio, and inspect a full yearly or monthly amortization schedule.',
    instructions: [
      'Enter the loan principal amount, annual interest rate (APR %), and loan term in years or months.',
      'Inspect monthly payment, total interest, and total repayment summary.',
      'Toggle between Yearly and Monthly amortization tables below.',
    ],
    overview:
      'Uses standard fixed-rate annuity amortization formulas so borrowers can compare loan terms, down payments, and interest rates transparently.',
    limitations:
      'Estimates fixed-rate principal and interest only; actual lender quotes may include origination fees, property taxes, or insurance.',
    faqs: [
      {
        question: 'Can I calculate a 0% interest loan?',
        answer: 'Yes. Entering 0% interest divides the principal evenly across the total number of monthly payments.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'age-calculator'],
  },

  // CONVERTERS (5)
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    shortDescription: 'Convert Area, Volume, Speed, Digital Storage, Pressure, and Energy units.',
    category: 'converters',
    keywords: ['unit converter', 'metric converter', 'area converter', 'volume speed data storage'],
    iconName: 'ArrowLeftRight',
    popular: true,
    featured: true,
    seoTitle: 'All-in-One Unit Converter – Area, Volume, Speed & Data | Toolora',
    seoDescription:
      'Convert units across Area, Volume, Speed, Digital Storage, Pressure, and Energy with instant swap and adjustable decimal precision.',
    instructions: [
      'Pick a measurement category tab (Area, Volume, Speed, Data, Pressure, Energy).',
      'Enter a numeric value and choose your From and To units, or click Swap.',
      'View the exact conversion and quick comparison table across all units in that category.',
    ],
    overview:
      'A unified scientific and everyday converter complementing dedicated Length, Weight, Temperature, and Time converters.',
    limitations:
      'Digital Storage uses standard binary/decimal prefixes clearly labeled (e.g., MiB vs MB); verify which convention your storage vendor uses.',
    faqs: [
      {
        question: 'How many decimal places are supported?',
        answer: 'Results format cleanly up to 6 significant decimal digits, avoiding floating-point noise.',
      },
    ],
    relatedSlugs: ['length-converter', 'weight-converter', 'temperature-converter'],
  },
  {
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    shortDescription: 'Convert between Celsius, Fahrenheit, Kelvin, and Rankine simultaneously.',
    category: 'converters',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'kelvin converter', 'c to f'],
    iconName: 'Thermometer',
    seoTitle: 'Temperature Converter – Celsius, Fahrenheit & Kelvin | Toolora',
    seoDescription:
      'Convert temperatures instantaneously across Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with formula references.',
    instructions: [
      'Type any temperature value into Celsius, Fahrenheit, Kelvin, or Rankine.',
      'All other temperature scales update simultaneously in real time.',
      'Use Quick Presets (Freezing, Room Temp, Body Temp, Boiling) or Reset.',
    ],
    overview:
      'Designed for cooking, weather tracking, and physics calculations with live synchronized inputs across all four temperature scales.',
    limitations:
      'Values below absolute zero (-273.15 °C / 0 K) are physically impossible and trigger a clear warning note.',
    faqs: [
      {
        question: 'What is the formula to convert Celsius to Fahrenheit?',
        answer: 'Multiply Celsius by 9/5 (1.8) and add 32.',
      },
    ],
    relatedSlugs: ['unit-converter', 'length-converter', 'weight-converter'],
  },
  {
    slug: 'length-converter',
    name: 'Length Converter',
    shortDescription: 'Convert millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.',
    category: 'converters',
    keywords: ['length converter', 'cm to inches', 'meters to feet', 'km to miles'],
    iconName: 'Ruler',
    seoTitle: 'Length & Distance Converter – Metric & Imperial | Toolora',
    seoDescription:
      'Convert lengths accurately between mm, cm, m, km, inches, feet, yards, miles, and nautical miles in real time.',
    instructions: [
      'Enter a number in any length unit box or use the primary From/To selector.',
      'All metric and imperial equivalents update instantaneously.',
      'Copy any converted figure directly.',
    ],
    overview:
      'Uses exact international definitions (1 inch = 25.4 mm exact, 1 foot = 0.3048 m exact) for engineering and everyday accuracy.',
    limitations:
      'Extremely large astronomical distances should be converted in scientific notation externally.',
    faqs: [
      {
        question: 'Is 1 inch defined as exactly 2.54 centimeters?',
        answer: 'Yes. By international agreement since 1959, 1 international inch equals exactly 25.4 millimeters.',
      },
    ],
    relatedSlugs: ['weight-converter', 'unit-converter', 'bmi-calculator'],
  },
  {
    slug: 'weight-converter',
    name: 'Weight Converter',
    shortDescription: 'Convert milligrams, grams, kilograms, metric tons, ounces, pounds, and stones.',
    category: 'converters',
    keywords: ['weight converter', 'kg to lbs', 'grams to ounces', 'pounds to kilograms'],
    iconName: 'Scale',
    seoTitle: 'Weight & Mass Converter – KG, Pounds, Ounces & Grams | Toolora',
    seoDescription:
      'Convert mass and weight accurately across milligrams, grams, kilograms, metric tons, ounces, pounds, stones, and US tons.',
    instructions: [
      'Type any mass value into your starting unit.',
      'Review live synchronized conversions across metric and imperial units.',
      'Copy any output value or click Reset.',
    ],
    overview:
      'Uses the exact international avoirdupois pound definition (1 lb = 0.45359237 kg) for cooking, shipping, and fitness tracking.',
    limitations:
      'Uses standard avoirdupois ounces (not troy ounces used for precious metals).',
    faqs: [
      {
        question: 'How many grams are in one pound?',
        answer: 'One international avoirdupois pound equals exactly 453.59237 grams.',
      },
    ],
    relatedSlugs: ['length-converter', 'unit-converter', 'bmi-calculator'],
  },
  {
    slug: 'time-converter',
    name: 'Time Converter',
    shortDescription: 'Convert milliseconds, seconds, minutes, hours, days, weeks, months, and Unix timestamps.',
    category: 'converters',
    keywords: ['time converter', 'hours to minutes', 'seconds to days', 'unix timestamp converter'],
    iconName: 'Clock',
    recentlyAdded: true,
    seoTitle: 'Time & Unix Timestamp Converter – Duration & Epoch | Toolora',
    seoDescription:
      'Convert time durations from milliseconds to years and translate Unix Epoch timestamps to human-readable UTC and local dates.',
    instructions: [
      'Use Duration Mode to convert between milliseconds, seconds, minutes, hours, days, weeks, months, and years.',
      'Switch to Unix Timestamp Mode to convert epoch seconds/milliseconds into ISO/UTC and local date strings.',
    ],
    overview:
      'Combines an everyday duration converter with a developer-ready Unix Epoch timestamp translator in one clean workspace.',
    limitations:
      'Month and year duration conversions use standard Gregorian averages (30.436875 days/month and 365.2425 days/year).',
    faqs: [
      {
        question: 'Does the Unix converter support both seconds and milliseconds?',
        answer: 'Yes. You can toggle between 10-digit seconds and 13-digit milliseconds or auto-detect based on digit length.',
      },
    ],
    relatedSlugs: ['age-calculator', 'unit-converter', 'length-converter'],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: CategorySlug): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === categorySlug);
}
