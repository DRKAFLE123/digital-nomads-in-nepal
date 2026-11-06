"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
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
  Lock,
  Plus,
  Minus,
  Phone,
  Sparkles,
  Zap,
  Ticket,
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
}

interface BookingModalCardProps {
  isOpen: boolean
  onClose: () => void
  hub: HubForBooking | null
  initialUnitType?: string
}

export type PackageTier = "desk_only" | "workation_all_inclusive" | "stay_coworking_voucher"

export const PACKAGE_TIERS: Array<{
  id: PackageTier
  tag: string
  title: string
  desc: string
  icon: string
  highlight?: boolean
}> = [
  {
    id: "desk_only",
    tag: "Option A",
    title: "💻 Desk Only",
    desc: "Dedicated workspace seat with verified fiber Wi-Fi & backup power.",
    icon: "💻",
  },
  {
    id: "workation_all_inclusive",
    tag: "Option B • Popular",
    title: "⚡ Room + Desk Workation",
    desc: "Private room + guaranteed dedicated desk with backup power & breakfast.",
    icon: "⚡",
    highlight: true,
  },
  {
    id: "stay_coworking_voucher",
    tag: "Option C",
    title: "🎟️ Stay + Coworking Pass",
    desc: "Nomad room stay with multi-day passes to walk to nearby verified coworking hubs.",
    icon: "🎟️",
  },
]

export const UNIT_OPTIONS = [
  { id: "hot_desk", label: "Hot Desk / Flexi Seat", defaultMonthly: 80, defaultDaily: 5 },
  { id: "dedicated_desk", label: "Dedicated Fixed Desk", defaultMonthly: 120, defaultDaily: 8 },
  { id: "private_room", label: "Private Executive Room", defaultMonthly: 350, defaultDaily: 25 },
  { id: "meeting_hall", label: "Meeting Hall / Conference Room", defaultMonthly: 600, defaultDaily: 40 },
  { id: "coliving_room", label: "🛌 Coliving Work & Stay (Room + Desk Included)", defaultMonthly: 450, defaultDaily: 28 },
]

export default function BookingModalCard({
  isOpen,
  onClose,
  hub,
  initialUnitType,
}: BookingModalCardProps) {
  const { data: session } = useSession()

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

  useEffect(() => {
    if (isOpen) {
      setSuccess(false)
      setError("")
      setBookingRef("")
    }
  }, [isOpen])

  if (!isOpen || !hub) return null

  // Minimum datePicker constraint (today)
  const todayStr = new Date().toISOString().split("T")[0]

  const activeUnitConfig = UNIT_OPTIONS.find((u) => u.id === selectedUnit) || UNIT_OPTIONS[0]

  // Cost Calculation Engine
  let estimatedCost = 0
  let daysDifference = 0
  let totalSavings = 0
  let discountPercent = 0

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start >= today && end > start) {
      const timeDiff = end.getTime() - start.getTime()
      daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24))

      let dailyRate = hub.priceDaily || activeUnitConfig.defaultDaily
      let monthlyRate = hub.priceMonthly || activeUnitConfig.defaultMonthly

      if (selectedPackage === "workation_all_inclusive") {
        dailyRate = hub.priceDaily ? Math.round(hub.priceDaily * 3.2) : 28
        monthlyRate = hub.priceMonthly ? Math.max(420, Math.round(hub.priceMonthly * 3.2)) : 450
      } else if (selectedPackage === "stay_coworking_voucher") {
        dailyRate = hub.priceDaily ? Math.round(hub.priceDaily * 2.5) : 22
        monthlyRate = hub.priceMonthly ? Math.max(350, Math.round(hub.priceMonthly * 2.8)) : 380
      }

      const unDiscountedDailyCost = daysDifference * dailyRate * quantity

      let unitBaseCost = 0
      if (daysDifference >= 30) {
        const months = Math.floor(daysDifference / 30)
        const remDays = daysDifference % 30
        unitBaseCost = months * monthlyRate + remDays * dailyRate
        estimatedCost = unitBaseCost * quantity

        if (unDiscountedDailyCost > estimatedCost) {
          totalSavings = unDiscountedDailyCost - estimatedCost
          discountPercent = Math.round((totalSavings / unDiscountedDailyCost) * 100)
        }
      } else {
        unitBaseCost = daysDifference * dailyRate
        estimatedCost = unitBaseCost * quantity
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess(false)

    if (!startDate || !endDate) {
      setError("Please select check-in and check-out dates.")
      setSubmitting(false)
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start < today) {
      setError("Check-in date cannot be in the past. Please select today or a future date.")
      setSubmitting(false)
      return
    }

    if (end <= start) {
      setError("Check-out date must be after check-in date.")
      setSubmitting(false)
      return
    }

    if (!nomadName || !nomadEmail) {
      setError("Please provide your name and contact email.")
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`/api/work-hubs/${hub?.slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomadName,
          nomadEmail,
          startDate,
          endDate,
          notes: `PACKAGE: ${selectedPackage.toUpperCase()} | UNIT: ${selectedUnit.toUpperCase()} | Quantity: ${quantity} | Phone: ${nomadPhone} | ${notes}`.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setBookingRef(data.id || `NEPAL-WS-${Math.floor(100000 + Math.random() * 900000)}`)
        setSuccess(true)
      } else {
        const errData = await res.json()
        setError(errData.error || "Reservation request failed. Please check your details.")
      }
    } catch (err) {
      console.error("Booking error:", err)
      setError("An unexpected network error occurred.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* MODAL CONTAINER */}
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl shadow-2xl overflow-hidden my-auto text-gray-900 dark:text-[#F5F5F5] transition-all max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-[#C2410C] flex-shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E8E2D8] dark:border-[#26262A] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C2410C]/10 border border-[#C2410C]/30 rounded-2xl flex items-center justify-center text-[#C2410C] dark:text-[#FB923C] flex-shrink-0">
              <Building size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] flex items-center gap-1">
                <Calendar size={11} /> Instant Desk Reservation
              </span>
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white line-clamp-1">{hub.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                <MapPin size={11} className="text-[#C2410C] dark:text-[#FB923C] flex-shrink-0" /> {hub.city}, Nepal • {hub.address}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {success ? (
            /* COMBINED WORK + STAY SUCCESS CONFIRMATION VIEW */
            <div className="text-center py-6 sm:py-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle size={32} />
              </div>

              <div className="space-y-1.5 max-w-lg mx-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/10 dark:bg-[#C2410C]/20 px-3 py-1 rounded-full">
                  COMBINED WORKATION CONFIRMATION
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white pt-1">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Thank you <strong className="text-gray-900 dark:text-white">{nomadName}</strong>! Your combined reservation request for{" "}
                  <strong className="text-gray-900 dark:text-white">{hub.name}</strong> is logged.
                </p>
              </div>

              {/* Reference Banner */}
              <div className="bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between shadow-2xs">
                <div className="text-left">
                  <span className="text-[9.5px] font-bold text-gray-500 uppercase tracking-wider block">
                    Combined Reference Code
                  </span>
                  <p className="font-mono text-base sm:text-lg font-black text-[#C2410C] dark:text-[#FB923C] tracking-wider">
                    {bookingRef}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] font-bold text-gray-500 uppercase tracking-wider block">
                    Package Tier
                  </span>
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                    {PACKAGE_TIERS.find((p) => p.id === selectedPackage)?.title}
                  </span>
                </div>
              </div>

              {/* Single Combined Instructions Dual-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto text-left pt-1">
                {/* 1. Check-in Instructions */}
                <div className="bg-[#FAF7F2] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-gray-900 dark:text-white">
                    <MapPin size={13} className="text-[#C2410C]" />
                    <span>Check-in Instructions</span>
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-[#A1A1AA] space-y-1">
                    <p>
                      <strong>Address:</strong> {hub.address}, {hub.city}
                    </p>
                    <p>
                      <strong>Check-in:</strong> 2:00 PM onwards
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold pt-0.5">
                      ✓ Host keycard &amp; arrival notes sent to {nomadEmail}.
                    </p>
                  </div>
                </div>

                {/* 2. Desk Access Pass */}
                <div className="bg-[#FAF7F2] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-gray-900 dark:text-white">
                    <Zap size={13} className="text-emerald-600" />
                    <span>Desk Access &amp; Wi-Fi Pass</span>
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-[#A1A1AA] space-y-1">
                    <p>
                      <strong>Digital Pass:</strong>{" "}
                      <code className="bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 px-1.5 py-0.5 rounded font-mono font-bold text-gray-900 dark:text-white">
                        PASS-{bookingRef.slice(-6)}
                      </code>
                    </p>
                    <p>
                      <strong>Power Guarantee:</strong> Dual-WAN Fiber &amp; Generator
                    </p>
                    <p>
                      <strong>Access Hours:</strong> {hub.openingHours || "24/7 Access"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C2410C]/20 cursor-pointer"
                >
                  Done &amp; Close ✓
                </button>
              </div>
            </div>
          ) : (
            /* FORM & FIXED PRICE SUMMARY GRID */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN: FORM INPUTS (7 COLS) */}
              <div className="lg:col-span-7 space-y-3.5">
                
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl animate-in fade-in duration-150">
                    {error}
                  </div>
                )}

                {/* 0. PACKAGE TIER SELECTION */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} className="text-[#C2410C] dark:text-[#FB923C]" />
                      Package Tier *
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">Workation Bundles</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PACKAGE_TIERS.map((pkg) => {
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
                          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-1.5 ${
                            isSelected
                              ? "bg-[#C2410C]/8 dark:bg-[#C2410C]/15 border-[#C2410C] shadow-xs ring-1 ring-[#C2410C]"
                              : "bg-[#FBF9F5] dark:bg-[#181818] border-[#E8E2D8] dark:border-[#282828] hover:border-gray-400"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {pkg.tag}
                              </span>
                              {isSelected && <CheckCircle size={13} className="text-[#C2410C] dark:text-[#FB923C]" />}
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

                {/* 1. SEAT TYPE DROPDOWN */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Layers size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> Select Seat / Room Type *
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-[#C2410C] transition-colors cursor-pointer"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.id} value={u.id} className="bg-white dark:bg-[#181818] text-gray-900 dark:text-white">
                        {u.label} (${hub.priceMonthly || u.defaultMonthly}/mo • ${hub.priceDaily || u.defaultDaily}/day)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. DATES */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> Check-In Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> Check-Out Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
                    />
                  </div>
                </div>

                {/* 3. QUANTITY COUNTER */}
                <div className="bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Number of Desks / Seats
                    </span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      Select total quantity needed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] px-3 py-1.5 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#C2410C] hover:text-white dark:bg-[#222] dark:hover:bg-[#C2410C] text-gray-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm text-gray-900 dark:text-white font-mono min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#C2410C] hover:text-white dark:bg-[#222] dark:hover:bg-[#C2410C] text-gray-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* 4. CONTACT DETAILS */}
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
                        placeholder="Damodar K."
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
                        placeholder="nomad@example.com"
                        className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors"
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

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Special Requests / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Dual monitor request, quiet call booth, 24/7 keycard access..."
                    className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] transition-colors resize-none"
                  />
                </div>

                {/* DESKTOP SUBMIT BUTTON AT BOTTOM OF LEFT FORM */}
                <div className="hidden lg:block pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C2410C]/20 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : estimatedCost > 0 ? (
                      `Confirm Desk Reservation Request • $${estimatedCost} USD ✓`
                    ) : (
                      "Confirm Desk Reservation Request ✓"
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: FIXED SUMMARY OF BOOKING INFO CARD (5 COLS) */}
              <div className="lg:col-span-5 bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#282828] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full space-y-4">
                {/* Visual Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-[#C2410C]" />

                <div className="space-y-3.5">
                  {/* Summary Header */}
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#282828] pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C]">
                      SUMMARY OF BOOKING
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-[#121212] px-2.5 py-1 rounded-full border border-[#E8E2D8] dark:border-[#282828] shadow-xs">
                      {daysDifference > 0 ? `${daysDifference} Days Stay` : "Dates Pending"}
                    </span>
                  </div>

                  {/* Selected Package Breakdown */}
                  <div className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl p-3 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Package Tier
                      </span>
                      <span className="font-bold text-[#C2410C] dark:text-[#FB923C]">
                        {PACKAGE_TIERS.find((p) => p.id === selectedPackage)?.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] px-2 py-0.5 rounded-full">
                      {PACKAGE_TIERS.find((p) => p.id === selectedPackage)?.tag}
                    </span>
                  </div>

                  {/* Selected Seat Breakdown */}
                  <div className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl p-3 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Selected Unit
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {quantity} × {activeUnitConfig.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      ${hub.priceMonthly || activeUnitConfig.defaultMonthly}/mo
                    </span>
                  </div>

                  {/* Long-Term Nomad Savings Banner */}
                  {daysDifference >= 30 && totalSavings > 0 && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>30+ Day Long-Term Discount</span>
                      </div>
                      <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
                        Save {discountPercent}% (-${totalSavings} USD)
                      </span>
                    </div>
                  )}

                  {/* Status / Dates Banner */}
                  <div className="p-3 bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl text-xs text-[#C2410C] dark:text-[#FB923C] flex items-center gap-2 shadow-xs">
                    <Clock size={15} className="flex-shrink-0" />
                    <span className="truncate font-medium">
                      {startDate && endDate
                        ? `${startDate} ➔ ${endDate}`
                        : "Select check-in & out dates"}
                    </span>
                  </div>

                  {/* Quantity & Unit Row */}
                  <div className="flex justify-between items-center text-xs border-t border-[#E8E2D8] dark:border-[#282828] pt-3 text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Users size={14} className="text-[#C2410C] dark:text-[#FB923C]" /> Quantity
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">
                      {quantity} {quantity === 1 ? "Seat / Unit" : "Seats / Units"}
                    </span>
                  </div>

                  {/* Base Rates */}
                  <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Base Workspace Price:</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">
                      ${estimatedCost} USD
                    </span>
                  </div>

                  {/* Platform Deposit Fee */}
                  <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Reservation Fee:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$0.00 (Free)</span>
                  </div>

                  {/* Grand Total Row */}
                  <div className="border-t border-[#E8E2D8] dark:border-[#282828] pt-3 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider block">
                        GRAND TOTAL:
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        approx. NPR {(estimatedCost * 132).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#C2410C] dark:text-[#FB923C] font-mono tracking-tight block">
                        ${estimatedCost} USD
                      </span>
                    </div>
                  </div>

                  {/* Paid / Due Now Tag */}
                  <div className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-xl p-3 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        PAID / DUE NOW:
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100% Free Seat Request</span>
                    </div>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      $0 USD
                    </span>
                  </div>
                </div>

                {/* SSL Security Badge & Mobile Submit Button Container */}
                <div className="space-y-3 pt-3 border-t border-[#E8E2D8] dark:border-[#282828]">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium">
                    <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                    <span>256-bit Secure Gateway SSL Encrypted Session</span>
                  </div>

                  {/* MOBILE RESPONSIVE CONFIRMATION BUTTON AT THE VERY BOTTOM */}
                  <div className="lg:hidden">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C2410C]/20 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : estimatedCost > 0 ? (
                        `Confirm Reservation • $${estimatedCost} USD ✓`
                      ) : (
                        "Confirm Desk Reservation Request ✓"
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
