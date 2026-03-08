# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AegisPay web frontend - a marketing, docs, and interactive demo site for a decentralized Web3 payment protocol (Visa-style Auth & Capture for smart contracts). The `/demos` page showcases live protocol demos. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Commands

- `bun dev` - Start dev server
- `bun run build` - Production build
- `bun run lint` - ESLint (next core-web-vitals + typescript configs)

## Architecture

**Framework:** Next.js 16 App Router with TypeScript. Uses `bun` as package manager (bun.lock present).

**Path alias:** `@/*` maps to project root (configured in tsconfig.json).

**Directory layout:**

- `app/` - Next.js App Router pages (layout.tsx, page.tsx, demos/, docs/)
- `src/components/` - Application components (header, hero-section, feature-grid, terminal-mockup, app-mockup, video-section, footer)
- `src/components/docs/` - Documentation page components (markdown-renderer, search-bar, table-of-contents)
- `src/config/` - Site configuration (site.ts for nav/features/copy, demos.ts for demo data)
- `src/components/ui/` - shadcn/ui primitives (button, card, badge, switch, tabs)
- `lib/utils.ts` - Utility functions (cn helper via clsx + tailwind-merge)

**Styling:** Tailwind CSS 4 with `@tailwindcss/postcss`. Dark mode is always on (`className="dark"` on html element). Uses `tw-animate-css` for animations. Custom `aegis-gradient-bg` class on body.

**UI components:** shadcn/ui (installed via `shadcn` CLI). Uses Radix UI primitives, class-variance-authority, and lucide-react icons.

**Fonts:** Geist Sans and Geist Mono loaded via `next/font/google`.
