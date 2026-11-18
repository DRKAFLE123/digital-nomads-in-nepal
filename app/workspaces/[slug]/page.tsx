import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import CoworkingDetailPage from "@/app/resources/coworking/[slug]/page"
import { SITE_URL } from "@/lib/seo"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const hub = await prisma.workHub.findUnique({
    where: { slug: params.slug },
    select: { name: true, city: true, description: true, photoUrl: true, address: true }
  }).catch(() => null)

  const hubUrl = `${SITE_URL}/workspaces/${params.slug}`
  const title = hub ? `${hub.name} (${hub.city}): Coworking & Desk` : "Workspace in Nepal | Digital Nomads in Nepal"
  const description = hub?.description
    ? `${hub.description.slice(0, 155)}...`
    : `Verified coworking space and nomad workspace in Nepal with high-speed internet and power backup.`

  let imageUrl = `${SITE_URL}/hero-bg.png`
  if (hub?.photoUrl) {
    try {
      if (hub.photoUrl.startsWith("[")) {
        const parsed = JSON.parse(hub.photoUrl)
        if (parsed.length > 0) imageUrl = parsed[0]
      } else if (hub.photoUrl.includes(",")) {
        imageUrl = hub.photoUrl.split(",")[0].trim()
      } else {
        imageUrl = hub.photoUrl
      }
    } catch {}
  }

  return {
    title,
    description,
    alternates: {
      canonical: hubUrl,
    },
    openGraph: {
      title,
      description,
      url: hubUrl,
      siteName: "Digital Nomads in Nepal",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  }
}

export default function WorkspaceSlugPage({ params }: { params: { slug: string } }) {
  return <CoworkingDetailPage params={params} />
}
