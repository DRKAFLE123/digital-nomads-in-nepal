# Design System & Aesthetic Guidelines
**Project**: Digital Nomads in Nepal  
**Core Aesthetic**: Premium Himalayan Modern Dark / High-Contrast Accent  
**Strict Mandate**: **DO NOT REDESIGN**. All existing components, layouts, card designs, colors, typography, buttons, and animations must be preserved.

---

## 1. Color Palette Tokens

| Token Name | Hex Code | Purpose |
|---|---|---|
| `--background` | `#0A0A0A` / `#0B0B0B` | Deep ultra-dark background |
| `--card` / Surface | `#121212` / `#171717` | Card backgrounds with subtle border framing |
| `--border` | `#242424` / `#2D2D2D` | Sleek separator borders |
| `--primary` | `#FFD400` / `#FFC700` | High-energy Himalayan amber/yellow accent |
| `--primary-hover` | `#F59E0B` / `#EAB308` | Interaction hover state |
| `--foreground` | `#F5F5F5` / `#FFFFFF` | Primary high-contrast text |
| `--muted` | `#A1A1AA` / `#71717A` | Secondary metadata and helper text |
| `--success` | `#22C55E` / `#10B981` | Verification checkmarks, fast speeds |
| `--alert` | `#EF4444` / `#F87171` | Warning alerts and cons |

---

## 2. Typography Hierarchy

- **Font Family**: `Inter`, sans-serif (via `next/font/google`).
- **Heading 1 (`h1`)**:
  - Hero: `text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white`
  - Subpage: `text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight`
- **Heading 2 (`h2`)**:
  - Section Headers: `text-3xl md:text-5xl font-black text-foreground border-l-4 border-primary px-2`
- **Heading 3 (`h3`)**:
  - Card & Subsection Titles: `text-lg sm:text-xl font-bold text-foreground`
- **Body & Paragraphs**:
  - Regular text: `text-sm sm:text-base text-muted-foreground leading-relaxed`

---

## 3. Component Design Rules

### 3.1. Navigation & Header
- Sticky navbar with blur backdrop (`backdrop-blur-md bg-background/80 border-b border-border`).
- Interactive Google Search trigger modal button with keyboard shortcut (`⌘K` / `Ctrl+K`).
- Responsive mobile drawer retaining identical layout on smaller screens.

### 3.2. Cards & Grids
- **Border Treatment**: `border border-[#242424] rounded-2xl sm:rounded-3xl hover:border-[#FFD400]/40 transition-all`.
- **Badges**: Pill-shaped badges (`rounded-full bg-primary/10 text-primary text-xs font-bold px-3 py-1`).
- **Image Optimization**: Cover image aspect ratios (`aspect-video` or `h-48 md:h-56`) with smooth hover scales (`group-hover:scale-105 transition-transform`).

### 3.3. Buttons & CTAs
- **Primary CTA**: `bg-primary hover:bg-yellow-400 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-primary/20`.
- **Secondary Ghost**: `bg-transparent hover:bg-card border border-border text-foreground px-5 py-2.5 rounded-xl text-xs font-bold`.
