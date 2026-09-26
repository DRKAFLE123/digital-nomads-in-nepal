# Memory & Architectural Decisions
**Project**: Digital Nomads in Nepal  
**Domain**: [digitalnomadsinnepal.com](https://digitalnomadsinnepal.com)  

---

## 1. Key Decisions & Rationale

### 1.1. Absolute Visual Preservation
- **Decision**: No visual redesigns, no color alterations, no navbar or hero restructuring.
- **Rationale**: The website is established and visually approved. The primary goal is technical SEO, Google indexing readiness, Schema.org entities, crawl efficiency, and internal link equity.

### 1.2. Workspace Routing & Canonical Strategy
- **Decision**: Workspaces remain canonical at `/resources/coworking` and `/resources/coworking/[slug]`. Added permanent 301 redirects for `/workspaces` and `/coworking` in `next.config.mjs`.
- **Rationale**: Prevents broken backlinks, consolidates domain authority, and provides zero-friction navigation for search crawlers while preserving established database routes.

### 1.3. Stay & Work Concept
- **Decision**: Adopted "Stay & Work" as the core accommodation positioning. Canonical URL is `/stay` with permanent 301 redirects from `/stay-and-work`, `/work-friendly-stays`, and `/accommodations`.
- **Rationale**: Differentiates the platform from generic hotel booking aggregators by highlighting verified fiber Wi-Fi, dedicated workstations, and power backup.

### 1.4. Schema.org AggregateRating Guardrails
- **Decision**: Google strictly penalizes fake review structured data. `aggregateRating` in `generateCoworkingJsonLd` and `generateGuideJsonLd` is conditionally rendered **only** when `totalReviews > 0` and `rating > 0`.
- **Rationale**: Protects the domain from algorithmic and manual structured data penalties in Google Search Console.

### 1.5. Dynamic Metadata in Next.js 14 App Router
- **Decision**: Even for client components (`"use client"`), metadata and JSON-LD structured data are generated server-side in `layout.tsx` or `generateMetadata` in `page.tsx`.
- **Rationale**: Search engine bots receive complete HTML, meta titles, descriptions, openGraph tags, and Schema.org graphs on initial byte transfer prior to React hydration.

### 1.6. PWA Manifest & Favicon Fix
- **Decision**: Removed `favicon.ico` from `/manifest.webmanifest` and configured standard PNG icons (`192x192` and `512x512` with `any` and `maskable` purposes).
- **Rationale**: Resolves Chrome/Edge PWA manifest download errors while maintaining native browser favicon loading in `<head>`.

### 1.7. Zero ESLint Warnings & Passing Production Build
- **Decision**: Strict adherence to zero ESLint warnings and errors across all `.tsx` and `.ts` files. Production build (`npm run build`) verified clean.
