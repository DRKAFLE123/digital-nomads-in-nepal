import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import type { Metadata } from "next"
import GuidesClient from "./GuidesClient"

export const metadata: Metadata = {
  title: "Find Local Guides in Nepal | Digital Nomads in Nepal",
  description: "Discover and connect with verified local Nepalese guides — trekking, culture, food, and more. Leave reviews and ratings.",
}

export const revalidate = 60

export default async function GuidesPage() {
  const guides = await prisma.guide.findMany({
    orderBy: { avgRating: "desc" },
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">Guide Marketplace</span>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4">
                Find a Local Guide in Nepal
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

          <GuidesClient guides={guides} />
        </div>
      </main>
      <Footer />
    </>
  )
}
