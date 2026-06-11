"use client"
import { useState, useMemo } from "react"
import Link from "next/link"

export type Partner = {
  name: string
  category: "Remote Jobs" | "Insurance" | "Coworking" | "Destination" | "Adventure" | "Banking"
  location: string
  description: string
  tags: string[]
  discount?: string
  priority?: boolean
}

const CATEGORIES = ["All", "Remote Jobs", "Insurance", "Coworking", "Destination", "Adventure", "Banking"]

export default function PartnersClient({ partners }: { partners: Partner[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    partners.forEach(p => p.tags.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [partners])

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const categoryMatch = selectedCategory === "All" || p.category === selectedCategory
      const tagMatch = !activeTag || p.tags.includes(activeTag)
      return categoryMatch && tagMatch
    })
  }, [partners, selectedCategory, activeTag])

  return (
    <div className="space-y-12">
      {/* Search & Filters */}
      <div className="space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setActiveTag(null); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                selectedCategory === cat 
                  ? "bg-primary text-black border-primary shadow-lg shadow-primary/20" 
                  : "bg-card border-border text-muted hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted/60">Quick Search #tags:</span>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-md transition-all ${
                activeTag === tag 
                  ? "bg-[#FFD700] text-black font-bold scale-110" 
                  : "bg-muted/10 text-muted hover:bg-muted/20"
              }`}
            >
              #{tag}
            </button>
          ))}
          {activeTag && (
            <button onClick={() => setActiveTag(null)} className="text-[10px] text-primary hover:underline ml-2">Clear filter</button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.length > 0 ? (
          filteredPartners.map((partner) => (
            <div 
              key={partner.name} 
              className={`bg-card border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden ${
                partner.priority ? "border-primary/30" : "border-border"
              }`}
            >
              {partner.priority && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-black text-[9px] font-black uppercase px-3 py-1 rounded-bl-lg transform">Featured</div>
                </div>
              )}

              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">
                  {partner.category}
                </span>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {partner.name}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-muted text-xs mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {partner.location}
              </div>

              <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-3">
                {partner.description}
              </p>

              {partner.discount && (
                <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">🎁</span>
                  <div>
                    <div className="text-[10px] font-bold text-primary uppercase leading-none mb-1">Exclusive Discount</div>
                    <div className="text-sm font-bold text-foreground">{partner.discount}</div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
                {partner.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border transition-colors ${
                      activeTag === tag 
                        ? "bg-[#FFD700] text-black border-[#FFD700]" 
                        : "bg-background border-border text-muted hover:border-primary/50"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted mb-2 text-lg">No partners found matching these filters.</p>
            <button onClick={() => { setSelectedCategory("All"); setActiveTag(null); }} className="text-primary hover:underline">Clear all filters</button>
          </div>
        )}
      </div>

      {/* Become a Partner CTA */}
      <section className="relative mt-24 group overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]" />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        
        <div className="relative p-10 md:p-16 border border-primary/20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Scale Your Brand
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 max-w-3xl leading-tight">
            Partner with the #1 Nomad Platform in Nepal
          </h2>
          
          <p className="text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Put your brand in front of 10,000+ digital nomads, remote workers, and adventurers. 
            From software to gear, let&apos;s build the Himalayan nomad ecosystem together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/contact?subject=Partnership" 
              className="px-10 py-5 bg-primary text-black font-black text-lg rounded-full shadow-2xl shadow-primary/20 hover:bg-white hover:text-black hover:scale-105 transition-all"
            >
              Become a Partner →
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-border/50 pt-10 w-full">
            {[
              { label: "Reach", val: "10k+" },
              { label: "Engaged Hubs", val: "15+" },
              { label: "Guide Network", val: "100+" },
              { label: "Community", val: "Global" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-primary">{stat.val}</div>
                <div className="text-[10px] font-bold uppercase text-muted tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
