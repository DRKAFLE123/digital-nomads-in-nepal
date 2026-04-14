import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="bg-background text-foreground border-t border-border mt-20"
      aria-label="Site Footer"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">

        {/* 1. Brand Section */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-md bg-white group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.png" alt="Digital Nomads in Nepal Logo" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground transition-colors group-hover:text-primary">
              Digital Nomads <span className="text-primary">in Nepal</span>
            </span>
          </Link>

          <p className="text-muted text-sm leading-relaxed max-w-sm">
            The #1 resource for digital nomads in Nepal. Learn about cost of living,
            visa, remote work setup, and the best cities like Kathmandu and Pokhara.
          </p>

          <p className="text-xs text-muted/60 mt-4">
            Built for digital nomads, remote workers, and freelancers exploring Nepal.
          </p>

          {/* Social */}
          <div className="flex gap-4 mt-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors font-medium">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors font-medium">X</a>
            <a href="#" className="hover:text-primary transition-colors font-medium">YouTube</a>
          </div>
        </div>

        {/* 2. Community */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Community</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/forum" className="hover:text-primary transition-colors">Nomad Forum</Link></li>
            <li><Link href="/directory" className="hover:text-primary transition-colors">Member Directory</Link></li>
            <li><Link href="/events" className="hover:text-primary transition-colors">Events in Nepal</Link></li>
            <li><Link href="/newsletter" className="hover:text-primary transition-colors">Join Newsletter</Link></li>
          </ul>
        </div>

        {/* 3. Resources */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link href="/visa-guide" className="hover:text-primary transition-colors">Nepal Visa Guide for Digital Nomads</Link></li>
            <li><Link href="/cost-of-living" className="hover:text-primary transition-colors">Cost of Living in Nepal</Link></li>
            <li><Link href="/setup" className="hover:text-primary transition-colors">Internet & Remote Work Setup</Link></li>
            <li><Link href="/banking" className="hover:text-primary transition-colors">Banking & Payments in Nepal</Link></li>
            <li><Link href="/healthcare" className="hover:text-primary transition-colors">Healthcare in Nepal</Link></li>
          </ul>
        </div>

        {/* 4. Destinations (SEO BOOST) */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Destinations</h3>
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
      </div>

      {/* Newsletter */}
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
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-primary text-black font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Get Free Guide
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6 text-sm text-muted">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="font-medium">
            © {new Date().getFullYear()} Digital Nomads in Nepal. All rights reserved.
          </p>

          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>

        {/* SEO micro text */}
        <p className="text-center text-muted/50 mt-6 text-[11px] uppercase tracking-widest font-bold max-w-4xl mx-auto px-4">
          Popular searches: Digital nomad Nepal | Cost of living Nepal | Nepal visa for remote workers | Best cities in Nepal for expats
        </p>
      </div>
    </footer>
  );
}
