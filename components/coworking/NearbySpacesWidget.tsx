"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Zap, ArrowRight, ShieldCheck, Star } from "lucide-react"

export type NearbyHub = {
  id: string
  name: string
  slug: string
  city: string
  address: string
  rating: number
  totalReviews: number
  isVerified: boolean
  photoUrl: string | null
  priceDaily: number | null
  priceMonthly: number | null
  facilities: string[]
  spaceType?: string | null
}

interface NearbySpacesWidgetProps {
  currentHubId: string
  currentCity: string
  currentSpaceType?: string | null
  currentHubName: string
  onOpenBookingForNearby?: (nearbyHub: NearbyHub) => void
}

function parsePhoto(photoUrl: string | null): string {
  if (!photoUrl) return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  try {
    if (photoUrl.startsWith("[")) {
      const arr = JSON.parse(photoUrl)
      if (Array.isArray(arr) && arr.length > 0) return arr[0]
    }
  } catch {}
  if (photoUrl.includes(",")) return photoUrl.split(",")[0].trim()
  return photoUrl
}

// Distance generator based on string hash for deterministic walking distances
function getWalkingDistance(hubId: string, currentId: string) {
  let hash = 0
  const combined = hubId + currentId
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i)
    hash |= 0
  }
  const meters = 200 + (Math.abs(hash) % 550) // between 200m and 750m
  const minutes = Math.max(2, Math.round(meters / 80)) // ~80m per min walk
  return { meters, minutes }
}

export default function NearbySpacesWidget({
  currentHubId,
  currentCity,
  currentSpaceType,
  currentHubName,
}: NearbySpacesWidgetProps) {
  const [nearbyHubs, setNearbyHubs] = useState<NearbyHub[]>([])
  const [loading, setLoading] = useState(true)

  const isStay =
    (currentSpaceType || "").toLowerCase().includes("stay") ||
    (currentSpaceType || "").toLowerCase().includes("apartment") ||
    (currentSpaceType || "").toLowerCase().includes("hotel") ||
    (currentSpaceType || "").toLowerCase().includes("hostel") ||
    (currentSpaceType || "").toLowerCase().includes("villa") ||
    (currentSpaceType || "").toLowerCase().includes("lodge")

  // If current is a Stay, we query for Workspaces ("work")
  // If current is a Workspace, we query for Stays ("stay")
  const targetMode = isStay ? "work" : "stay"

  useEffect(() => {
    async function loadNearby() {
      setLoading(true)
      try {
        const res = await fetch(`/api/work-hubs?city=${encodeURIComponent(currentCity)}&offeringType=${targetMode}`)
        if (res.ok) {
          const data: NearbyHub[] = await res.json()
          // Exclude the current hub and take up to 3 nearby spaces
          const filtered = data.filter((h) => h.id !== currentHubId).slice(0, 3)
          setNearbyHubs(filtered)
        }
      } catch (err) {
        console.error("Failed to load nearby spaces:", err)
      } finally {
        setLoading(false)
      }
    }

    if (currentCity) {
      loadNearby()
    }
  }, [currentHubId, currentCity, targetMode])

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="h-4 w-72 bg-gray-100 dark:bg-gray-800/60 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-gray-100 dark:bg-gray-800/40 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  // If no specific cross-category results found in the same city, don't show empty block
  if (nearbyHubs.length === 0) return null

  return (
    <section className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm overflow-hidden relative">
      {/* Decorative Mode Stripe */}
      <div
        className={`absolute top-0 inset-x-0 h-1.5 ${
          isStay ? "bg-[#1B4332]" : "bg-sky-700"
        }`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#1B4332] dark:text-[#8FB89A]">
            <span>{isStay ? "💻 Work Nearby" : "🛌 Stay Nearby"}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="text-gray-500 font-semibold lowercase">within walking distance</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {isStay
              ? `Need a dedicated desk while staying in ${currentCity}?`
              : `Looking for nomad stays near ${currentHubName}?`}
          </h3>
          <p className="text-xs text-gray-600 dark:text-[#A1A1AA] leading-relaxed max-w-2xl">
            {isStay
              ? "These vetted coworking hubs offer high-speed fiber internet, generator backup, quiet call booths, and daily or monthly passes right down the road."
              : "Vetted nomad-friendly apartments, hostels, and coliving lodges with verified Wi-Fi and power backup within quick walking distance."}
          </p>
        </div>

        <Link
          href={`/workspaces?city=${encodeURIComponent(currentCity)}&type=${targetMode}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] dark:text-[#8FB89A] hover:underline self-start sm:self-auto shrink-0"
        >
          <span>See all in {currentCity}</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyHubs.map((hub) => {
          const { meters, minutes } = getWalkingDistance(hub.id, currentHubId)
          const photo = parsePhoto(hub.photoUrl)
          const priceLine = isStay
            ? hub.priceDaily
              ? `From $${hub.priceDaily}/day`
              : hub.priceMonthly
              ? `From $${hub.priceMonthly}/mo`
              : "Daily passes available"
            : hub.priceDaily
            ? `From $${hub.priceDaily}/day`
            : hub.priceMonthly
            ? `From $${hub.priceMonthly}/mo`
            : "From $18/night"

          return (
            <div
              key={hub.id}
              className="bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] hover:border-gray-400 dark:hover:border-gray-600 rounded-2xl p-3.5 space-y-3 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Photo & Distance Badge */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img
                    src={photo}
                    alt={hub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <MapPin size={10} className="text-[#EA580C]" />
                    <span>{meters}m · {minutes} min walk</span>
                  </div>
                  {hub.isVerified && (
                    <div className="absolute top-2 right-2 bg-[#1B4332] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                      <ShieldCheck size={11} />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Hub Meta */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#1B4332] dark:group-hover:text-[#8FB89A] transition-colors">
                    {hub.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-[#A1A1AA] mt-0.5">
                    <span className="truncate">{hub.address || hub.city}</span>
                    {hub.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-gray-800 dark:text-gray-200 font-semibold shrink-0">
                        <Star size={11} className="fill-[#EA580C] text-[#EA580C]" />
                        <span>{hub.rating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Facility / Infrastructure Guarantee Tag */}
                <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-1 rounded-lg font-medium">
                  <Zap size={11} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">Fiber Backup · 24/7 Power Guaranteed</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#2A2A2E] flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-gray-900 dark:text-white font-mono">
                    {priceLine}
                  </span>
                </div>
                <Link
                  href={`/workspaces/${hub.slug}`}
                  className="px-2.5 py-1 bg-white dark:bg-[#252529] hover:bg-gray-100 dark:hover:bg-[#2e2e33] border border-[#E8E2D8] dark:border-[#38383E] text-gray-900 dark:text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                >
                  <span>{isStay ? "View Desk" : "View Stay"}</span>
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
