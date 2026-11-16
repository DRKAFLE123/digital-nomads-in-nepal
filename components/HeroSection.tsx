"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronDown,
  ArrowRight,
  Compass,
  Check,
  MapPin,
  Building,
  Home,
  Users,
  Search,
  Wifi,
  ShieldCheck,
  Mountain,
  Coffee,
} from "lucide-react"

const LOCATIONS = [
  { value: "all", label: "Anywhere in Nepal", desc: "Explore all hubs & regions" },
  { value: "Pokhara", label: "Pokhara", desc: "Lakeside & Nomad Capital" },
  { value: "Kathmandu", label: "Kathmandu", desc: "Thamel & Tech Capital" },
  { value: "Lalitpur", label: "Lalitpur", desc: "Jhamsikhel & Sanepa" },
  { value: "Bandipur", label: "Bandipur", desc: "Hilltop Peace & Coliving" },
  { value: "Bhaktapur", label: "Bhaktapur", desc: "Newari Heritage & Quiet" },
  { value: "Solukhumbu", label: "Everest / Namche", desc: "Himalayan High Altitude" },
  { value: "Mustang", label: "Mustang", desc: "Rainshadow & Monasteries" },
]

const CATEGORIES = [
  {
    value: "workspace",
    label: "Workspaces & Cafes",
    shortLabel: "Workspaces",
    desc: "Coworking spaces, hot desks & fiber cafes",
    icon: Building,
  },
  {
    value: "stay",
    label: "Stays, Hostels & Coliving",
    shortLabel: "Stays & Hostels",
    desc: "Verified rooms with backup power & fiber",
    icon: Home,
  },
  {
    value: "guide",
    label: "Local Mountain Guides",
    shortLabel: "Local Guides",
    desc: "Licensed Sherpa & trekking specialists",
    icon: Users,
  },
]

const QUICK_FILTERS = [
  {
    label: "Workspaces",
    href: "/workspaces",
    icon: Building,
    iconColor: "text-[#023629] dark:text-emerald-400",
  },
  {
    label: "Stays & Hostels",
    href: "/stay",
    icon: Home,
    iconColor: "text-[#C2410C] dark:text-[#FB923C]",
  },
  {
    label: "Local Guides",
    href: "/guides",
    icon: Users,
    iconColor: "text-[#023629] dark:text-emerald-400",
  },
  {
    label: "Himalayan Treks",
    href: "/destinations",
    icon: Mountain,
    iconColor: "text-[#C2410C] dark:text-[#FB923C]",
  },
  {
    label: "Nomad Cafes",
    href: "/workspaces?category=Work-Friendly%20Cafes",
    icon: Coffee,
    iconColor: "text-amber-700 dark:text-amber-400",
  },
]

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("workspace")

  // Custom Dropdowns
  const [whereOpen, setWhereOpen] = useState(false)
  const [whatOpen, setWhatOpen] = useState(false)

  const whereRef = useRef<HTMLDivElement>(null)
  const whatRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (whereRef.current && !whereRef.current.contains(e.target as Node)) {
        setWhereOpen(false)
      }
      if (whatRef.current && !whatRef.current.contains(e.target as Node)) {
        setWhatOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setWhereOpen(false)
    setWhatOpen(false)

    const cityQuery = selectedCity !== "all" ? `?city=${encodeURIComponent(selectedCity)}` : ""
    if (selectedCategory === "workspace") {
      router.push(`/workspaces${cityQuery}`)
    } else if (selectedCategory === "stay") {
      router.push(`/stay${cityQuery}`)
    } else {
      router.push(`/guides${cityQuery}`)
    }
  }

  const activeCityObj = LOCATIONS.find((l) => l.value === selectedCity) || LOCATIONS[0]
  const activeCatObj = CATEGORIES.find((c) => c.value === selectedCategory) || CATEGORIES[0]
  const ActiveCatIcon = activeCatObj.icon

  return (
    <section className="relative z-20 w-full pt-[124px] pb-8 sm:pt-[136px] sm:pb-10 bg-white dark:bg-[#0B0B0D] transition-colors border-b border-slate-100 dark:border-[#1F1F24]">
      {/* Subtle Himalayan Topographic Vector Canvas Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Ambient Radial Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-b from-[#023629]/5 dark:from-[#023629]/25 via-[#C2410C]/4 dark:via-[#C2410C]/15 to-transparent rounded-full blur-3xl opacity-75" />

        {/* Crisp Topographic Vector Contour Lines (Subtle & Non-distracting) */}
        <svg
          className="absolute inset-0 w-full h-full stroke-gray-900/[0.03] dark:stroke-white/[0.03] fill-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 480"
          preserveAspectRatio="none"
        >
          <path d="M-100 160 C 300 90, 600 240, 1100 120 C 1300 60, 1500 170, 1600 140" strokeWidth="1.2" />
          <path d="M-100 220 C 250 150, 650 300, 1050 170 C 1350 110, 1480 230, 1600 200" strokeWidth="1.2" />
          <path d="M-100 290 C 220 220, 700 350, 1000 240 C 1280 170, 1450 280, 1600 260" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Compact Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#023629] dark:text-[#34D399] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 px-3.5 py-1 rounded-full mb-2.5 shadow-xs">
          <Compass size={12} className="text-[#023629] dark:text-[#34D399]" />
          <span>The Himalayan Remote Work &amp; Guide Ecosystem</span>
        </div>

        {/* High-Contrast Editorial Heading - Compact & Punchy */}
        <h1 className="tracking-tight text-center max-w-3xl mb-2 sm:mb-2.5">
          <span className="block font-extrabold text-2xl sm:text-4xl lg:text-[44px] text-slate-900 dark:text-white leading-[1.12]">
            Digital Nomads in Nepal
          </span>
          <span className="block font-serif italic font-normal text-xl sm:text-3xl lg:text-[34px] text-[#C2410C] dark:text-[#FB923C] mt-0.5 leading-[1.18]">
            Live, Work &amp; Explore
          </span>
        </h1>

        {/* Supporting Description - Concise 1-liner to prevent vertical scroll overflow */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl mx-auto mb-5 sm:mb-6 text-center">
          Verified 100+ Mbps workspaces, boutique coliving hubs, mountain hostels, and licensed local guides across Nepal.
        </p>

        {/* Elevated Segmented Search Bar - Primary Visual Anchor */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl mx-auto bg-white dark:bg-[#141416] border border-slate-200/90 dark:border-[#27272A] rounded-2xl sm:rounded-full p-2 sm:p-2 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-left"
        >
          {/* Segment 1: WHERE Custom Dropdown */}
          <div ref={whereRef} className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setWhereOpen(!whereOpen)
                setWhatOpen(false)
              }}
              className="w-full text-left px-3.5 sm:px-4 py-1.5 sm:py-1.5 rounded-xl sm:rounded-full hover:bg-slate-50 dark:hover:bg-[#1E1E23] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8.5 h-8.5 rounded-full bg-slate-50 dark:bg-[#1E1E23] border border-slate-200/80 dark:border-[#2E2E34] flex items-center justify-center shrink-0 group-hover:border-[#C2410C]/40 transition-colors">
                  <MapPin size={15} className="text-[#C2410C] dark:text-[#FB923C]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block leading-tight mb-0.5">
                    Where in Nepal
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeCityObj.label}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={15}
                className={`text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 shrink-0 mr-1 ${
                  whereOpen ? "rotate-180 text-[#C2410C]" : ""
                }`}
              />
            </button>

            {/* Custom Popover with Discreet Thin Scrollbar */}
            {whereOpen && (
              <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-80 mt-2 bg-white dark:bg-[#141416] border border-slate-200 dark:border-[#27272A] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Select Hub / Destination
                </div>
                <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent] dark:[scrollbar-color:#334155_transparent]">
                  {LOCATIONS.map((loc) => {
                    const isSelected = loc.value === selectedCity
                    return (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => {
                          setSelectedCity(loc.value)
                          setWhereOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C]"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1F1F24]"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="block font-bold truncate">{loc.label}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{loc.desc}</span>
                        </div>
                        {isSelected && <Check size={14} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Divider (Desktop Only) */}
          <div className="hidden sm:block w-[1px] h-9 bg-slate-200 dark:bg-[#27272A]" />

          {/* Segment 2: WHAT Custom Dropdown */}
          <div ref={whatRef} className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setWhatOpen(!whatOpen)
                setWhereOpen(false)
              }}
              className="w-full text-left px-3.5 sm:px-4 py-1.5 sm:py-1.5 rounded-xl sm:rounded-full hover:bg-slate-50 dark:hover:bg-[#1E1E23] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8.5 h-8.5 rounded-full bg-slate-50 dark:bg-[#1E1E23] border border-slate-200/80 dark:border-[#2E2E34] flex items-center justify-center shrink-0 group-hover:border-[#023629]/40 transition-colors">
                  <ActiveCatIcon size={15} className="text-[#023629] dark:text-[#34D399]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block leading-tight mb-0.5">
                    What are you looking for?
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeCatObj.shortLabel}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={15}
                className={`text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 shrink-0 mr-1 ${
                  whatOpen ? "rotate-180 text-[#C2410C]" : ""
                }`}
              />
            </button>

            {/* Custom Popover with Discreet Thin Scrollbar */}
            {whatOpen && (
              <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-80 mt-2 bg-white dark:bg-[#141416] border border-slate-200 dark:border-[#27272A] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Select Category
                </div>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = cat.value === selectedCategory
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.value)
                          setWhatOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C]"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1F1F24]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <Icon size={15} className={isSelected ? "text-[#C2410C] dark:text-[#FB923C]" : "text-slate-400"} />
                          <div className="truncate">
                            <span className="block font-bold truncate">{cat.label}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{cat.desc}</span>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search Button (Solid Terracotta, Proportional Height & Crisp Alignment) */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#C2410C] hover:bg-[#9A3412] active:scale-95 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl sm:rounded-full transition-all shadow-md shadow-[#C2410C]/25 flex items-center justify-center gap-2 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
          >
            <Search size={15} />
            <span>Search Now</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Quick Category Filter Cards - High Contrast on Pure White Canvas */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 mt-4 w-full max-w-4xl">
          {QUICK_FILTERS.map((filter) => {
            const Icon = filter.icon
            return (
              <Link
                key={filter.label}
                href={filter.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-xs font-semibold bg-slate-50/90 hover:bg-white dark:bg-[#141416] dark:hover:bg-[#1F1F24] border border-slate-200/90 dark:border-[#27272A] text-slate-800 dark:text-slate-200 hover:border-[#C2410C] hover:text-[#C2410C] dark:hover:border-[#FB923C] dark:hover:text-[#FB923C] hover:shadow-xs hover:-translate-y-0.5 transition-all shadow-xs"
              >
                <Icon size={13} className={filter.iconColor} />
                <span>{filter.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Compact Micro-Trust Strip */}
        <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 dark:border-[#222226] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-3xl">
          {/* Nomad Avatars Stack */}
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#141416] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Nomad"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#141416] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Guide"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#141416] object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Remote Worker"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#141416] object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Host"
              />
            </div>
            <div className="text-left">
              <p className="text-[11.5px] font-bold text-slate-900 dark:text-white leading-tight">
                1,200+ Nomads, Guides &amp; Hosts
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Kathmandu • Pokhara • Bandipur • Everest
              </p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-[1px] h-6 bg-slate-200 dark:bg-[#27272A]" />

          {/* Trust Value Props */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <Wifi size={12} className="text-[#C2410C] dark:text-[#FB923C]" />
              <span>100+ Mbps Fiber</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#023629] dark:text-[#34D399]" />
              <span>0% Commission Direct Contact</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
