# Image Watermarking Application (Nuxt 4)

A modern web application for adding watermarks to images using Nuxt 4, Nuxt UI, and Nuxt Image. Supports multiple languages, all image formats, and SEO optimization.

## Features

- **Nuxt 4 Framework**: Built with the latest Nuxt 4 framework
- **Multi-language Support**: English and Spanish with auto-detection
- **Image Format Support**: JPG, PNG, GIF, SVG, WebP, Base64, Clipboard
- **Watermark Customization**: Text, font size, color, opacity, position
- **Multiple Watermarks**: Add and manage multiple watermarks
- **Real-time Preview**: See watermark effects instantly
- **SEO Optimized**: Nuxt Image integration for optimized images
- **Responsive Design**: Works on all device sizes
- **Vercel Ready**: Deployable to Vercel with no server-side dependencies

## Project Structure

```
watermark/
├── app/
│   ├── components/
│   │   ├── ImageUploader.vue
│   │   ├── WatermarkConfig.vue
│   │   ├── WatermarkPreview.vue
│   │   └── WatermarkManager.vue
│   ├── pages/
│   │   └── index.vue
│   ├── locales/
│   │   ├── en.json
│   │   └── es.json
│   └── assets/
│       └── styles/
├── nuxt.config.ts
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Generate static site:
```bash
npm run generate
```

## Technologies Used

- **Nuxt 4**: Modern Vue.js framework
- **Nuxt UI**: Beautiful UI components with Tailwind CSS
- **Nuxt i18n**: Internationalization support
- **Nuxt Image**: Image optimization and SEO
- **Vue 3**: Reactive components
- **Canvas API**: Client-side image processing

## Supported Image Formats

- JPG, PNG, GIF, SVG, WebP
- Base64 encoded images
- Clipboard paste support
- Drag and drop uploads

## Internationalization

- English (en) - Default
- Spanish (es) - Auto-detected based on browser language
- Dynamic language switching

## SEO Features

- Nuxt Image module integration
- Meta tags for all pages
- Open Graph tags for social sharing
- Schema.org structured data
- Responsive image handling
- Alt text support for accessibility

## Deployment

The application is ready for deployment to Vercel with:
- Static site generation
- No server-side dependencies
- Optimized for performance
- SEO-friendly structure

## License

This project is open source and available under the MIT License.