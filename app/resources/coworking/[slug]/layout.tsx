import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { generateCoworkingJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const hub = await prisma.workHub.findUnique({
    where: { slug: params.slug },
  }).catch(() => null)

  const baseUrl = "https://digitalnomadsinnepal.com"
  const url = `${baseUrl}/resources/coworking/${params.slug}`

  if (!hub) {
    return {
      title: "Coworking Space in Nepal | Digital Nomads in Nepal",
      alternates: { canonical: url },
    }
  }

  const title = `${hub.name} | Coworking Space in ${hub.city}, Nepal`
  const description = hub.description
    ? hub.description.slice(0, 155) + "..."
    : `Find verified coworking desks, high-speed fiber Wi-Fi, power backup, and meeting rooms at ${hub.name} in ${hub.city}, Nepal.`

  let imageUrl = `${baseUrl}/hero-bg.png`
  if (hub.photoUrl) {
    try {
      if (hub.photoUrl.startsWith("[")) {
        const parsed = JSON.parse(hub.photoUrl)
        if (Array.isArray(parsed) && parsed[0]) imageUrl = parsed[0]
      } else if (hub.photoUrl.includes(",")) {
        imageUrl = hub.photoUrl.split(",")[0].trim()
      } else {
        imageUrl = hub.photoUrl
      }
    } catch {
      // fallback
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Digital Nomads in Nepal",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${hub.name} Coworking Space in ${hub.city}, Nepal`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function CoworkingDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const hub = await prisma.workHub.findUnique({
    where: { slug: params.slug },
  }).catch(() => null)

  const coworkingJsonLd = hub
    ? generateCoworkingJsonLd({
        name: hub.name,
        slug: hub.slug,
        city: hub.city,
        address: hub.address,
        description: hub.description,
        photoUrl: hub.photoUrl,
        openingHours: hub.openingHours,
        priceDaily: hub.priceDaily,
        priceMonthly: hub.priceMonthly,
        rating: hub.rating,
        totalReviews: hub.totalReviews,
        contactEmail: hub.contactEmail,
        website: hub.website,
        isVerified: hub.isVerified,
      })
    : null

  const breadcrumbJsonLd = hub
    ? generateBreadcrumbJsonLd([
        { name: "Home", item: "/" },
        { name: "Workspaces", item: "/resources/coworking" },
        { name: hub.city, item: `/resources/coworking?city=${encodeURIComponent(hub.city)}` },
        { name: hub.name, item: `/resources/coworking/${hub.slug}` },
      ])
    : null

  return (
    <>
      {coworkingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(coworkingJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
