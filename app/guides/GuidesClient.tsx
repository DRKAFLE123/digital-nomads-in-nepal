/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Star, 
  Globe, 
  Briefcase, 
  ArrowUpDown,
  Check
} from "lucide-react"

const LOCATIONS = ["All Cities", "Kathmandu", "Pokhara", "Bandipur", "Chitwan", "Lumbini", "Nagarkot", "Mustang"]
const ALL_SPECIALTIES = ["All", "Trekking", "Foodie", "History", "Photography", "Cultural", "Wildlife", "Adventure", "Yoga & Wellness", "Day Trips"]

export type Guide = {
  id: string
  name: string
  tagline?: string | null
  bio: string
  location: string
  specialties: string[]
  photoUrl: string | null
  languages?: string[] | any
  experienceYears?: number | null
  licensedSince?: number | null
  isVerified: boolean
  avgRating: number
  totalReviews: number
  createdAt?: string | Date
}

type SortOption = "top-rated" | "recent" | "experienced"

const SORT_LABELS: Record<SortOption, string> = {
  "top-rated": "Top Rated",
  "recent": "Recently Added",
  "experienced": "Most Experienced",
}

export default function GuidesClient({ guides }: { guides: Guide[] }) {
  const [city, setCity] = useState("All Cities")
  const [specialty, setSpecialty] = useState("All")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("top-rated")
  const [sortOpen, setSortOpen] = useState(false)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filtered = useMemo(() => {
    return guides.filter(g => {
      const matchCity = city === "All Cities" || g.location.toLowerCase() === city.toLowerCase()
      const matchSpec = specialty === "All" || g.specialties.some(s => s.toLowerCase() === specialty.toLowerCase())
      const matchSearch =
        !search ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.bio.toLowerCase().includes(search.toLowerCase()) ||
        g.location.toLowerCase().includes(search.toLowerCase()) ||
        g.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
      return matchCity && matchSpec && matchSearch
    })
  }, [guides, city, specialty, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "top-rated") {
        if ((b.avgRating || 0) !== (a.avgRating || 0)) return (b.avgRating || 0) - (a.avgRating || 0)
        return (b.totalReviews || 0) - (a.totalReviews || 0)
      }
      if (sortBy === "experienced") {
        const expA = a.experienceYears || (a.licensedSince ? 2026 - a.licensedSince : 5)
        const expB = b.experienceYears || (b.licensedSince ? 2026 - b.licensedSince : 5)
        return expB - expA
      }
      if (sortBy === "recent") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      }
      return 0
    })
  }, [filtered, sortBy])

  const hasActiveFilters = city !== "All Cities" || specialty !== "All" || search.trim() !== ""

  const handleResetFilters = () => {
    setCity("All Cities")
    setSpecialty("All")
    setSearch("")
    setSortBy("top-rated")
  }

  return (
    <>
      {/* Mobile-Optimized Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, trek, specialty..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-9 py-2.5 sm:py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-muted transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* City Selector with Native Styling Fix */}
        <div className="relative sm:w-52 shrink-0">
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full appearance-none bg-card border border-border rounded-xl pl-9 pr-9 py-2.5 sm:py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer transition-all"
          >
            {LOCATIONS.map(l => (
              <option key={l} value={l} className="bg-card text-foreground py-1.5">
                {l}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        </div>
      </div>

      {/* Specialty Filter Chips */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Specialty ({sorted.length} {sorted.length === 1 ? "guide" : "guides"})
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-slate-700 hover:text-slate-950 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Pill Row on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0">
          {ALL_SPECIALTIES.map(s => {
            const isActive = specialty === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSpecialty(s)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                {s === "All" ? "All Specialties" : `# ${s}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          GuideMeet Header Bar: Available Count & Sort By Dropdown
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-6 pt-3 border-t border-slate-200/80">
        <p className="text-sm font-extrabold text-slate-900 tracking-tight">
          {sorted.length} Available Guide{sorted.length === 1 ? "" : "s"}
        </p>

        {/* Custom GuideMeet Sort Dropdown */}
        <div className="relative" ref={sortDropdownRef}>
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:border-[#023629] dark:hover:border-[#FB923C] text-xs font-bold transition-all shadow-xs cursor-pointer"
            aria-expanded={sortOpen}
          >
            <ArrowUpDown size={13} className="text-[#C2410C] dark:text-[#FB923C]" />
            <span>
              Sort by: <strong className="font-extrabold text-slate-900 dark:text-white">{SORT_LABELS[sortBy]}</strong>
            </span>
            {sortOpen ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in zoom-in-95">
              {(["recent", "top-rated", "experienced"] as SortOption[]).map((opt) => {
                const isSelected = sortBy === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSortBy(opt)
                      setSortOpen(false)
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left transition-colors font-semibold cursor-pointer ${
                      isSelected
                        ? "text-[#023629] dark:text-[#FB923C] font-bold bg-[#023629]/5 dark:bg-[#FB923C]/10"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#023629] dark:bg-[#FB923C]" : "bg-transparent border border-slate-300 dark:border-slate-600"}`} />
                    <span>{SORT_LABELS[opt]}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Guide Cards Grid (GuideMeet 4-Column Benchmark) */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl text-muted">
          <p className="text-base font-bold text-foreground mb-1.5">No guides found</p>
          <p className="text-xs sm:text-sm max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or city filter, or register as a guide yourself.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
            <Link
              href="/guides/register"
              className="px-4 py-2 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Register as a Guide
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map(guide => {
            const langs = Array.isArray(guide.languages) && guide.languages.length > 0
              ? guide.languages.slice(0, 3).join(", ")
              : "Nepali, English"
            const expText = guide.experienceYears
              ? `${guide.experienceYears} Years Experience`
              : "10+ Years Experience"
            const sinceText = guide.licensedSince ? `, Since ${guide.licensedSince}` : ""

            return (
              <Link
                key={guide.id}
                href={`/guides/${guide.id}`}
                className="bg-white dark:bg-[#141416] border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-[#023629] dark:hover:border-[#FB923C]/60 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
              >
                {/* Soft top banner with centered circular avatar + NPL country badge */}
                <div className="pt-6 pb-2 px-5 bg-gradient-to-b from-slate-100/90 via-slate-50/50 to-white dark:from-slate-800/40 dark:via-slate-800/20 dark:to-transparent text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm bg-slate-200 dark:bg-slate-700">
                      {guide.photoUrl ? (
                        <img
                          src={guide.photoUrl}
                          alt={guide.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-600 dark:text-slate-300">
                          {guide.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {/* Country Short Code Badge (NPL) */}
                    <span 
                      className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#023629] dark:bg-white text-white dark:text-slate-950 font-black text-[9px] tracking-wider uppercase shadow-xs border-2 border-white dark:border-slate-800 leading-none select-none"
                      title="Nepal (NPL)"
                    >
                      NPL
                    </span>
                  </div>

                  {/* Guide Name & Verified Check */}
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-[#023629] dark:group-hover:text-[#FB923C] transition-colors line-clamp-1">
                      {guide.name}
                    </h3>
                    {guide.isVerified && (
                      <span className="w-4 h-4 rounded-full bg-[#023629] dark:bg-[#FB923C] text-white dark:text-slate-950 flex items-center justify-center text-[10px] flex-shrink-0" title="Verified Local Guide">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Tagline / Headline */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium min-h-[18px]">
                    {guide.tagline || `Licensed Trekking Guide in ${guide.location}`}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 mt-2">
                    <span className="text-amber-500 font-bold">★ {guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">({guide.totalReviews || 0} Reviews)</span>
                  </div>
                </div>

                {/* Info Rows */}
                <div className="px-5 pb-5 pt-2 space-y-2.5">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {/* Spoken Languages */}
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{langs}</span>
                    </div>
                    {/* Experience */}
                    <div className="flex items-center gap-2">
                      <Briefcase size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{expText}{sinceText}</span>
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {guide.specialties.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                      >
                        #{s}
                      </span>
                    ))}
                    {guide.specialties.length > 2 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                        +{guide.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Bottom Card Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                      <MapPin size={11} className="text-slate-400" />
                      {guide.location}
                    </span>
                    <span className="font-bold text-[#C2410C] dark:text-[#FB923C] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      <span>View Profile</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
