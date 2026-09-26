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
      <main className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">Guide Marketplace</span>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4 flex items-center gap-3 flex-wrap">
                Find a Local Guide in Nepal
                <TrekkingGuideIcon size={40} className="translate-y-[-2px]" />
              </h1>
              <p className="text-muted text-lg max-w-xl">
                Connect with verified Nepalese locals for trekking, cultural tours, food walks, and more.
              </p>
            </div>
            <Link
              href="/guides/register"
              className="flex-shrink-0 inline-block px-6 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-black transition-all"
            >
              Register as a Guide →
            </Link>
          </div>

          {/* Disambiguation Helper: Informational Guides vs Local Human Guides */}
          <div className="mb-10 p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-wider block mb-1">Looking for Informational How-To Guides?</span>
              <p className="text-sm text-muted">
                Need tutorials on mobile data, transit, or legal rules? Read our{" "}
                <Link href="/resources/sim-cards" className="text-primary font-medium hover:underline">SIM Cards Guide</Link>,{" "}
                <Link href="/resources/transportation" className="text-primary font-medium hover:underline">Transportation Guide</Link>, and{" "}
                <Link href="/resources/visa" className="text-primary font-medium hover:underline">Nomad Visa Guide</Link>.
              </p>
            </div>
            <Link
              href="/resources"
              className="px-4 py-2 border border-border rounded-lg text-xs font-bold text-foreground hover:bg-card hover:border-primary transition-colors flex-shrink-0 text-center"
            >
              View Practical Guides →
            </Link>
          </div>

          <GuidesClient guides={serializedGuides} />
        </div>
      </main>
      <Footer />
    </>
  )
}
