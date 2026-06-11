import Link from "next/link";
import Image from "next/image";
import TrekkingGuideIcon from "./TrekkingGuideIcon";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-900 mt-20" aria-label="Global Footer">
      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-12">
          
          {/* Column 1: Brand/Bio */}
          <div className="flex flex-col lg:pr-8">
            <Link href="/" className="inline-block mb-6 transition-transform hover:scale-105 active:scale-95 duration-300">
              <div className="relative w-16 h-16 overflow-hidden">
                <Image src="/nomadlogo.png" alt="Digital Nomads in Nepal Logo" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              The definitive guide for digital nomads in Nepal. Get up-to-date info on
              the Nepal Nomad Visa, Pokhara remote work hubs, and the cost of living
              for 2026.
              <br /><br />
              <span className="font-bold text-gray-300">
                Built for remote workers, freelancers, and location-independent entrepreneurs exploring Nepal.
              </span>
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-5 mb-6">
              <a href="#" className="text-gray-500 hover:text-[#FFD700] transition-all hover:-translate-y-1" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-[#FFD700] transition-all hover:-translate-y-1" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-[#FFD700] transition-all hover:-translate-y-1" aria-label="X (formerly Twitter)">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 2.395h-2.19L17.607 20.65z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-[#FFD700] transition-all hover:-translate-y-1" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-4.17.07-8.33.07-12.5z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-[#FFD700] transition-all hover:-translate-y-1" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span>📍 Basecamp: Kathmandu, Nepal</span>
            </div>
          </div>

          {/* Column 2: COMMUNITY */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-gray-200 uppercase mb-6">Community</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/forum" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Nomad Forum<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/directory" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Member Directory<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li>
                <Link href="/guides" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors flex items-center gap-1.5 group w-fit">
                  <span className="relative">
                    Find a Local Guide
                    <span className="block absolute bottom-[-2px] left-0 h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span>
                  </span>
                  <TrekkingGuideIcon size={14} className="text-gray-400 group-hover:text-[#FFD700] transition-colors" />
                </Link>
              </li>
              <li><Link href="/events" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Events in Nepal<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/newsletter" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Join Newsletter<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-gray-200 uppercase mb-6">Resources</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/resources/visa" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Nepal Digital Nomad Visa Guide (2026)<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/resources/cost-of-living" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Cost of Living in Nepal for Remote Workers<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/resources/transportation" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Transport & Apps<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/resources/sim-cards" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">SIM Cards, Internet & Remote Setup<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/setup" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Internet & Remote Setup<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/resources/coworking" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Best Coworking Spaces in Nepal ⭐<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/resources/banking" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Banking & Payments in Nepal<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          {/* Column 4: DESTINATIONS */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-gray-200 uppercase mb-6">Destinations</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/destinations/kathmandu" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Nomads in Kathmandu<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/destinations/pokhara" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Nomads in Pokhara<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/destinations/bandipur" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Remote Work in Bandipur<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/map" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Digital Nomad Map<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          {/* Column 5: COMPANY */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-gray-200 uppercase mb-6">Company</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">About Us<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Our Blog<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/partners" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Partnerships<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Contact Support<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/insurance" className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors inline-block group">Travel Insurance<span className="block h-px w-0 bg-[#FFD700] transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

        </div>

        {/* Newsletter Box */}
        <div className="mt-16 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl blur opacity-30 transition duration-1000 group-hover:opacity-50"></div>
          <div className="relative bg-[#0d0d0d] rounded-2xl p-10 md:p-14 flex flex-col lg:flex-row justify-between items-center border border-gray-800 shadow-2xl">
            <div className="mb-10 lg:mb-0 text-center lg:text-left max-w-xl">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                Get the Nepal Digital Nomad Starter Kit
              </h3>
              <p className="text-gray-400 text-lg">
                Weekly tips, cost breakdowns, and remote work guides for Nepal&apos;s growing ecosystem.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row w-full lg:w-auto gap-0 shadow-2xl relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-black border border-gray-800 py-4 px-6 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none text-white text-base focus:outline-none focus:border-[#FFD700] w-full lg:w-80 transition-all placeholder:text-gray-600" 
              />
              <button 
                type="submit" 
                className="bg-[#FFD700] text-black font-black py-4 px-10 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none hover:bg-white hover:text-black transition-all whitespace-nowrap text-base uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
              >
                Join Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-16 pt-10 border-t border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-sm font-medium text-gray-500">
              © 2026 Digital Nomads in Nepal. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              <Link href="/privacy" className="text-sm font-semibold text-gray-500 hover:text-[#FFD700] transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Privacy Policy</Link>
              <Link href="/terms" className="text-sm font-semibold text-gray-500 hover:text-[#FFD700] transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Terms of Service</Link>
              <Link href="/sitemap" className="text-sm font-semibold text-gray-500 hover:text-[#FFD700] transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Sitemap</Link>
              <Link href="/disclaimer" className="text-sm font-semibold text-gray-500 hover:text-[#FFD700] transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Disclaimer</Link>
            </div>
          </div>
          {/* SEO Header */}
          <div className="mt-10 text-center">
            <p className="text-[10px] sm:text-xs text-gray-600 font-bold tracking-[0.3em] uppercase leading-relaxed max-w-5xl mx-auto">
              Popular Searches: Digital Nomad Nepal | Cost of Living Nepal | Nepal Visa for Remote Workers | Best Cities in Nepal for Expats | Coworking Kathmandu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
