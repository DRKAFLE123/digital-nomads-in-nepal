import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import GuideProfileClient from "./GuideProfileClient"
import { generateGuideJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const guide = await prisma.guide.findUnique({ where: { id: params.id } })
  if (!guide) return {}
  return {
    title: `${guide.name} | Verified Local Guide in ${guide.location}, Nepal`,
    description: `${guide.bio.slice(0, 150)}...`,
    alternates: {
      canonical: `https://digitalnomadsinnepal.com/local-guides/${params.id}`,
    },
    openGraph: {
      title: `${guide.name} | Verified Local Guide in ${guide.location}, Nepal`,
      description: `${guide.bio.slice(0, 150)}...`,
      url: `https://digitalnomadsinnepal.com/local-guides/${params.id}`,
      siteName: "Digital Nomads in Nepal",
      locale: "en_US",
      type: "profile",
      images: [
        {
          url: guide.photoUrl || "https://digitalnomadsinnepal.com/hero-bg.png",
          width: 800,
          height: 800,
          alt: `${guide.name} Himalayan Guide in ${guide.location}`,
        },
      ],
    },
  }
}

export default async function GuideProfilePage({ params }: { params: { id: string } }) {
  const guide = await prisma.guide.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  })

  if (!guide) notFound()

  const specialtiesArray = Array.isArray(guide.specialties) ? (guide.specialties as string[]) : []
  const languagesArray = Array.isArray(guide.languages) ? (guide.languages as string[]) : ["Nepali", "English"]
  const certificationsArray = Array.isArray((guide as any).certifications) ? ((guide as any).certifications as string[]) : []
  const guidingAreasArray = Array.isArray((guide as any).guidingAreas) ? ((guide as any).guidingAreas as string[]) : []

  const guideJsonLd = generateGuideJsonLd({
    id: guide.id,
    name: guide.name,
    bio: guide.bio,
    location: guide.location,
    specialties: specialtiesArray,
    photoUrl: guide.photoUrl,
    contactEmail: guide.contactEmail,
    avgRating: guide.avgRating,
    totalReviews: guide.totalReviews,
    isVerified: guide.isVerified,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Local Guides", item: "/local-guides" },
    { name: guide.name, item: `/local-guides/${guide.id}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="min-h-screen bg-slate-50/70 dark:bg-background pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <GuideProfileClient 
            guide={{
              ...guide,
              specialties: specialtiesArray,
              languages: languagesArray,
              certifications: certificationsArray,
              guidingAreas: guidingAreasArray,
              galleryPhotos: (guide as any).galleryPhotos || [],
              reviews: guide.reviews.map(r => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt.toISOString(),
                user: { name: r.user?.name || "Verified Nomad" }
              }))
            }}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}
