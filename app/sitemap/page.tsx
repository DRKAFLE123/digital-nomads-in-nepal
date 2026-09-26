import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { MapPin, Compass, BookOpen, Building, ShieldCheck, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "HTML Sitemap | Digital Nomads in Nepal",
  description: "Complete index and sitemap of all destination guides, remote work resources, coworking hubs, blog posts, and verified guides in Nepal.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/sitemap",
  },
}

export const dynamic = "force-dynamic"

export default async function SitemapPage() {
  const [destinations, posts, hubs, guides] = await Promise.all([
    prisma.destination.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }).catch(() => []),
    prisma.post.findMany({ where: { published: true }, select: { slug: true, title: true }, orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.workHub.findMany({ select: { slug: true, name: true, city: true }, orderBy: { name: "asc" } }).catch(() => []),
    prisma.guide.findMany({ where: { isVerified: true }, select: { id: true, name: true, location: true }, orderBy: { avgRating: "desc" } }).catch(() => []),
  ])

  const staticResources = [
    { title: "Nepal Digital Nomad Visa Guide (2026)", href: "/resources/visa" },
    { title: "Cost of Living in Nepal for Remote Workers", href: "/resources/cost-of-living" },
    { title: "Best Coworking Spaces in Nepal ⭐", href: "/resources/coworking" },
    { title: "SIM Cards, Internet & Connectivity in Nepal", href: "/resources/sim-cards" },
    { title: "Transportation & Getting Around Nepal", href: "/resources/transportation" },
    { title: "Banking, ATMs & Payments for Nomads", href: "/resources/banking" },
    { title: "Internet & Hardware Remote Setup", href: "/setup" },
  ]

  const mainPages = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "All Destinations", href: "/destinations" },
    { title: "Local Guides Marketplace", href: "/guides" },
    { title: "Remote Work Resources", href: "/resources" },
    { title: "Digital Nomad Map", href: "/map" },
    { title: "Long-term Nomad Stays & Coliving", href: "/stay" },
    { title: "Travel Insurance Guide", href: "/insurance" },
    { title: "Community Events", href: "/events" },
    { title: "Nomad Newsletter", href: "/newsletter" },
    { title: "Partnerships & Sponsorships", href: "/partners" },
    { title: "Contact Support", href: "/contact" },
  ]

  const legalPages = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Disclaimer", href: "/disclaimer" },
    { title: "XML Sitemap", href: "/sitemap.xml" },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="border-b border-border pb-10 mb-12">
            <span className="text-primary text-xs font-bold uppercase tracking-widest block mb-3">Directory & Index</span>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
              Website Sitemap
            </h1>
            <p className="text-muted text-lg max-w-2xl">
              An overview of all remote work destinations, vetted coworking hubs, local guides, and survival resources across Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Navigation */}
            <div className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-5 text-primary">
                <Compass size={22} />
                <h2 className="text-lg font-bold text-foreground">Main Pages</h2>
              </div>
              <ul className="space-y-2.5 text-sm">
                {mainPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="text-muted hover:text-primary transition-colors flex items-center gap-1.5 group">
                      <span className="text-xs text-primary/60 group-hover:translate-x-0.5 transition-transform">→</span>
                      <span>{page.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guides & Resources */}
            <div className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-5 text-primary">
                <BookOpen size={22} />
                <h2 className="text-lg font-bold text-foreground">Essential Nomad Guides</h2>
              </div>
              <ul className="space-y-2.5 text-sm">
                {staticResources.map((res) => (
                  <li key={res.href}>
                    <Link href={res.href} className="text-muted hover:text-primary transition-colors flex items-center gap-1.5 group">
                      <span className="text-xs text-primary/60 group-hover:translate-x-0.5 transition-transform">→</span>
                      <span>{res.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-5 text-primary">
                <MapPin size={22} />
                <h2 className="text-lg font-bold text-foreground">Destinations in Nepal ({destinations.length})</h2>
              </div>
              <ul className="space-y-2.5 text-sm max-h-72 overflow-y-auto pr-2">
                {destinations.map((dest) => (
                  <li key={dest.slug}>
                    <Link href={`/destinations/${dest.slug}`} className="text-muted hover:text-primary transition-colors flex items-center gap-1.5 group">
                      <span className="text-xs text-primary/60 group-hover:translate-x-0.5 transition-transform">→</span>
                      <span>{dest.name} Nomad Guide</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coworking Hubs */}
            <div className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-5 text-primary">
                <Building size={22} />
                <h2 className="text-lg font-bold text-foreground">Vetted Work Hubs ({hubs.length})</h2>
              </div>
              <ul className="space-y-2.5 text-sm max-h-72 overflow-y-auto pr-2">
                {hubs.map((hub) => (
                  <li key={hub.slug}>
                    <Link href={`/resources/coworking/${hub.slug}`} className="text-muted hover:text-primary transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-primary/60 group-hover:translate-x-0.5 transition-transform">→</span>
                        <span>{hub.name}</span>
                      </div>
                      <span className="text-xs text-muted/60 capitalize">{hub.city}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blog Posts */}
            <div className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-5 text-primary">
                <FileText size={22} />
                <h2 className="text-lg font-bold text-foreground">Blog & Articles ({posts.length})</h2>
              </div>
              <ul className="space-y-2.5 text-sm max-h-72 overflow-y-auto pr-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="text-muted hover:text-primary transition-colors flex items-start gap-1.5 group line-clamp-1">
                      <span className="text-xs text-primary/60 group-hover:translate-x-0.5 transition-transform mt-0.5">→</span>
                      <span>{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Guides & Legal */}
            <div className="space-y-6">
              {guides.length > 0 && (
                <div className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <ShieldCheck size={22} />
                    <h2 className="text-lg font-bold text-foreground">Verified Local Guides</h2>
                  </div>
                  <ul className="space-y-2.5 text-sm">
                    {guides.map((g) => (
                      <li key={g.id}>
                        <Link href={`/guides/${g.id}`} className="text-muted hover:text-primary transition-colors flex items-center justify-between group">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-primary/60 group-hover:translate-x-0.5 transition-transform">→</span>
                            <span>{g.name}</span>
                          </div>
                          <span className="text-xs text-muted/60">{g.location}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
                <h2 className="text-lg font-bold text-foreground mb-4">Legal & Compliance</h2>
                <ul className="space-y-2.5 text-sm">
                  {legalPages.map((lp) => (
                    <li key={lp.href}>
                      <Link href={lp.href} className="text-muted hover:text-primary transition-colors flex items-center gap-1.5 group">
                        <span className="text-xs text-primary/60 group-hover:translate-x-0.5 transition-transform">→</span>
                        <span>{lp.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
