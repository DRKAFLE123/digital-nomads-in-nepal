/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, MapPin, ChevronDown, X, Star } from "lucide-react"

const LOCATIONS = ["All Cities", "Kathmandu", "Pokhara", "Bandipur", "Chitwan", "Lumbini", "Nagarkot", "Mustang"]
const ALL_SPECIALTIES = ["All", "Trekking", "Foodie", "History", "Photography", "Cultural", "Wildlife", "Adventure", "Yoga & Wellness", "Day Trips"]

type Guide = {
  id: string
  name: string
  bio: string
  location: string
  specialties: string[]
  photoUrl: string | null
  isVerified: boolean
  avgRating: number
  totalReviews: number
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </div>
  )
}

export default function GuidesClient({ guides }: { guides: Guide[] }) {
  const [city, setCity] = useState("All Cities")
  const [specialty, setSpecialty] = useState("All")
  const [search, setSearch] = useState("")

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

  const hasActiveFilters = city !== "All Cities" || specialty !== "All" || search.trim() !== ""

  const handleResetFilters = () => {
    setCity("All Cities")
    setSpecialty("All")
    setSearch("")
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

      {/* Specialty Filter Chips: Single Horizontal Swipe on Mobile */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Specialty ({filtered.length} {filtered.length === 1 ? "guide" : "guides"})
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

      {/* Guide Cards Grid */}
      {filtered.length === 0 ? (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(guide => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50 transition-all group block active:scale-[0.99]"
            >
              {/* Photo & Badges */}
              <div className="h-44 sm:h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
                {guide.photoUrl ? (
                  <img
                    src={guide.photoUrl}
                    alt={guide.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-2xl sm:text-3xl font-black">
                    {guide.name[0]}
                  </div>
                )}
                {guide.isVerified && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    ✓ Himalayan Verified
                  </div>
                )}
                <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <MapPin size={11} className="text-amber-400" />
                  <span>{guide.location}</span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-foreground text-base sm:text-lg group-hover:text-blue-600 transition-colors leading-snug">
                    {guide.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md text-xs font-bold text-amber-900">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{guide.avgRating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-muted text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
                  {guide.bio}
                </p>

                {/* Specialties Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {guide.specialties.slice(0, 3).map(s => (
                    <span
                      key={s}
                      className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full"
                    >
                      #{s}
                    </span>
                  ))}
                  {guide.specialties.length > 3 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                      +{guide.specialties.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                  <div className="flex items-center gap-1 text-muted text-[11px]">
                    <StarDisplay rating={guide.avgRating} />
                    <span className="ml-1">({guide.totalReviews})</span>
                  </div>
                  <span className="font-bold text-foreground group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1">
                    <span>View Profile</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
