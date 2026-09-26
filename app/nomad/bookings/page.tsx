"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { 
  Calendar, 
  MapPin, 
  Wifi, 
  User, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Building2, 
  ShieldCheck, 
  Search,
  BedDouble,
} from "lucide-react"

interface BookingItem {
  id: string
  hubId: string
  nomadName: string
  nomadEmail: string
  startDate: string
  endDate: string
  notes?: string | null
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  createdAt: string
  hub: {
    id: string
    name: string
    slug: string
    city: string
    address: string
    photoUrl?: string | null
    contactEmail: string
    facilities?: any
    openingHours?: string | null
    ownerName?: string | null
    ownerEmail?: string | null
  }
}


export default function NomadBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "PENDING" | "CANCELLED">("ALL")
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/nomad/bookings")
    } else if (session?.user?.email) {
      setUserEmail(session.user.email)
      fetchUserBookings(session.user.email)
    }
  }, [session, status, router])

  // Fetch real user bookings for session email
  const fetchUserBookings = async (email: string) => {
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setBookings(data)
          if (data.length > 0) {
            setExpandedId(data[0].id)
          }
        }
      }
    } catch (err) {
      console.error("Failed to load user bookings:", err)
    } finally {
      setLoading(false)
    }
  }


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUserBookings(userEmail)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this reservation request?")) return
    setCancellingId(id)
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id, status: "CANCELLED" })
      })
      if (res.ok) {
        setBookings(prev =>
          prev.map(b => (b.id === id ? { ...b, status: "CANCELLED" as const } : b))
        )
      }
    } catch (err) {
      console.error("Cancellation error:", err)
    } finally {
      setCancellingId(null)
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === "ALL") return true
    return b.status === statusFilter
  })

  // Format dates & calculate stay length
  const formatDates = (startStr: string, endStr: string) => {
    const start = new Date(startStr)
    const end = new Date(endStr)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const startFormatted = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    const endFormatted = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    return { startFormatted, endFormatted, diffDays }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="relative border-b border-gray-800/80 bg-gradient-to-b from-[#121212] to-[#0A0A0A] py-10">
        <div className="max-w-6xl mx-[#auto] px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFD400]/10 text-[#FFD400] border border-[#FFD400]/30 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Nomad Reservation Portal
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                My Workspace & Coliving Passes
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                View detailed booking info, check-in dates, Wi-Fi credentials, host contacts, and manage active reservations.
              </p>
            </div>

            {/* Email Finder Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-[#181818] p-1.5 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 px-3 text-gray-400">
                <Mail className="w-4 h-4 text-[#FFD400]" />
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="Enter your email to load passes..."
                  className="bg-transparent text-xs sm:text-sm text-white focus:outline-none w-48 sm:w-60"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#FFD400] text-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                {loading ? "Loading..." : "Find Bookings"}
              </button>
            </form>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "ALL", label: "All Reservations", count: bookings.length },
              { id: "CONFIRMED", label: "Confirmed Passes", count: bookings.filter(b => b.status === "CONFIRMED").length },
              { id: "PENDING", label: "Pending Approval", count: bookings.filter(b => b.status === "PENDING").length },
              { id: "CANCELLED", label: "Cancelled / Past", count: bookings.filter(b => b.status === "CANCELLED").length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                  statusFilter === tab.id
                    ? "bg-[#FFD400] text-black border-[#FFD400] font-bold shadow-md shadow-yellow-500/10"
                    : "bg-[#141414] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  statusFilter === tab.id ? "bg-black/20 text-black font-bold" : "bg-gray-800 text-gray-300"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-[#121212] rounded-2xl border border-gray-800 p-8">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">No Bookings Yet</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              You haven't made any workspace or coliving reservations under <span className="text-[#FFD400] font-medium">{userEmail || "your account"}</span>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/resources/coworking"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFD400] text-black text-xs font-bold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Explore Workspaces & Desks
              </Link>
              <Link
                href="/stay"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1C1C] text-gray-200 border border-gray-700 text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Explore Nomad Coliving Stays
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map(booking => {
              const isExpanded = expandedId === booking.id
              const { startFormatted, endFormatted, diffDays } = formatDates(booking.startDate, booking.endDate)
              const isColiving = (booking.hub.facilities && JSON.stringify(booking.hub.facilities).toLowerCase().includes("coliving")) || booking.hub.name.toLowerCase().includes("coliving")

              return (
                <div
                  key={booking.id}
                  className={`bg-[#121212] border rounded-2xl transition-all overflow-hidden ${
                    isExpanded 
                      ? "border-[#FFD400]/40 shadow-xl shadow-yellow-500/5 bg-[#141414]" 
                      : "border-gray-800/80 hover:border-gray-700"
                  }`}
                >
                  {/* Card Compact Header (Always Visible) */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Hub Image Thumbnail */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex-shrink-0">
                        <Image
                          src={booking.hub.photoUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80"}
                          alt={booking.hub.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Info Summary */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {/* Status Badge */}
                          {booking.status === "CONFIRMED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> CONFIRMED PASS
                            </span>
                          )}
                          {booking.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" /> PENDING OWNER APPROVAL
                            </span>
                          )}
                          {booking.status === "CANCELLED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/30">
                              <XCircle className="w-3 h-3" /> CANCELLED
                            </span>
                          )}

                          {/* Space Type Badge */}
                          {isColiving ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              <BedDouble className="w-3 h-3" /> Live & Work Coliving
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              <Building2 className="w-3 h-3" /> Work Hub Pass
                            </span>
                          )}

                          <span className="text-xs font-mono font-bold text-[#FFD400] bg-[#1A1A1A] px-2 py-0.5 rounded border border-gray-800">
                            Booking ID: #{booking.id}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-white leading-snug">
                          {booking.hub.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1.5">
                          <span className="flex items-center gap-1 text-gray-300">
                            <MapPin className="w-3.5 h-3.5 text-[#FFD400]" />
                            {booking.hub.city}, Nepal
                          </span>
                          <span className="flex items-center gap-1 font-medium text-white bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                            <Calendar className="w-3.5 h-3.5 text-[#FFD400]" />
                            {startFormatted} → {endFormatted}
                          </span>
                          <span className="px-2 py-0.5 bg-yellow-500/10 text-[#FFD400] rounded font-semibold text-[11px]">
                            {diffDays} {diffDays === 1 ? "Day" : "Days"} Stay
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action & Toggle Expand */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <button
                        onClick={() => toggleExpand(booking.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border ${
                          isExpanded
                            ? "bg-[#FFD400] text-black border-[#FFD400]"
                            : "bg-[#1A1A1A] text-gray-200 border-gray-700 hover:border-gray-600 hover:text-white"
                        }`}
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Details</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>View Full Booking Details</span>
                            <ChevronDown className="w-4 h-4 text-[#FFD400]" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed View (Accordion Panel) */}
                  {isExpanded && (
                    <div className="border-t border-gray-800 bg-[#0E0E0E] p-5 sm:p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Column 1: Booked Space & Amenities */}
                        <div className="bg-[#141414] p-4 rounded-xl border border-gray-800/80 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#FFD400] uppercase tracking-wider">
                            <Building2 className="w-4 h-4" /> Reserved Space & Items
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {isColiving ? "Coliving Workcation Suite + Dedicated Desk" : "High-Speed Hot Desk & Lounge Pass"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Address: <span className="text-gray-200">{booking.hub.address}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Access Hours: <span className="text-emerald-400 font-medium">{booking.hub.openingHours || "24/7 Unlimited Access"}</span>
                            </p>
                          </div>

                          <div className="pt-2 border-t border-gray-800">
                            <p className="text-[11px] font-semibold text-gray-400 mb-2">Guaranteed Hub Facilities:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {Array.isArray(booking.hub.facilities) ? (
                                booking.hub.facilities.map((fac: string, idx: number) => (
                                  <span key={idx} className="px-2 py-0.5 bg-[#1C1C1C] text-gray-300 text-[10px] rounded border border-gray-800">
                                    ✓ {fac}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">High Speed Internet, Backup Power</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Nomad Pass Wi-Fi & Check-in Info */}
                        <div className="bg-[#141414] p-4 rounded-xl border border-gray-800/80 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#FFD400] uppercase tracking-wider">
                            <Wifi className="w-4 h-4" /> Wi-Fi & Check-in Pass
                          </div>

                          {booking.status === "CONFIRMED" ? (
                            <div className="bg-[#1A1A1A] p-3 rounded-lg border border-emerald-500/30 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">Hub Wi-Fi SSID:</span>
                                <span className="font-mono font-bold text-white bg-black px-2 py-0.5 rounded border border-gray-800">
                                  {booking.hub.name.split(" ")[0]}_Starlink_Nomad
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">Passcode Key:</span>
                                <span className="font-mono font-bold text-[#FFD400] bg-black px-2 py-0.5 rounded border border-gray-800">
                                  NOMAD_NEPAL_2026!
                                </span>
                              </div>
                              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Starlink 200+ Mbps Active Guarantee
                              </p>
                            </div>
                          ) : (
                            <div className="bg-[#1A1A1A] p-3 rounded-lg border border-amber-500/30 text-xs text-amber-300">
                              Wi-Fi Passcode & Check-in QR code will be activated automatically once property owner confirms this booking.
                            </div>
                          )}

                          <div className="pt-2 border-t border-gray-800 text-xs text-gray-400 space-y-1">
                            <div className="flex justify-between">
                              <span>Guest Name:</span>
                              <span className="text-white font-medium">{booking.nomadName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Guest Email:</span>
                              <span className="text-gray-300 font-mono">{booking.nomadEmail}</span>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Property Host & Action Support */}
                        <div className="bg-[#141414] p-4 rounded-xl border border-gray-800/80 space-y-3 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-[#FFD400] uppercase tracking-wider mb-2">
                              <User className="w-4 h-4" /> Host & Property Contact
                            </div>
                            <p className="text-sm font-semibold text-white">
                              {booking.hub.ownerName || "Property Operations Team"}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                              <Mail className="w-3.5 h-3.5 text-gray-500" />
                              <a href={`mailto:${booking.hub.contactEmail}`} className="hover:text-[#FFD400] transition-colors underline">
                                {booking.hub.contactEmail}
                              </a>
                            </p>
                          </div>

                          {/* Quick Action Links */}
                          <div className="pt-3 border-t border-gray-800 space-y-2">
                            <div className="flex gap-2">
                              <a
                                href={`mailto:${booking.hub.contactEmail}?subject=Question regarding booking #${booking.id}`}
                                className="flex-1 px-3 py-2 bg-[#222] text-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center flex items-center justify-center gap-1.5"
                              >
                                <Mail className="w-3.5 h-3.5 text-[#FFD400]" /> Contact Host
                              </a>
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(booking.hub.name + " " + booking.hub.city)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 px-3 py-2 bg-[#222] text-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center flex items-center justify-center gap-1.5"
                              >
                                <MapPin className="w-3.5 h-3.5 text-[#FFD400]" /> Map Directions
                              </a>
                            </div>

                            {booking.status !== "CANCELLED" && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                {cancellingId === booking.id ? "Cancelling..." : "Cancel Reservation"}
                              </button>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Guest Request Notes if present */}
                      {booking.notes && (
                        <div className="bg-[#161616] p-3.5 rounded-xl border border-gray-800 text-xs">
                          <span className="font-semibold text-[#FFD400] mr-2">Nomad Special Request:</span>
                          <span className="text-gray-300 italic">"{booking.notes}"</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
