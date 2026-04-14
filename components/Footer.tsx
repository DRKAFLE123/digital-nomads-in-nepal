import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
        
        {/* Column 1: Brand & Socials */}
        <div className="col-span-1 lg:col-span-1 flex flex-col">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-md bg-white">
              <Image src="/logo.png" alt="Digital Nomads in Nepal Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              DigiNomads<span className="text-accent">Nepal</span>
            </span>
          </Link>
          <p className="mt-2 text-muted text-sm leading-relaxed max-w-xs">
            Your community for living and working remotely in Nepal.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="w-10 h-10 bg-card border border-border flex flex-col items-center justify-center rounded-full text-muted hover:text-foreground hover:border-foreground transition-all text-xs font-semibold">
              IG
            </a>
            <a href="#" className="w-10 h-10 bg-card border border-border flex flex-col items-center justify-center rounded-full text-muted hover:text-foreground hover:border-foreground transition-all text-xs font-semibold">
              X
            </a>
            <a href="#" className="w-10 h-10 bg-card border border-border flex flex-col items-center justify-center rounded-full text-muted hover:text-foreground hover:border-foreground transition-all text-xs font-semibold">
              YT
            </a>
          </div>
        </div>
        
        {/* Column 2: Community */}
        <div>
          <h3 className="text-foreground font-semibold mb-6 tracking-wider uppercase text-xs">Community</h3>
          <ul className="space-y-4">
            <li><Link href="/forum" className="text-muted hover:text-accent font-medium text-sm transition-colors">Forum</Link></li>
            <li><Link href="/directory" className="text-muted hover:text-accent font-medium text-sm transition-colors">Member Directory</Link></li>
            <li><Link href="/events" className="text-muted hover:text-accent font-medium text-sm transition-colors">Events</Link></li>
            <li><Link href="/newsletter" className="text-muted hover:text-accent font-medium text-sm transition-colors">Newsletter</Link></li>
          </ul>
        </div>
        
        {/* Column 3: Resources */}
        <div>
          <h3 className="text-foreground font-semibold mb-6 tracking-wider uppercase text-xs">Resources</h3>
          <ul className="space-y-4">
            <li><Link href="/visa-guide" className="text-muted hover:text-accent font-medium text-sm transition-colors">Visa Guide</Link></li>
            <li><Link href="/coworking" className="text-muted hover:text-accent font-medium text-sm transition-colors">Co-Working</Link></li>
            <li><Link href="/cost-of-living" className="text-muted hover:text-accent font-medium text-sm transition-colors">Cost of Living</Link></li>
            <li><Link href="/banking" className="text-muted hover:text-accent font-medium text-sm transition-colors">Banking</Link></li>
            <li><Link href="/healthcare" className="text-muted hover:text-accent font-medium text-sm transition-colors">Healthcare</Link></li>
          </ul>
        </div>

        {/* Column 4: Destinations */}
        <div>
          <h3 className="text-foreground font-semibold mb-6 tracking-wider uppercase text-xs">Destinations</h3>
          <ul className="space-y-4">
            <li><Link href="/destinations/kathmandu" className="text-muted hover:text-accent font-medium text-sm transition-colors">Kathmandu</Link></li>
            <li><Link href="/destinations/pokhara" className="text-muted hover:text-accent font-medium text-sm transition-colors">Pokhara</Link></li>
            <li><Link href="/destinations/bandipur" className="text-muted hover:text-accent font-medium text-sm transition-colors">Bandipur</Link></li>
            <li><Link href="/destinations/map" className="text-muted hover:text-accent font-medium text-sm transition-colors">Nomad Map</Link></li>
            <li><Link href="/partners" className="text-muted hover:text-accent font-medium text-sm transition-colors">Partners</Link></li>
          </ul>
        </div>

        {/* Column 5: Company & Newsletter */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-foreground font-semibold mb-6 tracking-wider uppercase text-xs">Company</h3>
          <ul className="space-y-4 mb-8">
            <li><Link href="/about" className="text-muted hover:text-accent font-medium text-sm transition-colors">About</Link></li>
            <li><Link href="/blog" className="text-muted hover:text-accent font-medium text-sm transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="text-muted hover:text-accent font-medium text-sm transition-colors">Contact</Link></li>
          </ul>
          
          <div className="pt-2">
            <p className="text-muted text-xs mb-3">Nepal Nomad Weekly newsletter:</p>
            <form className="flex w-full max-w-sm relative">
              <input 
                type="email" 
                placeholder="your@email" 
                className="w-full bg-card border border-border text-foreground text-sm rounded-full pl-4 pr-24 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                required
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 px-4 bg-accent text-white font-medium text-sm rounded-full hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted text-xs font-medium">
          &copy; {new Date().getFullYear()} DigiNomads Nepal. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-muted hover:text-foreground text-xs font-medium transition-colors">Privacy</Link>
          <Link href="/terms" className="text-muted hover:text-foreground text-xs font-medium transition-colors">Terms</Link>
          <Link href="/sitemap" className="text-muted hover:text-foreground text-xs font-medium transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}
