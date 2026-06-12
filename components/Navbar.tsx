"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Users, CalendarCheck, LogOut } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import Image from "next/image"
import TrekkingGuideIcon from "./TrekkingGuideIcon"
import { useSession, signOut } from "next-auth/react"

interface NavItem {
  name: string
  href: string
  dropdown?: {
    name: string
    desc: string
    href: string
    hasIcon?: boolean
  }[]
}

export default function Navbar() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems: NavItem[] = [
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
        { name: "Find a Local Guide", desc: "Discover verified local experts", href: "/guides", hasIcon: true },
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
        ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30 py-0" 
        : "bg-transparent py-0"
    }`}>
      {/* Full-width container */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex justify-between items-center h-[70px]">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-11 h-11 overflow-hidden">
                <Image src="/nomadlogo.png" alt="Digital Nomads in Nepal Logo" fill className="object-contain" priority />
              </div>
              <span className={`hidden lg:block font-extrabold text-lg tracking-tight transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}>
                Digital Nomads <span className={isScrolled ? "text-primary" : "text-primary"}>Nepal</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu — centered nav items */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <div key={item.name} className="relative group h-[70px] flex items-center px-1">
                <Link
                  href={item.href}
                  className={`flex items-center gap-0.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    isScrolled
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown size={13} className="mt-0.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                  )}
                </Link>
                
                {/* Mega Menu Dropdown */}
                {item.dropdown && (
                  <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto">
                    <div className="mt-1 bg-[#111111] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden py-2">
                      {item.dropdown.map((sub, idx) => (
                        <Link key={idx} href={sub.href} className="block px-4 py-2.5 hover:bg-white/5 transition-colors">
                          <div className="text-white font-semibold text-sm flex items-center gap-1.5">
                            {sub.name}
                            {sub.hasIcon && <TrekkingGuideIcon size={15} className="translate-y-[-1px]" />}
                          </div>
                          <div className="text-gray-400 text-xs mt-0.5">{sub.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />

            {/* Community actions button/dropdown */}
            {session ? (
              <div className="relative group/community flex items-center gap-2">
                <Link
                  href="/community"
                  className={`text-xs font-bold px-4 py-2 border rounded-full transition-all flex items-center gap-1.5 ${
                    isScrolled
                      ? "border-white/20 text-gray-300 hover:border-primary hover:text-primary"
                      : "border-white/30 text-white hover:border-primary hover:text-primary"
                  }`}
                >
                  <Users size={14} />
                  Hi, {session.user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-red-400 hover:underline px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="relative group/community">
                <Link
                  href="/community"
                  className={`text-xs font-black uppercase tracking-wider px-5 py-2.5 border rounded-full transition-all block whitespace-nowrap ${
                    isScrolled
                      ? "border-primary text-primary hover:bg-primary hover:text-black shadow-lg shadow-primary/10"
                      : "border-white/45 text-white hover:border-primary hover:text-primary"
                  }`}
                >
                  Join Community
                </Link>
                {/* Rich hover tooltip card with Join + Sign In */}
                <div className="absolute top-full right-0 mt-3 w-72 opacity-0 invisible group-hover/community:opacity-100 group-hover/community:visible transition-all duration-200 origin-top-right scale-95 group-hover/community:scale-100 pointer-events-none z-50">
                  {/* Arrow */}
                  <div className="absolute -top-1.5 right-6 w-3 h-3 bg-[#1a1a1a] border-l border-t border-white/10 rotate-45" />
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden text-left pointer-events-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-primary/10 px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm leading-tight">Nomad Community</p>
                          <p className="text-primary text-xs font-medium">Connect · Explore · Co-work</p>
                        </div>
                      </div>
                    </div>
                    {/* Benefits */}
                    <div className="px-4 py-3 space-y-2">
                      {[
                        { icon: "👥", label: "Nomad Directory", desc: "Connect with digital nomads in Nepal" },
                        { icon: "🏔️", label: "Trek & Trip Alerts", desc: "Get invites to group mountain treks" },
                        { icon: "🎉", label: "Local Meetups", desc: "Invites to weekly events & workshops" },
                      ].map(({ icon, label, desc }) => (
                        <div key={label} className="flex items-start gap-3">
                          <span className="text-sm mt-0.5 flex-shrink-0">{icon}</span>
                          <div>
                            <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                            <p className="text-gray-500 text-[10px] leading-tight">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Join CTA & Sign In option below */}
                    <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 bg-black/25">
                      <Link
                        href="/community"
                        className="flex items-center justify-center w-full bg-primary hover:bg-yellow-400 text-black font-extrabold text-xs py-2 rounded-xl transition-all shadow-md shadow-primary/10"
                      >
                        Join Free Now
                      </Link>
                      <div className="text-center">
                        <span className="text-[11px] text-gray-500">Already a member? </span>
                        <Link
                          href="/auth/signin"
                          className="text-primary text-[11px] font-bold hover:underline"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Book Now CTA with rich tooltip */}
            <div className="relative group/booknow">
              <Link
                href="/resources/coworking"
                className="flex items-center gap-2 px-5 py-2 bg-primary text-black font-bold rounded-full transition-all hover:bg-yellow-400 shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap text-sm"
              >
                <CalendarCheck size={15} />
                Book Now
              </Link>

              {/* Rich hover tooltip card */}
              <div className="absolute top-full right-0 mt-3 w-72 opacity-0 invisible group-hover/booknow:opacity-100 group-hover/booknow:visible transition-all duration-200 origin-top-right scale-95 group-hover/booknow:scale-100 pointer-events-none z-50">
                {/* Arrow */}
                <div className="absolute -top-1.5 right-6 w-3 h-3 bg-[#1a1a1a] border-l border-t border-white/10 rotate-45" />
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/20 to-yellow-600/10 px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <CalendarCheck size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-tight">Book a Workspace</p>
                        <p className="text-primary text-xs font-medium">Verified · Tested · Nepal</p>
                      </div>
                    </div>
                  </div>
                  {/* Steps */}
                  <div className="px-4 py-3 space-y-2.5">
                    {[
                      { step: "1", label: "Choose your city", sub: "Kathmandu, Pokhara & more" },
                      { step: "2", label: "Pick a workspace", sub: "Filter by WiFi, power & price" },
                      { step: "3", label: "Reserve your desk", sub: "Pre-book before you arrive" },
                    ].map(({ step, label, sub }) => (
                      <div key={step} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center mt-0.5">{step}</span>
                        <div>
                          <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                          <p className="text-gray-500 text-[11px]">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Footer CTA */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                      <span className="text-gray-400 text-xs">500+ verified hubs in Nepal</span>
                      <span className="text-primary text-xs font-bold">Explore →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-lg transition-colors ${isScrolled ? "text-foreground hover:bg-white/10" : "text-white hover:bg-white/10"}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-x-0 top-[70px] bg-[#0B0B0B]/98 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all duration-300 transform ${
        mobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
      }`}>
        <div className="px-4 pt-3 pb-8 space-y-1 overflow-y-auto max-h-[calc(100vh-70px)]">
          {navItems.map((item) => (
            <div key={item.name} className="py-0.5">
              <Link 
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-bold text-white hover:text-primary transition-colors border-b border-white/5"
              >
                {item.name}
              </Link>
              {item.dropdown && (
                <div className="mt-1 pl-4 space-y-0.5 border-l-2 border-white/10 ml-3">
                  {item.dropdown.map((sub, idx) => (
                    <Link 
                      key={idx} 
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="text-gray-200 text-sm font-semibold flex items-center gap-1.5">
                        {sub.name}
                        {sub.hasIcon && <TrekkingGuideIcon size={14} className="translate-y-[-1px]" />}
                      </div>
                      <div className="text-gray-500 text-[11px] leading-tight">{sub.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-5 px-1 space-y-3">
            {session ? (
              <div className="space-y-2">
                <div className="text-center text-sm font-bold text-gray-300">
                  Logged in as <span className="text-primary">{session.user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 w-full text-center px-6 py-3 border border-red-500/20 text-red-400 font-bold rounded-2xl transition-all hover:bg-red-500/10 active:scale-[0.98]"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/community" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center px-6 py-3.5 border border-white/20 text-white font-bold rounded-2xl transition-all hover:bg-white/5 active:scale-[0.98]"
                >
                  <Users size={16} />
                  Join Community
                </Link>
                <div className="text-center text-xs text-gray-500 mt-1">
                  Already a member?{" "}
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}
            <Link 
              href="/resources/coworking" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-center px-6 py-3.5 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-yellow-400 transition-all active:scale-[0.98]"
            >
              <CalendarCheck size={16} />
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
