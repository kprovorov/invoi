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
- `app/page.tsx` — entire app (single client component, `'use client'`)
- `app/globals.css` — Lilex font import, Tailwind theme, print styles
- `app/layout.tsx` — minimal layout, no font setup (font loaded via `@fontsource/lilex` in CSS)
- `lib/types.ts` — `Invoice` and `LineItem` interfaces, `defaultInvoice`, `newLineItem()`
- `lib/store.ts` — IndexedDB read/write (no external deps)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

**Key patterns:**
- `app/` — pages and layouts (App Router)
- shadcn/ui is configured (New York style, lucide icons, RSC enabled) but components are added via CLI: `pnpm dlx shadcn@latest add <component>`

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
- **Path alias:** `@/*` maps to the project root.

## Invoice Preview

The preview renders the invoice at true A4 CSS dimensions (`794×1123px`) and uses `transform: scale()` driven by a `ResizeObserver` to fit the canvas — content never reflows, only scales. Print resets the transform so the browser prints at exact A4 size.

## Print / PDF

- `window.print()` — no PDF library
- `@page { margin: 0; size: A4 }` — suppresses browser headers/footers in Chrome/Edge
- `print-color-adjust: exact` — preserves grey tones
- Sidebar and canvas background hidden via `print:hidden` / `print:bg-white`
- Invoice paper resets transform and fills the page with `print:!transform-none print:!w-full`

## IndexedDB

`lib/store.ts` opens `invoi-db` (version 1), object store `data`, single key `current-invoice`. Auto-save debounced 400ms after any state change. Silently fails if unavailable.
