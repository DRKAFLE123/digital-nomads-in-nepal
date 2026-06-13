"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, Users, CalendarCheck, LogOut, User, Settings } from "lucide-react"
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
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/community/profile?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile?.avatarUrl) {
            setAvatarUrl(data.profile.avatarUrl)
          }
        })
        .catch(err => console.error("Error fetching navbar avatar:", err))
    } else {
      setAvatarUrl(null)
    }
  }, [session])

  const navItems: NavItem[] = [
    { 
      name: "Destinations", 
      href: "/destinations",
      dropdown: [
        { name: "Kathmandu", desc: "Capital hub for digital nomads", href: "/destinations/kathmandu" },
        { name: "Pokhara", desc: "Lakeside remote work paradise", href: "/destinations/pokhara" },
        { name: "Lalitpur", desc: "Artisan & cafe-rich workspace", href: "/destinations/lalitpur" },
        { name: "Chitwan", desc: "Jungle wilderness & warm weather", href: "/destinations/chitwan" },
        { name: "Manang", desc: "High-altitude Himalayan retreat", href: "/destinations/manang" },
        { name: "Mustang", desc: "Windswept ancient desert trails", href: "/destinations/mustang" },
        { name: "Bandipur", desc: "Quiet Newari mountain village", href: "/destinations/bandipur" },
        { name: "Khaptad", desc: "Spiritual meadows & forest detox", href: "/destinations/khaptad" },
        { name: "View All Destinations →", desc: "Explore all nomad regions of Nepal", href: "/destinations" },
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
        { name: "Forum", desc: "Ask questions, share tips", href: "/community#forum" },
        { name: "Member Directory", desc: "Find nomads in Nepal", href: "/community#directory" },
        { name: "Events", desc: "Meetups & workshops", href: "/events" },
      ]
    },
    { name: "Blog", href: "/blog" },
  ]


  const isSolid = !isHome || isScrolled

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isSolid 
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-md py-0" 
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
              <span className={`hidden lg:block font-extrabold text-lg tracking-tight transition-colors ${isSolid ? "text-foreground" : "text-white"}`}>
                Digital Nomads <span className="text-primary">Nepal</span>
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
                    isSolid
                      ? "text-muted hover:text-foreground hover:bg-muted/10"
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
                    <div className="mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden py-2">
                      {item.dropdown.map((sub, idx) => (
                        <Link key={idx} href={sub.href} className="block px-4 py-2.5 hover:bg-muted/10 transition-colors">
                          <div className="text-foreground font-semibold text-sm flex items-center gap-1.5">
                            {sub.name}
                            {sub.hasIcon && <TrekkingGuideIcon size={15} className="translate-y-[-1px]" />}
                          </div>
                          <div className="text-muted text-xs mt-0.5">{sub.desc}</div>
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
            {/* Community actions button/dropdown */}
            {session ? (
              <Link
                href="/community"
                className={`text-xs font-black uppercase tracking-wider px-5 py-2.5 border rounded-full transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  isSolid
                    ? "border-foreground/20 text-foreground dark:border-primary dark:text-primary hover:bg-primary hover:border-primary hover:text-black dark:hover:text-black shadow-md dark:shadow-lg dark:shadow-primary/10"
                    : "border-white/45 text-white hover:border-primary hover:text-primary"
                }`}
              >
                <Users size={14} className="translate-y-[-0.5px]" />
                <span>Explore</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className={`text-xs font-bold px-4 py-2 border rounded-full transition-all whitespace-nowrap ${
                    isSolid
                      ? "border-foreground/20 text-foreground hover:border-primary dark:hover:text-primary"
                      : "border-white/30 text-white hover:border-primary hover:text-primary"
                  }`}
                >
                  Sign In
                </Link>
                <div className="relative group/community">
                  <Link
                    href="/auth/register"
                    className={`text-xs font-black uppercase tracking-wider px-5 py-2.5 border rounded-full transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      isSolid
                        ? "border-foreground/20 text-foreground dark:border-primary dark:text-primary hover:bg-primary hover:border-primary hover:text-black dark:hover:text-black shadow-md dark:shadow-lg dark:shadow-primary/10"
                        : "border-white/45 text-white hover:border-primary hover:text-primary"
                    }`}
                  >
                    <Users size={14} className="translate-y-[-0.5px]" />
                    <span>Join</span>
                  </Link>
                  {/* Rich hover tooltip card with Join + Sign In */}
                  <div className="absolute top-full right-0 mt-3 w-72 opacity-0 invisible group-hover/community:opacity-100 group-hover/community:visible transition-all duration-200 origin-top-right scale-95 group-hover/community:scale-100 pointer-events-none z-50">
                    {/* Arrow */}
                    <div className="absolute -top-1.5 right-6 w-3 h-3 bg-card border-l border-t border-border rotate-45" />
                    <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-left pointer-events-auto">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-purple-900/10 to-primary/5 dark:from-purple-900/30 dark:to-primary/10 px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Users size={16} className="text-amber-600 dark:text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground font-bold text-sm leading-tight">Nomad Community</p>
                            <p className="text-amber-600 dark:text-primary text-xs font-medium">Connect · Explore · Co-work</p>
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
                              <p className="text-foreground text-xs font-semibold leading-tight">{label}</p>
                              <p className="text-muted text-[10px] leading-tight">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Join CTA & Sign In option below */}
                      <div className="px-4 pb-4 pt-2 border-t border-border space-y-3 bg-muted/5">
                        <Link
                          href="/auth/register"
                          className="flex items-center justify-center w-full bg-primary hover:bg-yellow-400 text-black font-extrabold text-xs py-2 rounded-xl transition-all shadow-md shadow-primary/10"
                        >
                          Join Free Now
                        </Link>
                        <div className="text-center">
                          <span className="text-[11px] text-muted">Already a member? </span>
                          <Link
                            href="/auth/signin"
                            className="text-amber-600 dark:text-primary text-[11px] font-bold hover:underline"
                          >
                            Sign In
                          </Link>
                        </div>
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
                <div className="absolute -top-1.5 right-6 w-3 h-3 bg-card border-l border-t border-border rotate-45" />
                <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/10 to-yellow-600/5 dark:from-primary/20 dark:to-yellow-600/10 px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <CalendarCheck size={16} className="text-amber-600 dark:text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-bold text-sm leading-tight">Book a Workspace</p>
                        <p className="text-amber-600 dark:text-primary text-xs font-medium">Verified · Tested · Nepal</p>
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
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-amber-700 dark:text-primary text-[10px] font-black flex items-center justify-center mt-0.5">{step}</span>
                        <div>
                          <p className="text-foreground text-xs font-semibold leading-tight">{label}</p>
                          <p className="text-muted text-[11px]">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Footer CTA */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between bg-muted/20 rounded-xl px-3 py-2">
                      <span className="text-muted text-xs">500+ verified hubs in Nepal</span>
                      <span className="text-amber-600 dark:text-primary text-xs font-bold">Explore →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Avatar Dropdown */}
            {session && (
              <div className="relative group/avatar flex items-center ml-1.5">
                <button className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm transition-all relative overflow-hidden ${
                  avatarUrl 
                    ? "bg-primary/20 border border-primary/30 text-primary hover:border-primary group-hover/avatar:border-primary" 
                    : "bg-primary text-black border border-primary hover:bg-yellow-400"
                }`}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    session.user?.name?.[0]?.toUpperCase() || <User size={15} />
                  )}
                </button>
                
                {/* Dropdown Card */}
                <div className="absolute top-full right-0 mt-3.5 w-60 opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all duration-200 origin-top-right scale-95 group-hover/avatar:scale-100 pointer-events-none z-50">
                  {/* Arrow pointer */}
                  <div className="absolute -top-1.5 right-3 w-3 h-3 bg-card border-l border-t border-border rotate-45" />
                  
                  <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-4 text-left pointer-events-auto space-y-3.5">
                    {/* Header */}
                    <div className="border-b border-border pb-3">
                      <p className="text-foreground font-extrabold text-sm truncate leading-none mb-1">
                        {session.user?.name}
                      </p>
                      <p className="text-muted text-xs truncate leading-none">
                        {session.user?.email}
                      </p>
                    </div>

                    {/* Settings Link */}
                    <div className="border-b border-border pb-3">
                      <Link
                        href="/community/settings"
                        className="flex items-center gap-2 w-full hover:bg-muted/10 text-muted hover:text-foreground px-3 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <Settings size={14} />
                        Profile Settings
                      </Link>
                    </div>
                    
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-muted text-xs font-semibold">Theme</span>
                      <ThemeToggle />
                    </div>
                    
                    {/* Action */}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-extrabold py-2.5 rounded-xl text-xs transition-all active:scale-[0.98] border border-red-500/15 dark:border-red-500/10 hover:border-red-500/30"
                    >
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-lg transition-colors ${isSolid ? "text-foreground hover:bg-muted/10" : "text-white hover:bg-white/10"}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-background border-l border-border shadow-2xl p-6 flex flex-col transition-transform duration-300 transform ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
            <div className="relative w-9 h-9">
              <Image src="/nomadlogo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-foreground">
              Digital Nomads <span className="text-primary">Nepal</span>
            </span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list (scrollable) */}
        <div className="flex-1 overflow-y-auto py-6 space-y-3">
          {navItems.map((item) => {
            const hasDropdown = !!item.dropdown;
            const isExpanded = expandedItem === item.name;

            return (
              <div key={item.name} className="border-b border-border/40 pb-2">
                {hasDropdown ? (
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                    className="flex items-center justify-between w-full text-left py-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronDown 
                      size={16} 
                      className={`text-muted-foreground transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-primary" : ""
                      }`} 
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown items */}
                {hasDropdown && isExpanded && (
                  <div className="mt-2 pl-4 space-y-1 border-l-2 border-primary/30 ml-2 animate-in fade-in slide-in-from-top-1 duration-250">
                    {item.dropdown!.map((sub, idx) => (
                      <Link 
                        key={idx} 
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <div className="text-foreground text-xs font-semibold flex items-center gap-1.5">
                          {sub.name}
                          {sub.hasIcon && <TrekkingGuideIcon size={14} className="translate-y-[-1px]" />}
                        </div>
                        <div className="text-muted-foreground text-[10px] leading-tight mt-0.5">{sub.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="border-t border-border pt-6 space-y-4 shrink-0 bg-background">
          {session ? (
            <div className="space-y-3">
              <div className="text-center text-xs font-bold text-muted-foreground">
                Logged in as <span className="text-primary font-bold">{session.user?.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href="/community" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1 text-center px-3 py-2.5 bg-primary text-black font-bold rounded-xl border border-primary hover:bg-yellow-400 transition-all active:scale-[0.98] text-xs whitespace-nowrap"
                >
                  <Users size={13} />
                  Explore
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/auth/signin" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center text-center px-3 py-2.5 border border-border text-foreground hover:bg-accent font-bold rounded-xl text-xs transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1 text-center px-3 py-2.5 bg-primary text-black font-bold rounded-xl border border-primary hover:bg-yellow-400 transition-all active:scale-[0.98] text-xs whitespace-nowrap"
              >
                <Users size={13} />
                Join
              </Link>
            </div>
          )}
          
          <Link 
            href="/resources/coworking" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 bg-primary hover:bg-yellow-400 text-black font-extrabold rounded-xl transition-all active:scale-[0.98] text-xs shadow-md shadow-primary/15"
          >
            <CalendarCheck size={14} />
            Book Workspace Now
          </Link>
        </div>
      </div>
    </nav>
  )
}
