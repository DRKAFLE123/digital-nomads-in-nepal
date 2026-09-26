import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Coworking Spaces & Work Hubs in Nepal | Digital Nomads in Nepal",
  description: "Find verified coworking spaces and work hubs in Kathmandu, Pokhara, and across Nepal with Wi-Fi, desks, power backup, day passes, and workspace details.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/resources/coworking",
  },
}

export default async function CoworkingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hubs = await prisma.workHub.findMany({
    select: { name: true, slug: true },
    orderBy: { rating: "desc" },
    take: 30,
  }).catch(() => [])

  const itemListJsonLd = hubs.length > 0
    ? generateItemListJsonLd(
        "Verified Coworking Spaces in Nepal",
        hubs.map((hub) => ({
          name: hub.name,
          url: `/resources/coworking/${hub.slug}`,
        }))
      )
    : null

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Workspaces", item: "/resources/coworking" },
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
      {children}
    </>
  )
}
