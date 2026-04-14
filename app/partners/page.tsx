import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Partners | Digital Nomads in Nepal",
  description: "Trusted partners for digital nomads in Nepal — coworking spaces, travel insurance, remote job boards, and more.",
}

const partners = [
  {
    name: "Spaces Kathmandu",
    category: "Coworking Space",
    location: "Jhamsikhel, Lalitpur",
    description: "Premium flexible coworking with fast fiber internet, standing desks, meeting rooms, and a great community vibe.",
    tags: ["Coworking", "Kathmandu"],
    highlight: true,
  },
  {
    name: "Pokhara Remote Hub",
    category: "Coworking Space",
    location: "Lakeside, Pokhara",
    description: "Coworking with stunning Fewa Lake views. Perfect for nomads who want to work with a side of nature.",
    tags: ["Coworking", "Pokhara"],
    highlight: false,
  },
  {
    name: "SafetyWing",
    category: "Travel Insurance",
    location: "Global",
    description: "Nomad-specific health and travel insurance built for remote workers. Affordable monthly subscriptions.",
    tags: ["Insurance", "Global"],
    highlight: true,
  },
  {
    name: "Remote OK",
    category: "Remote Job Board",
    location: "Online",
    description: "One of the largest remote job boards. Find vetted remote-first roles across tech, design, and marketing.",
    tags: ["Jobs", "Remote"],
    highlight: false,
  },
  {
    name: "Wise",
    category: "International Banking",
    location: "Global",
    description: "Send money internationally at real exchange rates. Essential for digital nomads receiving foreign income in Nepal.",
    tags: ["Banking", "Finance"],
    highlight: false,
  },
  {
    name: "Nepal Trek & Tours",
    category: "Adventure Partner",
    location: "Kathmandu",
    description: "Exclusive weekend trekking packages for the DigiNomads community. Group discounts for members.",
    tags: ["Travel", "Adventure"],
    highlight: false,
  },
]

const categoryColors: Record<string, string> = {
  "Coworking Space": "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "Travel Insurance": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Remote Job Board": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "International Banking": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Adventure Partner": "bg-green-500/10 text-green-400 border-green-500/20",
}

export default function PartnersPage() {
  const featured = partners.filter((p) => p.highlight)
  const all = partners.filter((p) => !p.highlight)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-10" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Partners</span>
          </nav>

          {/* Page Header */}
          <div className="mb-16">
            <span className="uppercase text-primary text-xs font-bold tracking-[0.2em] mb-4 block">
              Our Partners
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-tight mb-5">
              Trusted by Nepal's Nomad Ecosystem
            </h1>
            <p className="text-muted text-lg max-w-2xl leading-relaxed">
              We partner with the best coworking spaces, services, and tools that serve the digital nomad community in Nepal — vetted and recommended by our team.
            </p>
          </div>

          {/* Featured Partners */}
          {featured.length > 0 && (
            <section className="mb-16">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                Featured Partners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((partner) => (
                  <PartnerCard key={partner.name} partner={partner} featured />
                ))}
              </div>
            </section>
          )}

          {/* All Partners */}
          <section className="mb-20">
            <h2 className="text-xl font-bold text-foreground mb-6">All Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {all.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
          </section>

          {/* Become a Partner CTA */}
          <div className="border border-primary/30 rounded-2xl p-8 md:p-12 bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-300 to-primary" />
            <div className="max-w-2xl">
              <span className="uppercase text-primary text-xs font-bold tracking-[0.2em] mb-4 block">
                Partner With Us
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Reach 10,000+ Digital Nomads in Nepal
              </h2>
              <p className="text-muted mb-8 leading-relaxed">
                Are you a coworking space, SaaS tool, travel insurer, or Nepal-based service? Partner with us to get featured in front of our growing community of remote workers and location-independent professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-block px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-white hover:text-black transition-all text-center"
                >
                  Become a Partner →
                </Link>
                <Link
                  href="/community"
                  className="inline-block px-8 py-4 border-2 border-border text-foreground font-semibold rounded-full hover:border-primary hover:text-primary transition-all text-center"
                >
                  View Community
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

function PartnerCard({ partner, featured = false }: { partner: typeof partners[0]; featured?: boolean }) {
  const tagStyle = categoryColors[partner.category] ?? "bg-muted/10 text-muted border-border"

  return (
    <div className={`bg-card border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group ${featured ? "border-primary/30" : "border-border"}`}>
      {featured && (
        <div className="flex items-center gap-1.5 mb-4">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Featured</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-foreground font-bold text-lg leading-snug group-hover:text-primary transition-colors">
          {partner.name}
        </h3>
        <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${tagStyle}`}>
          {partner.category}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-muted text-xs mb-4">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {partner.location}
      </div>

      <p className="text-muted text-sm leading-relaxed mb-5">{partner.description}</p>

      <div className="flex flex-wrap gap-2">
        {partner.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 bg-background border border-border rounded-full text-muted">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
