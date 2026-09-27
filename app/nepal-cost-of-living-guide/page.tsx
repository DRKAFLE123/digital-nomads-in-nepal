import ResourceSlugPage, { generateMetadata as baseGenerateMetadata } from "@/app/resources/[slug]/page"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await baseGenerateMetadata({ params: { slug: "cost-of-living" } })
  return {
    ...meta,
    alternates: {
      canonical: "https://digitalnomadsinnepal.com/nepal-cost-of-living-guide",
    },
    openGraph: {
      ...meta.openGraph,
      url: "https://digitalnomadsinnepal.com/nepal-cost-of-living-guide",
    }
  }
}

export default function NepalCostOfLivingGuidePage() {
  return <ResourceSlugPage params={{ slug: "cost-of-living" }} />
}
