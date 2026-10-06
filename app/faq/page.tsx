import { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FaqClient from "./FaqClient"
import { ALL_FAQS } from "@/lib/faqs"
import { HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Digital Nomad Nepal FAQ | Visa, Internet, Living Costs & Coworking (2026)",
  description: "Get answers to frequently asked questions about living and working remotely in Nepal: 150-day tourist visa rules, 100+ Mbps fiber Wi-Fi, monthly cost of living ($600–$1,200), trekking guides, and coworking spaces.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/faq",
  },
  openGraph: {
    title: "Digital Nomad Nepal FAQ | Visa, Internet, Living Costs & Coworking (2026)",
    description: "Answers to top Google questions about working remotely in Nepal: visa limits, internet speeds, apartments, ATMs, and Himalayan trekking.",
    url: "https://digitalnomadsinnepal.com/faq",
    siteName: "Digital Nomads in Nepal",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Nomad Nepal FAQ (2026)",
    description: "Everything you need to know about remote working in Nepal: visas, Wi-Fi, costs & guides.",
  },
}

export default function FaqPage() {
  // Schema.org FAQPage structured data for Google rich snippets
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  // Schema.org BreadcrumbList structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://digitalnomadsinnepal.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: "https://digitalnomadsinnepal.com/faq",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <HelpCircle size={13} /> Questions &amp; Answers
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              Curated answers to the most common Google search inquiries about living, working, and exploring the Himalayas as a remote professional.
            </p>
          </div>

          {/* Interactive FAQ Browser */}
          <FaqClient />
        </div>
      </main>

      <Footer />
    </div>
  )
}
