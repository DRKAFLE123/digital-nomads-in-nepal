"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ChevronDown, ArrowRight, Compass } from "lucide-react"

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
  { value: "workspace", label: "Workspace" },
  { value: "stay", label: "Stay & Coliving" },
  { value: "guide", label: "Local Guide" },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("workspace")
  const router = useRouter()

  // Auto-slide every 6.5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(slideTimer)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
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

  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0C]">
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

      {/* Balanced Vignette Overlay: clear mountain center with soft dissolves top and bottom */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B0B0C] via-black/40 to-[#0B0B0C]/60" />
      <div className="absolute inset-0 z-10 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

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

      {/* Content Container (Perfect Center Alignment, max-w-4xl) */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 sm:pb-28 text-center flex flex-col items-center">
        
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#F5B301] mb-4 bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full shadow-sm">
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

        {/* Supporting Text: Regular 400 weight, max 70 chars */}
        <p className="text-sm sm:text-base text-gray-200 font-normal leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10 drop-shadow-sm text-center">
          Verified coworking spaces, high-speed fiber stays, and licensed guides across Kathmandu, Pokhara &amp; the Himalayas.
        </p>

        {/* Segmented Search Bar (Where / What / Search) */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl mx-auto bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-2 text-left"
        >
          {/* Segment 1: WHERE */}
          <div className="flex-1 px-3 sm:px-4 py-1 flex flex-col justify-center">
            <label htmlFor="hero-where" className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-0.5">
              Where
            </label>
            <div className="relative flex items-center">
              <select
                id="hero-where"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none appearance-none pr-5 cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value} className="bg-white dark:bg-[#141416] text-gray-900 dark:text-white">
                    {loc.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-0 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Divider (Desktop) */}
          <div className="hidden sm:block w-[1px] h-8 bg-gray-200 dark:bg-[#26262A]" />

          {/* Segment 2: WHAT */}
          <div className="flex-1 px-3 sm:px-4 py-1 flex flex-col justify-center">
            <label htmlFor="hero-what" className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-0.5">
              What
            </label>
            <div className="relative flex items-center">
              <select
                id="hero-what"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none appearance-none pr-5 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-white dark:bg-[#141416] text-gray-900 dark:text-white">
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-0 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Single Primary Yellow Button for Hero */}
          <button
            type="submit"
            className="bg-[#F5B301] hover:bg-[#E0A200] active:scale-95 text-[#1A1A1C] font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-xl sm:rounded-full transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Secondary Shortcuts (Clean Text Links Under Search) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 text-xs sm:text-sm font-semibold text-gray-300">
          <Link
            href="/workspaces"
            className="hover:text-[#F5B301] transition-colors inline-flex items-center gap-1 group"
          >
            <span>Workspaces</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <span className="text-gray-600 select-none">•</span>

          <Link
            href="/stay"
            className="hover:text-[#F5B301] transition-colors inline-flex items-center gap-1 group"
          >
            <span>Stays &amp; coliving</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <span className="text-gray-600 select-none">•</span>

          <Link
            href="/guides"
            className="hover:text-[#F5B301] transition-colors inline-flex items-center gap-1 group"
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
