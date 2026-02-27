# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start development server
pnpm build     # Production build
pnpm lint      # Run ESLint
pnpm start     # Start production server
```

## What This Is

Single-page invoice generator. No auth, no backend. All data persisted in IndexedDB in the browser. Clicking "Download PDF" triggers `window.print()`.

## Architecture

Next.js 16 app using the App Router (`app/` directory). React 19, TypeScript (strict), Tailwind CSS v4.

**Key files:**
- `app/page.tsx` — sidebar form UI, orchestrates state via `useInvoice`
- `app/globals.css` — Lilex font import, Tailwind theme, print styles
- `app/layout.tsx` — minimal layout, no font setup (font loaded via `@fontsource/lilex` in CSS)
- `lib/types.ts` — `Invoice` and `LineItem` interfaces, `defaultInvoice`, `newLineItem()`
- `lib/constants.ts` — `PAPER_W`, `PAPER_H` (A4 CSS pixels), `CURRENCIES` list
- `lib/store.ts` — IndexedDB read/write (no external deps)
- `lib/use-invoice.ts` — `useInvoice()` hook: invoice state, auto-save, update callbacks
- `lib/utils.ts` — `cn()`, `formatDate()`, `formatCurrency()`
- `components/invoice-preview.tsx` — A4 preview component, manages its own scale/ResizeObserver
- `components/ui/` — shadcn/ui components (Button, Input, Label, Select, DatePicker, Calendar, Popover)

**Key patterns:**
- `app/` — pages and layouts (App Router)
- shadcn/ui is configured (New York style, lucide icons, RSC enabled). Add components via: `pnpm dlx shadcn@latest add <component>`
- shadcn component defaults are overridden in the component files to match the black/white Lilex palette

## Invoice Data Model

```ts
interface Invoice {
  fromName, fromEmail, fromPhone, fromAddress   // sender
  toName, toEmail, toAddress                    // client
  invoiceNumber, issueDate, dueDate, currency   // details
  lineItems: LineItem[]                         // { id, description, quantity, rate }
  bankName, bankAccount, bankSwift              // payment details
}
```

## Styling

- **Font:** Lilex (monospace) loaded via `@fontsource/lilex`. Set as `--font-sans` and `--font-mono` in Tailwind theme.
- **Palette:** black `#111111`, muted `#888888`, subtle `#BBBBBB`, border `#E5E5E5`, input bg `#FAFAFA`, canvas bg `#EBEBEB`
- Tailwind v4 with CSS custom properties in `globals.css` using `oklch()` color space.
- `--primary` and `--ring` CSS variables set to `oklch(0.13 0 0)` (~`#111111`) so shadcn Button and focus states match the palette.
- **Path alias:** `@/*` maps to the project root.

## Invoice Preview

`components/invoice-preview.tsx` renders the invoice at true A4 CSS dimensions (`794×1123px`, defined in `lib/constants.ts`) and uses `transform: scale()` driven by a `ResizeObserver` to fit the canvas — content never reflows, only scales. Print resets the transform so the browser prints at exact A4 size.

## Print / PDF

- `window.print()` — no PDF library
- `@page { margin: 0; size: A4 }` — suppresses browser headers/footers in Chrome/Edge
- `print-color-adjust: exact` — preserves grey tones
- Sidebar and canvas background hidden via `print:hidden` / `print:bg-white`
- Invoice paper resets transform and fills the page with `print:!transform-none print:!w-full`

## IndexedDB

`lib/store.ts` opens `invoi-db` (version 1), object store `data`, single key `current-invoice`. Auto-save is debounced 400ms after any state change, managed inside `useInvoice()`. Silently fails if unavailable.
