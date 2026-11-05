"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Wifi, Zap, ShieldCheck, Users, Compass, TrendingUp } from "lucide-react"

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

const KEYWORDS = [
  "workspaces in Kathmandu",
  "coliving in Pokhara",
  "Jhamsikhel fiber cafes",
  "licensed mountain guides",
  "Lakeside nomad villas",
  "24/7 power backup hubs",
  "Nepal nomad visa guide"
]

const QUICK_TRENDING = [
  { label: "Kathmandu Hubs", href: "/workspaces?city=Kathmandu" },
  { label: "Pokhara Lakeside", href: "/workspaces?city=Pokhara" },
  { label: "Coliving Stays", href: "/stay?type=coliving" },
  { label: "Mountain Guides", href: "/guides" },
  { label: "Nomad Visa", href: "/nomad-visa-guide" },
]

export default function HeroSection() {
  const [query, setQuery] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const [placeholder, setPlaceholder] = useState("")
  const [wordIdx, setWordIdx] = useState(0)
  const [subIdx, setSubIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Auto-slide every 6 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    if (subIdx === KEYWORDS[wordIdx].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1500)
      return () => clearTimeout(timeout)
    }

    if (subIdx === 0 && isDeleting) {
      setIsDeleting(false)
      setWordIdx(prev => (prev + 1) % KEYWORDS.length)
      return
    }

    const timeout = setTimeout(() => {
      setPlaceholder(KEYWORDS[wordIdx].substring(0, subIdx + (isDeleting ? -1 : 1)))
      setSubIdx(prev => prev + (isDeleting ? -1 : 1))
    }, isDeleting ? 40 : 100)

    return () => clearTimeout(timeout)
  }, [subIdx, isDeleting, wordIdx])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open-search-modal"))
      }
      return
    }
    router.push(`/workspaces?search=${encodeURIComponent(query.trim())}`)
  }

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)

  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Slider with Art-Directed HD Images */}
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
                className="object-cover object-center transform transition-transform duration-[6000ms] ease-out"
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
                className="object-cover object-center transform transition-transform duration-[6000ms] ease-out"
                priority={idx === 0}
                quality={95}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Manual Slide Navigation Arrows (Desktop) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
      >
        <ChevronRight size={20} />
      </button>

      {/* Adaptive Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-black/50 to-black/35 dark:from-[#0B0B0B] dark:via-black/55 dark:to-black/35" />

      {/* Hero Central Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-24 pb-16 sm:py-24">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-4 shadow-md">
          <Compass size={13} className="text-[#FFD400]" />
          <span>The Himalayan Remote Work Ecosystem</span>
        </div>

        {/* H1 Title */}
        <h1 className="tracking-tight drop-shadow-xl mb-3 sm:mb-4 text-center max-w-4xl mx-auto">
          <span className="block font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
            Digital Nomads in Nepal
          </span>
          <span className="block font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mt-1 sm:mt-2 leading-tight">
            Live, Work &amp; Explore
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-gray-200 font-medium drop-shadow-md max-w-2xl mb-6 sm:mb-8 px-2 leading-relaxed">
          The verified directory and field guide for remote workers, founders, and creators living and working across Nepal.
        </p>

        {/* Primary Hero Action: Unified Search */}
        <form onSubmit={handleSearch} className="w-full max-w-xl mb-4 px-1 relative group z-30">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-yellow-400 to-amber-500 rounded-full blur-md opacity-35 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative flex items-center bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border border-gray-200 dark:border-white/15 rounded-full p-1.5 sm:p-2 focus-within:border-primary shadow-2xl transition-all">
            <Search className="text-gray-400 dark:text-gray-400 w-5 h-5 ml-3 sm:ml-4 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-search-modal"))
                }
              }}
              placeholder={placeholder ? `Search ${placeholder}...` : "Search workspaces, stays, guides, visas..."}
              className="w-full bg-transparent border-0 text-gray-900 dark:text-white text-xs sm:text-sm pl-2 sm:pl-3 pr-2 sm:pr-4 py-2 sm:py-2.5 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 cursor-pointer font-medium"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-[#FFE033] text-black font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-full uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap shadow-md cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Trending Search Suggestions */}
        <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-2 mb-8 px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300/80 flex items-center gap-1">
            <TrendingUp size={12} className="text-[#FFD400]" /> Trending:
          </span>
          {QUICK_TRENDING.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-[11px] font-semibold text-gray-200 hover:text-white bg-black/45 hover:bg-black/70 backdrop-blur-sm border border-white/15 hover:border-[#FFD400]/60 px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Minimalist Trust Features Bar (Emoji-free, Line-icon driven) */}
        <div className="w-full max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2.5 px-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-gray-300 text-[11px] sm:text-xs font-semibold shadow-lg">
          <div className="flex items-center gap-1.5">
            <Wifi size={14} className="text-[#FFD400]" />
            <span>Verified Fiber Wi-Fi</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-[#FFD400]" />
            <span>24/7 Generator Backup</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#FFD400]" />
            <span>Licensed Guides</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-[#FFD400]" />
            <span>2,400+ Nomads</span>
          </div>
        </div>

        {/* Slider Indicator Dots */}
        <div className="flex items-center gap-2 mt-6 z-20">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                currentSlide === idx
                  ? "w-8 bg-primary shadow-lg shadow-primary/30"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Switch to slide ${idx + 1}: ${slide.label}`}
              title={slide.label}
            />
          ))}
        </div>

      </div>

      {/* Curved Arch Edge SVG mask at the bottom smoothly transitioning into page background */}
      <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden leading-none pointer-events-none translate-y-[2px] text-background">
        <svg className="relative block w-[calc(100%+5px)] h-[40px] md:h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  )
}
