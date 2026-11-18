"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  X,
  Calendar,
  User,
  Mail,
  Building,
  CheckCircle,
  Loader2,
  MapPin,
  Clock,
  Layers,
  Users,
  ShieldCheck,
  Plus,
  Minus,
  Phone,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  AlertCircle,
  FileText
} from "lucide-react"

export type Unit = {
  type: string
  name: string
  count: number
  priceDaily?: number
  priceMonthly?: number
}

export type HubForBooking = {
  id: string
  name: string
  slug: string
  city: string
  address: string
  priceDaily?: number | null
  priceMonthly?: number | null
  openingHours?: string | null
  units?: Unit[] | null
  facilities?: string[] | null
  spaceType?: string | null
}

interface BookingModalCardProps {
  isOpen: boolean
  onClose: () => void
  hub: HubForBooking | null
  initialUnitType?: string
}

export type PlanType = "daily" | "monthly"
export type PackageTier = "desk_only" | "workation_all_inclusive" | "stay_coworking_voucher"

export const PACKAGE_TIERS: Array<{
  id: PackageTier
  tag: string
  title: string
  desc: string
  icon: string
  requiresStay?: boolean
}> = [
  {
    id: "desk_only",
    tag: "Flexible Pass",
    title: "Dedicated Desk & Space",
    desc: "Ergonomic workspace seat with verified high-speed fiber Wi-Fi and generator backup power.",
    icon: "💻",
    requiresStay: false
  },
  {
    id: "workation_all_inclusive",
    tag: "Work + Stay",
    title: "Room + Desk Workation",
    desc: "Private nomad room stay paired with guaranteed dedicated workspace seat & power backup.",
    icon: "⚡",
    requiresStay: true
  },
  {
    id: "stay_coworking_voucher",
    tag: "Partner Stay",
    title: "Stay + Coworking Pass",
    desc: "Nomad accommodation with multi-day passes to walk to nearby verified partner coworking spaces.",
    icon: "🎟️",
    requiresStay: true
  }
]

export const UNIT_OPTIONS = [
  { id: "hot_desk", label: "Hot Desk / Flexi Seat", defaultMonthly: 80, defaultDaily: 6 },
  { id: "dedicated_desk", label: "Dedicated Fixed Desk", defaultMonthly: 120, defaultDaily: 9 },
  { id: "private_room", label: "Private Executive Office", defaultMonthly: 350, defaultDaily: 25 },
  { id: "meeting_hall", label: "Meeting / Conference Room", defaultMonthly: 600, defaultDaily: 45 },
  { id: "coliving_room", label: "Coliving Room + Desk Included", defaultMonthly: 450, defaultDaily: 28, isStay: true }
]

// Nepal standard exchange rate reference
const NPR_RATE = 135
const RATE_DATE = "Nov 2026"

/**
 * Returns today's date formatted as YYYY-MM-DD in Nepal timezone (UTC +5:45)
 */
function getNepalTodayStr(): string {
  const now = new Date()
  const nepalOffset = 5 * 60 + 45
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const nepalTime = new Date(utc + nepalOffset * 60000)
  return nepalTime.toISOString().split("T")[0]
}

/**
 * Human readable date format (e.g., "Thu, 19 Nov 2026")
 */
function formatReadableDate(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr + "T00:00:00")
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

export default function BookingModalCard({
  isOpen,
  onClose,
  hub,
  initialUnitType
}: BookingModalCardProps) {
  const { data: session } = useSession()

  // Plan Type: Daily vs Monthly
  const [planType, setPlanType] = useState<PlanType>("daily")
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>("desk_only")
  const [selectedUnit, setSelectedUnit] = useState<string>("hot_desk")
  const [nomadName, setNomadName] = useState("")
  const [nomadEmail, setNomadEmail] = useState("")
  const [nomadPhone, setNomadPhone] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState("")
  const [error, setError] = useState("")

  const nepalToday = useMemo(() => getNepalTodayStr(), [])

  // Check if hub supports stay / workation
  const hubHasStay = useMemo(() => {
    if (!hub) return false
    const facs = (hub.facilities || []).map((f) => f.toLowerCase())
    const type = (hub.spaceType || "").toLowerCase()
    return (
      facs.some((f) => f.includes("coliving") || f.includes("stay") || f.includes("room")) ||
      type.includes("coliving") ||
      type.includes("stay") ||
      (hub.units || []).some((u) => u.type?.toLowerCase().includes("room"))
    )
  }, [hub])

  const visiblePackageTiers = useMemo(() => {
    return PACKAGE_TIERS.filter((tier) => !tier.requiresStay || hubHasStay)
  }, [hubHasStay])

  const visibleUnitOptions = useMemo(() => {
    return UNIT_OPTIONS.filter((u) => !u.isStay || hubHasStay)
  }, [hubHasStay])

  // Update selected unit when initialUnitType prop changes
  useEffect(() => {
    if (initialUnitType) {
      setSelectedUnit(initialUnitType)
      if (initialUnitType === "coliving_room") {
        setSelectedPackage("workation_all_inclusive")
      }
    }
  }, [initialUnitType])

  // Pre-fill user data from session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !nomadName) setNomadName(session.user.name)
      if (session.user.email && !nomadEmail) setNomadEmail(session.user.email)
    }
  }, [session, nomadName, nomadEmail])

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSuccess(false)
      setError("")
      setBookingRef("")
      if (!startDate) {
        setStartDate(nepalToday)
        setEndDate(nepalToday)
      }
    }
  }, [isOpen, nepalToday, startDate])

  // Keep monthly end date in sync with start date
  useEffect(() => {
    if (planType === "monthly" && startDate) {
      const start = new Date(startDate + "T00:00:00")
      if (!isNaN(start.getTime())) {
        const nextMonth = new Date(start)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth.setDate(nextMonth.getDate() - 1)
        const yyyy = nextMonth.getFullYear()
        const mm = String(nextMonth.getMonth() + 1).padStart(2, "0")
        const dd = String(nextMonth.getDate()).padStart(2, "0")
        setEndDate(`${yyyy}-${mm}-${dd}`)
      }
    }
  }, [planType, startDate])

  // ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !hub) return null

  const activeUnitConfig =
    visibleUnitOptions.find((u) => u.id === selectedUnit) || visibleUnitOptions[0]

  // Dynamic rates based on package and hub pricing
  let dailyRate = hub.priceDaily || activeUnitConfig.defaultDaily
  let monthlyRate = hub.priceMonthly || activeUnitConfig.defaultMonthly

  if (selectedPackage === "workation_all_inclusive") {
    dailyRate = hub.priceDaily ? Math.round(hub.priceDaily * 2.8) : 28
    monthlyRate = hub.priceMonthly ? Math.max(400, Math.round(hub.priceMonthly * 2.8)) : 450
  } else if (selectedPackage === "stay_coworking_voucher") {
    dailyRate = hub.priceDaily ? Math.round(hub.priceDaily * 2.2) : 22
    monthlyRate = hub.priceMonthly ? Math.max(340, Math.round(hub.priceMonthly * 2.4)) : 380
  }

  // Calculate inclusive access days
  let inclusiveDays = 0
  let estimatedCost = 0
  let monthsCount = 1

  if (startDate && endDate) {
    const start = new Date(startDate + "T00:00:00")
    const end = new Date(endDate + "T00:00:00")

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
      const diffMs = end.getTime() - start.getTime()
      inclusiveDays = Math.round(diffMs / (1000 * 3600 * 24)) + 1

      if (planType === "monthly") {
        monthsCount = Math.max(1, Math.round(inclusiveDays / 30))
        estimatedCost = monthlyRate * monthsCount * quantity
      } else {
        estimatedCost = dailyRate * inclusiveDays * quantity
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess(false)

    if (!startDate || !endDate) {
      setError("Please select your start and end dates.")
      setSubmitting(false)
      return
    }

    if (startDate < nepalToday) {
      setError("Start date cannot be in the past in Nepal time.")
      setSubmitting(false)
      return
    }

    if (endDate < startDate) {
      setError("End date must be on or after start date.")
      setSubmitting(false)
      return
    }

    if (!nomadName.trim() || !nomadEmail.trim()) {
      setError("Please provide your name and contact email.")
      setSubmitting(false)
      return
    }

    try {
      const planLabel = planType === "monthly" ? "MONTHLY MEMBERSHIP" : "DAILY PASS"
      const res = await fetch(`/api/work-hubs/${hub?.slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomadName: nomadName.trim(),
          nomadEmail: nomadEmail.trim().toLowerCase(),
          startDate,
          endDate,
          notes: `PLAN: ${planLabel} | TIER: ${selectedPackage.toUpperCase()} | UNIT: ${activeUnitConfig.label} | Seats: ${quantity} | Phone: ${nomadPhone || "N/A"} | Est: $${estimatedCost} USD | Notes: ${notes}`.trim()
        })
      })

      if (res.ok) {
        const data = await res.json()
        const cleanRef = data.refCode || `DNN-${(data.id || "").slice(-4).toUpperCase() || Math.floor(1000 + Math.random() * 9000)}`
        setBookingRef(cleanRef)
        setSuccess(true)
      } else {
        const errData = await res.json()
        setError(errData.error || "Booking request failed. Please check your details.")
      }
    } catch (err) {
      console.error("Booking error:", err)
      setError("An unexpected network error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl shadow-2xl overflow-hidden my-auto text-gray-900 dark:text-[#F5F5F5] transition-all max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Stripe */}
        <div className="h-1.5 w-full bg-[#C2410C] flex-shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E8E2D8] dark:border-[#26262A] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C2410C]/10 border border-[#C2410C]/30 rounded-2xl flex items-center justify-center text-[#C2410C] dark:text-[#FB923C] flex-shrink-0">
              <Building size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] flex items-center gap-1">
                <Calendar size={11} /> Booking request
              </span>
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white line-clamp-1">
                {hub.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                <MapPin size={11} className="text-[#C2410C] dark:text-[#FB923C] flex-shrink-0" />{" "}
                {hub.city}, Nepal • {hub.address}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {success ? (
            /* ═══════════════════════════════════════════════════════════
               REWRITTEN CONFIRMATION VIEW (Pending Host Acceptance)
               Zero digital pass or door codes leaked in pending state.
               ═══════════════════════════════════════════════════════════ */
            <div className="max-w-2xl mx-auto py-4 sm:py-6 space-y-5 animate-in zoom-in-95 duration-200">
              {/* Header Status */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                  <Clock size={13} className="animate-pulse" />
                  <span>Pending Host Review</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  Request sent
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  We have forwarded your booking request to <strong className="text-gray-900 dark:text-white">{hub.name}</strong>. The host will confirm availability shortly.
                </p>
              </div>

              {/* Clean Reference & Space Pill */}
              <div className="bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Reference Code
                  </span>
                  <p className="font-mono text-base sm:text-lg font-black text-[#C2410C] dark:text-[#FB923C] tracking-wider">
                    {bookingRef}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Space &amp; City
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {hub.name} · {hub.city}
                  </span>
                </div>
              </div>

              {/* Request Summary Card */}
              <div className="bg-white dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs text-left">
                <div className="flex items-center gap-2 border-b border-[#E8E2D8] dark:border-[#2A2A2E] pb-2.5">
                  <FileText size={15} className="text-[#C2410C] dark:text-[#FB923C]" />
                  <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    Request Details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Selected Unit &amp; Plan</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {quantity} × {activeUnitConfig.label} ({planType === "monthly" ? "Monthly Membership" : "Daily Access"})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Access Dates</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatReadableDate(startDate)} – {formatReadableDate(endDate)} ({inclusiveDays} {inclusiveDays === 1 ? "day" : "days"})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Estimated Total</span>
                    <span className="font-bold text-[#C2410C] dark:text-[#FB923C]">
                      ${estimatedCost} USD <span className="text-gray-500 text-[11px] font-normal">(approx. NPR {(estimatedCost * NPR_RATE).toLocaleString()})</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Guest Contact</span>
                    <span className="font-semibold text-gray-900 dark:text-white truncate block">
                      {nomadName} ({nomadEmail})
                    </span>
                  </div>
                </div>

                {notes && (
                  <div className="pt-2 border-t border-[#E8E2D8]/60 dark:border-[#2A2A2E]/60">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Special Requests</span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 italic mt-0.5">&ldquo;{notes}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* What Happens Next Guidance */}
              <div className="bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-4 sm:p-5 space-y-2.5 text-left">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white block">
                  What happens next?
                </span>
                <ol className="text-xs text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong className="text-gray-900 dark:text-white">Host Review:</strong> The host checks desk availability (usually replies within a few hours).
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Confirmation &amp; Access Details:</strong> You will receive an email and an in-app message. Once accepted, full arrival instructions and door access details unlock.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Direct Payment:</strong> You will arrange payment directly with the host on check-in.
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <Link
                  href={`/resources/coworking/${hub.slug}`}
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#E8E2D8] dark:border-[#282828] bg-white dark:bg-[#18181A] text-gray-900 dark:text-white text-xs font-bold hover:border-[#C2410C] transition-colors text-center"
                >
                  View Workspace Page
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-8 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C2410C]/20 cursor-pointer"
                >
                  Close &amp; Return
                </button>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════════
               ACTIVE FORM & SUMMARY (2-Column Grid)
               ═══════════════════════════════════════════════════════════ */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* LEFT COLUMN: FORM INPUTS (7 COLS) */}
              <div className="lg:col-span-7 space-y-4">
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* 1. PLAN DURATION: DAILY VS MONTHLY (Segmented Control) */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Plan Duration *
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPlanType("daily")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        planType === "daily"
                          ? "bg-white dark:bg-[#242428] text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-white/10"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <span>Daily Pass</span>
                      <span className="text-[10px] font-mono text-[#C2410C] dark:text-[#FB923C]">
                        (${dailyRate}/day)
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanType("monthly")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        planType === "monthly"
                          ? "bg-white dark:bg-[#242428] text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-white/10"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <span>Monthly Membership</span>
                      <span className="text-[10px] font-mono text-[#C2410C] dark:text-[#FB923C]">
                        (${monthlyRate}/mo)
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. PACKAGE TIERS (Only shown if space offers accommodation / workation) */}
                {visiblePackageTiers.length > 1 && (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles size={12} className="text-[#C2410C] dark:text-[#FB923C]" />
                        Package Bundle
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">Optional Stays</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {visiblePackageTiers.map((pkg) => {
                        const isSelected = selectedPackage === pkg.id
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => {
                              setSelectedPackage(pkg.id)
                              if (pkg.id === "workation_all_inclusive") {
                                setSelectedUnit("coliving_room")
                              } else if (pkg.id === "desk_only") {
                                setSelectedUnit("hot_desk")
                              } else {
                                setSelectedUnit("dedicated_desk")
                              }
                            }}
                            className={`p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-1 ${
                              isSelected
                                ? "bg-[#C2410C]/8 dark:bg-[#C2410C]/15 border-[#C2410C] ring-1 ring-[#C2410C]"
                                : "bg-[#FBF9F5] dark:bg-[#181818] border-[#E8E2D8] dark:border-[#282828] hover:border-gray-400"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-wide text-gray-500">
                                  {pkg.tag}
                                </span>
                                {isSelected && (
                                  <CheckCircle size={12} className="text-[#C2410C] dark:text-[#FB923C]" />
                                )}
                              </div>
                              <span className="font-bold text-xs text-gray-900 dark:text-white block mt-0.5">
                                {pkg.title}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-[#A1A1AA] leading-snug line-clamp-2">
                              {pkg.desc}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 3. SEAT / UNIT TYPE SELECTION */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Layers size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> Seat / Desk Type *
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-[#C2410C] transition-colors cursor-pointer"
                  >
                    {visibleUnitOptions.map((u) => (
                      <option key={u.id} value={u.id} className="bg-white dark:bg-[#181818] text-gray-900 dark:text-white">
                        {u.label} — {planType === "monthly" ? `$${hub.priceMonthly || u.defaultMonthly}/month` : `$${hub.priceDaily || u.defaultDaily}/day`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. DATES (Inclusive Start and End Date) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> Start date *
                    </label>
                    <input
                      type="date"
                      required
                      min={nepalToday}
                      value={startDate}
                      onChange={(e) => {
                        const newStart = e.target.value
                        setStartDate(newStart)
                        if (endDate < newStart) {
                          setEndDate(newStart)
                        }
                      }}
                      className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> End date (inclusive) *
                    </label>
                    <input
                      type="date"
                      required
                      min={startDate || nepalToday}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={planType === "monthly"}
                      className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Readable Date Range Helper */}
                {startDate && endDate && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Access period: <strong className="text-gray-900 dark:text-white">{formatReadableDate(startDate)}</strong> to{" "}
                    <strong className="text-gray-900 dark:text-white">{formatReadableDate(endDate)}</strong> ({inclusiveDays} {inclusiveDays === 1 ? "day" : "days"} inclusive)
                  </p>
                )}

                {/* 5. SEATS / QUANTITY */}
                <div className="bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Number of seats
                    </span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      Select total desks or seats needed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] px-3 py-1.5 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#C2410C] hover:text-white dark:bg-[#222] dark:hover:bg-[#C2410C] text-gray-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="font-bold text-sm text-gray-900 dark:text-white min-w-[20px] text-center font-sans">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#C2410C] hover:text-white dark:bg-[#222] dark:hover:bg-[#C2410C] text-gray-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* 6. CONTACT DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={nomadName}
                        onChange={(e) => setNomadName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Contact Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={nomadEmail}
                        onChange={(e) => setNomadEmail(e.target.value)}
                        readOnly={!!session?.user?.email}
                        placeholder="nomad@example.com"
                        className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors read-only:opacity-85"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    WhatsApp / Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={nomadPhone}
                      onChange={(e) => setNomadPhone(e.target.value)}
                      placeholder="+977 9800000000"
                      className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                    />
                  </div>
                </div>

                {/* 7. SPECIAL REQUESTS (Clean neutral border, orange highlight ONLY on focus) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Special Requests / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Dual monitor request, quiet call booth preference, arrival time..."
                    className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] transition-colors resize-none"
                  />
                </div>

                {/* DESKTOP SUBMIT BUTTON (Dropped misleading $ and checkmark) */}
                <div className="hidden lg:block pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C2410C]/20 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending booking request...</span>
                      </>
                    ) : (
                      <span>Send booking request</span>
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: TRANSPARENT SUMMARY CARD (5 COLS) */}
              <div className="lg:col-span-5 bg-[#FAF8F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-4">
                <div className="absolute top-0 inset-x-0 h-1 bg-[#C2410C]" />

                <div className="space-y-3.5">
                  {/* Summary Header */}
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#282828] pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C]">
                      Summary of request
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-[#121212] px-2.5 py-1 rounded-full border border-[#E8E2D8] dark:border-[#282828] shadow-xs">
                      {planType === "monthly" ? "Monthly Membership" : `${inclusiveDays} Days Access`}
                    </span>
                  </div>

                  {/* Selected Unit Breakdown */}
                  <div className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl p-3 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Selected Workspace
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {quantity} × {activeUnitConfig.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                      {planType === "monthly" ? `$${monthlyRate}/mo` : `$${dailyRate}/day`}
                    </span>
                  </div>

                  {/* Dates & Duration Banner */}
                  <div className="p-3 bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl text-xs text-gray-800 dark:text-gray-200 flex items-center gap-2 shadow-xs">
                    <Clock size={15} className="text-[#C2410C] dark:text-[#FB923C] flex-shrink-0" />
                    <span className="truncate font-medium text-[11px]">
                      {startDate && endDate
                        ? `${formatReadableDate(startDate)} ➔ ${formatReadableDate(endDate)}`
                        : "Select dates"}
                    </span>
                  </div>

                  {/* Transparent Arithmetic Breakdown */}
                  <div className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl p-3 space-y-2 text-xs shadow-xs">
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                      <span>Rate calculation:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {planType === "monthly"
                          ? `$${monthlyRate} × ${monthsCount} mo × ${quantity} seat = $${estimatedCost}`
                          : `$${dailyRate} × ${inclusiveDays} days × ${quantity} seat = $${estimatedCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <span>Reservation fee:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">$0.00 (Free)</span>
                    </div>
                  </div>

                  {/* Estimated Grand Total */}
                  <div className="border-t border-[#E8E2D8] dark:border-[#282828] pt-3 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider block">
                        Estimated total
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium block">
                        arranged directly with host
                      </span>
                      <span className="text-[9.5px] text-gray-400 font-normal block mt-0.5">
                        approx. NPR {(estimatedCost * NPR_RATE).toLocaleString()} ({RATE_DATE})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#C2410C] dark:text-[#FB923C] tracking-tight block">
                        ${estimatedCost} USD
                      </span>
                    </div>
                  </div>

                  {/* Paid / Due Now Notice */}
                  <div className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl p-3 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Paid now:
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        100% Free Seat Request
                      </span>
                    </div>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      $0 USD
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">
                    The host will review and confirm availability. You will arrange payment directly with them on check-in.
                  </p>
                </div>

                {/* Trust Badge & Mobile Submit Button */}
                <div className="space-y-3 pt-3 border-t border-[#E8E2D8] dark:border-[#282828]">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium">
                    <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>
                      Your details are shared only with this host.{" "}
                      <Link href="/privacy" target="_blank" className="underline hover:text-gray-900 dark:hover:text-white">
                        Privacy Policy
                      </Link>
                    </span>
                  </div>

                  {/* MOBILE SUBMIT BUTTON */}
                  <div className="lg:hidden">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C2410C]/20 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Sending booking request...</span>
                        </>
                      ) : (
                        <span>Send booking request</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
