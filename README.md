# MarkShield — Image & PDF Watermarking (Nuxt 4)

A client-side watermarking tool for images and PDFs. Built with Nuxt 4, Nuxt UI, and Canvas API. Deployable to Vercel.

## Features

- **Multi-image gallery** — Upload N files, page through them one at a time (arrow keys or ◀/▶ buttons)
- **PDF support** — Renders real PDF pages in preview via pdfjs-dist; exports all pages as a watermarked PDF
- **Rich watermarks** — Solid / gradient / random colors, tiled patterns, background boxes, borders, rotation, multiline text
- **Smart presets** — 25+ built-in presets + 4 business presets with dynamic token interpolation (`{month_name}`, `{year}`, `{business}`, etc.)
- **Business name** — Configurable in the sidebar; defaults to "Hostal Zamora"; persisted to localStorage
- **Export formats** — PNG, JPG, WebP, BMP, TIFF, AVIF (images) · PDF (documents)
- **Batch export** — Export all uploaded files in one click with the full watermark pipeline
- **Undo / Redo** — Full history with up to 50 steps
- **Saved presets** — Up to 10 user presets persisted to localStorage
- **i18n** — English + Spanish (`/i18n/locales/`)
- **Mobile responsive** — Collapsible tabs, touch pan/pinch-zoom preview

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3008
npm run build     # Vercel-ready production build
npm run preview   # Preview production build locally
```

## Project Structure

```
watermark/
├── app/
│   ├── components/
│   │   ├── ImageGallery.vue       # Thumbnail strip / image selector
│   │   ├── ImageUploader.vue      # Drag-drop / clipboard file intake
│   │   ├── WatermarkConfig.vue    # Per-watermark property editor
│   │   ├── WatermarkManager.vue   # Multi-watermark layer list
│   │   └── WatermarkPreview.vue   # Canvas preview (images + PDFs)
│   ├── composables/
│   │   └── useWatermark.js        # Shared watermark state
│   ├── pages/
│   │   ├── index.vue              # Landing page
│   │   └── tool.vue               # Main editor
│   └── utils/
│       ├── imageProcessor.js      # Image load / export helpers
│       ├── pdfProcessor.js        # pdfjs render + jsPDF export
│       └── presetTokens.js        # {token} interpolation for presets
├── i18n/locales/
│   ├── en.json
│   └── es.json
├── nuxt.config.ts                 # nitro preset: vercel, /tool SSR-off
├── vercel.json                    # Cache headers for _nuxt/ assets
└── tailwind.config.js
```

## Deployment (Vercel)

The project is pre-configured for Vercel:
- `nitro.preset: 'vercel'` in `nuxt.config.ts`
- `/tool` route uses `ssr: false` (fully client-side canvas work)
- `vercel.json` sets immutable cache headers for hashed assets
- `engines.node: ">=20.11.0"` in `package.json`

Push to your Vercel-linked repo and deploy — no extra configuration needed.

## Preset Tokens

Use these inside any preset text (including saved presets):

| Token | Example output |
|-------|---------------|
| `{business}` | Hostal Zamora |
| `{month_name}` | abril |
| `{month}` | 04 |
| `{year}` | 2026 |
| `{date}` | 18/04/2026 |
| `{time}` | 09:30 |

The business name is editable via the "Business:" field in the sidebar.

## localStorage Keys

| Key | Contents |
|-----|----------|
| `markshield_presets` | Saved user presets (max 10) |
| `markshield_watermarks` | Active watermark layers |
| `markshield_current_watermark` | Current watermark config |
| `markshield_history` | Undo history |
| `markshield_settings` | `{ businessName }` |

## License

MIT
