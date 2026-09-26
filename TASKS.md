# Tasks & Roadmap
**Project**: Digital Nomads in Nepal  
**Status**: SEO Upgrade & Core Marketplace Phase Complete  

---

## 1. Completed Milestones

### Milestone 1: Platform Foundation & Marketplace
- [x] Workspaces directory with split map/grid view (`/resources/coworking`).
- [x] Interactive booking and inquiry modals for work hubs.
- [x] Workspace registration portal (`/resources/coworking/register`).
- [x] Stay & Work accommodations directory (`/stay`).
- [x] Stay owner onboarding portal (`/stay/register`).
- [x] Verified local guide marketplace (`/guides`, `/guides/[id]`).
- [x] Guide dashboard and self-registration (`/guides/dashboard`, `/guides/register`).
- [x] Nomad community forum and real-time check-ins (`/community`).
- [x] Global debounced Google-style search modal (`GoogleSearchModal.tsx`).
- [x] PWA manifest `.ico` download error fix with valid PNG icons.
- [x] 100% ESLint cleanup (0 errors, 0 warnings across whole codebase).

### Milestone 2: Technical SEO Upgrade (P0, P1, P2)
- [x] **P0**: Robots.txt disallowed paths (`/search`, `/admin`, `/api`, `/dashboard`).
- [x] **P0**: 301 permanent redirects in `next.config.mjs` for `/workspaces`, `/stay-and-work`, `/work-friendly-stays`, `/accommodations`, `/coworking`, `/nomad-guides`.
- [x] **P0**: Dynamic XML sitemap with destinations, work hubs, verified guides, blog articles, stays, and pillar guides.
- [x] **P0**: Semantic single H1 on Homepage (*"Digital Nomads in Nepal — Live, Work & Explore"*).
- [x] **P0**: Dynamic unique title tag and meta description system across all public pages.
- [x] **P1**: Schema.org `CoworkingSpace` & `LocalBusiness` JSON-LD on workspace pages.
- [x] **P1**: Schema.org `LodgingBusiness` & `Hotel` JSON-LD on Stay & Work pages.
- [x] **P1**: Schema.org `Person` & `TouristGuide` JSON-LD on local guide pages.
- [x] **P1**: Schema.org `TouristDestination` & `BreadcrumbList` on destination pages.
- [x] **P1**: Schema.org `Article` with `datePublished` & `dateModified` on blog pages.
- [x] **P1**: Schema.org `WebSite` with `SearchAction` & `Organization` in root layout.
- [x] **P1**: Contextual cross-links between destinations, workspaces, stays, and guides.
- [x] **P2**: Trust & freshness signals with real `updatedAt` timestamps.
- [x] **P2**: Custom 404 recovery page linking directly to Home, Workspaces, Stay & Work, Destinations, and Blog.
- [x] **P2**: Production build validation (`npm run build` completed with exit code 0).

---

## 2. Upcoming Roadmap (Milestone 3 & Beyond)

- [ ] **Google Search Console**:
  - Submit `https://digitalnomadsinnepal.com/sitemap.xml`.
  - Request indexing on high-priority landing pages (`/`, `/resources/coworking`, `/stay`, `/destinations`, `/guides`).
- [ ] **City Workspaces Landing Pages**:
  - Automatically generate static city workspace pages (`/workspaces/kathmandu`, `/workspaces/pokhara`) as catalog grows.
- [ ] **Community Discussions Indexing**:
  - Enable public crawl for curated community FAQ threads with `DiscussionForumPosting` schema once admin moderation approves them.
- [ ] **Stripe / Khalti Payment Gateway**:
  - Seamless deposit payments for confirmed workspace desk bookings.
