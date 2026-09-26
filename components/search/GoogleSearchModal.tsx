"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Search,
  X,
  Building,
  Compass,
  MapPin,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Home,
  Star,
} from "lucide-react"

interface SearchResultHub {
  id: string
  name: string
  slug: string
  city: string
  address: string
  spaceType?: string
  rating?: number
  priceDaily?: number
  photoUrl?: string
  isVerified?: boolean
}

interface SearchResultGuide {
  id: string
  name: string
  location: string
  bio: string
  specialties: any
  photoUrl?: string
  avgRating?: number
  totalReviews?: number
  isVerified?: boolean
}

interface SearchResultDestination {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

interface SearchResultPost {
  id: string
  title: string
  slug: string
  customUrl?: string
  excerpt: string
  category: string
  coverImage?: string
  readTime?: string
}

interface SearchResults {
  workHubs: SearchResultHub[]
  guides: SearchResultGuide[]
  destinations: SearchResultDestination[]
  posts: SearchResultPost[]
  total: number
}

const TRENDING_KEYWORDS = [
  "Pokhara Lakeside fiber internet",
  "Thamel 24/7 power backup workspaces",
  "Annapurna Base Camp trekking guide",
  "Nepal Digital Nomad Visa 2026",
  "Cost of living Kathmandu",
  "NTC vs Ncell eSIM for remote work",
  "Banthanti nomad villa",
]

const CATEGORY_TABS = [
  { id: "all", label: "All", icon: Search },
  { id: "workspaces", label: "🏢 Workspaces", icon: Building },
  { id: "guides", label: "🧭 Local Guides", icon: Compass },
  { id: "destinations", label: "🏔️ Destinations", icon: MapPin },
  { id: "posts", label: "📖 Visa & Blog", icon: BookOpen },
  { id: "stays", label: "🏡 Nomad Stays", icon: Home },
]

interface GoogleSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GoogleSearchModal({ isOpen, onClose }: GoogleSearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResults>({
    workHubs: [],
    guides: [],
    destinations: [],
    posts: [],
    total: 0,
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [mounted, setMounted] = useState(false)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof document !== "undefined") {
      const root = document.getElementById("search-modal-root") || document.body
      setPortalElement(root)
    }
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("dnin_recent_searches")
        if (stored) {
          setRecentSearches(JSON.parse(stored).slice(0, 5))
        }
      } catch (e) {
        console.error("Error reading recent searches:", e)
      }
    }
  }, [isOpen])

  // Save query to recent searches
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return
    try {
      const term = searchTerm.trim()
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== term.toLowerCase())
        const updated = [term, ...filtered].slice(0, 6)
        localStorage.setItem("dnin_recent_searches", JSON.stringify(updated))
        return updated
      })
    } catch (e) {
      console.error("Error saving recent search:", e)
    }
  }, [])

  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation()
    try {
      const updated = recentSearches.filter((t) => t !== termToRemove)
      setRecentSearches(updated)
      localStorage.setItem("dnin_recent_searches", JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }
  }

  const clearAllRecent = () => {
    setRecentSearches([])
    localStorage.removeItem("dnin_recent_searches")
  }

  // Focus input and lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    } else {
      document.body.style.overflow = ""
      setQuery("")
      setSelectedIndex(-1)
      setResults({ workHubs: [], guides: [], destinations: [], posts: [], total: 0 })
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Live Debounced Search API call
  useEffect(() => {
    if (!query.trim()) {
      setResults({ workHubs: [], guides: [], destinations: [], posts: [], total: 0 })
      setLoading(false)
      setSelectedIndex(-1)
      return
    }

    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const typeParam = activeTab === "stays" ? "all" : activeTab
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&type=${typeParam}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (err) {
        console.error("Search failed:", err)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [query, activeTab])

  // Flatten active items for keyboard navigation
  const flatItems = React.useMemo(() => {
    const list: { type: string; title: string; url: string }[] = []
    results.workHubs.forEach((h) =>
      list.push({ type: "hub", title: h.name, url: `/resources/coworking/${h.slug}` })
    )
    results.guides.forEach((g) =>
      list.push({ type: "guide", title: g.name, url: `/guides/${g.id}` })
    )
    results.destinations.forEach((d) =>
      list.push({ type: "dest", title: d.name, url: `/destinations` })
    )
    results.posts.forEach((p) =>
      list.push({ type: "post", title: p.title, url: p.customUrl || `/blog/${p.slug}` })
    )
    return list
  }, [results])

  // Handle keyboard events (ESC, Arrow keys, Enter)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1))
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && flatItems[selectedIndex]) {
          e.preventDefault()
          saveRecentSearch(query)
          router.push(flatItems[selectedIndex].url)
          onClose()
        } else if (query.trim()) {
          e.preventDefault()
          saveRecentSearch(query)
          if (activeTab === "workspaces") {
            router.push(`/resources/coworking?search=${encodeURIComponent(query)}`)
          } else if (activeTab === "guides") {
            router.push(`/guides?search=${encodeURIComponent(query)}`)
          } else {
            router.push(`/resources/coworking?search=${encodeURIComponent(query)}`)
          }
          onClose()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, flatItems, query, activeTab, onClose, router, saveRecentSearch])

  const handleSelectKeyword = (keyword: string) => {
    setQuery(keyword)
    saveRecentSearch(keyword)
    inputRef.current?.focus()
  }

  const handleItemClick = (url: string) => {
    saveRecentSearch(query || "Nepal Nomad Search")
    router.push(url)
    onClose()
  }

  if (!isOpen || !mounted || !portalElement) return null

  return createPortal(
    <div
      id="google-search-modal-overlay"
      className="fixed inset-0 z-[99999] bg-black/75 dark:bg-black/90 backdrop-blur-md flex flex-col items-center justify-start pt-3 sm:pt-10 px-2.5 sm:px-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-1 sm:my-4 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Google-Style Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-200 dark:border-[#242424] gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFD400]/15 dark:bg-[#FFD400]/20 flex items-center justify-center text-[#B45309] dark:text-[#FFD400] flex-shrink-0">
            <Search size={18} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(-1)
            }}
            placeholder="Search workspaces, trekking guides, destinations, visa..."
            className="flex-1 bg-transparent border-0 text-base sm:text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 font-medium"
          />

          {loading && (
            <div className="w-5 h-5 border-2 border-[#FFD400] border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#202020] transition-colors"
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}

          {/* Clickable Close / ESC Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-[#1C1C1C] dark:hover:bg-[#252525] border border-gray-200 dark:border-[#2D2D2D] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Close search (ESC)"
            aria-label="Close search dialog"
          >
            <X size={15} />
            <span className="hidden sm:inline text-[11px] font-mono font-bold tracking-wider">ESC</span>
          </button>
        </div>

        {/* Google-Style Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-gray-50/70 dark:bg-[#161616]/70 border-b border-gray-200 dark:border-[#242424] overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  inputRef.current?.focus()
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#FFD400] text-black shadow-xs font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-[#222222]"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Main Body: Results OR Discovery Panel */}
        <div
          ref={resultsContainerRef}
          className="max-h-[65vh] sm:max-h-[550px] overflow-y-auto p-4 sm:p-6 space-y-6"
        >
          {/* STATE 1: Live Results Available */}
          {query.trim() && results.total > 0 && (
            <div className="space-y-6">
              {/* Workspaces Group */}
              {results.workHubs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-[#222222]">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Building size={14} className="text-[#FFD400]" /> Workspaces & Coworking Hubs
                    </span>
                    <Link
                      href={`/resources/coworking?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      View all ({results.workHubs.length}) <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.workHubs.map((hub) => (
                      <div
                        key={hub.id}
                        onClick={() => handleItemClick(`/resources/coworking/${hub.slug}`)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl border border-gray-200 dark:border-[#242424] bg-white dark:bg-[#151515] hover:border-primary/50 dark:hover:border-primary/50 hover:bg-amber-50/20 dark:hover:bg-[#1A1A1A] transition-all cursor-pointer shadow-xs"
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                          {hub.photoUrl ? (
                            <Image
                              src={hub.photoUrl}
                              alt={hub.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <Building className="w-6 h-6 m-auto mt-3 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                              {hub.name}
                            </h4>
                            {hub.isVerified && (
                              <CheckCircle2 size={12} className="text-[#22C55E] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {hub.city} • {hub.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              <Zap size={10} /> 24/7 Power
                            </span>
                            {hub.priceDaily && (
                              <span className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold">
                                NPR {hub.priceDaily}/day
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guides Group */}
              {results.guides.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-[#222222]">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Compass size={14} className="text-indigo-400" /> Verified Trekking & Local Guides
                    </span>
                    <Link
                      href="/guides"
                      onClick={onClose}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      Browse Guides <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.guides.map((guide) => (
                      <div
                        key={guide.id}
                        onClick={() => handleItemClick(`/guides/${guide.id}`)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl border border-gray-200 dark:border-[#242424] bg-white dark:bg-[#151515] hover:border-indigo-500/50 hover:bg-indigo-50/10 dark:hover:bg-[#1A1A1A] transition-all cursor-pointer shadow-xs"
                      >
                        <div className="relative w-12 h-12 rounded-full bg-indigo-500/10 overflow-hidden shrink-0 border border-indigo-500/20">
                          {guide.photoUrl ? (
                            <Image
                              src={guide.photoUrl}
                              alt={guide.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Compass className="w-6 h-6 m-auto mt-3 text-indigo-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-400 transition-colors">
                              {guide.name}
                            </h4>
                            {guide.isVerified && (
                              <CheckCircle2 size={12} className="text-indigo-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {guide.location}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-amber-500 font-bold">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{guide.avgRating?.toFixed(1) || "5.0"}</span>
                            <span className="text-gray-400 font-normal">
                              ({guide.totalReviews || 12} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Destinations & Blog Posts Group */}
              {(results.destinations.length > 0 || results.posts.length > 0) && (
                <div>
                  <div className="pb-2 mb-2 border-b border-gray-100 dark:border-[#222222]">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-emerald-500" /> Destinations & Nomad Articles
                    </span>
                  </div>
                  <div className="space-y-2">
                    {results.destinations.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => handleItemClick(`/destinations`)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 dark:border-[#242424] bg-white dark:bg-[#151515] hover:border-emerald-500/50 hover:bg-emerald-50/10 dark:hover:bg-[#1A1A1A] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                            <MapPin size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {dest.name}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 uppercase">
                                Destination
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                              {dest.description || "Top destination for digital nomads in Nepal"}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-400 shrink-0 ml-2" />
                      </div>
                    ))}

                    {results.posts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleItemClick(post.customUrl || `/blog/${post.slug}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 dark:border-[#242424] bg-white dark:bg-[#151515] hover:border-amber-500/50 hover:bg-amber-50/10 dark:hover:bg-[#1A1A1A] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                            <BookOpen size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {post.title}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 uppercase">
                                {post.category || "Article"}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE 2: Query entered but no results found */}
          {query.trim() && !loading && results.total === 0 && (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1e1e1e] flex items-center justify-center m-auto text-gray-400">
                <Search size={22} />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                No direct matches for &quot;{query}&quot;
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Try searching for popular hubs like &quot;Pokhara&quot;, &quot;Kathmandu&quot;, &quot;Starlink&quot;, or click a suggested category below.
              </p>
            </div>
          )}

          {/* STATE 3: Default Initial View (No Query) */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Quick Action Navigation Cards (Find Workspace, Find Guide, Stays) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <Compass size={14} className="text-[#FFD400]" /> Fast Explorer Shortcuts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link
                    href="/resources/coworking"
                    onClick={onClose}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-[#262626] bg-gradient-to-br from-amber-50/50 to-white dark:from-[#181818] dark:to-[#121212] hover:border-primary/50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FFD400]/15 dark:bg-[#FFD400]/20 text-[#B45309] dark:text-[#FFD400] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <Building size={18} />
                    </div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-between">
                      <span>Find Workspaces</span>
                      <ArrowRight size={13} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Coworking spaces with 24/7 power backup & fiber wifi in Kathmandu & Pokhara.
                    </p>
                  </Link>

                  <Link
                    href="/guides"
                    onClick={onClose}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-[#262626] bg-gradient-to-br from-indigo-50/50 to-white dark:from-[#181818] dark:to-[#121212] hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <Compass size={18} />
                    </div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-between">
                      <span>Find Trekking Guides</span>
                      <ArrowRight size={13} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Licensed Sherpa & local experts for Annapurna, Everest & cultural tours.
                    </p>
                  </Link>

                  <Link
                    href="/stay"
                    onClick={onClose}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-[#262626] bg-gradient-to-br from-emerald-50/50 to-white dark:from-[#181818] dark:to-[#121212] hover:border-emerald-500/50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <Home size={18} />
                    </div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-between">
                      <span>Find Coliving Stays</span>
                      <ArrowRight size={13} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Curated remote-work friendly villas, homestays & monthly apartments.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Frequent / Trending Nomad Searches */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-amber-500" /> Frequent & Trending Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_KEYWORDS.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => handleSelectKeyword(keyword)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#282828] text-gray-800 dark:text-gray-200 hover:border-[#FFD400] hover:text-[#B45309] dark:hover:text-[#FFD400] transition-colors"
                    >
                      <Search size={11} className="opacity-50" />
                      <span>{keyword}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches (from localStorage) */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400" /> Recent Searches
                    </h4>
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-[#202020] rounded-xl border border-gray-200 dark:border-[#242424] overflow-hidden">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleSelectKeyword(term)}
                        className="flex items-center justify-between px-3.5 py-2.5 hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 text-xs text-gray-800 dark:text-gray-200">
                          <Clock size={13} className="text-gray-400 group-hover:text-[#FFD400] transition-colors" />
                          <span>{term}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                          aria-label={`Remove ${term}`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Keyboard Shortcut Hints */}
        <div className="px-4 sm:px-6 py-2.5 bg-gray-50 dark:bg-[#141414] border-t border-gray-200 dark:border-[#242424] flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] font-mono text-[10px]">
                ↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] font-mono text-[10px]">
                ↵
              </kbd>
              <span>select</span>
            </span>
          </div>
          <span className="font-medium text-gray-400 dark:text-gray-500">Digital Nomads Nepal Search</span>
        </div>
      </div>
    </div>,
    portalElement
  )
}
