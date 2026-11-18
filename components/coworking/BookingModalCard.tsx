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
  ArrowLeft,
  MessageSquare,
  HelpCircle,
  AlertCircle,
  FileText,
  Check
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

export type OfferingType = "work" | "stay" | "work_and_stay"
export type PlanType = "daily" | "monthly"

export interface OfferingUnitOption {
  id: string
  label: string
  offering: OfferingType
  desc: string
  defaultDaily: number
  defaultMonthly: number
  icon: string
}

export const OFFERING_UNITS: OfferingUnitOption[] = [
  // 1. WORK UNITS
  {
    id: "hot_desk",
    label: "Hot Desk / Flexi Seat",
    offering: "work",
    desc: "Flexible open-space seat, verified fiber Wi-Fi, generator backup power.",
    defaultDaily: 6,
    defaultMonthly: 80,
    icon: "💻"
  },
  {
    id: "dedicated_desk",
    label: "Dedicated Fixed Desk",
    offering: "work",
    desc: "Your personal reserved desk, ergonomic chair, secure locker.",
    defaultDaily: 9,
    defaultMonthly: 120,
    icon: "🪑"
  },
  {
    id: "private_office",
    label: "Private Team Office",
    offering: "work",
    desc: "Lockable private room for 1–4 people with whiteboard and 24/7 access.",
    defaultDaily: 25,
    defaultMonthly: 350,
    icon: "🚪"
  },
  {
    id: "meeting_hall",
    label: "Meeting / Conference Room",
    offering: "work",
    desc: "Projector, video conferencing setup, tea/coffee service.",
    defaultDaily: 45,
    defaultMonthly: 600,
    icon: "👥"
  },

  // 2. STAY UNITS
  {
    id: "nomad_room",
    label: "Private Nomad Room",
    offering: "stay",
    desc: "Ensuite bathroom, queen bed, balcony, and quiet workspace desk.",
    defaultDaily: 20,
    defaultMonthly: 380,
    icon: "🛏️"
  },
  {
    id: "coliving_dorm",
    label: "Coliving Shared Suite",
    offering: "stay",
    desc: "Shared nomad room (max 3 roommates) with hot shower & kitchen access.",
    defaultDaily: 10,
    defaultMonthly: 220,
    icon: "🛌"
  },
  {
    id: "studio_apartment",
    label: "Full Nomad Apartment",
    offering: "stay",
    desc: "Kitchenette, private living room, high-speed Wi-Fi, mountain terrace.",
    defaultDaily: 35,
    defaultMonthly: 650,
    icon: "🏠"
  },

  // 3. WORK + STAY UNITS
  {
    id: "workation_package",
    label: "Room + Dedicated Desk Bundle",
    offering: "work_and_stay",
    desc: "Private room + guaranteed dedicated desk in the workspace + all facilities.",
    defaultDaily: 28,
    defaultMonthly: 450,
    icon: "⚡"
  },
  {
    id: "coliving_pass_bundle",
    label: "Coliving Bed + Coworking Pass",
    offering: "work_and_stay",
    desc: "Coliving accommodation + unlimited 24/7 coworking desk access.",
    defaultDaily: 22,
    defaultMonthly: 360,
    icon: "🎟️"
  }
]

// 1-Click Nomad Work Need Tags
const NOMAD_QUICK_TAGS = [
  "🖥️ Dual Monitor",
  "🤫 Quiet Call Booth",
  "⚡ Standing Desk",
  "🔌 LAN Ethernet",
  "🌙 Late Arrival"
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

  // Stepper State: 1 (Space & Dates) -> 2 (Guest Details) -> 3 (Review & Send)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Offering Type: Work vs Stay vs Work + Stay
  const [selectedOffering, setSelectedOffering] = useState<OfferingType>("work")

  // Plan Type: Daily vs Monthly
  const [planType, setPlanType] = useState<PlanType>("daily")
  const [selectedUnit, setSelectedUnit] = useState<string>("hot_desk")

  // Guest Info
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

  // Check if hub supports stay / accommodation
  const hubHasStay = useMemo(() => {
    if (!hub) return false
    const facs = (hub.facilities || []).map((f) => f.toLowerCase())
    const type = (hub.spaceType || "").toLowerCase()
    return (
      facs.some(
        (f) =>
          f.includes("coliving") ||
          f.includes("stay") ||
          f.includes("room") ||
          f.includes("hotel") ||
          f.includes("hostel") ||
          f.includes("apartment")
      ) ||
      type.includes("coliving") ||
      type.includes("stay") ||
      type.includes("hotel") ||
      type.includes("hostel") ||
      type.includes("apartment") ||
      (hub.units || []).some(
        (u) =>
          u.type?.toLowerCase().includes("room") ||
          u.type?.toLowerCase().includes("stay")
      )
    )
  }, [hub])

  // Units filtered by active offering
  const availableUnits = useMemo(() => {
    return OFFERING_UNITS.filter((u) => u.offering === selectedOffering)
  }, [selectedOffering])

  // Keep selectedUnit valid when offering changes
  useEffect(() => {
    const isCurrentValid = availableUnits.some((u) => u.id === selectedUnit)
    if (!isCurrentValid && availableUnits.length > 0) {
      setSelectedUnit(availableUnits[0].id)
    }
  }, [selectedOffering, availableUnits, selectedUnit])

  // Update selected unit when initialUnitType prop changes
  useEffect(() => {
    if (initialUnitType) {
      const match = OFFERING_UNITS.find((u) => u.id === initialUnitType)
      if (match) {
        setSelectedOffering(match.offering)
        setSelectedUnit(match.id)
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
      setCurrentStep(1)
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
    OFFERING_UNITS.find((u) => u.id === selectedUnit) ||
    availableUnits[0] ||
    OFFERING_UNITS[0]

  // Dynamic rates strictly derived from chosen unit & hub pricing:
  let unitDailyRate = activeUnitConfig.defaultDaily
  let unitMonthlyRate = activeUnitConfig.defaultMonthly

  if (activeUnitConfig.id === "hot_desk" && hub.priceDaily) {
    unitDailyRate = hub.priceDaily
  }
  if (activeUnitConfig.id === "hot_desk" && hub.priceMonthly) {
    unitMonthlyRate = hub.priceMonthly
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
        estimatedCost = unitMonthlyRate * monthsCount * quantity
      } else {
        estimatedCost = unitDailyRate * inclusiveDays * quantity
      }
    }
  }

  // Quick Preset Handlers
  const handleSetPreset = (days: number) => {
    if (!startDate) return
    const start = new Date(startDate + "T00:00:00")
    if (isNaN(start.getTime())) return
    const target = new Date(start)
    target.setDate(target.getDate() + days - 1)
    const yyyy = target.getFullYear()
    const mm = String(target.getMonth() + 1).padStart(2, "0")
    const dd = String(target.getDate()).padStart(2, "0")
    setEndDate(`${yyyy}-${mm}-${dd}`)
  }

  // Step 1 Validation -> Proceed to Step 2
  const handleProceedToStep2 = () => {
    setError("")
    if (!startDate || !endDate) {
      setError("Please select both your start and end dates.")
      return
    }
    if (startDate < nepalToday) {
      setError("Start date cannot be in the past in Nepal time.")
      return
    }
    if (endDate < startDate) {
      setError("End date must be on or after start date.")
      return
    }
    setCurrentStep(2)
  }

  // Step 2 Validation -> Proceed to Step 3
  const handleProceedToStep3 = () => {
    setError("")
    if (!nomadName.trim() || !nomadEmail.trim()) {
      setError("Please provide your name and contact email.")
      return
    }
    setCurrentStep(3)
  }

  // Toggle quick tags in notes
  const handleToggleTag = (tag: string) => {
    if (notes.includes(tag)) {
      setNotes((prev) => prev.replace(tag, "").replace(/,\s*,/g, ",").trim())
    } else {
      setNotes((prev) => (prev ? `${prev}, ${tag}` : tag))
    }
  }

  // Final Form Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hub) return
    setSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      const offeringLabel =
        selectedOffering === "work"
          ? "WORK DESK"
          : selectedOffering === "stay"
          ? "NOMAD STAY"
          : "WORK + STAY PACKAGE"
      const planLabel = planType === "monthly" ? "MONTHLY MEMBERSHIP" : "DAILY PASS"

      const res = await fetch(`/api/work-hubs/${hub.slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomadName: nomadName.trim(),
          nomadEmail: nomadEmail.trim().toLowerCase(),
          startDate,
          endDate,
          notes: `OFFERING: ${offeringLabel} | PLAN: ${planLabel} | UNIT: ${activeUnitConfig.label} | Seats/Guests: ${quantity} | Phone: ${nomadPhone || "N/A"} | Est: $${estimatedCost} USD | Notes: ${notes}`.trim()
        })
      })

      if (res.ok) {
        const data = await res.json()
        const cleanRef =
          data.refCode ||
          `DNN-${(data.id || "").slice(-4).toUpperCase() || Math.floor(1000 + Math.random() * 9000)}`
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

        {/* Modal Header & Stepper Progress */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E8E2D8] dark:border-[#26262A] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/10 dark:bg-[#C2410C]/20 px-2.5 py-0.5 rounded-full">
                  Booking request
                </span>
                <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline-block">
                  Direct host connection · $0 due now
                </span>
              </div>
              <h2 className="font-serif font-black text-base sm:text-xl text-gray-900 dark:text-white truncate mt-0.5">
                {hub.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate">
                <MapPin size={11} className="text-[#C2410C] shrink-0" />
                <span>{hub.address || `${hub.city}, Nepal`}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#202024] dark:hover:bg-[#2c2c30] text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stepper Progress Bar (Only visible when form active) */}
          {!success && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#202024] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                    currentStep === 1
                      ? "text-[#C2410C] dark:text-[#FB923C]"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                      currentStep === 1
                        ? "bg-[#C2410C] text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    1
                  </span>
                  <span>Space &amp; Dates</span>
                </button>

                <span className="text-gray-300 dark:text-gray-700">→</span>

                <button
                  type="button"
                  onClick={() => {
                    if (startDate && endDate) setCurrentStep(2)
                  }}
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    currentStep === 2
                      ? "text-[#C2410C] dark:text-[#FB923C]"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                      currentStep === 2
                        ? "bg-[#C2410C] text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    2
                  </span>
                  <span>Guest Details</span>
                </button>

                <span className="text-gray-300 dark:text-gray-700">→</span>

                <button
                  type="button"
                  onClick={() => {
                    if (startDate && endDate && nomadName && nomadEmail) setCurrentStep(3)
                  }}
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    currentStep === 3
                      ? "text-[#C2410C] dark:text-[#FB923C]"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                      currentStep === 3
                        ? "bg-[#C2410C] text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    3
                  </span>
                  <span>Review &amp; Send</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-gray-400 hidden sm:inline-block">
                Step {currentStep} of 3
              </span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {success ? (
            /* ═══════════════════════════════════════════════════════════
               CONFIRMATION SCREEN: HONEST "REQUEST SENT" STATE
               ═══════════════════════════════════════════════════════════ */
            <div className="max-w-xl mx-auto py-4 sm:py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle size={32} />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Clock size={12} />
                  <span>Pending Host Review</span>
                </div>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight pt-1">
                  Booking Request Sent!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Your request has been delivered to <strong>{hub.name}</strong>. The host will confirm availability shortly.
                </p>
              </div>

              {/* Reference Short Code Card */}
              <div className="bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-4 sm:p-5 space-y-3 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]/60 dark:border-[#2A2A2E]/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Request Reference
                  </span>
                  <span className="text-xs font-mono font-bold text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/10 px-2 py-0.5 rounded-md">
                    {bookingRef}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Selected Unit</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {quantity} × {activeUnitConfig.label} ({planType === "monthly" ? "Monthly Membership" : "Daily Access"})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Access Period</span>
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
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Guest</span>
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
              <div className="bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-4 sm:p-5 space-y-2 text-left">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white block">
                  What happens next?
                </span>
                <ol className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong className="text-gray-900 dark:text-white">Host Review:</strong> The host checks availability (usually replies within a few hours).
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Confirmation:</strong> You will receive an email confirmation once accepted with door access and Wi-Fi instructions.
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
               ACTIVE MULTI-STEP BOOKING FLOW
               ═══════════════════════════════════════════════════════════ */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  STEP 1: SELECT SPACE & DATES
                 ───────────────────────────────────────────────────────── */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* A. OFFERING SWITCHER: WORK / STAY / WORK + STAY */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Choose Offering Type *
                      </label>
                      <span className="text-[10px] text-gray-400">
                        {hubHasStay ? "Workspace & Stays available" : "Verified Coworking Hub"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-gray-100 dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setSelectedOffering("work")}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          selectedOffering === "work"
                            ? "bg-white dark:bg-[#242428] text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-white/10"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span>💻</span>
                        <span>Work Only</span>
                      </button>

                      {hubHasStay && (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedOffering("stay")}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              selectedOffering === "stay"
                                ? "bg-white dark:bg-[#242428] text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-white/10"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            <span>🛏️</span>
                            <span>Stay / Coliving</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedOffering("work_and_stay")}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              selectedOffering === "work_and_stay"
                                ? "bg-[#023629] text-white shadow-xs"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            <span>⚡</span>
                            <span>Work + Stay Package</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* B. PLAN DURATION: DAILY VS MONTHLY */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Plan Duration *
                    </label>

                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setPlanType("daily")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          planType === "daily"
                            ? "bg-white dark:bg-[#242428] text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-white/10"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span>Daily Pass</span>
                        <span className="text-[10px] font-mono text-[#C2410C] dark:text-[#FB923C]">
                          (${unitDailyRate}/day)
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPlanType("monthly")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          planType === "monthly"
                            ? "bg-white dark:bg-[#242428] text-gray-900 dark:text-white shadow-xs border border-gray-200/80 dark:border-white/10"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span>Monthly Membership</span>
                        <span className="text-[10px] font-mono text-[#C2410C] dark:text-[#FB923C]">
                          (${unitMonthlyRate}/mo)
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* C. SEAT / UNIT TYPE SELECTION (Visual Card Grid) */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <Layers size={13} className="text-[#C2410C] dark:text-[#FB923C]" />
                      <span>Select Unit Type *</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {availableUnits.map((u) => {
                        const isSelected = selectedUnit === u.id
                        const priceDisplay =
                          planType === "monthly"
                            ? `$${u.id === "hot_desk" && hub.priceMonthly ? hub.priceMonthly : u.defaultMonthly}/month`
                            : `$${u.id === "hot_desk" && hub.priceDaily ? hub.priceDaily : u.defaultDaily}/day`

                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setSelectedUnit(u.id)}
                            className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? "bg-[#C2410C]/8 dark:bg-[#C2410C]/15 border-[#C2410C] ring-1 ring-[#C2410C]"
                                : "bg-[#FAF8F5] dark:bg-[#18181A] border-[#E8E2D8] dark:border-[#282828] hover:border-gray-400"
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span>{u.icon}</span>
                                <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                  {u.label}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-1">
                                {u.desc}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono font-bold text-[#C2410C] dark:text-[#FB923C]">
                                {priceDisplay}
                              </span>
                              {isSelected && (
                                <CheckCircle size={14} className="text-[#C2410C] ml-auto mt-1" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* D. DATES & INCLUSIVE PERIOD */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#C2410C] dark:text-[#FB923C]" />
                        <span>Dates (Inclusive Access) *</span>
                      </label>

                      {/* Quick Date Presets */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSetPreset(7)}
                          className="text-[10px] font-semibold text-gray-500 hover:text-[#C2410C] dark:hover:text-[#FB923C] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md cursor-pointer"
                        >
                          +1 Week
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPreset(30)}
                          className="text-[10px] font-semibold text-gray-500 hover:text-[#C2410C] dark:hover:text-[#FB923C] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md cursor-pointer"
                        >
                          +1 Month
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-gray-400 block mb-1">
                          Start date *
                        </span>
                        <input
                          type="date"
                          required
                          min={nepalToday}
                          value={startDate}
                          onChange={(e) => {
                            const newStart = e.target.value
                            setStartDate(newStart)
                            if (endDate < newStart) setEndDate(newStart)
                          }}
                          className="w-full bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-gray-400 block mb-1">
                          End date (inclusive) *
                        </span>
                        <input
                          type="date"
                          required
                          min={startDate || nepalToday}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                        />
                      </div>
                    </div>

                    {startDate && endDate && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pt-0.5">
                        <Clock size={12} className="text-[#C2410C]" />
                        <span>
                          Access period: <strong>{formatReadableDate(startDate)}</strong> to{" "}
                          <strong>{formatReadableDate(endDate)}</strong> (
                          {inclusiveDays} {inclusiveDays === 1 ? "day" : "days"} inclusive)
                        </span>
                      </p>
                    )}
                  </div>

                  {/* E. SEAT / GUEST QUANTITY */}
                  <div className="p-3.5 bg-gray-50 dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white block">
                        Number of seats / guests
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Select total desks or rooms needed
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-mono font-bold text-sm w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                        className="w-8 h-8 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Step 1 Footer Navigation */}
                  <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-[#202024]">
                    <div className="text-xs text-gray-500">
                      Estimated:{" "}
                      <strong className="text-[#C2410C] dark:text-[#FB923C] font-mono">
                        ${estimatedCost} USD
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#C2410C]/20 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <span>Continue to Guest Details</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  STEP 2: GUEST DETAILS & WORK REQUIREMENTS
                 ───────────────────────────────────────────────────────── */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-3 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={nomadName}
                          onChange={(e) => setNomadName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                          Contact Email *
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-3 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={nomadEmail}
                            onChange={(e) => setNomadEmail(e.target.value)}
                            placeholder="nomad@example.com"
                            className="w-full bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                          WhatsApp / Phone (Optional)
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-3 text-gray-400" />
                          <input
                            type="tel"
                            value={nomadPhone}
                            onChange={(e) => setNomadPhone(e.target.value)}
                            placeholder="+977 9800000000"
                            className="w-full bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Work Tags */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Quick Work Needs (Click to add)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {NOMAD_QUICK_TAGS.map((tag) => {
                          const active = notes.includes(tag)
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                active
                                  ? "bg-[#C2410C] text-white shadow-xs"
                                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {active && "✓ "}
                              {tag}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Custom Notes */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                        Special Requests / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Arrival time, dual monitor setup, quiet booth preference..."
                        className="w-full bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] resize-none"
                      />
                    </div>
                  </div>

                  {/* Step 2 Footer Navigation */}
                  <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-[#202024]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Space &amp; Dates</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#C2410C]/20 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <span>Continue to Review</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  STEP 3: REVIEW & SEND BOOKING REQUEST
                 ───────────────────────────────────────────────────────── */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Detailed Review Card */}
                  <div className="bg-[#FAF8F5] dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E8E2D8]/60 dark:border-[#2A2A2E]/60 pb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C]">
                        Request Summary
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {planType === "monthly" ? "Monthly Membership" : `${inclusiveDays} Days Access`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Selected Offering &amp; Unit
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {quantity} × {activeUnitConfig.label}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Access Dates
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatReadableDate(startDate)} ➔ {formatReadableDate(endDate)} ({inclusiveDays} days)
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Guest Contact
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white truncate block">
                          {nomadName} ({nomadEmail}) {nomadPhone ? `· ${nomadPhone}` : ""}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Rate Calculation
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {planType === "monthly"
                            ? `$${unitMonthlyRate} × ${monthsCount} mo × ${quantity} seat = $${estimatedCost}`
                            : `$${unitDailyRate} × ${inclusiveDays} days × ${quantity} seat = $${estimatedCost}`}
                        </span>
                      </div>
                    </div>

                    {notes && (
                      <div className="pt-2 border-t border-[#E8E2D8]/60 dark:border-[#2A2A2E]/60">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Notes / Preferences
                        </span>
                        <p className="text-xs text-gray-700 dark:text-gray-300 italic mt-0.5">
                          &ldquo;{notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown & Zero Due Now Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#18181A] border border-[#E8E2D8] dark:border-[#282828] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                          Estimated Total
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          approx. NPR {(estimatedCost * NPR_RATE).toLocaleString()} ({RATE_DATE})
                        </span>
                      </div>
                      <span className="text-2xl font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                        ${estimatedCost} USD
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                          Paid Now
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                          100% Free Seat Request
                        </span>
                      </div>
                      <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                        $0 USD
                      </span>
                    </div>
                  </div>

                  {/* Payment Transparency Notice */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-[#18181A] rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      The host will review your request and confirm availability. Payment is arranged directly with the host upon check-in.
                    </span>
                  </div>

                  {/* Step 3 Footer Navigation & Submit */}
                  <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-[#202024]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Details</span>
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C2410C]/25 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Sending request...</span>
                        </>
                      ) : (
                        <>
                          <span>Send booking request</span>
                          <Check size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
