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

      const dailyRate = hub.priceDaily || activeUnitConfig.defaultDaily
      const monthlyRate = hub.priceMonthly || activeUnitConfig.defaultMonthly

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
          notes: `Unit: ${selectedUnit.toUpperCase()} | Quantity: ${quantity} | Phone/WhatsApp: ${nomadPhone} | ${notes}`.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setBookingRef(data.id || `HUB-${Math.floor(100000 + Math.random() * 900000)}`)
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* MODAL CONTAINER */}
      <div
        className="relative w-full max-w-4xl bg-[#121212] border border-[#242424] rounded-3xl shadow-2xl overflow-hidden my-auto text-[#F5F5F5] transition-all max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Bar Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 flex-shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#242424] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-center justify-center text-amber-400 flex-shrink-0">
              <Building size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                <Calendar size={11} /> Instant Desk Reservation
              </span>
              <h2 className="text-base sm:text-lg font-black text-white line-clamp-1">{hub.name}</h2>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                <MapPin size={11} className="text-amber-400 flex-shrink-0" /> {hub.city}, Nepal • {hub.address}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {success ? (
            /* SUCCESS STATE */
            <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle size={36} />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-white">Reservation Request Confirmed!</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Thank you <strong className="text-white">{nomadName}</strong>! Your seat reservation request for{" "}
                  <strong className="text-white">{hub.name}</strong> has been logged.
                </p>
              </div>

              <div className="bg-[#181818] border border-[#282828] rounded-2xl p-5 max-w-sm mx-auto space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Reservation Reference Code
                </span>
                <p className="font-mono text-lg font-black text-amber-400 tracking-wider">
                  {bookingRef}
                </p>
                <p className="text-[11px] text-gray-400 pt-1">
                  We sent confirmation details to <span className="text-white font-medium">{nomadEmail}</span>.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-amber-400 hover:bg-yellow-300 text-black font-black px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  Done & Close ✓
                </button>
              </div>
            </div>
          ) : (
            /* FORM & FIXED PRICE SUMMARY GRID */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN: FORM INPUTS (7 COLS) */}
              <div className="lg:col-span-7 space-y-3.5">
                
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl animate-in fade-in duration-150">
                    {error}
                  </div>
                )}

                {/* 1. SEAT TYPE DROPDOWN */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Layers size={12} className="text-amber-400" /> Select Seat / Room Type *
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.label} (${hub.priceMonthly || u.defaultMonthly}/mo • ${hub.priceDaily || u.defaultDaily}/day)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. DATES */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar size={12} className="text-amber-400" /> Check-In Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar size={12} className="text-amber-400" /> Check-Out Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* 3. QUANTITY COUNTER */}
                <div className="bg-[#181818] border border-[#282828] rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Number of Desks / Seats
                    </span>
                    <span className="text-xs text-gray-300 font-medium">
                      Select total quantity needed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-[#121212] border border-[#282828] px-3 py-1.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-[#222] hover:bg-amber-400 hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm text-white font-mono min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-lg bg-[#222] hover:bg-amber-400 hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* 4. CONTACT DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={nomadName}
                        onChange={(e) => setNomadName(e.target.value)}
                        placeholder="Damodar K."
                        className="w-full bg-[#181818] border border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Contact Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={nomadEmail}
                        onChange={(e) => setNomadEmail(e.target.value)}
                        placeholder="nomad@example.com"
                        className="w-full bg-[#181818] border border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    WhatsApp / Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="tel"
                      value={nomadPhone}
                      onChange={(e) => setNomadPhone(e.target.value)}
                      placeholder="+977 9800000000"
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Special Requests / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Dual monitor request, quiet call booth, 24/7 keycard access..."
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                {/* DESKTOP SUBMIT BUTTON AT BOTTOM OF LEFT FORM */}
                <div className="hidden lg:block pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
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
              <div className="lg:col-span-5 bg-[#181818] border border-[#282828] rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full space-y-4">
                {/* Visual Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-300" />

                <div className="space-y-3.5">
                  {/* Summary Header */}
                  <div className="flex items-center justify-between border-b border-[#282828] pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      SUMMARY OF BOOKING
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-[#121212] px-2.5 py-1 rounded-full border border-[#282828]">
                      {daysDifference > 0 ? `${daysDifference} Days Stay` : "Dates Pending"}
                    </span>
                  </div>

                  {/* Selected Seat Breakdown */}
                  <div className="bg-[#121212] border border-[#282828] rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Selected Unit
                      </span>
                      <span className="font-bold text-amber-400">
                        {quantity} × {activeUnitConfig.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      ${hub.priceMonthly || activeUnitConfig.defaultMonthly}/mo
                    </span>
                  </div>

                  {/* Long-Term Nomad Savings Banner */}
                  {daysDifference >= 30 && totalSavings > 0 && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                        <span>30+ Day Long-Term Discount</span>
                      </div>
                      <span className="font-mono font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
                        Save {discountPercent}% (-${totalSavings} USD)
                      </span>
                    </div>
                  )}

                  {/* Status / Dates Banner */}
                  <div className="p-3 bg-[#121212] border border-[#282828] rounded-xl text-xs text-amber-400 flex items-center gap-2">
                    <Clock size={15} className="flex-shrink-0" />
                    <span className="truncate">
                      {startDate && endDate
                        ? `${startDate} ➔ ${endDate}`
                        : "Select check-in & out dates"}
                    </span>
                  </div>

                  {/* Quantity & Unit Row */}
                  <div className="flex justify-between items-center text-xs border-t border-[#282828] pt-3 text-gray-300">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Users size={14} className="text-amber-400" /> Quantity
                    </span>
                    <span className="font-bold text-white font-mono">
                      {quantity} {quantity === 1 ? "Seat / Unit" : "Seats / Units"}
                    </span>
                  </div>

                  {/* Base Rates */}
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span className="text-gray-400">Base Workspace Price:</span>
                    <span className="font-bold text-white font-mono">
                      ${estimatedCost} USD
                    </span>
                  </div>

                  {/* Platform Deposit Fee */}
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span className="text-gray-400">Reservation Fee:</span>
                    <span className="font-bold text-emerald-400">$0.00 (Free)</span>
                  </div>

                  {/* Grand Total Row */}
                  <div className="border-t border-[#282828] pt-3 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-black text-white uppercase tracking-wider block">
                        GRAND TOTAL:
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        approx. NPR {(estimatedCost * 132).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-400 font-mono tracking-tight block">
                        ${estimatedCost} USD
                      </span>
                    </div>
                  </div>

                  {/* Paid / Due Now Tag */}
                  <div className="bg-[#121212] border border-[#282828] rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        PAID / DUE NOW:
                      </span>
                      <span className="text-xs font-bold text-emerald-400">100% Free Seat Request</span>
                    </div>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      $0 USD
                    </span>
                  </div>
                </div>

                {/* SSL Security Badge & Mobile Submit Button Container */}
                <div className="space-y-3 pt-3 border-t border-[#282828]">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center font-medium">
                    <Lock size={12} className="text-emerald-400" />
                    <span>256-bit Secure Gateway SSL Encrypted Session</span>
                  </div>

                  {/* MOBILE RESPONSIVE CONFIRMATION BUTTON AT THE VERY BOTTOM */}
                  <div className="lg:hidden">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-amber-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
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
