"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Laptop, BookOpen, ArrowRight, Sparkles } from "lucide-react"
import TrekkingGuideIcon from "./TrekkingGuideIcon"

const HERO_SLIDES = [
  {
    src: "/heroslider1.png",
    alt: "Digital nomad working remotely at a scenic cafe balcony overlooking the Himalayas in Nepal",
    label: "Work & Connect",
  },
  {
    src: "/heroslider2.png",
    alt: "Trekkers hiking on a mountain trail under snow-capped peaks in Nepal",
    label: "Explore & Trek",
  },
  {
    src: "/heroslider3.png",
    alt: "Sunrise meditation and yoga overlooking Himalayan peaks and prayer flags",
    label: "Live & Restore",
  },
]

const keywords = [
  "workspaces in Kathmandu",
  "stays in Pokhara",
  "coliving in Mustang",
  "high-speed fiber cafes",
  "licensed mountain guides",
  "Jhamsikhel hubs",
  "Lakeside nomad villas",
  "24/7 power backup hubs"
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
    if (subIdx === keywords[wordIdx].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1500)
      return () => clearTimeout(timeout)
    }

    if (subIdx === 0 && isDeleting) {
      setIsDeleting(false)
      setWordIdx(prev => (prev + 1) % keywords.length)
      return
    }

    const timeout = setTimeout(() => {
      setPlaceholder(keywords[wordIdx].substring(0, subIdx + (isDeleting ? -1 : 1)))
      setSubIdx(prev => prev + (isDeleting ? -1 : 1))
    }, isDeleting ? 40 : 100)

    return () => clearTimeout(timeout)
  }, [subIdx, isDeleting, wordIdx])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/resources/coworking?search=${encodeURIComponent(query.trim())}`)
  }

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Slider (heroslider 1, 2, 3) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image 
              src={slide.src} 
              alt={slide.alt} 
              fill 
              sizes="100vw"
              className="object-cover object-center transform transition-transform duration-[6000ms] ease-out"
              priority={idx === 0}
              quality={90}
            />
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

      {/* Adaptive Gradient Overlay for text readability and smooth transition into page */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-black/55 to-black/35 dark:from-[#0B0B0B] dark:via-black/60 dark:to-black/35" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center py-16 md:py-24">
        
        {/* H1 */}
        <h1 className="tracking-tight drop-shadow-xl mb-3 sm:mb-4 text-center max-w-4xl mx-auto">
          <span className="block font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
            Digital Nomads in Nepal
          </span>
          <span className="block font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mt-1.5 sm:mt-2 leading-tight">
            Live, Work &amp; Explore
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-sm sm:text-base md:text-lg text-gray-200 font-medium drop-shadow-md max-w-2xl mb-6 px-2 leading-relaxed">
          The definitive guide &amp; verified directory for remote workers, freelancers, and adventurers across Nepal.
        </p>

        {/* Search Bar for Workspaces, Stays, Guides */}
        <form onSubmit={handleSearch} className="w-full max-w-lg mb-6 px-2 relative group z-30">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-yellow-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative flex items-center bg-white/95 dark:bg-black/85 backdrop-blur border border-gray-200 dark:border-white/10 rounded-full p-1.5 focus-within:border-primary shadow-lg transition-colors">
            <Search className="text-gray-400 dark:text-muted w-4 h-4 ml-4 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-search-modal"))
                }
              }}
              placeholder={`Search workspaces, stays, guides... (${placeholder || 'e.g. Pokhara'})`}
              className="w-full bg-transparent border-0 text-gray-900 dark:text-white text-xs sm:text-sm pl-3 pr-4 py-2.5 focus:outline-none placeholder:text-gray-500 cursor-pointer"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-yellow-500 text-black font-black text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Access (Two distinct intent cards: WORK & EXPLORE) */}
        <div className="w-full max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6 px-2">
          {/* Card 1: WORK INTENT */}
          <Link
            href="/workspaces"
            className="group relative flex flex-col justify-between text-left p-4 sm:p-5 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 hover:border-[#FFD400]/80 transition-all duration-300 shadow-xl hover:shadow-[0_12px_32px_rgba(255,212,0,0.18)] hover:-translate-y-1 overflow-hidden"
          >
            {/* Ambient hover light */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FFD400]/10 rounded-full blur-2xl group-hover:bg-[#FFD400]/25 transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-[#FFD400] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFD400] group-hover:text-black transition-all duration-300 shadow-xs">
                  <Laptop size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/30 shadow-xs">
                  Work
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#FFD400] transition-colors mt-3">
                Find Workspaces
              </h2>
              <p className="text-xs text-gray-300/90 mt-1 leading-snug line-clamp-2">
                Verified fiber Wi-Fi, ergonomic desks &amp; 24/7 power backup.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD400] mt-3.5 pt-2.5 border-t border-white/10 group-hover:border-[#FFD400]/30 transition-colors">
              <span>Explore 50+ Hubs</span>
              <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>
          </Link>

          {/* Card 2: EXPLORE INTENT */}
          <Link
            href="/guides"
            className="group relative flex flex-col justify-between text-left p-4 sm:p-5 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 hover:border-emerald-400/80 transition-all duration-300 shadow-xl hover:shadow-[0_12px_32px_rgba(52,211,153,0.18)] hover:-translate-y-1 overflow-hidden"
          >
            {/* Ambient hover light */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/25 transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-black transition-all duration-300 shadow-xs">
                  <TrekkingGuideIcon size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 shadow-xs">
                  Explore
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors mt-3">
                Find Trekking Guides
              </h2>
              <p className="text-xs text-gray-300/90 mt-1 leading-snug line-clamp-2">
                Licensed Himalayan mountain leaders, Sherpas &amp; local fixers.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mt-3.5 pt-2.5 border-t border-white/10 group-hover:border-emerald-400/30 transition-colors">
              <span>Meet Local Guides</span>
              <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>
          </Link>
        </div>

        {/* Content CTA: Read the Blog Guides */}
        <div className="flex items-center justify-center w-full">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#FFD400] via-[#FFE033] to-[#FFC700] hover:from-[#FFE033] hover:to-[#FFD400] text-black font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-[#FFD400]/25 hover:shadow-[#FFD400]/45 hover:scale-105 active:scale-95 transition-all border border-amber-300/60"
          >
            <BookOpen size={16} className="text-black" />
            <span>Read the Blog Guides</span>
            <ArrowRight size={14} className="text-black group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Line */}
        <p className="mt-6 text-gray-400 text-xs sm:text-sm font-medium tracking-wide">
          ✨ Trusted by 2,000+ digital nomads living and working in Nepal.
        </p>

        {/* Slider Indicator Dots */}
        <div className="flex items-center gap-2 mt-4 z-20">
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

      {/* Curved Arch Edge SVG mask at the bottom smoothly transitioning into the theme */}
      <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden leading-none pointer-events-none translate-y-[2px] text-background">
        <svg className="relative block w-[calc(100%+5px)] h-[50px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  )
}
