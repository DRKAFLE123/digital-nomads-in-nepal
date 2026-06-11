"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { 
      name: "Destinations", 
      href: "/destinations",
      dropdown: [
        { name: "Kathmandu", desc: "Capital hub for digital nomads", href: "/destinations/kathmandu" },
        { name: "Pokhara", desc: "Lakeside remote work paradise", href: "/destinations/pokhara" },
        { name: "Bandipur", desc: "Quiet mountain retreat", href: "/destinations/bandipur" },
        { name: "Nomad Map", desc: "Explore all Nepal destinations", href: "/map" },
      ]
    },
    { 
      name: "Resources", 
      href: "/resources",
      dropdown: [
        { name: "Nepal Digital Nomad Visa Guide (2026)", desc: "Latest requirements & application steps", href: "/resources/visa" },
        { name: "Cost of Living in Nepal for Remote Workers", desc: "Budget breakdowns for Kathmandu & Pokhara", href: "/resources/cost-of-living" },
        { name: "Best Coworking Spaces in Nepal ⭐", desc: "Workspaces tested for speed & backup power", href: "/resources/coworking" },
        { name: "SIM Cards, Internet & Remote Setup", desc: "Stay connected anywhere you go", href: "/resources/connectivity" },
        { name: "Transport & Apps", desc: "Navigating with InDrive, Pathao & domestic flights", href: "/resources/transportation" },
        { name: "Banking & Payments in Nepal", desc: "ATMs, QR codes, and foreign cards", href: "/resources/banking" },
      ]
    },
    { 
      name: "Local Experts", 
      href: "/guides",
      dropdown: [
        { name: "Find a Guide 🏔️", desc: "Discover verified local experts", href: "/guides" },
        { name: "Become a Guide", desc: "Join our expert network", href: "/guides/register" },
      ]
    },
    { 
      name: "Community", 
      href: "/community",
      dropdown: [
        { name: "Forum", desc: "Ask questions, share tips", href: "/forum" },
        { name: "Member Directory", desc: "Find nomads in Nepal", href: "/directory" },
        { name: "Events", desc: "Meetups & workshops", href: "/events" },
      ]
    },
    { name: "Blog", href: "/blog" },
  ]


  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-[#0B0B0B] border-b border-border shadow-lg py-1" 
        : "bg-transparent py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                <Image src="/logo.png" alt="Digital Nomads in Nepal Logo" fill className="object-cover" priority />
              </div>
              <span className={`hidden sm:block font-extrabold text-xl md:text-2xl tracking-tight drop-shadow-sm transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}>
                Digital Nomads <span className={isScrolled ? "text-primary" : "text-accent"}>Nepal</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <div key={item.name} className="relative group h-20 flex items-center">
                <Link href={item.href} className={`flex items-center gap-1 font-medium transition-colors ${isScrolled ? "text-foreground hover:text-primary" : "text-white drop-shadow-sm hover:text-gray-200"}`}>
                  {item.name}
                  {item.dropdown && <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-200" />}
                </Link>
                
                {/* Mega Menu Dropdown */}
                {item.dropdown && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                    <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden py-2.5">
                      {item.dropdown.map((sub, idx) => (
                        <Link key={idx} href={sub.href} className="block px-5 py-3 hover:bg-background transition-colors">
                          <div className="text-foreground font-semibold text-sm">{sub.name}</div>
                          <div className="text-muted text-xs mt-0.5">{sub.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <ThemeToggle />

            <Link href="/community" className={`px-5 py-2 border-2 font-bold rounded-full transition-all ${isScrolled ? "border-primary text-primary hover:bg-primary hover:text-black" : "border-white text-white hover:bg-white hover:text-black shadow-lg"}`}>
              Join Community
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={isScrolled ? "text-foreground" : "text-white"}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-x-0 top-20 bg-background border-b border-border shadow-2xl transition-all duration-300 transform ${
        mobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
      }`}>
        <div className="px-4 pt-2 pb-8 space-y-2 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {navItems.map((item) => (
            <div key={item.name} className="py-1">
              <Link 
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-bold text-foreground hover:text-primary transition-colors border-b border-border/30"
              >
                {item.name}
              </Link>
              {item.dropdown && (
                <div className="mt-1 pl-4 space-y-1 border-l-2 border-border/20 ml-3">
                  {item.dropdown.map((sub, idx) => (
                    <Link 
                      key={idx} 
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-foreground text-sm font-semibold">{sub.name}</div>
                      <div className="text-muted text-[11px] leading-tight">{sub.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-6 px-3">
            <Link 
              href="/community" 
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-6 py-4 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/10 hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
