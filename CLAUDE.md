# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start development server
pnpm build     # Production build
pnpm lint      # Run ESLint
pnpm start     # Start production server
```

## Architecture

Next.js 16 app using the App Router (`app/` directory). React 19, TypeScript (strict), Tailwind CSS v4.

**Key patterns:**
- `app/` — pages and layouts (App Router)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge) for conditional class merging
- shadcn/ui is configured (New York style, lucide icons, RSC enabled) but components are added via CLI: `pnpm dlx shadcn@latest add <component>`

**Styling:** Tailwind v4 with CSS custom properties in `globals.css` using `oklch()` color space. Theme tokens cover light/dark modes, sidebar, and chart colors.

**Path alias:** `@/*` maps to the project root.
