"use client"

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, CalendarCheck, LogOut, User, Settings, Compass, Building, Home, Users, BookOpen, ArrowRight, Bell, Award, Repeat, Search, CheckCircle2, TrendingUp, Building2, PlusCircle, Sparkles } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import Image from "next/image"
import TrekkingGuideIcon from "./TrekkingGuideIcon"
import { useSession, signOut } from "next-auth/react"
import GoogleSearchModal from "./search/GoogleSearchModal"
import ProfileSlider from "./profile/ProfileSlider"

interface NavActionItem {
  name: string
  desc: string
  href: string
  icon?: React.ElementType
  isTrekkingGuideIcon?: boolean
  variant?: "owner" | "register"
}

interface NavDropdownItem {
  name: string
  desc: string
  href: string
  hasTrekkingIcon?: boolean
  icon?: React.ElementType
}

interface NavCategory {
  name: string
  href?: string
  dropdown?: NavDropdownItem[]
  actions?: NavActionItem[]
  wide?: boolean
  icon?: React.ElementType
}

interface PopularPost {
  slug: string
  title: string
  excerpt: string
  category: string
  coverImage: string
  readTime: string
  featured?: boolean
}

const DEFAULT_POPULAR_POSTS: PopularPost[] = [
  {
    slug: "nepal-digital-nomad-visa-guide-2026",
    title: "The Ultimate Guide to the Nepal Digital Nomad Visa (2026)",
    excerpt: "Everything you need to know about remote working in Nepal: visa options, cost of living, top destinations, and internet connectivity.",
    category: "Visa Guide",
    coverImage: "/nepal-nomad-visa-banner.png",
    readTime: "8 min read",
    featured: true
  },
  {
    slug: "pokhara-nomads-basecamp-summit-2026",
    title: "Pokhara to Host Nomads Basecamp 2026: Remote Work Community Summit",
    excerpt: "The first annual international gathering of remote workers and location-independent entrepreneurs in Nepal's lakeside adventure capital.",
    category: "Events & Community",
    coverImage: "/images/pokhara-nomads-basecamp-hero.jpg",
    readTime: "6 min read",
    featured: true
  },
  {
    slug: "cost-of-living-nepal-2026-nomad-budget",
    title: "Cost of Living in Nepal: A 2026 Budget Guide for Remote Workers",
    excerpt: "Break down your monthly budget for living and working remotely in Nepal. From rent in Kathmandu/Pokhara to food, transport, and leisure costs.",
    category: "Cost of Living",
    coverImage: "/blog-cost-of-living.png",
    readTime: "7 min read",
  },
  {
    slug: "top-10-destinations-nepal-remote-workers-2026",
    title: "Top 10 Destinations in Nepal for Remote Workers & Digital Nomads (2026)",
    excerpt: "From bustling Kathmandu to serene lakeside Pokhara, hill stations like Bandipur and mountain escapes with fiber internet.",
    category: "Destinations",
    coverImage: "/blog-top-10-destinations.png",
    readTime: "9 min read",
  },
  {
    slug: "top-5-work-friendly-cafes-kathmandu-wifi",
    title: "Top 5 Work-Friendly Cafes in Kathmandu with High-Speed Wi-Fi",
    excerpt: "Need a reliable workspace with delicious coffee and fast internet? Here are the top 5 cafes in Kathmandu perfect for nomads.",
    category: "Work Setup",
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80",
    readTime: "5 min read",
  }
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>(DEFAULT_POPULAR_POSTS)
  const [hoveredBlogIndex, setHoveredBlogIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
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
    async function loadPopularPosts() {
      try {
        const res = await fetch("/api/posts/popular")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setPopularPosts(data)
          }
        }
      } catch (err) {
        console.error("Failed to load popular posts:", err)
      }
    }
    loadPopularPosts()
  }, [])

  // Dynamic Owner & Local Expert role state
  const [roleInfo, setRoleInfo] = useState<{
    isOwner: boolean
    isGuide: boolean
    pendingOwnerBookings: number
    pendingGuideInquiries: number
  }>({
    isOwner: false,
    isGuide: false,
    pendingOwnerBookings: 0,
    pendingGuideInquiries: 0
  })

  // Mode switcher ("DASHBOARD" vs "NOMAD")
  const [userMode, setUserMode] = useState<"DASHBOARD" | "NOMAD">("DASHBOARD")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileSliderOpen, setIsProfileSliderOpen] = useState(false)

  const navRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnterNav = (catName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setActiveDropdown(catName)
  }

  const handleMouseLeaveNav = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      setIsScrolled(scrollPos > 15)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Keyboard shortcut (Cmd/Ctrl + K) & custom event listener to open search & profile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    const handleOpenModal = () => setIsSearchOpen(true)
    const handleOpenProfile = () => setIsProfileSliderOpen(true)
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("open-search-modal", handleOpenModal)
    window.addEventListener("open-profile-slider", handleOpenProfile)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("open-search-modal", handleOpenModal)
      window.removeEventListener("open-profile-slider", handleOpenProfile)
    }
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
      // 1. Fetch community profile for avatar
      fetch(`/api/community/profile?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile?.avatarUrl) {
            setAvatarUrl(data.profile.avatarUrl)
          }
        })
        .catch(err => console.error("Error fetching navbar avatar:", err))

      // 2. Fetch role status (Owner / Guide / Nomad) and pending notification count
      fetch(`/api/auth/me?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setRoleInfo({
              isOwner: !!data.isOwner,
              isGuide: !!data.isGuide,
              pendingOwnerBookings: data.pendingOwnerBookings || 0,
              pendingGuideInquiries: data.pendingGuideInquiries || 0
            })
          }
        })
        .catch(err => console.error("Error fetching role status:", err))
    } else {
      setAvatarUrl(null)
      setRoleInfo({ isOwner: false, isGuide: false, pendingOwnerBookings: 0, pendingGuideInquiries: 0 })
    }
  }, [session])

  // Handle ESC key to close open dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Handle outside click to close active dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navCategories: NavCategory[] = [
    {
      name: "Explore",
      icon: Compass,
      dropdown: [
        { name: "Destinations", desc: "Explore cities and destinations across Nepal.", href: "/destinations" },
        { name: "Neighborhoods", desc: "Discover the best areas for digital nomads to stay and work.", href: "/destinations#neighborhoods" },
        { name: "Practical Guides", desc: "Comprehensive guides for SIM cards, transport, visas & money.", href: "/practical-guides" },
        { name: "SIM Cards & Data Guide", desc: "Ncell vs NTC 4G/5G, eSIMs and airport kiosk setup.", href: "/nepal-sim-cards-guide" },
        { name: "Transportation Guide", desc: "Pathao, InDrive ride-hailing, taxis & domestic flights.", href: "/nepal-transportation-guide" },
        { name: "Nomad Visa Guide", desc: "150-day tourist visa rules, entry & immigration extensions.", href: "/nomad-visa-guide" },
      ]
    },
    {
      name: "Workspaces",
      icon: Building,
      wide: true,
      dropdown: [
        { name: "All Workspaces", desc: "Browse all verified workspaces in Nepal.", href: "/workspaces" },
        { name: "Coworking Spaces", desc: "Hot desks, dedicated desks and shared workspaces.", href: "/workspaces?category=Coworking%20Spaces" },
        { name: "Private Offices", desc: "Private rooms and offices for individuals and teams.", href: "/workspaces?category=Private%20Offices" },
        { name: "Meeting Rooms", desc: "Book professional meeting and conference spaces.", href: "/workspaces?category=Meeting%20Rooms" },
        { name: "Work-Friendly Cafés", desc: "Find cafés suitable for focused remote work.", href: "/workspaces?category=Work-Friendly%20Cafes" },
        { name: "24/7 Workspaces", desc: "Find workspaces with round-the-clock access.", href: "/workspaces?amenity=24/7%20Access" },
      ],
      actions: [
        { name: "Owner Console", desc: "Manage your listings, rates & incoming nomad reservations.", href: "/owner/dashboard", icon: Building2, variant: "owner" },
        { name: "+ Register Workspace", desc: "List your coworking hub or café for digital nomads.", href: "/workspaces/register", icon: PlusCircle, variant: "register" }
      ]
    },
    {
      name: "Stay",
      icon: Home,
      dropdown: [
        { name: "Hotels", desc: "Find comfortable places to stay while working remotely.", href: "/stay?type=hotels" },
        { name: "Hostels", desc: "Budget-friendly accommodation for digital nomads.", href: "/stay?type=hostels" },
        { name: "Coliving", desc: "Live and work alongside other remote professionals.", href: "/stay?type=coliving" },
        { name: "Long-Term Stays", desc: "Accommodation suitable for extended stays.", href: "/stay?type=longterm" },
        { name: "My Nomad Passes", desc: "View your stay & workspace reservations and Wi-Fi passes.", href: "/nomad/bookings", icon: CalendarCheck },
      ],
      actions: [
        { name: "+ Register Your Stay / Coliving", desc: "List your hotel, hostel, coliving, or long-stay property.", href: "/stay/register", icon: Home, variant: "register" }
      ]
    },
    {
      name: "Local Experts",
      icon: Users,
      dropdown: [
        { name: "Find a Local Guide", desc: "Connect with verified human trekking, cultural & city guides.", href: "/local-guides", hasTrekkingIcon: true },
        { name: "Experiences", desc: "Discover authentic local activities and experiences.", href: "/local-guides#experiences" },
        { name: "Tours", desc: "Find private and group tours.", href: "/local-guides#tours" },
        { name: "Local Services", desc: "Useful local fixer services for digital nomads.", href: "/local-guides#services" },
      ],
      actions: [
        { name: "Guide Dashboard", desc: "Manage your expert profile & incoming trek inquiries.", href: "/local-guides/dashboard", icon: Compass, variant: "owner" },
        { name: "+ Become a Local Expert", desc: "Register as a licensed trekking or cultural guide.", href: "/local-guides/register", isTrekkingGuideIcon: true, variant: "register" }
      ]
    },
    {
      name: "Community",
      icon: Users,
      dropdown: [
        { name: "Community", desc: "Connect with other digital nomads.", href: "/community" },
        { name: "Events", desc: "Meetups, networking events and community activities.", href: "/events" },
        { name: "Discussions", desc: "Ask questions and share experiences.", href: "/community#forum" },
        { name: "Nomad Stories", desc: "Stories and experiences from people working remotely in Nepal.", href: "/blog" },
      ]
    },
    {
      name: "Blog",
      icon: BookOpen,
      href: "/blog",
      dropdown: [
        { name: "All Articles", desc: "Browse all guides & stories", href: "/blog" },
        { name: "Pokhara Nomads Basecamp 2026", desc: "Nepal's remote work summit", href: "/blog/pokhara-nomads-basecamp-summit-2026" },
        { name: "Nepal Nomad Visa (2026)", desc: "Visa requirements & updates", href: "/blog/nepal-digital-nomad-visa-guide-2026" },
        { name: "Top 10 Nomad Destinations", desc: "Best hubs across Nepal", href: "/blog/top-10-destinations-nepal-remote-workers-2026" },
        { name: "Cost of Living Guide", desc: "Monthly budget breakdown", href: "/blog/cost-of-living-nepal-2026-nomad-budget" },
      ]
    },
  ]

  const isSolid = !isHome || isScrolled

  return (
    <nav
      ref={navRef}
      suppressHydrationWarning
      aria-label="Main Navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isSolid
          ? "bg-white/95 dark:bg-[#080808]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#242424] shadow-md dark:shadow-xl py-0"
          : "bg-transparent py-0"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-[72px]">

          {/* Left: Brand Logo & Interactive Platform Intro Popover */}
          <div className="flex-shrink-0 flex items-center h-[72px] gap-2.5 sm:gap-3">
            {/* Logo Image (no popover on hover) - Proportional size & seamless spacing */}
            <Link
              href="/"
              className="relative h-9 sm:h-10 md:h-11 w-[86px] sm:w-[96px] md:w-[105px] overflow-hidden flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] rounded-xl flex items-center transition-transform hover:scale-105 active:scale-95 duration-200"
              aria-label="Digital Nomads in Nepal Home"
            >
              <Image src="/webisteofficiallogo-removebg-preview.png" alt="Digital Nomads in Nepal Logo" fill className="object-contain object-center" priority unoptimized />
            </Link>

            {/* Brand Name (Hidden on mobile when user is signed in to avoid pushing hamburger off screen) */}
            <div className={`relative group/name items-center h-full ${mounted && session ? "hidden md:flex" : "flex"}`}>
              <Link
                href="/"
                className="flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] rounded-xl py-1 text-center select-none"
              >
                <span className={`font-black text-sm sm:text-[15px] md:text-[17px] tracking-normal leading-tight uppercase transition-colors text-center ${
                  isSolid
                    ? "text-gray-900 dark:text-[#F5F5F5] lg:group-hover/name:text-primary"
                    : "text-white lg:group-hover/name:text-[#FFD400]"
                } ${
                  !isScrolled ? "inline-block" : "hidden sm:inline-block"
                }`}>
                  DIGITAL NOMADS
                </span>
                <span className={`w-full flex items-center justify-center gap-1.5 font-extrabold text-[9px] sm:text-[10px] text-[#FFD400] tracking-[0.16em] uppercase leading-none mt-1 select-none text-center ${
                  !isScrolled ? "flex" : "hidden sm:flex"
                }`}>
                  <span className="text-[#FFD400]/60 font-medium select-none">—</span>
                  <span>IN NEPAL</span>
                  <span className="text-[#FFD400]/60 font-medium select-none">—</span>
                </span>
              </Link>

              {/* Platform Intro Popover on Hover (Desktop ONLY: completely hidden on mobile/touch screens) */}
              <div className="hidden lg:block absolute top-[66px] -left-2 sm:left-0 w-[360px] sm:w-[410px] max-w-[94vw] opacity-0 invisible group-hover/name:opacity-100 group-hover/name:visible transition-all duration-200 origin-top-left scale-95 group-hover/name:scale-100 pointer-events-none group-hover/name:pointer-events-auto z-50 pt-2 before:absolute before:-top-3 before:left-0 before:w-full before:h-4 before:content-['']">
              <div className="relative bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] rounded-2xl shadow-2xl p-4 sm:p-5 space-y-3.5 text-left">
                {/* Pointer Arrow */}
                <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white dark:bg-[#121212] border-l border-t border-gray-200 dark:border-[#262626] rotate-45" />

                {/* Header Badge & Mission */}
                <div className="border-b border-gray-100 dark:border-[#222222] pb-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFD400]/15 text-[#B45309] dark:text-[#FFD400] border border-[#FFD400]/30 flex items-center gap-1">
                      <Compass size={11} /> Remote Work in Nepal
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">
                    Digital Nomads in Nepal
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    The verified digital nomad & remote work ecosystem built to help you live, work, and explore the Himalayas seamlessly.
                  </p>
                </div>

                {/* Core Services Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    What We Provide
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/resources/coworking"
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-100 dark:border-[#262626] hover:border-primary/50 transition-colors group/srv"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white group-hover/srv:text-primary">
                        <Building size={13} className="text-[#FFD400] shrink-0" />
                        <span>Workspaces</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                        24/7 generator backup & fiber internet hubs.
                      </p>
                    </Link>

                    <Link
                      href="/guides"
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-100 dark:border-[#262626] hover:border-indigo-500/50 transition-colors group/srv"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white group-hover/srv:text-indigo-400">
                        <Compass size={13} className="text-indigo-400 shrink-0" />
                        <span>Local Guides</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                        Licensed trekking & mountain experts.
                      </p>
                    </Link>

                    <Link
                      href="/stay"
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-100 dark:border-[#262626] hover:border-emerald-500/50 transition-colors group/srv"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white group-hover/srv:text-emerald-400">
                        <Home size={13} className="text-emerald-500 shrink-0" />
                        <span>Nomad Stays</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                        Workation villas & monthly apartments.
                      </p>
                    </Link>

                    <Link
                      href="/resources"
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-100 dark:border-[#262626] hover:border-amber-500/50 transition-colors group/srv"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white group-hover/srv:text-amber-500">
                        <BookOpen size={13} className="text-amber-500 shrink-0" />
                        <span>Visa & Guides</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                        eSIMs, banking & nomad budget.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Why Use This Platform? */}
                <div className="bg-amber-50/70 dark:bg-[#181818] rounded-xl p-2.5 border border-amber-200/50 dark:border-[#282828] text-[11px] text-gray-700 dark:text-gray-300 space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1 text-[11px]">
                    <CheckCircle2 size={13} className="text-[#22C55E]" /> Why nomads use this site:
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    Zero broker markups, verified speed tests, power backup guarantees, and an active community of digital nomads and remote workers in Nepal.
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-1 flex items-center justify-between">
                  <Link
                    href="/about"
                    className="text-[11px] font-bold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Learn our story</span>
                    <ArrowRight size={11} />
                  </Link>

                  <Link
                    href="/resources/coworking"
                    className="text-[11px] font-bold text-black bg-[#FFD400] hover:bg-[#FFE033] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-xs"
                  >
                    <span>Explore Spaces</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Mobile Center Top Search Bar Pill: Appears when scrolled (on any page) taking flex width */}
          {isScrolled && (
            <div className="flex-1 lg:hidden flex items-center px-2 min-w-0">
              <button
                type="button"
                id="mobile-scrolled-search-pill"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/95 dark:bg-[#181818]/95 border border-gray-200 dark:border-[#2C2C2C] text-gray-500 dark:text-gray-400 text-xs shadow-inner hover:border-[#FFD400] dark:hover:border-[#FFD400] transition-all text-left cursor-pointer"
                aria-label="Search workspaces, guides, destinations"
              >
                <Search size={14} className="text-[#B45309] dark:text-[#FFD400] shrink-0" />
                <span className="truncate text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                  Search workspaces, guides, visa...
                </span>
              </button>
            </div>
          )}

          {/* Center: Scalable Desktop Primary Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navCategories.map((cat) => {
              const hasDropdown = !!cat.dropdown
              const isOpen = activeDropdown === cat.name

              return (
                <div
                  key={cat.name}
                  className="relative group h-[72px] flex items-center px-1"
                  onMouseEnter={() => hasDropdown && handleMouseEnterNav(cat.name)}
                  onMouseLeave={() => hasDropdown && handleMouseLeaveNav()}
                >
                  {hasDropdown ? (
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : cat.name)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 text-[13px] font-semibold px-3 py-2 rounded-xl transition-all duration-150 ${
                        isOpen
                          ? "text-[#FFD400] bg-[#FFD400]/10"
                          : isSolid
                          ? "text-gray-700 hover:text-black hover:bg-gray-100 dark:text-[#F5F5F5] dark:hover:text-[#FFD400] dark:hover:bg-[#141414]"
                          : "text-white/90 hover:text-[#FFD400] hover:bg-white/10"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#FFD400]" : "opacity-60"}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={cat.href || "#"}
                      className={`flex items-center gap-1 text-[13px] font-semibold px-3 py-2 rounded-xl transition-all duration-150 ${
                        isSolid
                          ? "text-gray-700 hover:text-black hover:bg-gray-100 dark:text-[#F5F5F5] dark:hover:text-[#FFD400] dark:hover:bg-[#141414]"
                          : "text-white/90 hover:text-[#FFD400] hover:bg-white/10"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  )}

                  {/* Mega Menu Dropdown */}
                  {hasDropdown && (
                    cat.name === "Blog" ? (
                      /* Specialized Popular Blogs Mega Menu */
                      <div
                        onMouseEnter={() => handleMouseEnterNav(cat.name)}
                        onMouseLeave={() => handleMouseLeaveNav()}
                        className={`absolute top-[72px] pt-1.5 right-0 xl:left-1/2 xl:-translate-x-1/2 transition-all duration-150 origin-top-right xl:origin-top z-50 w-[720px] max-w-[92vw] ${
                          isOpen
                            ? "opacity-100 visible scale-100 pointer-events-auto"
                            : "opacity-0 invisible scale-95 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#242424] rounded-3xl shadow-2xl overflow-hidden p-5">
                          {/* Top Header */}
                          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-200 dark:border-[#242424]">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500">
                                <TrendingUp size={14} />
                              </span>
                              <span className="text-xs font-bold text-gray-900 dark:text-white">
                                Popular & Latest Guides
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">
                                • Hover headline to preview
                              </span>
                            </div>
                            <Link
                              href="/blog"
                              onClick={() => setActiveDropdown(null)}
                              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group/all"
                            >
                              <span>View All Articles</span>
                              <ArrowRight size={12} className="group-hover/all:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>

                          {/* Horizontal 2-Column Split: Headings on Left, Big Card on Right */}
                          <div className="grid grid-cols-12 gap-5 items-stretch">
                            {/* Left Column: Horizontal Headings List */}
                            <div className="col-span-7 flex flex-col justify-between space-y-1.5">
                              {popularPosts.slice(0, 4).map((post, idx) => {
                                const isHovered = hoveredBlogIndex === idx
                                return (
                                  <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    onMouseEnter={() => setHoveredBlogIndex(idx)}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`group/item flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                      isHovered
                                        ? "bg-amber-500/10 border-amber-500/40 text-[#FFD400]"
                                        : "bg-gray-50/80 dark:bg-[#161616] border-transparent hover:border-gray-200 dark:hover:border-[#282828] text-gray-900 dark:text-white"
                                    }`}
                                  >
                                    <div className="min-w-0 pr-2">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                          {post.category || "Guide"}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {post.readTime}
                                        </span>
                                      </div>
                                      <h4 className="text-xs font-bold truncate group-hover/item:text-primary transition-colors">
                                        {post.title}
                                      </h4>
                                    </div>
                                    <ArrowRight
                                      size={14}
                                      className={`shrink-0 transition-transform ${
                                        isHovered
                                          ? "translate-x-1 text-primary"
                                          : "text-muted-foreground opacity-60"
                                      }`}
                                    />
                                  </Link>
                                )
                              })}
                            </div>

                            {/* Right Column: The Big Card Preview */}
                            <div className="col-span-5">
                              {popularPosts[hoveredBlogIndex] && (
                                <Link
                                  href={`/blog/${popularPosts[hoveredBlogIndex].slug}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/bigcard block h-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] hover:border-primary/50 rounded-2xl overflow-hidden p-3 transition-all shadow-md flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-zinc-800 mb-2.5">
                                      <img
                                        src={popularPosts[hoveredBlogIndex].coverImage || "/blog-cost-of-living.png"}
                                        alt={popularPosts[hoveredBlogIndex].title}
                                        className="w-full h-full object-cover group-hover/bigcard:scale-105 transition-transform duration-300"
                                      />
                                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                                        {popularPosts[hoveredBlogIndex].category || "Featured"}
                                      </span>
                                    </div>
                                    <h3 className="text-xs font-black text-gray-900 dark:text-white line-clamp-2 group-hover/bigcard:text-primary transition-colors leading-snug">
                                      {popularPosts[hoveredBlogIndex].title}
                                    </h3>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-snug">
                                      {popularPosts[hoveredBlogIndex].excerpt}
                                    </p>
                                  </div>

                                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-[#242424] flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground font-semibold">
                                      {popularPosts[hoveredBlogIndex].readTime}
                                    </span>
                                    <span className="text-[11px] font-bold text-primary group-hover/bigcard:translate-x-1 transition-transform flex items-center gap-1">
                                      Read Article →
                                    </span>
                                  </div>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard Mega Menu Dropdown */
                      <div
                        onMouseEnter={() => handleMouseEnterNav(cat.name)}
                        onMouseLeave={() => handleMouseLeaveNav()}
                        className={`absolute top-[72px] pt-1.5 left-1/2 -translate-x-1/2 transition-all duration-150 origin-top z-50 ${
                          cat.wide ? "w-[440px]" : "w-80"
                        } ${
                          isOpen
                            ? "opacity-100 visible scale-100 pointer-events-auto"
                            : "opacity-0 invisible scale-95 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#242424] rounded-2xl shadow-2xl overflow-hidden p-2.5 space-y-1">
                          <div className={cat.wide ? "grid grid-cols-2 gap-1" : "space-y-1"}>
                            {cat.dropdown!.map((item, idx) => (
                              <Link
                                key={idx}
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="block p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all group/item border border-transparent hover:border-gray-200 dark:hover:border-[#262626]"
                              >
                                <div className="text-gray-900 dark:text-white font-extrabold text-xs flex items-center justify-between group-hover/item:text-[#FFD400] transition-colors">
                                  <span className="flex items-center gap-1.5">
                                    {item.name}
                                    {item.hasTrekkingIcon && <TrekkingGuideIcon size={14} className="translate-y-[-1px]" />}
                                  </span>
                                </div>
                                <p className="text-gray-500 dark:text-[#A1A1AA] text-[11px] leading-snug mt-1 font-normal group-hover/item:text-gray-700 dark:group-hover/item:text-gray-300">
                                  {item.desc}
                                </p>
                              </Link>
                            ))}
                          </div>

                          {/* Distinctive Highlighted Actions Section (Owner Console & Registrations) */}
                          {cat.actions && cat.actions.length > 0 && (
                            <div className="pt-2.5 mt-2 border-t border-gray-100 dark:border-[#222222] space-y-1.5">
                              {cat.actions.map((act, actIdx) => {
                                const ActionIcon = act.icon
                                const isRegister = act.variant === "register"
                                return (
                                  <Link
                                    key={actIdx}
                                    href={act.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                      isRegister
                                        ? "bg-amber-400/10 dark:bg-[#FFD400]/10 border-[#FFD400]/30 hover:border-[#FFD400] text-gray-900 dark:text-white"
                                        : "bg-gray-50 dark:bg-[#181818] border-gray-200/80 dark:border-[#282828] hover:border-gray-300 dark:hover:border-[#383838] text-gray-900 dark:text-white"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                        isRegister
                                          ? "bg-[#FFD400] text-black shadow-xs"
                                          : "bg-gray-200 dark:bg-[#252525] text-[#FFD400]"
                                      }`}>
                                        {act.isTrekkingGuideIcon ? (
                                          <TrekkingGuideIcon size={16} />
                                        ) : ActionIcon ? (
                                          <ActionIcon size={14} />
                                        ) : null}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-xs font-black truncate flex items-center gap-1.5">
                                          <span>{act.name}</span>
                                          {isRegister && (
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-[#FFD400] text-black tracking-wide">
                                              New
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-gray-500 dark:text-[#A1A1AA] truncate mt-0.5">
                                          {act.desc}
                                        </p>
                                      </div>
                                    </div>
                                    <ArrowRight size={13} className="text-gray-400 shrink-0 ml-2" />
                                  </Link>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            })}
          </div>

          {/* Right: Actions (Sign In, Join Free, Mode Switcher, Bell, Dashboard/Book Now) */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            {/* Notification Bell Icon for Owners & Guides */}
            {(roleInfo.isOwner || roleInfo.isGuide) && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl bg-[#141414] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-all"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  {(roleInfo.pendingOwnerBookings > 0 || roleInfo.pendingGuideInquiries > 0) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                      {roleInfo.pendingOwnerBookings + roleInfo.pendingGuideInquiries}
                    </span>
                  )}
                </button>

                {/* Notifications Quick Dropdown Drawer */}
                {notificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-[#121212] border border-gray-800 rounded-2xl shadow-2xl p-3 z-50 text-left space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2 px-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Bell size={13} className="text-[#FFD400]" /> Notifications
                      </span>
                      <span className="text-[10px] text-gray-400">Live Alerts</span>
                    </div>

                    {roleInfo.isOwner && (
                      <Link
                        href="/owner/dashboard?tab=BOOKINGS"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-2.5 rounded-xl bg-[#161616] hover:bg-[#1C1C1C] border border-gray-800 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#FFD400]">
                          <span>Pending Guest Requests</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]">
                            {roleInfo.pendingOwnerBookings} New
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">Review guest stay dates & confirm pass</p>
                      </Link>
                    )}

                    {roleInfo.isGuide && (
                      <Link
                        href="/guides/dashboard"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-2.5 rounded-xl bg-[#161616] hover:bg-[#1C1C1C] border border-gray-800 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                          <span>Trek & Tour Inquiries</span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                            {roleInfo.pendingGuideInquiries} New
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">View requested dates and reply</p>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mode Switcher Toggle Pill for Owners / Guides */}
            {mounted && (roleInfo.isOwner || roleInfo.isGuide) && (
              <button
                type="button"
                onClick={() => setUserMode(prev => (prev === "DASHBOARD" ? "NOMAD" : "DASHBOARD"))}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 bg-[#141414] text-gray-300 border border-gray-800 hover:border-gray-700"
              >
                <Repeat size={12} className="text-[#FFD400]" />
                <span>{userMode === "DASHBOARD" ? (roleInfo.isOwner ? "Owner Mode" : "Expert Mode") : "Nomad View"}</span>
              </button>
            )}

            {mounted && session ? (
              /* Signed in profile avatar with interactive hover pill and drawer trigger */
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsProfileSliderOpen(true)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-gray-100/90 dark:bg-[#141416] border border-gray-200 dark:border-[#26262B] hover:border-[#FFD400] dark:hover:border-[#FFD400] hover:bg-gray-200/50 dark:hover:bg-[#1C1C20] hover:shadow-md hover:shadow-[#FFD400]/10 transition-all duration-200 cursor-pointer active:scale-95 group/avatar"
                  aria-label="Open User Profile Drawer"
                  title={`${session.user?.name || "User Profile"} (Click to open profile)`}
                >
                  <div className="relative shrink-0 w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full bg-[#FFD400] text-black font-black text-xs flex items-center justify-center overflow-hidden shadow-xs ring-2 ring-[#FFD400]/30 group-hover/avatar:ring-[#FFD400] group-hover/avatar:scale-105 transition-all">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="User Avatar" className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full object-cover" />
                      ) : (
                        session.user?.name?.[0]?.toUpperCase() || <User size={14} />
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#141416]" title="Online" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover/avatar:text-[#FFD400] max-w-[85px] truncate hidden sm:inline-block transition-colors">
                    {session.user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown size={13} className="text-gray-400 group-hover/avatar:text-[#FFD400] transition-transform duration-200 group-hover/avatar:rotate-180" />
                </button>
              </div>
            ) : (
              /* Signed out actions */
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="text-xs font-extrabold text-gray-700 dark:text-[#F5F5F5] hover:text-[#FFD400] px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/register"
                  className="text-xs font-bold px-3.5 py-2 border border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black rounded-full transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm shadow-[#FFD400]/10"
                >
                  <Users size={13} />
                  <span>Join Free</span>
                </Link>
              </div>
            )}

            {/* Desktop Search Trigger Icon */}
            <button
              type="button"
              id="desktop-search-trigger"
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all cursor-pointer ${
                isSolid
                  ? "bg-gray-100/90 hover:bg-gray-200 dark:bg-[#161616] dark:hover:bg-[#202020] border-gray-200 dark:border-[#2A2A2A] text-gray-700 dark:text-gray-200 hover:text-[#B45309] dark:hover:text-[#FFD400] shadow-xs"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-[#FFD400] backdrop-blur-sm"
              }`}
              title="Search workspaces, guides, destinations (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {/* Book Now Button (Constant CTA for All Users) */}
            <div className="relative group/booknow">
              <Link
                href="/resources/coworking#book"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FFD400] hover:bg-[#FFE033] text-black font-bold text-xs rounded-full transition-all shadow-md shadow-[#FFD400]/20 hover:shadow-[#FFD400]/35 hover:scale-[1.02] active:scale-95 whitespace-nowrap cursor-pointer z-10"
              >
                <CalendarCheck size={13} className="group-hover/booknow:rotate-12 transition-transform duration-200" />
                <span>Book Now</span>
                <ChevronDown size={11} className="opacity-70 group-hover/booknow:rotate-180 transition-transform duration-200" />
              </Link>

                {/* Quick-Booking Interactive Card */}
                <div className="absolute top-full right-0 mt-2 pt-2 w-80 opacity-0 invisible group-hover/booknow:opacity-100 group-hover/booknow:visible group-hover/booknow:pointer-events-auto transition-all duration-200 origin-top-right scale-95 group-hover/booknow:scale-100 pointer-events-none z-50 before:absolute before:-top-3 before:left-0 before:w-full before:h-4 before:content-['']">
                  <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white dark:bg-[#121212] border-l border-t border-gray-200 dark:border-[#242424] rotate-45" />
                  
                  <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#242424] rounded-2xl shadow-2xl overflow-hidden p-3.5 space-y-3 text-left">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#242424] pb-2.5 px-1">
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarCheck size={14} className="text-[#FFD400]" /> Quick Marketplace Booking
                      </span>
                      <span className="text-[10px] font-bold text-[#16a34a] dark:text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                        Instant Access
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <Link
                        href="/resources/coworking#book"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all group/opt border border-transparent hover:border-gray-200 dark:hover:border-[#282828]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center text-[#FFD400] flex-shrink-0 group-hover/opt:bg-[#FFD400] group-hover/opt:text-black transition-colors">
                          <Building size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover/opt:text-[#FFD400] transition-colors">Workspaces & Desks</span>
                            <ArrowRight size={12} className="text-[#A1A1AA] group-hover/opt:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA] truncate">Hot desks, private offices & meeting rooms</p>
                        </div>
                      </Link>

                      <Link
                        href="/stay"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all group/opt border border-transparent hover:border-gray-200 dark:hover:border-[#282828]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center text-[#FFD400] flex-shrink-0 group-hover/opt:bg-[#FFD400] group-hover/opt:text-black transition-colors">
                          <Home size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover/opt:text-[#FFD400] transition-colors">Nomad Stays &amp; Coliving</span>
                            <ArrowRight size={12} className="text-[#A1A1AA] group-hover/opt:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA] truncate">Hotels, hostels &amp; long-term apartments</p>
                        </div>
                      </Link>

                      <Link
                        href="/guides"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all group/opt border border-transparent hover:border-gray-200 dark:hover:border-[#282828]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center text-[#FFD400] flex-shrink-0 group-hover/opt:bg-[#FFD400] group-hover/opt:text-black transition-colors">
                          <TrekkingGuideIcon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover/opt:text-[#FFD400] transition-colors">Book a Local Guide</span>
                            <ArrowRight size={12} className="text-[#A1A1AA] group-hover/opt:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA] truncate">Himalayan trekking, Sherpas &amp; cultural fixers</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          {/* Mobile Right Actions: Search (if not scrolled), Profile avatar (ONLY when signed in), Theme, Hamburger */}
          <div className="lg:hidden flex items-center gap-1.5 flex-shrink-0">
            {!isScrolled && (
              <button
                type="button"
                id="mobile-search-btn-top"
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isSolid
                    ? "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#181818]"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}

            {/* Profile Avatar on Mobile (ONLY when signed in) */}
            {mounted && session && (
              <button
                type="button"
                onClick={() => setIsProfileSliderOpen(true)}
                className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-[#242424] flex items-center justify-center bg-[#FFD400]/20 text-[#B45309] dark:text-[#FFD400] font-bold text-xs active:scale-95 cursor-pointer ring-1 ring-[#FFD400]/40"
                title={session.user?.name || "Profile"}
                aria-label="Open Profile Slider"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  session.user?.name?.[0]?.toUpperCase() || "U"
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isSolid
                  ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#181818]"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu Portaled to document.body */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <div
            className={`lg:hidden fixed inset-y-0 right-0 z-[9999] w-full sm:max-w-sm h-[100dvh] bg-white dark:bg-[#080808] border-l border-gray-200 dark:border-[#242424] shadow-2xl p-6 flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#242424] shrink-0">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 select-none">
                <div className="relative h-9 w-[86px] overflow-hidden shrink-0">
                  <Image src="/webisteofficiallogo-removebg-preview.png" alt="Logo" fill className="object-contain object-center" unoptimized />
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-black text-sm tracking-normal uppercase text-gray-900 dark:text-white leading-tight">
                    DIGITAL NOMADS
                  </span>
                  <div className="w-full flex items-center justify-center gap-1.5 font-extrabold text-[9px] text-[#FFD400] tracking-[0.16em] uppercase leading-none mt-1 select-none">
                    <span className="text-[#FFD400]/60 font-medium select-none">—</span>
                    <span>IN NEPAL</span>
                    <span className="text-[#FFD400]/60 font-medium select-none">—</span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#141414] transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search Trigger in Drawer */}
            <div className="py-3 border-b border-gray-200 dark:border-[#242424] shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsSearchOpen(true)
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-[#282828] text-gray-700 dark:text-gray-300 hover:border-primary transition-all text-xs font-medium cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search size={15} className="text-[#FFD400]" />
                  <span>Search workspaces, guides, visa...</span>
                </span>
                <span className="text-[10px] text-primary font-bold">Open</span>
              </button>
            </div>

            {/* Mobile Navigation List (Scrollable middle container) */}
            <div className="flex-1 overflow-y-auto py-4 space-y-1.5 overscroll-contain">
              {navCategories.map((cat) => {
                const hasDropdown = !!cat.dropdown
                const isExpanded = expandedMobileItem === cat.name

                return (
                  <div key={cat.name} className="border-b border-gray-100 dark:border-[#1c1c1c] pb-2">
                    {hasDropdown ? (
                      <button
                        onClick={() => setExpandedMobileItem(isExpanded ? null : cat.name)}
                        className="flex items-center justify-between w-full text-left py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FFD400] transition-colors cursor-pointer"
                      >
                        <span>{cat.name}</span>
                        <ChevronDown
                          size={16}
                          className={`text-[#A1A1AA] transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#FFD400]" : ""}`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={cat.href || "#"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FFD400] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    )}

                    {hasDropdown && isExpanded && (
                      <div className="mt-1 pl-3 border-l-2 border-[#FFD400]/40 ml-1 space-y-1.5 py-1">
                        {cat.dropdown!.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors"
                          >
                            <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                              {sub.name}
                              {sub.hasTrekkingIcon && <TrekkingGuideIcon size={13} />}
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-[#A1A1AA] mt-0.5">{sub.desc}</p>
                          </Link>
                        ))}

                        {/* Highlighted Actions in Mobile Drawer */}
                        {cat.actions && cat.actions.length > 0 && (
                          <div className="pt-2 mt-1 border-t border-gray-100 dark:border-[#222222] space-y-1.5 pr-2">
                            {cat.actions.map((act, actIdx) => {
                              const ActionIcon = act.icon
                              const isRegister = act.variant === "register"
                              return (
                                <Link
                                  key={actIdx}
                                  href={act.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                                    isRegister
                                      ? "bg-[#FFD400]/10 border-[#FFD400]/40 text-gray-900 dark:text-white"
                                      : "bg-gray-100 dark:bg-[#181818] border-gray-200 dark:border-[#282828] text-gray-900 dark:text-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                      isRegister ? "bg-[#FFD400] text-black" : "bg-gray-200 dark:bg-[#252525] text-[#FFD400]"
                                    }`}>
                                      {act.isTrekkingGuideIcon ? (
                                        <TrekkingGuideIcon size={14} />
                                      ) : ActionIcon ? (
                                        <ActionIcon size={13} />
                                      ) : null}
                                    </div>
                                    <div className="text-xs font-bold">{act.name}</div>
                                  </div>
                                  <ArrowRight size={12} className="text-gray-400" />
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Mobile-only About Us link positioned directly below Blog */}
              <div className="border-b border-gray-100 dark:border-[#1c1c1c] pb-2">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FFD400] transition-colors"
                >
                  About Us
                </Link>
              </div>
            </div>

            {/* Mobile Actions Footer (Pinned to bottom of drawer) */}
            <div className="border-t border-gray-200 dark:border-[#242424] pt-4 space-y-2.5 shrink-0 bg-white dark:bg-[#080808]">
              {!session ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center text-center px-4 py-2.5 border border-gray-200 dark:border-[#242424] text-gray-900 dark:text-white hover:border-[#FFD400] font-semibold rounded-xl text-xs transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 text-center px-4 py-2.5 border border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black font-bold rounded-xl text-xs transition-all"
                  >
                    <Users size={13} />
                    <span>Join Free</span>
                  </Link>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setIsProfileSliderOpen(true)
                  }}
                  className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#242424] rounded-xl cursor-pointer hover:border-[#FFD400]/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FFD400] text-black font-bold text-[10px] flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        session.user?.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                    <span className="text-xs text-gray-900 dark:text-white font-bold">{session.user?.name}</span>
                  </div>
                  <span className="text-[11px] text-[#FFD400] font-bold">View Profile &rarr;</span>
                </div>
              )}

              {/* Mobile Theme Row */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#242424] rounded-xl">
                <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold">Theme</span>
                <ThemeToggle variant="ghost" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/resources/coworking#book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 text-center px-3 py-2.5 bg-[#FFD400] hover:bg-[#FFE033] text-black font-bold rounded-xl transition-all text-xs shadow-md shadow-[#FFD400]/20 active:scale-95"
                >
                  <CalendarCheck size={14} />
                  <span>Book Space</span>
                </Link>
                <Link
                  href="/guides"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 text-center px-3 py-2.5 bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] hover:border-[#FFD400] text-gray-900 dark:text-white font-bold rounded-xl transition-all text-xs shadow-xs active:scale-95"
                >
                  <TrekkingGuideIcon size={14} />
                  <span>Book Guide</span>
                </Link>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Google-Style Search Overlay Modal */}
      <GoogleSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Facebook-Style Profile Slider Drawer (0ms instant transition, zero page reload) */}
      <ProfileSlider
        isOpen={isProfileSliderOpen}
        onClose={() => setIsProfileSliderOpen(false)}
        session={session}
        avatarUrl={avatarUrl}
        roleInfo={roleInfo}
        userMode={userMode}
        setUserMode={setUserMode}
      />
    </nav>
  )
}
