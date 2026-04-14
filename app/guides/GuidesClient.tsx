"use client"
import { useState, useMemo } from "react"
import Link from "next/link"

const LOCATIONS = ["All Cities", "Kathmandu", "Pokhara", "Bandipur", "Chitwan", "Lumbini", "Nagarkot", "Mustang"]
const ALL_SPECIALTIES = ["All", "Trekking", "Foodie", "History", "Photography", "Cultural", "Wildlife", "Adventure", "Yoga & Wellness", "Day Trips"]

type Guide = {
  id: string; name: string; bio: string; location: string
  specialties: string[]; photoUrl: string | null
  isVerified: boolean; avgRating: number; totalReviews: number
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-primary fill-primary" : "text-border fill-border"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
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
      const matchCity = city === "All Cities" || g.location === city
      const matchSpec = specialty === "All" || g.specialties.includes(specialty)
      const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.bio.toLowerCase().includes(search.toLowerCase())
      return matchCity && matchSpec && matchSearch
    })
  }, [guides, city, specialty, search])

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search guides by name or expertise..."
          className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted"
        />
        <select value={city} onChange={e => setCity(e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={specialty} onChange={e => setSpecialty(e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          {ALL_SPECIALTIES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg font-semibold mb-2">No guides found</p>
          <p className="text-sm">Try adjusting your filters, or <Link href="/guides/register" className="text-primary">register as a guide</Link>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(guide => (
            <Link key={guide.id} href={`/guides/${guide.id}`}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group block">
              {/* Photo */}
              <div className="h-48 bg-gradient-to-br from-border to-card flex items-center justify-center relative">
                {guide.photoUrl ? (
                  <img src={guide.photoUrl} alt={guide.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-black">
                    {guide.name[0]}
                  </div>
                )}
                {guide.isVerified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    ✓ Himalayan Verified
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{guide.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted mt-1 mb-3">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  {guide.location}
                </div>
                <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">{guide.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {guide.specialties.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">#{s}</span>
                  ))}
                  {guide.specialties.length > 3 && (
                    <span className="text-[10px] font-semibold px-2 py-1 bg-border text-muted rounded-full">+{guide.specialties.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={guide.avgRating} />
                    <span className="text-xs text-muted">{guide.avgRating.toFixed(1)} ({guide.totalReviews})</span>
                  </div>
                  <span className="text-xs font-semibold text-primary">View Profile →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
