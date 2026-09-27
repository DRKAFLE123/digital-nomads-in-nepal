import ResourceSlugPage, { generateMetadata as baseGenerateMetadata } from "@/app/resources/[slug]/page"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await baseGenerateMetadata({ params: { slug: "sim-cards" } })
  return {
    ...meta,
    alternates: {
      canonical: "https://digitalnomadsinnepal.com/nepal-sim-cards-guide",
    },
    openGraph: {
      ...meta.openGraph,
      url: "https://digitalnomadsinnepal.com/nepal-sim-cards-guide",
    }
  }
}

export default function NepalSimCardsGuidePage() {
  return <ResourceSlugPage params={{ slug: "sim-cards" }} />
}
