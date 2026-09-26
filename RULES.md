# Development Rules & Coding Standards
**Project**: Digital Nomads in Nepal  

---

## 1. Core Principles
1. **Never Redesign Without Explicit Permission**: The UI design, typography, brand colors, spacing, and layouts are frozen. Only semantic HTML, metadata, and accessibility improvements are permitted.
2. **Never Fabricate Data**: Never output fake reviews, fake ratings, or fake verification dates. Use real database columns (`rating`, `totalReviews`, `updatedAt`, `isVerified`) or safe fallbacks.
3. **No Unused Code or Build Warnings**: Run `npm run lint` before committing. Ensure 0 warnings and 0 errors.

---

## 2. Next.js 14 App Router Conventions
1. **Server vs. Client Components**:
   - Keep data fetching on the server wherever possible.
   - If interactive client state (`useState`, `useEffect`) is needed, isolate it in `"use client"` components, while keeping `generateMetadata` and JSON-LD scripts in parent server `layout.tsx` or `page.tsx`.
2. **Dynamic Route Metadata**:
   - Every dynamic page (`[slug]`, `[id]`) must export an `async generateMetadata({ params })` function with a dynamic title, description, canonical URL, and OpenGraph image.
3. **Canonical URLs**:
   - Always include `alternates: { canonical: url }` with absolute URLs (`https://digitalnomadsinnepal.com/...`).
   - Query parameters (filters, searches) must self-canonicalize to the base clean URL.

---

## 3. Structured Data (Schema.org) Rules
1. All structured data scripts must use `type="application/ld+json"`.
2. Validate against official Schema.org standards:
   - Workspaces: `CoworkingSpace` + `LocalBusiness`.
   - Accommodations: `LodgingBusiness` + `Hotel`.
   - Local Guides: `Person` + `TouristGuide`.
   - Destinations: `TouristDestination`.
   - Articles: `Article`.
   - Breadcrumbs: `BreadcrumbList`.
3. `aggregateRating` must **never** be rendered if `totalReviews === 0` or `rating === 0`.

---

## 4. Git & Commit Guidelines
- Use conventional commit messages:
  - `feat: ...` for new features
  - `fix: ...` for bug fixes
  - `perf: ...` for performance improvements
  - `refactor: ...` for refactoring without behavior changes
  - `seo: ...` for technical SEO upgrades
- Never commit secret credentials, `.env` files, or API keys.
