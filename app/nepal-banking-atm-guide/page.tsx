import ResourceSlugPage, { generateMetadata as baseGenerateMetadata } from "@/app/resources/[slug]/page"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await baseGenerateMetadata({ params: { slug: "banking" } })
  return {
    ...meta,
    alternates: {
      canonical: "https://digitalnomadsinnepal.com/nepal-banking-atm-guide",
    },
    openGraph: {
      ...meta.openGraph,
      url: "https://digitalnomadsinnepal.com/nepal-banking-atm-guide",
    }
  }
}

export default function NepalBankingAtmGuidePage() {
  return <ResourceSlugPage params={{ slug: "banking" }} />
}
