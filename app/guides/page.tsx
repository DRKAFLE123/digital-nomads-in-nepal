import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import type { Metadata } from "next"
import GuidesClient from "./GuidesClient"
import TrekkingGuideIcon from "@/components/TrekkingGuideIcon"

import { generateItemListJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Local Experts & Guides in Nepal | Verified Himalayan Guides & Fixers",
  description: "Connect with verified local experts and licensed human guides in Nepal: Himalayan trekking leaders, cultural insiders, city fixers, and local advisors.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/guides",
  },
  openGraph: {
    title: "Local Experts & Guides in Nepal | Verified Himalayan Guides & Fixers",
    description: "Connect with verified local experts and licensed human guides in Nepal: Himalayan trekking leaders, cultural insiders, city fixers, and local advisors.",
    url: "https://digitalnomadsinnepal.com/guides",
    siteName: "Digital Nomads in Nepal",
    locale: "en_US",
    type: "website",
  },
}

export const dynamic = "force-dynamic"

export default async function GuidesPage() {
  const guides = await prisma.guide.findMany({
    orderBy: { avgRating: "desc" },
  })

  const serializedGuides = guides.map(g => ({
    ...g,
    specialties: Array.isArray(g.specialties) ? (g.specialties as string[]) : []
  }))

  const itemListJsonLd = serializedGuides.length > 0
    ? generateItemListJsonLd(
        "Verified Local Experts & Guides in Nepal",
        serializedGuides.map((guide) => ({
          name: guide.name,
          url: `/guides/${guide.id}`,
        }))
      )
    : null

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Local Experts", item: "/guides" },
  ])

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">
                <span>Verified Local Experts</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight flex items-center gap-2 sm:gap-3 flex-wrap">
                <span>Find a Local Guide</span>
                <TrekkingGuideIcon size={30} className="inline-block translate-y-[-1px]" />
              </h1>
              <p className="text-muted text-xs sm:text-sm md:text-base max-w-xl mt-1 sm:mt-1.5 leading-relaxed">
                Connect with verified Nepalese locals for trekking, cultural tours, food walks, and more.
              </p>
            </div>
            <Link
              href="/guides/register"
              className="self-start sm:self-center shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 border border-primary text-primary font-bold text-xs sm:text-sm rounded-full hover:bg-primary hover:text-black transition-all shadow-xs"
            >
              <span>Register as a Guide</span>
              <span>→</span>
            </Link>
          </div>

          {/* Compact Helper: Informational Guides vs Local Human Guides */}
          <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-start sm:items-center gap-2 text-muted">
              <span className="text-sm shrink-0 mt-0.5 sm:mt-0">💡</span>
              <p className="text-[11px] sm:text-xs leading-normal">
                Looking for tutorials on data, transit, or visas? Read our{" "}
                <Link href="/resources/sim-cards" className="text-primary font-semibold hover:underline">SIM Cards Guide</Link>,{" "}
                <Link href="/resources/transportation" className="text-primary font-semibold hover:underline">Transportation</Link>, or{" "}
                <Link href="/resources/visa" className="text-primary font-semibold hover:underline">Nomad Visa Guide</Link>.
              </p>
            </div>
            <Link
              href="/resources"
              className="self-start sm:self-center shrink-0 text-primary font-bold text-[11px] sm:text-xs inline-flex items-center gap-1 hover:underline"
            >
              <span>View Practical Guides</span>
              <span>→</span>
            </Link>
          </div>

          <GuidesClient guides={serializedGuides} />
        </div>
      </main>
      <Footer />
    </>
  )
}
