import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer"
import Link from "next/link"
import type { Metadata } from "next"
import { generateBreadcrumbJsonLd, generateItemListJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Practical Guides & Remote Work Resources for Nepal | Digital Nomads in Nepal",
  description: "Comprehensive guides and curated tools for digital nomads in Nepal: SIM cards, high-speed fiber internet, ride-hailing, visa extensions, and remote work setups.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/resources",
  },
  openGraph: {
    title: "Practical Guides & Remote Work Resources for Nepal | Digital Nomads in Nepal",
    description: "Comprehensive guides and curated tools for digital nomads in Nepal: SIM cards, high-speed fiber internet, ride-hailing, visa extensions, and remote work setups.",
    url: "https://digitalnomadsinnepal.com/resources",
    siteName: "Digital Nomads in Nepal",
    locale: "en_US",
    type: "website",
  },
}

const practicalGuides = [
  {
    name: "SIM Cards & Mobile Internet Guide",
    desc: "Complete connectivity guide comparing Ncell 4G/5G, Nepal Telecom (NTC), eSIMs, and data packages for remote workers.",
    link: "/resources/sim-cards"
  },
  {
    name: "Nepal Transportation & Ride-Hailing Guide",
    desc: "How to navigate Nepal: Pathao motorbike taxis, InDrive, local cabs, domestic mountain flights, and tourist buses.",
    link: "/resources/transportation"
  },
  {
    name: "Nepal Nomad Visa & Extensions Guide",
    desc: "Detailed legal framework, 150-day tourist visa rules, on-arrival procedures, and immigration extension fees.",
    link: "/resources/visa"
  },
  {
    name: "Nepal Cost of Living & Budget Breakdown",
    desc: "Comprehensive monthly budget breakdown for Kathmandu and Pokhara: rent, food, cafes, coworking, and transport.",
    link: "/resources/cost-of-living"
  },
  {
    name: "Vetted Coworking Spaces & Work Hubs",
    desc: "Nomad-verified workspaces in Kathmandu, Lalitpur, and Pokhara with generator power backups and fiber internet.",
    link: "/resources/coworking"
  },
  {
    name: "Banking, ATMs & Payment Apps",
    desc: "Managing money in Nepal: reliable bank ATMs, Wise/Revolut card tips, cash exchange, and mobile digital payments.",
    link: "/resources/banking"
  }
]

const resources: Record<string, { name: string; desc: string; link?: string }[]> = {
  "SIM Cards & Data Providers": [
    { name: "Ncell", desc: "Best overall 4G/LTE coverage and data speeds for nomads in Kathmandu and Pokhara." },
    { name: "NTC", desc: "Government telecom provider, superior coverage in remote high-altitude Himalayan regions." },
    { name: "Airalo eSIM", desc: "Get connected instantly with a digital eSIM before landing at Kathmandu airport." }
  ],
  "Banking & Money": [
    { name: "Wise", desc: "Incredibly useful for low-fee transfers to local bank accounts." },
    { name: "Revolut", desc: "Great for ATM withdrawals with low exchange fees." },
    { name: "Payoneer", desc: "Alternative for freelancers receiving USD." }
  ],
  "VPNs": [
    { name: "NordVPN", desc: "Fast and reliable, necessary for accessing home bank accounts." },
    { name: "ExpressVPN", desc: "Premium speeds, great for streaming while in Asia." },
    { name: "Surfshark", desc: "Budget friendly with unlimited device connections." }
  ],
  "Accommodation": [
    { name: "Booking.com", desc: "Best for booking your first few nights in Thamel or Lakeside." },
    { name: "Hostelworld", desc: "Ideal for solo nomads looking to socialize." }
  ],
  "Platform Guides": [
    { name: "List Your Workspace", desc: "Are you a workspace or hub owner? Read our guide on how to register and list your space.", link: "/blog/how-to-list-coworking-space-nepal" },
    { name: "Register as a Local Guide", desc: "Licensed guides and adventure experts, learn how to build your profile here.", link: "/blog/how-to-register-local-guide-nepal" }
  ]
}

export default function ResourcesPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Practical Guides & Resources", item: "/resources" },
  ])

  const itemListJsonLd = generateItemListJsonLd(
    "Practical Guides for Digital Nomads in Nepal",
    practicalGuides.map((g) => ({
      name: g.name,
      url: g.link,
    }))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">Nomad Knowledge Base</span>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Practical Guides & Essential Resources</h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">In-depth guides on SIM cards, transportation, visas, and living setups for remote workers across Nepal.</p>
          </div>

          {/* Disambiguation: Link to Human Local Guides */}
          <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-wider block mb-1">Human Experts vs Informational Guides</span>
              <h3 className="text-lg font-bold text-foreground">Looking for a verified human guide or local fixer?</h3>
              <p className="text-sm text-muted">
                Need on-the-ground support, trekking guidance, or cultural tours? Connect with licensed local guides across Nepal.
              </p>
            </div>
            <Link
              href="/guides"
              className="px-6 py-2.5 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors text-sm whitespace-nowrap flex-shrink-0"
            >
              Browse Local Experts & Guides →
            </Link>
          </div>

          {/* 1. Practical Guides Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-b border-border pb-3 text-primary">Practical Remote Work Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practicalGuides.map((guide, idx) => (
                <div key={idx} className="bg-card border border-border p-6 rounded-xl hover:border-primary transition-colors flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{guide.name}</h3>
                    <p className="text-muted text-sm mb-6 leading-relaxed">{guide.desc}</p>
                  </div>
                  <Link
                    href={guide.link}
                    className="w-full py-2.5 bg-background border border-border text-foreground font-semibold hover:bg-primary hover:text-black transition-colors rounded-lg text-xs uppercase tracking-wider text-center block"
                  >
                    Read Full Guide →
                  </Link>
                </div>
              ))}
            </div>
          </section>
          
          <AffiliateDisclaimer />

          {/* 2. Curated Tools & Services */}
          <div className="space-y-16 mt-12">
            {Object.entries(resources).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-6 border-b border-border pb-3 text-primary">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-card border border-border p-6 rounded-xl hover:border-primary transition-colors flex flex-col">
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.name}</h3>
                      <p className="text-muted text-sm flex-grow mb-6 leading-relaxed">{item.desc}</p>
                      {item.link ? (
                        <Link
                          href={item.link}
                          className="w-full py-2 bg-background border border-border text-foreground font-medium hover:bg-primary hover:text-black transition-colors rounded-md text-sm uppercase tracking-wider text-center block"
                        >
                          Read Guide
                        </Link>
                      ) : (
                        <button className="w-full py-2 bg-background border border-border text-foreground font-medium hover:bg-primary hover:text-black transition-colors rounded-md text-sm uppercase tracking-wider">
                          Get Deal
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

