"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ChevronDown, ArrowRight, Compass, Check, MapPin, Building, Home, Users } from "lucide-react"

const HERO_SLIDES = [
  {
    desktopSrc: "/images/hero/hero-work-desktop.jpg",
    mobileSrc: "/images/hero/hero-work-mobile.jpg",
    alt: "Digital nomad working remotely at a scenic cafe balcony overlooking the Himalayas in Nepal",
    label: "Work & Connect",
  },
  {
    desktopSrc: "/images/hero/hero-trek-desktop.jpg",
    mobileSrc: "/images/hero/hero-trek-mobile.jpg",
    alt: "Trekkers hiking on a mountain trail under snow-capped peaks in Nepal",
    label: "Explore & Trek",
  },
  {
    desktopSrc: "/images/hero/hero-relax-desktop.jpg",
    mobileSrc: "/images/hero/hero-relax-mobile.jpg",
    alt: "Sunrise over Phewa Lake in Pokhara with colorful boats and Fishtail mountain reflection",
    label: "Live & Restore",
  },
]

const LOCATIONS = [
  { value: "all", label: "Anywhere in Nepal" },
  { value: "Kathmandu", label: "Kathmandu" },
  { value: "Pokhara", label: "Pokhara" },
  { value: "Lalitpur", label: "Lalitpur" },
  { value: "Bandipur", label: "Bandipur" },
]

const CATEGORIES = [
  { value: "workspace", label: "Workspace", icon: Building },
  { value: "stay", label: "Stay & Coliving", icon: Home },
  { value: "guide", label: "Local Guide", icon: Users },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("workspace")

  // Custom Dropdown Open States (replacing buggy native OS <select>)
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

  // Auto-slide every 6.5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(slideTimer)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setWhereOpen(false)
    setWhatOpen(false)

    if (selectedCategory === "workspace") {
      const cityQuery = selectedCity !== "all" ? `?city=${encodeURIComponent(selectedCity)}` : ""
      router.push(`/workspaces${cityQuery}`)
    } else if (selectedCategory === "stay") {
      const cityQuery = selectedCity !== "all" ? `?city=${encodeURIComponent(selectedCity)}` : ""
      router.push(`/stay${cityQuery}`)
    } else {
      const cityQuery = selectedCity !== "all" ? `?city=${encodeURIComponent(selectedCity)}` : ""
      router.push(`/guides${cityQuery}`)
    }
  }

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)

  const activeCityObj = LOCATIONS.find(l => l.value === selectedCity) || LOCATIONS[0]
  const activeCatObj = CATEGORIES.find(c => c.value === selectedCategory) || CATEGORIES[0]

  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-x-hidden bg-[#0B0B0C]">
      {/* Dynamic Background Slider */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            {/* Desktop 2K Ultra-HD 16:9 Image */}
            <div className="hidden md:block absolute inset-0">
              <Image 
                src={slide.desktopSrc} 
                alt={slide.alt} 
                fill 
                sizes="100vw"
                className="object-cover object-center transform transition-transform duration-[6500ms] ease-out"
                priority={idx === 0}
                quality={95}
              />
            </div>

            {/* Mobile Portrait HD 9:16 Image */}
            <div className="block md:hidden absolute inset-0">
              <Image 
                src={slide.mobileSrc} 
                alt={slide.alt} 
                fill 
                sizes="100vw"
                className="object-cover object-center transform transition-transform duration-[6500ms] ease-out"
                priority={idx === 0}
                quality={95}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Balanced Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B0B0C] via-black/40 to-[#0B0B0C]/60 pointer-events-none" />

      {/* Manual Slide Navigation Arrows (Desktop) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
      >
        <ChevronRight size={18} />
      </button>

      {/* Content Container (Center Aligned, Zero Horizontal Overflow) */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 sm:pb-28 text-center flex flex-col items-center">
        
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#F5B301] mb-4 bg-black/50 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full shadow-sm">
          <Compass size={13} className="text-[#F5B301]" />
          <span>The Himalayan Remote Work Ecosystem</span>
        </div>

        {/* Editorial H1 (Inter + Fraunces Italic Contrast) */}
        <h1 className="tracking-tight text-center drop-shadow-md mb-4 sm:mb-5 max-w-3xl">
          <span className="block font-bold text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.08]">
            Digital Nomads in Nepal
          </span>
          <span className="block font-serif italic font-normal text-2xl sm:text-4xl lg:text-5xl text-[#F5B301] mt-1 sm:mt-2 leading-[1.15]">
            Live, Work &amp; Explore
          </span>
        </h1>

        {/* Supporting Text: Regular 400 weight */}
        <p className="text-sm sm:text-base text-gray-200 font-normal leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10 drop-shadow-sm text-center">
          Verified coworking spaces, high-speed fiber stays, and licensed guides across Kathmandu, Pokhara &amp; the Himalayas.
        </p>

        {/* Segmented Search Bar (Custom Non-Native Dropdowns · No Mobile Overflow) */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl mx-auto bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-left"
        >
          {/* Segment 1: WHERE Custom Dropdown */}
          <div ref={whereRef} className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setWhereOpen(!whereOpen)
                setWhatOpen(false)
              }}
              className="w-full text-left px-3.5 py-2 sm:py-1 rounded-xl sm:rounded-full hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors flex items-center justify-between group"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-0.5">
                  Where
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {activeCityObj.label}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 shrink-0 ${
                  whereOpen ? "rotate-180 text-[#F5B301]" : ""
                }`}
              />
            </button>

            {/* Custom Popover (Contained within viewport, zero overflow) */}
            {whereOpen && (
              <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-64 mt-2 bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5">
                  Select Destination
                </div>
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
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-[#F5B301]/15 text-[#B45309] dark:text-[#F5B301]"
                          : "text-gray-800 dark:text-gray-200 hover:bg-[#FAF7F2] dark:hover:bg-[#1C1C1F]"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <MapPin size={13} className={isSelected ? "text-[#F5B301]" : "text-gray-400"} />
                        <span className="truncate">{loc.label}</span>
                      </span>
                      {isSelected && <Check size={14} className="text-[#F5B301] shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Divider (Desktop Only) */}
          <div className="hidden sm:block w-[1px] h-8 bg-gray-200 dark:bg-[#26262A]" />

          {/* Segment 2: WHAT Custom Dropdown */}
          <div ref={whatRef} className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setWhatOpen(!whatOpen)
                setWhereOpen(false)
              }}
              className="w-full text-left px-3.5 py-2 sm:py-1 rounded-xl sm:rounded-full hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors flex items-center justify-between group"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-0.5">
                  What
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {activeCatObj.label}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 shrink-0 ${
                  whatOpen ? "rotate-180 text-[#F5B301]" : ""
                }`}
              />
            </button>

            {/* Custom Popover (Contained within viewport, zero overflow) */}
            {whatOpen && (
              <div className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-60 mt-2 bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5">
                  Select Category
                </div>
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
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-[#F5B301]/15 text-[#B45309] dark:text-[#F5B301]"
                          : "text-gray-800 dark:text-gray-200 hover:bg-[#FAF7F2] dark:hover:bg-[#1C1C1F]"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon size={13} className={isSelected ? "text-[#F5B301]" : "text-gray-400"} />
                        <span className="truncate">{cat.label}</span>
                      </span>
                      {isSelected && <Check size={14} className="text-[#F5B301] shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Search Button (Full width on small phones, pill on desktop) */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#F5B301] hover:bg-[#E0A200] active:scale-95 text-[#1A1A1C] font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-xl sm:rounded-full transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0 mt-1 sm:mt-0"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Secondary Shortcuts (Clean Text Links Under Search) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 text-xs sm:text-sm font-semibold text-gray-300">
          <Link
            href="/workspaces"
            className="hover:text-[#F5B301] transition-colors inline-flex items-center gap-1 group py-1"
          >
            <span>Workspaces</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <span className="text-gray-600 select-none">•</span>

          <Link
            href="/stay"
            className="hover:text-[#F5B301] transition-colors inline-flex items-center gap-1 group py-1"
          >
            <span>Stays &amp; coliving</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <span className="text-gray-600 select-none">•</span>

          <Link
            href="/guides"
            className="hover:text-[#F5B301] transition-colors inline-flex items-center gap-1 group py-1"
          >
            <span>Local guides</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Slider Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 z-20">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                currentSlide === idx
                  ? "w-7 bg-[#F5B301] shadow-md shadow-[#F5B301]/40"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Switch to slide ${idx + 1}: ${slide.label}`}
              title={slide.label}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
