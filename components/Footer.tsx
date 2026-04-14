import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="bg-background text-foreground border-t border-border mt-20"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-6">

        {/* BRAND */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-md bg-white group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.png" alt="Digital Nomads in Nepal Logo" fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
              Digital Nomads in Nepal
            </h2>
          </Link>

          {/* SEO-optimized description (UPDATED) */}
          <p className="text-muted text-sm leading-relaxed max-w-sm mt-4">
            The definitive guide for digital nomads in Nepal. Get up-to-date info on
            the Nepal Nomad Visa, Pokhara remote work hubs, and the cost of living
            in Kathmandu for 2026.
          </p>

          <p className="text-xs text-muted/60 mt-4">
            Built for remote workers, freelancers, and location-independent entrepreneurs exploring Nepal.
          </p>

          {/* SOCIAL (E-E-A-T BOOST) */}
          <div className="flex gap-4 mt-6 text-sm">
            <a href="https://instagram.com/yourprofile"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:text-primary transition-colors font-medium text-muted">
              Instagram
            </a>

            <a href="https://x.com/yourprofile"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:text-primary transition-colors font-medium text-muted">
              X
            </a>

            <a href="https://youtube.com/yourchannel"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:text-primary transition-colors font-medium text-muted">
              YouTube
            </a>
          </div>
        </div>

        {/* COMMUNITY */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Community</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/forum" className="hover:text-primary transition-colors">Nomad Forum</Link></li>
            <li><Link href="/directory" className="hover:text-primary transition-colors">Member Directory</Link></li>
            <li><Link href="/events" className="hover:text-primary transition-colors">Events in Nepal</Link></li>
            <li><Link href="/newsletter" className="hover:text-primary transition-colors">Join Newsletter</Link></li>
          </ul>
        </div>

        {/* RESOURCES (SEO EXPANDED) */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Resources</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <Link href="/visa-guide" className="hover:text-primary transition-colors">
                Nepal Visa Guide for Digital Nomads
              </Link>
            </li>
            <li>
              <Link href="/cost-of-living" className="hover:text-primary transition-colors">
                Cost of Living in Nepal
              </Link>
            </li>
            <li>
              <Link href="/setup" className="hover:text-primary transition-colors">
                Internet & Remote Work Setup
              </Link>
            </li>
            {/* NEW HIGH SEO TERM */}
            <li>
              <Link href="/coworking" className="hover:text-primary transition-colors">
                Best Coworking Spaces in Nepal
              </Link>
            </li>
            <li>
              <Link href="/coworking-guide" className="hover:text-primary transition-colors">
                Co-Working in Nepal (Guide)
              </Link>
            </li>
            <li>
              <Link href="/banking" className="hover:text-primary transition-colors">
                Banking & Payments in Nepal
              </Link>
            </li>
            <li>
              <Link href="/healthcare" className="hover:text-primary transition-colors">
                Healthcare in Nepal
              </Link>
            </li>
          </ul>
        </div>

        {/* DESTINATIONS (SEO CORE) */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Destinations</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <Link href="/destinations/kathmandu" className="hover:text-primary transition-colors">
                Nomads in Kathmandu
              </Link>
            </li>
            <li>
              <Link href="/destinations/pokhara" className="hover:text-primary transition-colors">
                Digital Nomads in Pokhara
              </Link>
            </li>
            <li>
              <Link href="/destinations/bandipur" className="hover:text-primary transition-colors">
                Remote Work in Bandipur
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-primary transition-colors">
                Nepal Nomad Map
              </Link>
            </li>
          </ul>
        </div>

        {/* PARTNERS (NEW SEO + AUTHORITY SIGNAL) */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Partners</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/partners/coworking" className="hover:text-primary transition-colors">Coworking Spaces</Link></li>
            <li><Link href="/partners/insurance" className="hover:text-primary transition-colors">Travel Insurance</Link></li>
            <li><Link href="/partners/jobs" className="hover:text-primary transition-colors">Remote Job Boards</Link></li>
            <li><Link href="/partners/affiliates" className="hover:text-primary transition-colors">Affiliate Partners</Link></li>
          </ul>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="max-w-7xl mx-auto px-6 pb-14">
        <div className="bg-card border border-border p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-primary/50 transition-colors">

          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Get the Nepal Digital Nomad Starter Kit
            </h3>
            <p className="text-muted text-sm mt-2">
              Weekly tips, cost breakdowns, and remote work guides for Nepal.
            </p>
          </div>

          <form className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-72 transition-all placeholder:text-muted"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-primary text-black font-semibold hover:bg-white transition-colors"
            >
              Get Free Guide
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM BAR (NOW FULLY CLICKABLE SEO LINKS) */}
      <div className="border-t border-border py-6 text-sm text-muted">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="font-medium">
            © {new Date().getFullYear()} Digital Nomads in Nepal. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6 font-medium">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>

            <Link href="/sitemap" className="hover:text-primary transition-colors">
              Sitemap
            </Link>

            <Link href="/disclaimer" className="hover:text-primary transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>

        {/* SEO FOOTER LINE */}
        <p className="text-center text-muted/50 mt-6 text-[11px] uppercase tracking-widest font-bold max-w-4xl mx-auto px-4">
          Popular searches: Digital nomad Nepal | Cost of living Nepal | Nepal visa for remote workers | Best cities in Nepal for expats
        </p>
      </div>
    </footer>
  );
}
