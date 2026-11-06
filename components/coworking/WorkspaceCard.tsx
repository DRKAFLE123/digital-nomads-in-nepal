"use client"

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react"
import Link from "next/link"
import { MapPin, Star, Heart, Wifi, Zap } from "lucide-react"

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

export default function WorkspaceCard({ hub }: WorkspaceCardProps) {
  const [favorited, setFavorited] = useState(false)
  const photos = parsePhotos(hub.photoUrl)
  const offeringType = classifyOfferingType(hub)
  
  // Deterministic curated fallback based on workspace slug
  const fallbackCover = CURATED_WORKSPACE_COVERS[
    Math.abs(hub.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % CURATED_WORKSPACE_COVERS.length
  ]
  const [imgSrc, setImgSrc] = useState<string>(photos[0] || fallbackCover)

  const facs = Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []

  // Extract clean chips (max 3)
  const chips: { label: string; icon?: React.ElementType }[] = []
  const hasFiber = facs.some(f => f.toLowerCase().includes("fiber") || f.toLowerCase().includes("wifi") || f.toLowerCase().includes("mbps"))
  const hasBackup = facs.some(f => f.toLowerCase().includes("generator") || f.toLowerCase().includes("backup") || f.toLowerCase().includes("ups") || f.toLowerCase().includes("solar"))

  if (hasFiber) {
    const fiberText = facs.find(f => f.toLowerCase().includes("fiber") || f.toLowerCase().includes("mbps")) || "Dual fiber"
    chips.push({ label: fiberText.length > 15 ? "Fast fiber" : fiberText, icon: Wifi })
  }
  if (hasBackup && chips.length < 3) {
    const backupText = facs.find(f => f.toLowerCase().includes("generator") || f.toLowerCase().includes("backup")) || "Generator backup"
    chips.push({ label: backupText.length > 18 ? "Power backup" : backupText, icon: Zap })
  }

  // Fill remaining slots from other amenities
  const otherFacs = facs.filter(f => {
    const l = f.toLowerCase()
    return !l.includes("wifi") && !l.includes("fiber") && !l.includes("generator") && !l.includes("backup") && !l.includes("ups")
  })

  while (chips.length < 3 && otherFacs.length > 0) {
    const next = otherFacs.shift()
    if (next) chips.push({ label: next })
  }

  // If DB had empty facilities, fallback to realistic defaults
  if (chips.length === 0) {
    chips.push({ label: "Fast fiber", icon: Wifi })
    chips.push({ label: "Generator backup", icon: Zap })
    chips.push({ label: "24/7 access" })
  }

  const remainingCount = facs.length > chips.length ? facs.length - chips.length : 0

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
          {offeringType === "work_and_stay" && (
            <span className="bg-[#C2410C] text-white text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 tracking-wide">
              <span>⚡</span> WORK + STAY
            </span>
          )}
          {offeringType === "stay" && (
            <span className="bg-sky-700 text-white text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 tracking-wide">
              <span>🛌</span> STAY
            </span>
          )}
          {offeringType === "work" && (
            <span className="bg-[#1B4332] text-white text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 tracking-wide">
              <span>💻</span> WORK
            </span>
          )}
          {(hub.isVerified || hub.isPartner) && (
            <span className="bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
              {hub.isVerified ? "Verified" : "Partner"}
            </span>
          )}
        </div>

        {/* Top-Right Save Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setFavorited(!favorited)
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            favorited
              ? "bg-rose-500 text-white"
              : "bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/10"
          }`}
          aria-label={favorited ? "Saved" : "Save workspace"}
        >
          <Heart size={14} className={favorited ? "fill-white" : ""} />
        </button>
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
