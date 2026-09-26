import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Compass, Home, MapPin, BookOpen, Building, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const quickLinks = [
    { title: "Home Base", href: "/", icon: Home },
    { title: "Nomad Destinations", href: "/destinations", icon: MapPin },
    { title: "Nepal Visa Guide", href: "/resources/visa", icon: BookOpen },
    { title: "Vetted Coworking Spaces", href: "/resources/coworking", icon: Building },
    { title: "Browse Sitemap", href: "/sitemap", icon: Compass },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            404 Error • Page Not Found
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tight mb-6">
            Lost on the Trail?
          </h1>
          
          <p className="text-muted text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
            The page you are looking for has been moved, renamed, or no longer exists. Let&apos;s get you back on track to your Himalayan remote work adventure.
          </p>

          {/* Quick Recovery Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-foreground hover:border-primary hover:text-primary transition-all text-sm font-semibold shadow-sm hover:-translate-y-0.5"
                >
                  <Icon size={16} className="text-primary" />
                  <span>{link.title}</span>
                </Link>
              )
            })}
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={16} /> Return to Homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
