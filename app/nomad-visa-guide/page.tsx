import ResourceSlugPage, { generateMetadata as baseGenerateMetadata } from "@/app/resources/[slug]/page"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await baseGenerateMetadata({ params: { slug: "visa" } })
  return {
    ...meta,
    alternates: {
      canonical: "https://digitalnomadsinnepal.com/nomad-visa-guide",
    },
    openGraph: {
      ...meta.openGraph,
      url: "https://digitalnomadsinnepal.com/nomad-visa-guide",
    }
  }
}

export default function NomadVisaGuidePage() {
  return <ResourceSlugPage params={{ slug: "visa" }} />
}
