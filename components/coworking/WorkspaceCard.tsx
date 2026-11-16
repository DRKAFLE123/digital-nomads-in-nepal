"use client"

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react"
import Link from "next/link"
import { MapPin, Star, Heart, Wifi, Zap, X } from "lucide-react"
import { useSession } from "next-auth/react"

export type Unit = {
  type: string
  name: string
  count: number
  priceDaily?: number
  priceMonthly?: number
}

export type Hub = {
  id: string
  name: string
  slug: string
  city: string
  description: string
  address: string
  spaceType?: string | null
  openingHours?: string | null
  units?: Unit[] | null
  ownerEmail?: string | null
  ownerName?: string | null
  rating: number
  totalReviews: number
  isVerified: boolean
  isPartner: boolean
  photoUrl: string | null
  facilities: string[]
  priceDaily: number | null
  priceMonthly: number | null
}

interface WorkspaceCardProps {
  hub: Hub
}

function parsePhotos(photoUrl: string | null): string[] {
  if (!photoUrl) return []
  try {
    if (photoUrl.startsWith("[")) {
      const parsed = JSON.parse(photoUrl)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean)
    }
  } catch {
    // fallback
  }
  if (photoUrl.includes(",")) {
    return photoUrl.split(",").map((s) => s.trim()).filter(Boolean)
  }
  return [photoUrl]
}

const CURATED_WORKSPACE_COVERS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
]

export function classifyOfferingType(hub: { spaceType?: string | null; name: string; facilities?: string[]; units?: Unit[] | null }): "work" | "stay" | "work_and_stay" {
  const type = (hub.spaceType || "").toLowerCase()
  const name = hub.name.toLowerCase()
  const facs = (Array.isArray(hub.facilities) ? hub.facilities : []).map(f => f.toLowerCase())
  const units = (Array.isArray(hub.units) ? hub.units : []).map(u => (u.type || u.name || "").toLowerCase())

  // Work + Stay: Coliving, live & work, hybrid
  if (
    type.includes("coliving") ||
    type.includes("live & work") ||
    type.includes("hybrid") ||
    name.includes("coliving") ||
    name.includes("workation") ||
    units.some(u => u.includes("coliving") || u.includes("suite")) ||
    facs.some(f => f.includes("coliving") || f.includes("room + workstation") || f.includes("coliving suite") || f.includes("room included"))
  ) {
    return "work_and_stay"
  }

  // Stay: Nomad apartments, hotels, guesthouses, villas
  if (
    type.includes("apartment") ||
    type.includes("hotel") ||
    type.includes("hostel") ||
    type.includes("villa") ||
    type.includes("stay") ||
    type.includes("residence") ||
    name.includes("apartment") ||
    name.includes("residence") ||
    name.includes("hotel") ||
    name.includes("hostel") ||
    name.includes("villa") ||
    name.includes("lodge")
  ) {
    return "stay"
  }

  return "work"
}

function getBadge(hub: Hub, offeringType: "work" | "stay" | "work_and_stay") {
  const type = (hub.spaceType || "").toLowerCase()
  const name = hub.name.toLowerCase()
  const isHostel = type.includes("hostel") || name.includes("hostel")
  const facs = (Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []).map(f => f.toLowerCase())
  const hasWorkSetup = facs.some(f => f.includes("fiber") || f.includes("wifi") || f.includes("mbps")) &&
                       facs.some(f => f.includes("generator") || f.includes("backup") || f.includes("desk"))

  if (isHostel) {
    if (offeringType === "work_and_stay" || hasWorkSetup) {
      return {
        label: "⚡ WORK + STAY HOSTEL",
        className: "bg-[#C2410C] text-white",
      }
    }
    return {
      label: "🛌 NOMAD HOSTEL (STAY ONLY)",
      className: "bg-sky-700 text-white",
    }
  }

  if (type.includes("coliving") || name.includes("coliving")) {
    return {
      label: "⚡ COLIVING & WORK",
      className: "bg-[#C2410C] text-white",
    }
  }

  if (type.includes("hotel") || name.includes("hotel") || type.includes("resort")) {
    return {
      label: "🏨 HOTEL",
      className: "bg-emerald-800 text-white",
    }
  }

  if (type.includes("apartment") || name.includes("apartment")) {
    return {
      label: "🏢 APARTMENT",
      className: "bg-indigo-700 text-white",
    }
  }

  if (type.includes("long_stay")) {
    return {
      label: "📅 MONTHLY STAY",
      className: "bg-purple-700 text-white",
    }
  }

  if (offeringType === "work_and_stay") {
    return {
      label: "⚡ WORK + STAY",
      className: "bg-[#C2410C] text-white",
    }
  }

  if (offeringType === "stay") {
    return {
      label: "🛌 STAY",
      className: "bg-sky-700 text-white",
    }
  }

  return {
    label: "💻 WORK",
    className: "bg-[#1B4332] text-white",
  }
}

function formatFacilityChip(facility: string): string {
  const lower = facility.toLowerCase()

  // Dual fiber / multiple ISPs / redundant connection -> "Backup internet"
  if (
    lower.includes("dual fiber") ||
    lower.includes("fiber isps") ||
    lower.includes("dual isp") ||
    lower.includes("secondary isp") ||
    lower.includes("backup isp") ||
    lower.includes("redundant internet") ||
    lower.includes("backup internet")
  ) {
    return "Backup internet"
  }

  // Speed figures (e.g. "100 Mbps", "100+ Mbps", "150 Mbps Fiber") -> "100 Mbps tested"
  const mbpsMatch = facility.match(/(\d+\+?\s*mbps)/i)
  if (mbpsMatch) {
    return `${mbpsMatch[1]} tested`
  }

  // General fiber / wifi
  if (lower.includes("high-speed fiber") || lower.includes("fast fiber") || lower.includes("fiber wi-fi")) {
    return "Fast fiber"
  }

  // Power generator / backup -> "Power backup"
  if (
    lower.includes("generator") ||
    lower.includes("power backup") ||
    lower.includes("ups") ||
    lower.includes("solar backup")
  ) {
    return "Power backup"
  }

  return facility
}

export default function WorkspaceCard({ hub }: WorkspaceCardProps) {
  const { data: session } = useSession()
  const [favorited, setFavorited] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const photos = parsePhotos(hub.photoUrl)
  const offeringType = classifyOfferingType(hub)
  const badge = getBadge(hub, offeringType)
  
  // Deterministic curated fallback based on workspace slug
  const fallbackCover = CURATED_WORKSPACE_COVERS[
    Math.abs(hub.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % CURATED_WORKSPACE_COVERS.length
  ]
  const [imgSrc, setImgSrc] = useState<string>(photos[0] || fallbackCover)

  const facs = Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []

  // Extract clean chips (max 3)
  const chips: { label: string; icon?: React.ElementType }[] = []

  // 1. Internet / Connectivity Chip (clear "Backup internet" or speed figure)
  const internetFac = facs.find(f => {
    const l = f.toLowerCase()
    return (
      l.includes("fiber") ||
      l.includes("wifi") ||
      l.includes("wi-fi") ||
      l.includes("mbps") ||
      l.includes("isp") ||
      l.includes("internet")
    )
  })
  if (internetFac) {
    chips.push({ label: formatFacilityChip(internetFac), icon: Wifi })
  }

  // 2. Power Backup Chip (Keep "Power backup")
  const backupFac = facs.find(f => {
    const l = f.toLowerCase()
    return (
      l.includes("generator") ||
      l.includes("backup") ||
      l.includes("ups") ||
      l.includes("solar")
    )
  })
  if (backupFac && chips.length < 3) {
    chips.push({ label: formatFacilityChip(backupFac), icon: Zap })
  }

  // 3. Fill remaining slots from other amenities
  const otherFacs = facs.filter(f => {
    const l = f.toLowerCase()
    return (
      !l.includes("wifi") &&
      !l.includes("wi-fi") &&
      !l.includes("fiber") &&
      !l.includes("mbps") &&
      !l.includes("isp") &&
      !l.includes("internet") &&
      !l.includes("generator") &&
      !l.includes("backup") &&
      !l.includes("ups") &&
      !l.includes("solar")
    )
  })

  while (chips.length < 3 && otherFacs.length > 0) {
    const next = otherFacs.shift()
    if (next) chips.push({ label: formatFacilityChip(next) })
  }

  // Fallback defaults if no facilities listed
  if (chips.length === 0) {
    chips.push({ label: "Backup internet", icon: Wifi })
    chips.push({ label: "Power backup", icon: Zap })
    chips.push({ label: "24/7 access" })
  }

  const remainingCount = facs.length > chips.length ? facs.length - chips.length : 0

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      setShowSignInPrompt(true)
      setTimeout(() => setShowSignInPrompt(false), 4500)
      return
    }

    setFavorited((prev) => !prev)
  }

  // Price formatting adapted to offering type (Work, Stay, Work + Stay)
  let priceLine = "Inquire for rates"
  if (offeringType === "work_and_stay") {
    if (hub.priceMonthly) {
      priceLine = `From $${hub.priceMonthly}/mo · Stay + Desk`
    } else if (hub.priceDaily) {
      priceLine = `From $${hub.priceDaily}/day · Workation`
    } else {
      priceLine = "Work + Stay Package"
    }
  } else if (offeringType === "stay") {
    if (hub.priceDaily && hub.priceMonthly) {
      priceLine = `$${hub.priceDaily}/night · $${hub.priceMonthly}/mo`
    } else if (hub.priceDaily) {
      priceLine = `From $${hub.priceDaily}/night`
    } else if (hub.priceMonthly) {
      priceLine = `From $${hub.priceMonthly}/month`
    } else {
      priceLine = "From $15/night"
    }
  } else {
    const priceDaily = hub.priceDaily ? `$${hub.priceDaily}/day` : null
    const priceMonthly = hub.priceMonthly ? `$${hub.priceMonthly}/month` : null
    priceLine = priceDaily && priceMonthly
      ? `From ${priceDaily} · ${priceMonthly}`
      : priceDaily
      ? `From ${priceDaily}`
      : priceMonthly
      ? `From ${priceMonthly}`
      : "From $5/day"
  }

  return (
    <Link
      href={`/workspaces/${hub.slug}`}
      className="group block bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 select-none"
    >
      {/* 4:3 Aspect Ratio Photo Crop */}
      <div className="relative aspect-[4/3] w-full bg-[#1A1A1C] overflow-hidden">
        <img
          src={imgSrc}
          alt={hub.name}
          loading="lazy"
          onError={() => {
            if (imgSrc !== fallbackCover) setImgSrc(fallbackCover)
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top-Left Category & Verification Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className={`${badge.className} text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 tracking-wide`}>
            {badge.label}
          </span>
          {(hub.isVerified || hub.isPartner) && (
            <span className="bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
              {hub.isVerified ? "Verified" : "Partner"}
            </span>
          )}
        </div>

        {/* High-Contrast Semi-Transparent Circle for Save Heart */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all z-20 cursor-pointer shadow-md backdrop-blur-md border ${
            favorited
              ? "bg-rose-500 hover:bg-rose-600 border-rose-400 text-white shadow-rose-500/30"
              : "bg-black/60 hover:bg-black/80 dark:bg-black/70 dark:hover:bg-black/90 border-white/30 text-white hover:scale-105 active:scale-95"
          }`}
          aria-label={favorited ? "Saved to favorites" : "Save to favorites"}
          title={favorited ? "Saved" : "Save to favorites"}
        >
          <Heart
            size={16}
            strokeWidth={2.4}
            className={`transition-colors duration-200 ${
              favorited ? "fill-white text-white" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
            }`}
          />
        </button>

        {/* Floating Sign-in Notification for Logged-Out Users */}
        {showSignInPrompt && (
          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute top-2 inset-x-2 z-30 p-2 sm:p-2.5 rounded-xl bg-slate-950/95 dark:bg-[#0c0c0e]/95 text-white shadow-2xl border border-white/20 backdrop-blur-xl flex items-center justify-between gap-2 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Heart size={13} className="text-rose-400 shrink-0 fill-rose-400/40" />
              <span className="text-[11.5px] font-semibold text-gray-100 truncate">
                Sign in to save favorites
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/auth/signin"
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="px-2.5 py-1 bg-[#C2410C] hover:bg-[#9A3412] text-white text-[11px] font-bold rounded-full shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowSignInPrompt(false)
                }}
                className="p-1 text-white/50 hover:text-white rounded-full transition-colors cursor-pointer"
                aria-label="Dismiss sign in prompt"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3">
        <div>
          {/* Title: 18px (text-lg), 600 weight, max 2 lines */}
          <h3 className="text-base sm:text-[17px] font-semibold text-gray-900 dark:text-[#F5F5F4] group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors line-clamp-1 leading-snug">
            {hub.name}
          </h3>

          {/* Location & Authentic Rating: 14px muted */}
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-gray-500 dark:text-[#A8A8B0] mt-1 font-normal">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{hub.city}</span>
            {hub.rating > 0 && (
              <>
                <span className="text-gray-300 dark:text-gray-600 select-none">·</span>
                <span className="flex items-center gap-0.5 text-gray-700 dark:text-gray-300 font-medium">
                  <Star size={11} className="fill-[#EA580C] text-[#EA580C]" />
                  <span>{hub.rating.toFixed(1)}</span>
                </span>
                {hub.totalReviews > 0 && (
                  <span className="text-gray-400 dark:text-gray-500 text-[11px]">({hub.totalReviews})</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chips Row: Maximum 3 neutral chips + '+X more' */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {chips.map((chip, idx) => {
            const Icon = chip.icon
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F3EEE5] dark:bg-[#1C1C1F] text-gray-800 dark:text-[#E4E4E7] border border-[#E8E2D8] dark:border-[#26262A]"
              >
                {Icon && <Icon size={11} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />}
                <span>{chip.label}</span>
              </span>
            )
          })}
          {remainingCount > 0 && (
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 px-1">
              +{remainingCount} more
            </span>
          )}
        </div>

        {/* Price Line: 16px font-semibold, single clean line */}
        <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#26262A] flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#F5F5F4]">
          <span>{priceLine}</span>
        </div>
      </div>
    </Link>
  )
}
