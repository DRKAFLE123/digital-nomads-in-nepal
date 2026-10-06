"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import TrekkingGuideIcon from "./TrekkingGuideIcon"
import { FacebookIcon, TikTokIcon, YouTubeIcon, InstagramIcon, TwitterIcon } from "./SocialIcons"

const DEFAULTS = {
  bio: "The definitive guide for digital nomads in Nepal. Get up-to-date info on the Nepal Nomad Visa, Pokhara remote work hubs, and the cost of living for 2026.\n\nBuilt for remote workers, freelancers, and location-independent entrepreneurs exploring Nepal.",
  basecamp: "Basecamp: Kathmandu, Nepal",
  facebook: "https://facebook.com",
  showFacebook: true,
  instagram: "https://instagram.com",
  showInstagram: true,
  twitter: "https://twitter.com",
  showTwitter: false,
  tiktok: "https://tiktok.com",
  showTiktok: true,
  youtube: "https://youtube.com",
  showYoutube: true,
  newsletterTitle: "Get the Nepal Digital Nomad Starter Kit",
  newsletterDesc: "Weekly tips, cost breakdowns, and remote work guides for Nepal's growing ecosystem."
}

export default function Footer() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/footer")
        if (res.ok) {
          const json = await res.json()
          setData(prev => ({ ...prev, ...json }))
        }
      } catch (err) {
        console.error("Failed to load footer settings:", err)
      }
    }
    load()
  }, [])

  return (
    <footer className="relative bg-background overflow-hidden pt-20 pb-12 transition-colors" aria-label="Global Footer">
      {/* Ambient Panoramic Himalayan Sunset Background with seamless top feathered dissolve */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image 
          src="/footer-bg.png" 
          alt="Himalayan Mountain Sunset Panorama in Nepal" 
          fill 
          sizes="100vw"
          className="object-cover object-top opacity-30 dark:opacity-35" 
        />
        {/* Top feathered dissolve: dissolves 100% into the section above with no hard edge */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background via-background/80 to-transparent" />
        {/* Soft ambient tint for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      {/* Main Grid Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-12">
          
          {/* Column 1: Brand/Bio */}
          <div className="flex flex-col lg:pr-8">
            <Link href="/" className="inline-block mb-6 transition-transform hover:scale-105 active:scale-95 duration-300">
              <div className="relative w-[115px] h-12 overflow-hidden">
                <Image src="/webisteofficiallogo-removebg-preview.png" alt="Digital Nomads in Nepal Logo" fill className="object-contain object-left" unoptimized />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6 whitespace-pre-line">
              {data.bio}
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 mb-6">
              {data.showFacebook !== false && data.facebook && (
                <a href={data.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1" aria-label="Facebook">
                  <FacebookIcon size={19} />
                </a>
              )}
              {data.showTiktok !== false && data.tiktok && (
                <a href={data.tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1" aria-label="TikTok">
                  <TikTokIcon size={19} />
                </a>
              )}
              {data.showYoutube !== false && data.youtube && (
                <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1" aria-label="YouTube">
                  <YouTubeIcon size={19} />
                </a>
              )}
              {data.showInstagram !== false && data.instagram && (
                <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1" aria-label="Instagram">
                  <InstagramIcon size={19} />
                </a>
              )}
              {Boolean(data.showTwitter) && data.twitter && (
                <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1" aria-label="X (formerly Twitter)">
                  <TwitterIcon size={17} />
                </a>
              )}
            </div>
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span>📍 {data.basecamp}</span>
            </div>
          </div>

          {/* Column 2: COMMUNITY */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-foreground uppercase mb-6">Community</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/community#forum" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Nomad Forum<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/community#directory" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Member Directory<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li>
                <Link href="/local-guides" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group w-fit">
                  <span className="relative">
                    Find a Local Guide
                    <span className="block absolute bottom-[-2px] left-0 h-px w-0 bg-primary transition-all group-hover:w-full"></span>
                  </span>
                  <TrekkingGuideIcon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </li>
              <li><Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Events in Nepal<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/newsletter" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Join Newsletter<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-foreground uppercase mb-6">Practical Guides</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/nomad-visa-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Nepal Digital Nomad Visa Guide (2026)<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/nepal-cost-of-living-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Cost of Living in Nepal for Remote Workers<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/nepal-transportation-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Transport & Apps<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/nepal-sim-cards-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">SIM Cards, Internet & Connectivity<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/workspaces" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Best Coworking Spaces in Nepal ⭐<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/nepal-banking-atm-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Banking & Payments in Nepal<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/practical-guides" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">All Practical Guides →<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          {/* Column 4: DESTINATIONS */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-foreground uppercase mb-6">Destinations</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/destinations/kathmandu" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Nomads in Kathmandu<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/destinations/pokhara" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Nomads in Pokhara<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/destinations/bandipur" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Remote Work in Bandipur<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/map" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Digital Nomad Map<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          {/* Column 5: COMPANY */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black tracking-widest text-foreground uppercase mb-6">Company</h3>
            <ul className="flex flex-col space-y-4">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">About Us<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Our Blog<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/partners" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Partnerships<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Contact Support<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">FAQ &amp; Help<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/insurance" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block group">Travel Insurance<span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-16 pt-10 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-sm font-medium text-muted-foreground">
              © 2026 Digital Nomads in Nepal. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              <Link href="/privacy" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Privacy Policy</Link>
              <Link href="/terms" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Terms of Service</Link>
              <Link href="/sitemap" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Sitemap</Link>
              <Link href="/disclaimer" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline underline-offset-4 tracking-tight">Disclaimer</Link>
            </div>
          </div>
          {/* SEO Header */}
          <div className="mt-10 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold tracking-[0.3em] uppercase leading-relaxed max-w-5xl mx-auto">
              Popular Searches: Digital Nomad Nepal | Cost of Living Nepal | Nepal Visa for Remote Workers | Best Cities in Nepal for Expats | Coworking Kathmandu
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
