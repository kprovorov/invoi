# invoi.xyz

![invoi.xyz — Free Invoice Generator](https://invoi.xyz/opengraph-image)

Free, open-source invoice generator. No account, no backend, no tracking beyond analytics. Create, preview, and download professional PDF invoices in seconds — everything happens in your browser.

**Live at [invoi.xyz](https://invoi.xyz)**

## Features

- Live preview as you type
- Download as PDF via browser print
- Data persisted locally in IndexedDB — nothing leaves your device
- Multiple currencies (USD, EUR, GBP, UAH, and more)
- Bank / payment details section
- Works on mobile

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui components
- Vercel Analytics

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx              # Main app (sidebar form)
  layout.tsx            # Root layout + metadata
  globals.css           # Font, Tailwind theme, print styles
  opengraph-image.tsx   # OG image (next/og)
components/
  invoice-preview.tsx   # A4 invoice preview with print support
  ui/                   # shadcn/ui components
lib/
  types.ts              # Invoice + LineItem types
  use-invoice.ts        # State hook with IndexedDB auto-save
  store.ts              # IndexedDB read/write
  constants.ts          # Paper dimensions, currency list
  utils.ts              # formatDate, formatCurrency, cn()
```

## PDF Export

Invoices are exported via `window.print()`. The preview renders at true A4 dimensions (`794×1123px`) and scales to fit the viewport — the print stylesheet resets the transform so the browser outputs exact A4. Chrome and Edge suppress browser headers/footers when `@page { margin: 0 }` is set.

## License

MIT
