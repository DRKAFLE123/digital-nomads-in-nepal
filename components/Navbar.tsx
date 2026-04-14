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
    { name: "Blog", href: "/blog" },
    { 
      name: "Destinations", 
      href: "/destinations",
      dropdown: [
        { name: "Kathmandu", desc: "The bustling capital hub", href: "/destinations/kathmandu" },
        { name: "Pokhara", desc: "Lakeside nomad capital", href: "/destinations/pokhara" },
        { name: "Bandipur", desc: "Quiet mountain retreat", href: "/destinations/bandipur" },
      ]
    },
    { name: "Guides", href: "/guides" },
    { 
      name: "Resources", 
      href: "/resources",
      dropdown: [
        { name: "Visa Guide", desc: "Navigating Nepal visas", href: "/resources/visa" },
        { name: "Co-Working", desc: "Best cafes & spaces", href: "/resources/coworking" },
        { name: "Cost of Living", desc: "Budgeting your stay", href: "/resources/cost-of-living" },
      ]
    },
    { name: "Community", href: "/community" },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-1" : "bg-transparent dark:bg-transparent py-2"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                <Image src="/logo.png" alt="Digital Nomads in Nepal Logo" fill className="object-cover" priority />
              </div>
              <span className={`hidden sm:block font-extrabold text-xl md:text-2xl tracking-tight drop-shadow-sm transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}>
                Digital Nomads <span className={isScrolled ? "text-primary" : "text-accent"}>in Nepal</span>
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
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
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
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link href={item.href} className="block px-2 py-3 text-base font-semibold text-foreground hover:text-primary border-b border-border/50">
                  {item.name}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 py-2 space-y-2 bg-muted/5 rounded-b-lg">
                    {item.dropdown.map((sub, idx) => (
                      <Link key={idx} href={sub.href} className="block px-2 py-2">
                        <div className="text-foreground text-sm font-medium">{sub.name}</div>
                        <div className="text-muted text-xs">{sub.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <Link href="/community" className="block w-full text-center px-5 py-3 bg-primary text-black font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors">
                Join Community
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
