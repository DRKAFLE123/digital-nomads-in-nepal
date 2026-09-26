"use client"

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  Star,
  CheckCircle,
  Award,
  Wifi,
  Zap,
  Building,
  Heart,
  CalendarCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react"
import { calculateWorkabilityScore } from "./WorkabilityScoreBadge"

import BookingModalCard from "./BookingModalCard"

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

export default function WorkspaceCard({ hub }: WorkspaceCardProps) {
  const [favorited, setFavorited] = useState(false)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)

  const photos = parsePhotos(hub.photoUrl)
  const hasMultiplePhotos = photos.length > 1
  const activePhoto = photos[activeImageIdx] || photos[0] || null

  const facs = Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []

  // Check if property offers Coliving / Work & Stay rooms
  const hasColiving =
    facs.some(f => f.toLowerCase().includes("coliving") || f.toLowerCase().includes("stay") || f.toLowerCase().includes("room") || f.toLowerCase().includes("suite")) ||
    (hub.units && hub.units.some(u => (u.type || u.name || "").toLowerCase().includes("coliving") || (u.type || u.name || "").toLowerCase().includes("suite") || (u.type || u.name || "").toLowerCase().includes("room"))) ||
    hub.name.toLowerCase().includes("coliving") || hub.name.toLowerCase().includes("resort") || hub.name.toLowerCase().includes("hostel") || hub.name.toLowerCase().includes("hotel")

  // Detect internet speed & power backup from facilities or defaults
  const internetFacility = facs.find(f => f.includes("Mbps") || f.includes("Fiber") || f.includes("Starlink")) || "100+ Mbps Fiber"
  const powerFacility = facs.find(f => f.includes("Generator") || f.includes("UPS") || f.includes("Inverter") || f.includes("Solar")) || "Generator + UPS"

  const workabilityScore = calculateWorkabilityScore({
    rating: hub.rating || 4.8,
    internetSpeed: internetFacility,
    powerBackup: powerFacility,
    facilities: facs,
  })

  // Format starting price string (starts from cheapest hot desk / basic room)
  const dailyNpr = hub.priceDaily ? Math.round(hub.priceDaily * 135) : null
  const monthlyNpr = hub.priceMonthly ? Math.round(hub.priceMonthly * 130) : null

  const displayPrice = hub.priceDaily
    ? `From NPR ${dailyNpr?.toLocaleString()}/day ($${hub.priceDaily})`
    : hub.priceMonthly
    ? `From NPR ${monthlyNpr?.toLocaleString()}/mo ($${hub.priceMonthly})`
    : "From NPR 540/day ($4)"

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIdx((prev) => (prev + 1) % photos.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIdx((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <>
      <div className="group bg-[#121212] border border-[#242424] hover:border-amber-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/5 hover:-translate-y-1 flex flex-col justify-between">
        <div>
          {/* Card Header Media & Slider */}
          <div className="relative h-52 w-full overflow-hidden bg-[#181818]">
            {activePhoto ? (
              <img
                src={activePhoto}
                alt={`${hub.name} photo ${activeImageIdx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gradient-to-br from-[#161616] to-[#0d0d0d]">
                <Building size={36} />
                <span className="text-xs font-semibold mt-2">Digital Nomad WorkHub</span>
              </div>
            )}

            {/* Slider Chevrons */}
            {hasMultiplePhotos && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-amber-400 hover:text-black transition-all z-20"
                  title="Previous photo"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-amber-400 hover:text-black transition-all z-20"
                  title="Next photo"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Photo Count Indicator */}
                <div className="absolute top-3 right-14 bg-black/75 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-white flex items-center gap-1 z-10">
                  <ImageIcon size={10} className="text-amber-400" />
                  {activeImageIdx + 1}/{photos.length}
                </div>

                {/* Slider Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setActiveImageIdx(i)
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeImageIdx ? "w-4 bg-amber-400" : "w-1.5 bg-white/50 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40 pointer-events-none" />

            {/* Badges Stack */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[75%] z-10">
              {hub.isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/90 text-black font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md backdrop-blur-md">
                  <CheckCircle size={10} className="fill-black text-emerald-500" /> Verified
                </span>
              )}
              {hub.isPartner && (
                <span className="inline-flex items-center gap-1 bg-amber-400 text-black font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md">
                  <Award size={10} className="fill-black" /> Partner
                </span>
              )}
              {hasColiving && (
                <span className="inline-flex items-center gap-1 bg-indigo-600/90 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md backdrop-blur-md border border-indigo-400/30">
                  🛌 Coliving Rooms
                </span>
              )}
            </div>

            {/* Favorite Bookmark Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setFavorited(!favorited)
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur ${
                favorited
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                  : "bg-black/60 text-gray-300 hover:text-white border border-white/10 hover:bg-black"
              }`}
              title={favorited ? "Saved" : "Save workspace"}
            >
              <Heart size={15} className={favorited ? "fill-white" : ""} />
            </button>

            {/* Price Badge on Image */}
            <div className="absolute bottom-3 right-3 bg-black/85 border border-[#333] px-2.5 py-1 rounded-xl text-xs font-black text-amber-400 shadow-md">
              {displayPrice}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* City & Rating Bar */}
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-amber-400 font-bold uppercase tracking-wide text-[11px]">
                <MapPin size={12} /> {hub.city}, Nepal
              </span>
              <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#262626] px-2 py-0.5 rounded-lg">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-white text-xs">{hub.rating ? hub.rating.toFixed(1) : "4.8"}</span>
                <span className="text-gray-500 text-[10px]">({hub.totalReviews || 42})</span>
              </div>
            </div>

            {/* Workspace Title */}
            <div>
              <Link href={`/resources/coworking/${hub.slug}`}>
                <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {hub.name}
                </h3>
              </Link>
              <p className="text-gray-400 text-[11px] mt-0.5 truncate">📍 {hub.address}</p>
            </div>

            {/* Workability Score & Speed Badges */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {/* Workability score component */}
              <div className="bg-[#161616] border border-[#222] rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-400" /> Workability
                </span>
                <span className="text-xs font-black text-emerald-400 font-mono">{workabilityScore}/100</span>
              </div>

              {/* Speed Badge */}
              <div className="bg-[#161616] border border-[#222] rounded-xl px-2.5 py-1.5 flex items-center justify-between truncate">
                <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 truncate">
                  <Wifi size={11} className="text-amber-400" /> Speed
                </span>
                <span className="text-[11px] font-extrabold text-white truncate">{internetFacility.split(" ")[0]}</span>
              </div>
            </div>

            {/* Power Backup Strip */}
            <div className="flex items-center gap-1.5 text-[11px] bg-[#161616] border border-[#222] px-2.5 py-1.5 rounded-xl text-gray-300">
              <Zap size={12} className="text-amber-400 shrink-0" />
              <span className="truncate font-medium">{powerFacility}</span>
            </div>

            {/* Amenities Pills (Non-duplicate) */}
            {(() => {
              const cleanFacs = facs.filter(f => {
                const l = f.toLowerCase()
                return !l.includes("wifi") && !l.includes("fiber") && !l.includes("generator") && !l.includes("battery") && !l.includes("ups")
              })
              if (cleanFacs.length === 0) return null
              return (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {cleanFacs.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-semibold px-2 py-0.5 bg-white/5 text-gray-300 rounded-md border border-white/5"
                    >
                      {f}
                    </span>
                  ))}
                  {cleanFacs.length > 3 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-white/5 text-gray-500 rounded-md border border-white/5">
                      +{cleanFacs.length - 3} more
                    </span>
                  )}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 pt-0 space-y-3">
          <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#222]">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" /> Available today
            </span>
            {hub.priceMonthly && hub.priceDaily ? (
              <span className="text-amber-400 font-bold text-[10px] sm:text-[11px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20" title="Cheaper long-term monthly rate">
                Monthly: ${hub.priceMonthly}/mo (Save {Math.round((1 - hub.priceMonthly / (hub.priceDaily * 30)) * 100)}%)
              </span>
            ) : (
              <span className="text-gray-400">{hub.openingHours || "24/7 Access"}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/resources/coworking/${hub.slug}`}
              className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-[#333] text-white font-bold text-xs hover:border-amber-400/50 hover:bg-white/5 transition-all text-center"
            >
              View Details
            </Link>
            <button
              type="button"
              onClick={() => setBookingModalOpen(true)}
              className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-yellow-300 transition-all shadow-md shadow-amber-400/15 text-center cursor-pointer active:scale-95"
            >
              <CalendarCheck size={13} /> Book Now
            </button>
          </div>
        </div>
      </div>

      {/* REUSABLE BOOKING MODAL CARD */}
      <BookingModalCard
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        hub={hub}
      />
    </>
  )
}

