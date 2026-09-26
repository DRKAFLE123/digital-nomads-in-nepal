"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  Edit3, 
  Save, 
  User, 
  MapPin, 
  PlusCircle, 
  RefreshCw 
} from "lucide-react"

interface HubData {
  id: string
  name: string
  slug: string
  city: string
  address: string
  spaceType: string
  priceDaily?: number | null
  priceMonthly?: number | null
  openingHours?: string | null
  photoUrl?: string | null
  contactEmail: string
  ownerEmail?: string | null
  ownerName?: string | null
  facilities: string[]
  bookings: any[]
}

export default function OwnerDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ownerEmail, setOwnerEmail] = useState("")
  const [hubs, setHubs] = useState<HubData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"BOOKINGS" | "LISTINGS" | "SETTINGS">("BOOKINGS")
  const [bookingFilter, setBookingFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/owner/dashboard")
    } else if (session?.user?.email) {
      setOwnerEmail(session.user.email)
      fetchOwnerData(session.user.email)
    } else {
      fetchOwnerData("pema.mustang@nomadnepal.com")
    }
  }, [session, status, router])
  
  // Editing state for property pricing & facilities
  const [editingHubId, setEditingHubId] = useState<string | null>(null)
  const [editPriceDaily, setEditPriceDaily] = useState<number>(12)
  const [editPriceMonthly, setEditPriceMonthly] = useState<number>(220)
  const [editOpeningHours, setEditOpeningHours] = useState<string>("24/7 Access")
  const [editFacilities, setEditFacilities] = useState<string>("")
  const [updatingHub, setUpdatingHub] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch owner hubs and bookings
  const fetchOwnerData = async (email: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/owner/hubs?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setHubs(data)
        } else {
          // If no custom owned hub found for typed email, attempt fallback fetch for demo hubs
          const fallbackRes = await fetch("/api/work-hubs")
          if (fallbackRes.ok) {
            const allHubs = await fallbackRes.json()
            const formatted = allHubs.slice(0, 3).map((h: any) => ({
              ...h,
              facilities: Array.isArray(h.facilities) ? h.facilities : ["Starlink Wi-Fi", "Solar Backup"],
              bookings: [
                {
                  id: `bk_${h.id}_101`,
                  nomadName: "Alex Rivera",
                  nomadEmail: "alex@nomadtech.io",
                  startDate: "2026-09-15T00:00:00.000Z",
                  endDate: "2026-10-15T00:00:00.000Z",
                  notes: "Starlink speed test requested for remote daily standups.",
                  status: "CONFIRMED",
                  createdAt: new Date().toISOString()
                },
                {
                  id: `bk_${h.id}_102`,
                  nomadName: "Sophie Martin",
                  nomadEmail: "sophie.m@designnomad.fr",
                  startDate: "2026-10-01T00:00:00.000Z",
                  endDate: "2026-10-20T00:00:00.000Z",
                  notes: "Coliving private room with mountain view.",
                  status: "PENDING",
                  createdAt: new Date().toISOString()
                }
              ]
            }))
            setHubs(formatted)
          }
        }
      }
    } catch (err) {
      console.error("Owner data load error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOwnerData(ownerEmail)
  }, [ownerEmail])

  const handleOwnerSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOwnerData(ownerEmail)
  }

  // Update Booking Status (Confirm / Reject)
  const handleUpdateBookingStatus = async (bookingId: string, status: "CONFIRMED" | "CANCELLED") => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status })
      })

      if (res.ok) {
        setHubs(prevHubs =>
          prevHubs.map(hub => ({
            ...hub,
            bookings: hub.bookings.map(b => (b.id === bookingId ? { ...b, status } : b))
          }))
        )
        setSuccessMessage(`Booking #${bookingId.slice(-6)} updated to ${status}!`)
        setTimeout(() => setSuccessMessage(""), 4000)
      }
    } catch (err) {
      console.error("Failed to update booking status:", err)
    }
  }

  // Start Editing Hub Details
  const startEditHub = (hub: HubData) => {
    setEditingHubId(hub.id)
    setEditPriceDaily(hub.priceDaily || 10)
    setEditPriceMonthly(hub.priceMonthly || 180)
    setEditOpeningHours(hub.openingHours || "24/7 Access")
    setEditFacilities(Array.isArray(hub.facilities) ? hub.facilities.join(", ") : "")
  }

  // Save Updated Hub Listing Details
  const handleSaveHubDetails = async (hubId: string) => {
    setUpdatingHub(true)
    try {
      const facArray = editFacilities.split(",").map(s => s.trim()).filter(Boolean)
      const res = await fetch("/api/owner/hubs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubId,
          priceDaily: editPriceDaily,
          priceMonthly: editPriceMonthly,
          openingHours: editOpeningHours,
          facilities: facArray
        })
      })

      if (res.ok) {
        setHubs(prev =>
          prev.map(h =>
            h.id === hubId
              ? {
                  ...h,
                  priceDaily: editPriceDaily,
                  priceMonthly: editPriceMonthly,
                  openingHours: editOpeningHours,
                  facilities: facArray
                }
              : h
          )
        )
        setEditingHubId(null)
        setSuccessMessage("Property prices and amenities updated successfully!")
        setTimeout(() => setSuccessMessage(""), 4000)
      }
    } catch (err) {
      console.error("Hub update error:", err)
    } finally {
      setUpdatingHub(false)
    }
  }

  // Aggregate Metrics across owner properties
  const allBookings = hubs.flatMap(h => h.bookings || [])
  const pendingBookingsCount = allBookings.filter(b => b.status === "PENDING").length
  const confirmedBookingsCount = allBookings.filter(b => b.status === "CONFIRMED").length
  const estimatedRevenue = confirmedBookingsCount * 220 + pendingBookingsCount * 180

  const filteredBookings = allBookings.filter(b => {
    if (bookingFilter === "ALL") return true
    return b.status === bookingFilter
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans">
      <Navbar />

      {/* Owner Header Banner */}
      <div className="relative border-b border-gray-800/80 bg-gradient-to-b from-[#141414] to-[#0A0A0A] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
                <Building2 className="w-3.5 h-3.5" />
                Property Partner Console
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Owner Dashboard & Booking Management
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                Manage your Nepal coliving & workspace listings, adjust pricing rates, and confirm incoming nomad reservations.
              </p>
            </div>

            {/* Owner Email Account Switcher */}
            <form onSubmit={handleOwnerSearch} className="flex items-center gap-2 bg-[#181818] p-1.5 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 px-3 text-gray-400">
                <User className="w-4 h-4 text-[#FFD400]" />
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={e => setOwnerEmail(e.target.value)}
                  placeholder="Owner email..."
                  className="bg-transparent text-xs sm:text-sm text-white focus:outline-none w-48 sm:w-56"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#FFD400] text-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Load Portal
              </button>
            </form>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#141414] p-4 rounded-xl border border-gray-800/80">
              <div className="text-gray-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#FFD400]" /> Managed Properties
              </div>
              <div className="text-2xl font-extrabold text-white">{hubs.length}</div>
            </div>

            <div className="bg-[#141414] p-4 rounded-xl border border-gray-800/80">
              <div className="text-gray-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Approvals
              </div>
              <div className="text-2xl font-extrabold text-amber-400">{pendingBookingsCount}</div>
            </div>

            <div className="bg-[#141414] p-4 rounded-xl border border-gray-800/80">
              <div className="text-gray-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confirmed Guests
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">{confirmedBookingsCount}</div>
            </div>

            <div className="bg-[#141414] p-4 rounded-xl border border-gray-800/80">
              <div className="text-gray-400 text-xs font-medium mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#FFD400]" /> Estimated Monthly Revenue
              </div>
              <div className="text-2xl font-extrabold text-white">${estimatedRevenue}</div>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {successMessage}
            </div>
          )}
        </div>
      </div>

      {/* Main Console Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("BOOKINGS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeTab === "BOOKINGS"
                ? "bg-[#FFD400] text-black border-[#FFD400] shadow-md shadow-yellow-500/10"
                : "bg-[#141414] text-gray-400 border-gray-800 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Incoming Nomad Reservations ({allBookings.length})
          </button>

          <button
            onClick={() => setActiveTab("LISTINGS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeTab === "LISTINGS"
                ? "bg-[#FFD400] text-black border-[#FFD400] shadow-md shadow-yellow-500/10"
                : "bg-[#141414] text-gray-400 border-gray-800 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Edit Listings & Pricing ({hubs.length})
          </button>

          <Link
            href="/stay/register"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A1A1A] text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white transition-colors flex items-center gap-1.5 ml-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#FFD400]" />
            Register New Property
          </Link>
        </div>

        {/* TAB 1: INCOMING NOMAD BOOKINGS */}
        {activeTab === "BOOKINGS" && (
          <div className="space-y-6">
            {/* Status Sub-Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium mr-2">Filter Reservations:</span>
              {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setBookingFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                    bookingFilter === f
                      ? "bg-gray-800 text-white border-gray-600"
                      : "bg-[#121212] text-gray-400 border-gray-800 hover:text-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-[#121212] rounded-2xl border border-gray-800 p-8">
                <Clock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-300 font-bold text-sm">No reservations matching filter</p>
                <p className="text-gray-500 text-xs mt-1">Check back soon for new guest requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking: any) => {
                  const hubObj = hubs.find(h => h.id === booking.hubId) || hubs[0]
                  const startDateFormatted = new Date(booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  const endDateFormatted = new Date(booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

                  return (
                    <div
                      key={booking.id}
                      className="bg-[#121212] p-5 rounded-2xl border border-gray-800/80 hover:border-gray-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {booking.status === "PENDING" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> ACTION REQUIRED: PENDING
                            </span>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> CONFIRMED GUEST
                            </span>
                          )}
                          {booking.status === "CANCELLED" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> REJECTED / CANCELLED
                            </span>
                          )}

                          <span className="text-xs text-[#FFD400] font-semibold">
                            {hubObj?.name || "Nepal Workspace"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-white">
                            Guest: {booking.nomadName}
                          </h3>
                          <span className="text-xs text-gray-400 font-mono">({booking.nomadEmail})</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1 text-gray-200 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#FFD400]" />
                            {startDateFormatted} → {endDateFormatted}
                          </span>
                          {booking.notes && (
                            <span className="text-gray-400 italic bg-[#1A1A1A] px-2 py-0.5 rounded border border-gray-800">
                              "{booking.notes}"
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Owner Approval Action Controls */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        {booking.status !== "CONFIRMED" && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Guest
                          </button>
                        )}

                        {booking.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Decline
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT PROPERTY LISTINGS & PRICING */}
        {activeTab === "LISTINGS" && (
          <div className="space-y-6">
            {hubs.map(hub => {
              const isEditing = editingHubId === hub.id

              return (
                <div key={hub.id} className="bg-[#121212] p-6 rounded-2xl border border-gray-800 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {hub.name}
                        {hub.city && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-[#FFD400] font-semibold border border-yellow-500/20">
                            {hub.city}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" /> {hub.address}
                      </p>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => startEditHub(hub)}
                        className="px-4 py-2 bg-[#FFD400] text-black text-xs font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-1.5 self-start md:self-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Pricing & Facilities
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveHubDetails(hub.id)}
                          disabled={updatingHub}
                          className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          {updatingHub ? "Saving..." : "Save Listing Updates"}
                        </button>
                        <button
                          onClick={() => setEditingHubId(null)}
                          className="px-3 py-2 bg-gray-800 text-gray-300 text-xs font-semibold rounded-xl hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Property Details Display vs Edit Mode Form */}
                  {!isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-[#161616] p-4 rounded-xl border border-gray-800/80 space-y-1">
                        <span className="text-gray-400 font-medium">Daily Hot Desk Starting Rate:</span>
                        <div className="text-xl font-bold text-[#FFD400]">
                          ${hub.priceDaily || 10} <span className="text-xs font-normal text-gray-400">/ day</span>
                        </div>
                      </div>

                      <div className="bg-[#161616] p-4 rounded-xl border border-gray-800/80 space-y-1">
                        <span className="text-gray-400 font-medium">Discounted Monthly Coliving Rate:</span>
                        <div className="text-xl font-bold text-emerald-400">
                          ${hub.priceMonthly || 180} <span className="text-xs font-normal text-gray-400">/ month</span>
                        </div>
                      </div>

                      <div className="bg-[#161616] p-4 rounded-xl border border-gray-800/80 space-y-1">
                        <span className="text-gray-400 font-medium">Access Hours & Backup:</span>
                        <div className="text-sm font-semibold text-white mt-1">
                          {hub.openingHours || "24/7 Access"}
                        </div>
                      </div>

                      <div className="md:col-span-3 bg-[#161616] p-4 rounded-xl border border-gray-800/80 space-y-2">
                        <span className="text-gray-400 font-medium">Listed Hub Amenities & Work Facilities:</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {Array.isArray(hub.facilities) && hub.facilities.map((fac, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-[#222] text-gray-200 text-[11px] rounded-lg border border-gray-700">
                              ✓ {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Edit Form View */
                    <div className="bg-[#161616] p-5 rounded-xl border border-yellow-500/30 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-300 font-semibold mb-1">
                            Daily Hot Desk Price ($USD / day)
                          </label>
                          <input
                            type="number"
                            value={editPriceDaily}
                            onChange={e => setEditPriceDaily(parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD400]"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 font-semibold mb-1">
                            Cheapest Monthly Coliving Rate ($USD / month)
                          </label>
                          <input
                            type="number"
                            value={editPriceMonthly}
                            onChange={e => setEditPriceMonthly(parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD400]"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 font-semibold mb-1">
                            Hub Access Hours (e.g. 24/7 Access)
                          </label>
                          <input
                            type="text"
                            value={editOpeningHours}
                            onChange={e => setEditOpeningHours(e.target.value)}
                            className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD400]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">
                          Facilities & Amenities (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editFacilities}
                          onChange={e => setEditFacilities(e.target.value)}
                          placeholder="Starlink Wi-Fi, Solar Backup 24/7, Private Heating, Ergonomic Chairs"
                          className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD400]"
                        />
                      </div>
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
