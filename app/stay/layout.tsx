import { Metadata } from "next"
import { ACCOMMODATIONS } from "@/lib/accommodations"
import { generateStayJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Work-Friendly Stays & Coliving in Nepal | Digital Nomads in Nepal",
  description: "Find verified work-friendly hotels, coliving spaces, hostels, and serviced apartments across Nepal with high-speed fiber Wi-Fi, dedicated desks, and power backup.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/stay",
  },
  openGraph: {
    title: "Work-Friendly Stays & Coliving in Nepal | Digital Nomads in Nepal",
    description: "Find verified work-friendly hotels, coliving spaces, hostels, and serviced apartments across Nepal with high-speed fiber Wi-Fi, dedicated desks, and power backup.",
    url: "https://digitalnomadsinnepal.com/stay",
    siteName: "Digital Nomads in Nepal",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/blog-lakeside-pokhara.png",
        width: 1200,
        height: 630,
        alt: "Work-Friendly Stays and Coliving in Nepal",
      },
    ],
  },
}

export default function StayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const staySchemas = ACCOMMODATIONS.map(stay => generateStayJsonLd(stay))
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Stay & Work", item: "/stay" },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(staySchemas) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}
