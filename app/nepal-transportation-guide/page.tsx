import ResourceSlugPage, { generateMetadata as baseGenerateMetadata } from "@/app/resources/[slug]/page"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await baseGenerateMetadata({ params: { slug: "transportation" } })
  return {
    ...meta,
    alternates: {
      canonical: "https://digitalnomadsinnepal.com/nepal-transportation-guide",
    },
    openGraph: {
      ...meta.openGraph,
      url: "https://digitalnomadsinnepal.com/nepal-transportation-guide",
    }
  }
}

export default function NepalTransportationGuidePage() {
  return <ResourceSlugPage params={{ slug: "transportation" }} />
}
