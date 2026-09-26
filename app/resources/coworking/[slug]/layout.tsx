import { Metadata } from "next"
import { prisma } from "@/lib/prisma"

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

  const title = `${hub.name} — Coworking in ${hub.city}, Nepal | Digital Nomads`
  const description = hub.description
    ? hub.description.slice(0, 155) + "..."
    : `Explore ${hub.name} in ${hub.city}, Nepal. Verified WiFi speed, desk rates, and digital nomad community.`

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

export default function CoworkingDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
