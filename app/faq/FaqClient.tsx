"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronDown, Check, HelpCircle, ArrowRight, Compass, Building, CalendarCheck } from "lucide-react"
import { ALL_FAQS, FaqItem } from "@/lib/faqs"
import TrekkingGuideIcon from "@/components/TrekkingGuideIcon"

const CATEGORIES = [
  "All",
  "General & Lifestyle",
  "Visa & Legal",
  "Internet & Tech",
  "Cost & Budget",
  "Destinations & Workspaces",
  "Banking & Money",
  "Trekking & Guides"
] as const

type CategoryType = (typeof CATEGORIES)[number]

export default function FaqClient() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["who-is-digital-nomad", "tourist-visa-duration-remote-work"]))

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory

      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    setOpenIds(new Set(filteredFaqs.map((f) => f.id)))
  }

  const collapseAll = () => {
    setOpenIds(new Set())
  }

  return (
    <div className="w-full">
      {/* Search Bar & Stats */}
      <div className="max-w-3xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any question (e.g. visa, wifi, cost of living, sim card, guide)..."
            className="w-full pl-11 pr-10 py-3.5 bg-card border border-border focus:border-[#FFD400] dark:focus:border-[#FFD400] rounded-2xl text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FFD400] text-black shadow-xs font-bold"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Counter & Expand / Collapse Controls */}
        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredFaqs.length}</strong> questions
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Expand all
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Google PAA List */}
      <div className="max-w-3xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-3">
            <HelpCircle size={36} className="mx-auto text-muted-foreground opacity-60" />
            <h3 className="text-base font-bold text-foreground">No questions found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find an exact match for &quot;{searchQuery}&quot;. Try searching for &quot;visa&quot;, &quot;wifi&quot;, &quot;rent&quot;, or browse our categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
              className="mt-2 px-4 py-2 bg-primary text-black font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-[#222222]">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.has(faq.id)
              return (
                <div key={faq.id} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-3.5 sm:py-4 flex items-center justify-between gap-4 text-left cursor-pointer group focus:outline-none select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[15px] sm:text-[16px] text-gray-900 dark:text-gray-100 font-normal group-hover:text-[#B45309] dark:group-hover:text-[#FFD400] transition-colors leading-snug">
                      {faq.question}
                    </span>

                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "bg-gray-200 dark:bg-[#282828] text-gray-900 dark:text-white rotate-180"
                          : "bg-gray-100 dark:bg-[#181818] text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-[#222222]"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-4 pt-0 pr-6 sm:pr-10 text-[14px] sm:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                      <p>{faq.answer}</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1a1a] px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                        {faq.googleSearchVolume && (
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                            {faq.googleSearchVolume} search intent
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Helpful Navigation Cards */}
      <div className="max-w-3xl mx-auto mt-16 pt-10 border-t border-gray-200 dark:border-[#222222]">
        <h3 className="text-base font-bold text-foreground mb-4">
          Explore More Resources for Nomads in Nepal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/workspaces"
            className="p-4 rounded-2xl bg-card border border-border hover:border-[#FFD400] transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:bg-primary group-hover:text-black transition-colors">
              <Building size={16} />
            </div>
            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
              Coworking Spaces
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              High-speed Wi-Fi, desks &amp; meeting rooms in Kathmandu &amp; Pokhara.
            </p>
          </Link>

          <Link
            href="/guides"
            className="p-4 rounded-2xl bg-card border border-border hover:border-[#FFD400] transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:bg-primary group-hover:text-black transition-colors">
              <TrekkingGuideIcon size={16} />
            </div>
            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
              Trekking &amp; Local Guides
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              Hire verified licensed mountain guides and cultural fixers.
            </p>
          </Link>

          <Link
            href="/practical-guides"
            className="p-4 rounded-2xl bg-card border border-border hover:border-[#FFD400] transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:bg-primary group-hover:text-black transition-colors">
              <Compass size={16} />
            </div>
            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
              Practical Guides
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              Deep dives on visas, SIM cards, cost of living &amp; transportation.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
