# Toolora – Free Online Tools for Everyday Tasks

Toolora is a fast, privacy-first, multi-page online utilities platform built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. All 32 tools execute locally inside the user's browser—files and inputs are never uploaded to or stored on external servers.

## Implemented Tools (32 Unique Utilities)

- **Image Tools (6)**: Image Compressor, Image Resizer, Image Cropper, JPG to PNG, PNG to JPG, Image to Base64
- **PDF Tools (4)**: PDF Merge, PDF Split, PDF to Images (`pdfjs-dist` Web Worker), Images to PDF (`pdf-lib`)
- **Text Tools (6)**: Word Counter, Character Counter, Case Converter, Remove Extra Spaces, Text Reverser, Lorem Ipsum Generator
- **Developer Tools (6)**: QR Code Generator (`qrcode`), Password Generator (Web Crypto API), URL Encoder/Decoder, Base64 Encoder/Decoder, JSON Formatter, HTML Encoder/Decoder
- **Calculators (5)**: Age Calculator, Percentage Calculator, BMI Calculator, Discount Calculator, Loan Calculator
- **Converters (5)**: Unit Converter (Area, Volume, Speed, Storage, Pressure, Energy), Temperature Converter, Length Converter, Weight Converter, Time & Unix Timestamp Converter

## Project Folder Structure

```text
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── common/          # Breadcrumbs, CopyButton, FileDropzone, SeoHead, ToolCard, ToolIcon
│   │   └── layout/          # Layout, Navbar, Footer, ToolPageLayout
│   ├── context/             # ThemeContext (Light/Dark), RecentToolsContext
│   ├── data/                # categories.ts, tools.ts
│   ├── hooks/               # useToolSearch.ts
│   ├── pages/               # HomePage, AllToolsPage, CategoryPage, ToolDetailPage, AboutPage, ContactPage, Legal pages, NotFoundPage
│   ├── tools/
│   │   ├── image/
│   │   ├── pdf/
│   │   ├── text/
│   │   ├── developer/
│   │   ├── calculators/
│   │   └── converters/
│   ├── utils/               # conversionData.ts, formatters.ts, imageUtils.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── netlify.toml
├── vercel.json
└── package.json
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run lint
npm run build
```

## Deployment Instructions

### Deploy to Netlify
`netlify.toml` is already included with the build command (`npm run build`), publish directory (`dist`), and SPA fallback redirect rule (`/* -> /index.html`).
1. Connect your repository in Netlify or run `npx netlify-cli deploy --prod --dir=dist`.
2. Update `public/sitemap.xml`, `public/robots.txt`, and `index.html` canonical URLs to your custom domain.

### Deploy to Vercel
`vercel.json` is already included with SPA rewrite rules (`/(.*) -> /index.html`).
1. Import the repository into Vercel (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`), or run `npx vercel --prod`.
2. Update `public/sitemap.xml`, `public/robots.txt`, and `index.html` canonical URLs to your custom domain.
