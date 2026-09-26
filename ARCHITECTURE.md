# Architecture Documentation
**Project**: Digital Nomads in Nepal  
**Framework**: Next.js 14.2.35 (App Router)  
**Database**: MySQL with Prisma ORM  
**Styling**: Tailwind CSS & Vanilla Tokens  
**Language**: TypeScript  

---

## 1. System Overview

```
                                [Client Browser]
                                       │
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
              [Next.js App Router]           [SEO Crawlers / Bots]
             (React Server & Client)           (SSR Initial HTML)
                        │                             │
       ┌────────────────┼────────────────┐            │
       ▼                ▼                ▼            ▼
[API Route Handlers] [Pages & Layouts] [Server Actions] [JSON-LD / Schema]
       │                │                │            │
       └────────────────┼────────────────┘            │
                        ▼                             │
                 [Prisma Client]                      │
                        │                             │
                        ▼                             │
                [MySQL Database]                      │
```

---

## 2. Directory Structure

```
├── app/
│   ├── layout.tsx                   # Global root layout, GTM, ThemeProvider, Organization & WebSite JSON-LD
│   ├── page.tsx                     # Homepage with single semantic H1, Top Destinations, Blog Grid
│   ├── robots.ts                    # Robots.txt handler (disallowing /admin, /api, /search)
│   ├── sitemap.ts                   # Dynamic XML sitemap generator with DB entities
│   ├── manifest.ts                  # PWA Manifest with valid PNG icons
│   ├── not-found.tsx                # Custom 404 recovery page
│   ├── api/                         # Backend API route handlers
│   │   ├── search/                  # Multi-entity debounced search endpoint
│   │   ├── work-hubs/               # Workspace CRUD, listings, and bookings
│   │   ├── guides/                  # Guide directory, reviews, and registrations
│   │   └── community/               # Discussions, check-ins, and nomad profiles
│   ├── blog/
│   │   ├── page.tsx                 # Blog index
│   │   └── [slug]/page.tsx          # Dynamic blog article with Article JSON-LD
│   ├── destinations/
│   │   ├── page.tsx                 # Destinations directory
│   │   └── [slug]/page.tsx          # Destination guide with TouristDestination & Breadcrumbs
│   ├── guides/
│   │   ├── page.tsx                 # Guides directory
│   │   ├── [id]/page.tsx            # Guide profile with Person JSON-LD
│   │   ├── register/page.tsx        # Guide self-onboarding
│   │   └── dashboard/page.tsx       # Guide profile management
│   ├── resources/
│   │   ├── page.tsx                 # Resources overview
│   │   ├── [slug]/page.tsx          # Pillar guides (visa, cost-of-living, sim-cards)
│   │   └── coworking/
│   │       ├── page.tsx             # Workspaces marketplace & map
│   │       ├── [slug]/layout.tsx    # Workspace dynamic metadata & CoworkingSpace JSON-LD
│   │       ├── [slug]/page.tsx      # Workspace details, booking modals, reviews
│   │       └── register/page.tsx    # Workspace owner self-onboarding
│   └── stay/
│       ├── layout.tsx               # Stay & Work metadata & LodgingBusiness JSON-LD
│       ├── page.tsx                 # Stay & Work curated accommodations
│       └── register/page.tsx        # Stay owner self-registration
├── components/                      # UI components (Hero, Navbar, Footer, Modals, Cards)
├── lib/
│   ├── prisma.ts                    # Global Prisma client singleton
│   ├── seo.ts                       # Schema.org structured data helpers
│   ├── accommodations.ts            # Shared Stay & Work dataset
│   └── auth.ts                      # Authentication helpers
└── prisma/
    └── schema.prisma                # Database schema definitions
```

---

## 3. Database Models (Prisma ORM)

| Model | Description | Primary Attributes |
|---|---|---|
| `WorkHub` | Coworking spaces and work hubs | `id`, `name`, `slug`, `city`, `address`, `rating`, `totalReviews`, `isVerified`, `priceDaily`, `priceMonthly`, `facilities`, `updatedAt` |
| `HubBooking` | Workspace desk reservation requests | `id`, `hubId`, `nomadName`, `nomadEmail`, `startDate`, `endDate`, `status` |
| `Guide` | Local licensed mountain/cultural guides | `id`, `name`, `bio`, `location`, `specialties`, `avgRating`, `totalReviews`, `isVerified`, `contactEmail` |
| `Review` | Verified nomad ratings for guides | `id`, `rating`, `comment`, `guideId`, `userId`, `createdAt` |
| `Destination` | City and regional hubs | `id`, `name`, `slug`, `description`, `tags`, `image`, `updatedAt` |
| `Post` | Blog articles and resource pillars | `id`, `slug`, `title`, `excerpt`, `content`, `coverImage`, `category`, `published`, `createdAt`, `updatedAt` |
| `NomadProfile` | Digital nomad community member profile | `id`, `name`, `email`, `country`, `currentCity`, `workType`, `bio` |
| `HubCheckIn` | Real-time presence at a workspace | `id`, `profileId`, `hubId`, `checkInAt`, `checkOutAt` |
| `CommunityDiscussion` | Nomad community forum threads | `id`, `title`, `content`, `category`, `authorId`, `likes`, `createdAt` |

---

## 4. Structured Data (JSON-LD) Strategy

| Route | Schema Type | Key Properties |
|---|---|---|
| `/` (Global Layout) | `Organization`, `WebSite` | `name`, `url`, `logo`, `potentialAction: SearchAction` |
| `/resources/coworking/[slug]` | `CoworkingSpace`, `LocalBusiness`, `BreadcrumbList` | `name`, `address`, `priceRange`, `openingHours`, `aggregateRating` (conditional on real reviews > 0) |
| `/stay` | `LodgingBusiness`, `Hotel`, `BreadcrumbList` | `name`, `description`, `priceRange`, `amenityFeature`, `address` |
| `/guides/[id]` | `Person`, `TouristGuide`, `BreadcrumbList` | `name`, `bio`, `addressLocality`, `knowsAbout`, `aggregateRating` |
| `/destinations/[slug]` | `TouristDestination`, `BreadcrumbList` | `name`, `containedInPlace (Nepal)`, `touristType`, `image` |
| `/blog/[slug]` | `Article`, `BreadcrumbList` | `headline`, `image`, `datePublished`, `dateModified`, `author`, `publisher` |
