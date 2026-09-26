# Product Requirements Document (PRD)
**Project**: Digital Nomads in Nepal  
**Domain**: [digitalnomadsinnepal.com](https://digitalnomadsinnepal.com)  
**Version**: 2.0 (Production Verified)  
**Last Updated**: September 2026  

---

## 1. Executive Summary & Vision
**Digital Nomads in Nepal** is the definitive, high-trust ecosystem connecting international remote workers, digital nomads, and expats with verified workspaces, work-friendly accommodations, licensed local guides, community events, and vetted practical guides across Nepal.

The platform eliminates remote work uncertainty in the Himalayas by providing verified internet speeds, generator/power backup guarantees, transparent local pricing, and trusted local networks.

---

## 2. Target Personas
1. **The Remote Nomad**:
   - Software engineers, designers, writers, and entrepreneurs seeking affordable, scenic Himalayan bases (Kathmandu, Pokhara, Lalitpur, Bandipur).
   - Needs: 100+ Mbps fiber internet, ergonomic desks, power backup during load shedding, visa extensions, and easy community integration.
2. **The Workspace & Stay Operator**:
   - Owners of coworking spaces, coliving hubs, work-friendly boutique hotels, and serviced apartments.
   - Needs: Verified listing badges, direct booking/inquiry requests, nomad foot-traffic, and lead management.
3. **The Licensed Mountain & Cultural Guide**:
   - Verified local Sherpas, trekking leaders, and cultural insiders.
   - Needs: Professional profile, nomad reviews, direct contact requests, and booking inquiries.
4. **Platform Administrator**:
   - Managing content, reviewing new hub and guide submissions, monitoring community discussions, and tracking analytics.

---

## 3. Core Feature Specifications

### 3.1. Workspaces Marketplace (`/resources/coworking`)
- **Directory & Map Split-View**: Filter by city (Kathmandu, Pokhara, Lalitpur, etc.), desk type (hot desk, dedicated desk, private office, meeting room), and verified amenities (fiber Wi-Fi, generator, 24/7 access).
- **Workspace Detail Pages (`/resources/coworking/[slug]`)**:
  - Semantic H1, address, verified checklist.
  - Interactive photo lightbox gallery.
  - Live Desk Booking modal (`HubBooking`) and Custom Inquiry modal.
  - Authentic "Verified [Date]" trust badges tied to database timestamps.
  - Schema.org `CoworkingSpace` & `LocalBusiness` JSON-LD structured data.

### 3.2. Stay & Work Directory (`/stay`)
- **Nomad Accommodations**: Curated listings of coliving hubs, work-friendly hotels, hostels, and long-term serviced apartments.
- **Key Work Attributes**: Fiber speed test results, dedicated desk availability, UPS/generator backup, weekly/monthly rates.
- **Schema.org `LodgingBusiness` & `Hotel` JSON-LD** embedded for rich search snippets.
- **Permanent 301 Redirects**: Mapping `/workspaces`, `/stay-and-work`, and `/work-friendly-stays` to canonical directory paths.

### 3.3. Verified Local Guides Directory (`/guides`)
- **Guide Profiles (`/guides/[id]`)**: Bio, specialties, language proficiency, verified badges, rating, review breakdown, and direct contact options.
- **Reviews Engine**: Authenticated nomad reviews with Star ratings.
- **Self-Registration**: Local guides can register at `/guides/register` with dashboard management at `/guides/dashboard`.

### 3.4. Destination Guides (`/destinations/[slug]`)
- **Pillar City Guides**: Kathmandu, Pokhara, Lalitpur, Chitwan, Bandipur, Manang, Mustang.
- **Nomad Fast Facts**: Nomad Score, estimated monthly living cost, tested fiber internet speeds, safety rating, power grid reliability, and SIM coverage.
- **Contextual Cross-Linking**: Direct links to workspaces, stays, local guides, and related articles for each city.

### 3.5. Resource Pillars & Blog (`/resources/*`, `/blog/*`)
- **Evergreen Hub Guides**:
  - `/resources/visa`: 150-day tourist visa rules, extensions, and legal status.
  - `/resources/cost-of-living`: Real budget tables for housing, food, and coworking.
  - `/resources/sim-cards`: Ncell vs NTC 4G/5G, fiber ISPs, and eSIM setup.
  - `/resources/transportation`: Pathao, inDrive, domestic flights, intercity transport.
  - `/resources/banking`: ATMs, card foreign fees, digital wallets.
- **SEO & Readability**: Table of contents, reading progress bar, Schema.org `Article` metadata with `datePublished` and `dateModified`.

### 3.6. Interactive Google-Style Global Search
- Live debounced modal search searching across Workspaces, Stays, Guides, Destinations, and Blog posts simultaneously.
- Recent search query storage in `localStorage`.
- Direct keyboard navigation (`Enter`, `Esc`, arrow keys).

---

## 4. Technical & Quality Constraints
- **Zero Redesign Mandate**: The established visual aesthetics (dark mode palette, amber accents, typography, spacing, navigation) must remain 100% consistent across all pages.
- **Data Integrity**: Zero fake reviews, fake ratings, or fabricated verification timestamps.
- **Code Quality**: Zero ESLint errors or warnings, passing Next.js production builds (`npm run build`).
