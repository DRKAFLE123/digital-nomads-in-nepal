"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

const keywords = [
  "Kathmandu",
  "Pokhara",
  "backup generator",
  "fiber internet",
  "Lakeside cafes",
  "meeting rooms",
  "Jhamsikhel workspaces",
  "Thamel hubs"
]

export default function HeroSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const [placeholder, setPlaceholder] = useState("")
  const [wordIdx, setWordIdx] = useState(0)
  const [subIdx, setSubIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

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

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0B]">
      {/* Mountain Peak Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png" 
          alt="Cinematic Himalayan Mountain Peak in Nepal" 
          fill 
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Dark Overlay for text readability (matches the image's deep navy/black overlay design seamlessly) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B0B0B] via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center py-16 md:py-24">
        
        {/* H1 */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-xl mb-4">
          Live and Work in Nepal<br className="hidden sm:block" />{" "}
          <span className="text-primary">on a Nomad Visa</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium drop-shadow-md max-w-2xl mb-2 px-2">
          Cost of living, visa, internet, and the best cities to live and work remotely in Nepal.
        </p>

        {/* Extra SEO Line */}
        <p className="text-xs sm:text-sm text-primary/90 font-medium drop-shadow mb-6 tracking-wide px-2">
          Guides for digital nomads in Kathmandu, Pokhara, and across Nepal.
        </p>

        {/* Search Bar for Coworking Spaces / Workplaces */}
        <form onSubmit={handleSearch} className="w-full max-w-lg mb-8 px-2 relative group z-30">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-yellow-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative flex items-center bg-black/80 backdrop-blur border border-white/10 rounded-full p-1.5 focus-within:border-primary transition-colors">
            <Search className="text-muted w-4 h-4 ml-4 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search workspaces (e.g. ${placeholder})`}
              className="w-full bg-transparent border-0 text-white text-xs sm:text-sm pl-3 pr-4 py-2.5 focus:outline-none placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-yellow-500 text-black font-black text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap"
            >
              Search Hubs
            </button>
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center w-full">
          {/* Read the Blog CTA */}
          <Link
            href="/blog"
            className="bg-primary text-black font-black px-8 py-3.5 sm:py-4 rounded-full transition-all transform hover:scale-105 hover:bg-white hover:shadow-xl text-base sm:text-lg text-center shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          >
            Read the Blog Guides →
          </Link>
        </div>

        {/* Trust Line — hidden on very small screens to reduce clutter */}
        <p className="hidden sm:block mt-8 text-gray-400 text-sm italic font-medium tracking-wide">
          Join thousands of digital nomads already working remotely from Nepal.
        </p>
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
