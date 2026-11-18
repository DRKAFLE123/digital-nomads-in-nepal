"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "@/components/ImageWithFallback"
import {
  Building2,
  MapPin,
  Eye,
  MessageSquare,
  CalendarCheck,
  Edit3,
  ExternalLink,
  MoreVertical,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders
} from "lucide-react"

export interface HubCardData {
  id: string
  name: string
  slug: string
  city: string
  address: string
  description?: string
  spaceType: string
  priceDaily?: number | null
  priceMonthly?: number | null
  openingHours?: string | null
  photoUrl?: string | null
  contactEmail: string
  website?: string | null
  published?: boolean
  ownerEmail?: string | null
  ownerName?: string | null
  facilities: string[]
  bookings: any[]
}

interface HostListingsSectionProps {
  hubs: HubCardData[]
  enquiriesCountByHub?: Record<string, number>
  isFullPage?: boolean
  onEditHub: (hub: HubCardData) => void
  onTogglePublished?: (hubId: string, currentPublished: boolean) => void
  onNavigateAvailability?: () => void
  onViewAll?: () => void
  onAddNew?: () => void
}

export function getListingOfferingType(hub: HubCardData): "Work" | "Stay" | "Work + Stay" {
  const type = (hub.spaceType || "").toLowerCase()
  const facs = (hub.facilities || []).map((f) => String(f).toLowerCase())
  if (type.includes("coliving") || type.includes("stay & work") || facs.some((f) => f.includes("coliving") || f.includes("workation"))) {
    return "Work + Stay"
  }
  if (type.includes("hotel") || type.includes("hostel") || type.includes("apartment") || type.includes("villa") || type.includes("stay")) {
    return "Stay"
  }
  return "Work"
}

export default function HostListingsSection({
  hubs,
  enquiriesCountByHub = {},
  isFullPage = false,
  onEditHub,
  onTogglePublished,
  onNavigateAvailability,
  onViewAll,
  onAddNew
}: HostListingsSectionProps) {
  const [filter, setFilter] = useState<"ALL" | "LIVE" | "DRAFT">("ALL")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const liveCount = hubs.filter((h) => h.published !== false).length
  const draftCount = hubs.filter((h) => h.published === false).length

  const filtered = hubs.filter((hub) => {
    if (filter === "LIVE") return hub.published !== false
    if (filter === "DRAFT") return hub.published === false
    return true
  })

  // Display top 3 on dashboard, or full list on dedicated tab
  const displayListings = isFullPage ? filtered : filtered.slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-[#222225] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#023629]/10 text-[#023629] dark:bg-[#023629]/30 dark:text-[#8FB89A] flex items-center justify-center">
            <Building2 size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-gray-900 dark:text-white tracking-tight">
                {isFullPage ? `Your Listed Properties (${hubs.length})` : "Your listings"}
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {liveCount} Published
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Work, Stay, and Work + Stay properties published on the Digital Nomads in Nepal directory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {onAddNew ? (
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#023629] hover:bg-[#034a38] text-white shadow-2xs transition-colors cursor-pointer"
            >
              <PlusCircle size={13} />
              <span>+ Add New Listing</span>
            </button>
          ) : (
            <Link
              href="/register/space"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#023629] hover:bg-[#034a38] text-white shadow-2xs transition-colors"
            >
              <PlusCircle size={13} />
              <span>+ Add New Listing</span>
            </Link>
          )}
          {!isFullPage && onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C2410C] dark:text-[#FB923C] hover:underline cursor-pointer"
            >
              <span>Manage all ({hubs.length})</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs if Full Page */}
      {isFullPage && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[#023629] text-white shadow-xs"
                : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            All Spaces ({hubs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("LIVE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "LIVE"
                ? "bg-[#023629] text-white shadow-xs"
                : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Published Live ({liveCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("DRAFT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "DRAFT"
                ? "bg-[#023629] text-white shadow-xs"
                : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            Draft / Paused ({draftCount})
          </button>
        </div>
      )}

      {/* Listings Grid */}
      {displayListings.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl space-y-3">
          <Building2 size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">No properties listed yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            List your coworking space, hostel, or coliving apartment to start receiving nomad bookings and enquiries.
          </p>
          <Link
            href="/register/space"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#023629] text-white shadow-xs hover:bg-[#034a38] transition-colors"
          >
            + Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayListings.map((hub) => {
            const offeringType = getListingOfferingType(hub)
            const isLive = hub.published !== false
            const nprDailyPrice = hub.priceDaily ? Math.round(hub.priceDaily * 135) : 500
            const inquiriesCount = enquiriesCountByHub[hub.id] || 0
            const bookingsCount = hub.bookings?.length || 0

            return (
              <div
                key={hub.id}
                className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Banner with Product Pill and Status */}
                  <div className="relative aspect-[16/9] w-full bg-[#18181B] overflow-hidden">
                    <Image
                      src={
                        hub.photoUrl ||
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                      }
                      alt={hub.name}
                      fill
                      className="object-cover"
                    />

                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Status & Offering Pills */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                      {/* Product Type Pill: e.g. Pokhara · Work */}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">
                        {hub.city} · {offeringType}
                      </span>

                      {/* Live State Badge */}
                      <span
                        className={`text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isLive
                            ? "bg-emerald-500 text-white border-emerald-400"
                            : "bg-slate-700 text-slate-200 border-slate-600"
                        }`}
                      >
                        {isLive ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Bottom Price on Photo */}
                    <div className="absolute bottom-2 left-2.5 text-white">
                      <p className="font-extrabold text-sm tracking-tight drop-shadow-sm font-sans">
                        Rs. {nprDailyPrice.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-white/90">/ day</span>
                        {hub.priceMonthly && (
                          <span className="text-[11px] font-normal text-white/80 ml-1.5">
                            (${hub.priceMonthly}/mo)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                        {hub.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                        <MapPin size={11} className="text-[#C2410C] flex-shrink-0" />
                        <span>{hub.address || `${hub.city}, Nepal`}</span>
                      </p>
                    </div>

                    {/* 3 Metrics: Views, Inquiries, Bookings */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 dark:border-[#222225] text-center">
                      <div>
                        <span className="text-xs font-black text-gray-900 dark:text-white font-mono block">
                          124
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">Views</span>
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono block">
                          {inquiriesCount}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">Inquiries</span>
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                          {bookingsCount}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">Bookings</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="p-3 pt-0 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditHub(hub)}
                    className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-[#1E1E22] dark:hover:bg-[#28282D] text-gray-800 dark:text-gray-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={12} />
                    <span>Edit listing</span>
                  </button>

                  <Link
                    href={`/resources/coworking/${hub.slug}`}
                    target="_blank"
                    className="py-1.5 px-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#2C2C30] hover:bg-gray-50 dark:hover:bg-[#1E1E22] transition-colors flex items-center gap-1"
                    title="Preview public page"
                  >
                    <Eye size={12} />
                    <span>Preview</span>
                  </Link>

                  {onNavigateAvailability && (
                    <button
                      type="button"
                      onClick={onNavigateAvailability}
                      className="py-1.5 px-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#2C2C30] hover:bg-gray-50 dark:hover:bg-[#1E1E22] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Manage availability"
                    >
                      <CalendarCheck size={12} />
                      <span className="hidden sm:inline">Availability</span>
                    </button>
                  )}

                  {onTogglePublished && (
                    <button
                      type="button"
                      onClick={() => onTogglePublished(hub.id, isLive)}
                      className="py-1.5 px-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-[#2C2C30] transition-colors cursor-pointer"
                      title={isLive ? "Pause / Hide listing" : "Publish live"}
                    >
                      <Sliders size={12} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
