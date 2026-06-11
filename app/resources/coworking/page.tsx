/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Search, MapPin, CheckCircle, Star, Sparkles, Building, Loader2 } from "lucide-react"

const LOCATIONS = ["All Cities", "Kathmandu", "Pokhara", "Bandipur"]
const FACILITIES = ["All", "High-Speed Fiber", "Backup Generator", "Ergonomic Chairs", "Coffee & Tea", "Skype Booths", "Meeting Rooms"]

type Hub = {
  id: string
  name: string
  slug: string
  city: string
  description: string
  address: string
  rating: number
  totalReviews: number
  isVerified: boolean
  isPartner: boolean
  photoUrl: string | null
  facilities: string[] // parsed from Json
  priceDaily: number | null
  priceMonthly: number | null
}

export default function CoworkingDirectoryPage() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("All Cities")
  const [facility, setFacility] = useState("All")

  const loadHubs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (city !== "All Cities") params.append("city", city)
      if (facility !== "All") params.append("facility", facility)
      if (search) params.append("search", search)

      const res = await fetch(`/api/work-hubs?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setHubs(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [city, facility, search])

  useEffect(() => {
    loadHubs()
  }, [loadHubs])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
            <div>
              <span className="text-primary text-xs font-black uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">Remote Work Hubs</span>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground mt-4 leading-tight">
                Tested Coworking & Work Hubs
              </h1>
              <p className="text-muted text-base mt-2 max-w-2xl">
                Find vetted workspace partners in Nepal verified for power grid resilience, high-speed fiber internet, and nomad community vibes.
              </p>
            </div>
            <Link href="/resources/coworking/register" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD700] hover:bg-white text-black font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-yellow-500/10 active:scale-95 whitespace-nowrap">
              <Building size={16} /> Register Your Space
            </Link>
          </div>

          {/* Search and Filters panel */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 mb-10 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search spaces by name, keywords..."
                  className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted"
                />
              </div>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="bg-black border border-[#222] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[180px] cursor-pointer"
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Facility Chips */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-3">
                Filter by Vetted Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map(f => {
                  const isActive = facility === f
                  return (
                    <button
                      key={f}
                      onClick={() => setFacility(f)}
                      className={[
                        "px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 active:scale-95",
                        isActive
                          ? "bg-primary text-black border-primary font-bold shadow-md shadow-primary/10"
                          : "bg-black border-[#222] text-muted hover:border-primary/50 hover:text-primary",
                      ].join(" ")}
                    >
                      {f === "All" ? "All Amenities" : f}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Workspace listing grid */}
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : hubs.length === 0 ? (
            <div className="text-center py-24 bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl">
              <Building className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No Coworking Hubs Found</h3>
              <p className="text-muted text-sm max-w-md mx-auto">
                No spaces match your filters. Try adjusting your query or city selection, or register your workspace.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hubs.map(hub => {
                const facs = Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []
                return (
                  <Link key={hub.id} href={`/resources/coworking/${hub.slug}`} className="bg-[#0d0d0d] border border-[#1e1e1e] hover:border-primary/45 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col justify-between">
                    {/* Header Image */}
                    <div>
                      <div className="h-52 bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                        {hub.photoUrl ? (
                          <img src={hub.photoUrl} alt={hub.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <Building className="w-16 h-16 text-[#333]" />
                        )}
                        
                        {/* Verification tags */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                          {hub.isPartner && (
                            <span className="flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                              <Sparkles size={10} className="fill-black" /> System Partner
                            </span>
                          )}
                          {hub.isVerified && (
                            <span className="flex items-center gap-1 bg-green-500 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                              <CheckCircle size={10} className="fill-black" /> Vetted WorkHub
                            </span>
                          )}
                        </div>

                        {/* Price badge */}
                        {(hub.priceMonthly || hub.priceDaily) && (
                          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur border border-[#333] px-3 py-1.5 rounded-lg text-xs font-extrabold text-primary">
                            {hub.priceMonthly ? `$${hub.priceMonthly}/mo` : `$${hub.priceDaily}/day`}
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-6">
                        <div className="flex items-center gap-1.5 text-xs text-primary font-bold mb-2 uppercase tracking-wide">
                          <MapPin size={12} />
                          {hub.city}
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {hub.name}
                        </h3>
                        <p className="text-muted text-xs mt-1 leading-relaxed line-clamp-1 mb-4">
                          📍 {hub.address}
                        </p>
                        <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-6">
                          {hub.description}
                        </p>

                        {/* Facilities subset */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {facs.slice(0, 3).map(f => (
                            <span key={f} className="text-[10px] font-bold px-2.5 py-1 bg-white/5 text-gray-300 rounded-md border border-white/5">
                              {f}
                            </span>
                          ))}
                          {facs.length > 3 && (
                            <span className="text-[10px] font-bold px-2 py-1 bg-white/5 text-gray-500 rounded-md border border-white/5">
                              +{facs.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer strip */}
                    <div className="px-6 py-4 border-t border-[#1e1e1e] flex items-center justify-between bg-black/40">
                      <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span>{hub.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted font-normal">({hub.totalReviews} reviews)</span>
                      </div>
                      <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore & Book →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
