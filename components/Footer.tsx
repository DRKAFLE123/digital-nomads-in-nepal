import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 5 Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* 1. Brand Section (Span 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-border shadow-md bg-white group-hover:border-primary transition-colors duration-300">
                <Image src="/logo.png" alt="Digital Nomads in Nepal Logo" fill className="object-cover" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-foreground transition-colors group-hover:text-primary">
                Digital Nomads <span className="text-primary">in Nepal</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-8 max-w-sm">
              The #1 resource for digital nomads in Nepal. Learn about cost of living, visa, remote work setup, and the best cities like Kathmandu and Pokhara.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 bg-card border border-border flex items-center justify-center rounded-full text-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
                <span className="text-xs font-bold">IG</span>
              </a>
              <a href="#" aria-label="X (Twitter)" className="w-10 h-10 bg-card border border-border flex items-center justify-center rounded-full text-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
                <span className="text-xs font-bold">X</span>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 bg-card border border-border flex items-center justify-center rounded-full text-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
                <span className="text-xs font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* 2. Resources */}
          <nav className="flex flex-col" aria-label="Resources">
            <h3 className="text-foreground font-bold mb-6 tracking-wider uppercase text-sm">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="/visa-guide" className="text-muted hover:text-primary font-medium text-sm transition-colors">Nepal Visa Guide for Digital Nomads</Link></li>
              <li><Link href="/cost-of-living" className="text-muted hover:text-primary font-medium text-sm transition-colors">Cost of Living in Nepal</Link></li>
              <li><Link href="/setup" className="text-muted hover:text-primary font-medium text-sm transition-colors">Internet & Remote Work Setup</Link></li>
              <li><Link href="/banking" className="text-muted hover:text-primary font-medium text-sm transition-colors">Banking & Payments in Nepal</Link></li>
              <li><Link href="/healthcare" className="text-muted hover:text-primary font-medium text-sm transition-colors">Healthcare in Nepal</Link></li>
            </ul>
          </nav>

          {/* 3. Destinations */}
          <nav className="flex flex-col" aria-label="Destinations">
            <h3 className="text-foreground font-bold mb-6 tracking-wider uppercase text-sm">Destinations</h3>
            <ul className="space-y-4">
              <li><Link href="/destinations/kathmandu" className="text-muted hover:text-primary font-medium text-sm transition-colors">Digital Nomads in Kathmandu</Link></li>
              <li><Link href="/destinations/pokhara" className="text-muted hover:text-primary font-medium text-sm transition-colors">Digital Nomads in Pokhara</Link></li>
              <li><Link href="/destinations/bandipur" className="text-muted hover:text-primary font-medium text-sm transition-colors">Remote Work in Bandipur</Link></li>
              <li><Link href="/map" className="text-muted hover:text-primary font-medium text-sm transition-colors">Nepal Nomad Map</Link></li>
            </ul>
          </nav>

          {/* 4. Community & Company (Combined for layout elegance) */}
          <div className="flex flex-col">
            <nav className="mb-8" aria-label="Community">
              <h3 className="text-foreground font-bold mb-6 tracking-wider uppercase text-sm">Community</h3>
              <ul className="space-y-4">
                <li><Link href="/forum" className="text-muted hover:text-primary font-medium text-sm transition-colors">Nomad Forum</Link></li>
                <li><Link href="/directory" className="text-muted hover:text-primary font-medium text-sm transition-colors">Member Directory</Link></li>
                <li><Link href="/events" className="text-muted hover:text-primary font-medium text-sm transition-colors">Events in Nepal</Link></li>
              </ul>
            </nav>
            <nav aria-label="Company">
              <h3 className="text-foreground font-bold mb-6 tracking-wider uppercase text-sm">Company</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-muted hover:text-primary font-medium text-sm transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="text-muted hover:text-primary font-medium text-sm transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-muted hover:text-primary font-medium text-sm transition-colors">Contact</Link></li>
              </ul>
            </nav>
          </div>

          {/* 5. High Conversion Newsletter */}
          <div className="lg:col-span-1 xl:col-span-1 flex flex-col bg-card p-6 border border-border shadow-md rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100" />
            <h3 className="text-foreground font-bold mb-2 text-lg">Get the Nepal Digital Nomad Starter Kit</h3>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Weekly tips, cost breakdowns, and remote work guides for Nepal.
            </p>
            <form className="flex flex-col gap-3 mt-auto w-full">
              <input 
                type="email" 
                placeholder="your@email.com" 
                aria-label="Email address"
                required
                className="w-full bg-background border border-border text-foreground text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted"
              />
              <button 
                type="submit" 
                className="w-full bg-primary text-black font-bold text-sm rounded-lg px-4 py-3 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Get Free Guide
              </button>
            </form>
          </div>

        </div>

        {/* 6. Base / SEO / Copyright */}
        <div className="pt-8 border-t border-border flex flex-col items-center text-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/privacy" className="text-muted hover:text-primary font-medium transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-muted hover:text-primary font-medium transition-colors">Terms</Link>
            <Link href="/sitemap" className="text-muted hover:text-primary font-medium transition-colors">Sitemap</Link>
            <Link href="/disclaimer" className="text-muted hover:text-primary font-medium transition-colors">Disclaimer</Link>
          </div>
          
          <div className="space-y-2">
            <p className="text-muted text-sm font-medium">
              &copy; {new Date().getFullYear()} Digital Nomads in Nepal. All rights reserved.
            </p>
            <p className="text-muted/60 text-xs max-w-2xl mx-auto">
              Built for digital nomads, remote workers, and freelancers exploring Nepal.
            </p>
            <p className="text-muted/40 text-[10px] uppercase font-bold tracking-widest mt-4">
              Popular searches: Digital nomad Nepal | Cost of living Nepal | Nepal visa for remote workers | Best cities in Nepal for expats
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
