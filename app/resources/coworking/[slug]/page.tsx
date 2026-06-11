/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowLeft, MapPin, Check, CheckCircle, Sparkles, Star, Loader2, Calendar, Mail, User, Info, Building } from "lucide-react"

type Hub = {
  id: string
  name: string
  slug: string
  city: string
  description: string
  address: string
  rating: number
  totalReviews: number
  isVerified: boolean
  isPartner: boolean
  photoUrl: string | null
  facilities: string[]
  priceDaily: number | null
  priceMonthly: number | null
  contactEmail: string
  website: string | null
}

export default function CoworkingDetailPage({ params }: { params: { slug: string } }) {
  const [hub, setHub] = useState<Hub | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Booking Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  const loadDetails = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/work-hubs/${params.slug}`)
      if (res.ok) {
        const data = await res.json()
        setHub(data)
      } else {
        setError("Work hub not found.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred loading hub details.")
    } finally {
      setLoading(false)
    }
  }, [params.slug])

  useEffect(() => {
    loadDetails()
  }, [loadDetails])

  async function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setBookingError("")
    setBookingSuccess(false)

    try {
      const res = await fetch(`/api/work-hubs/${params.slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomadName: name,
          nomadEmail: email,
          startDate,
          endDate,
          notes
        })
      })

      if (res.ok) {
        setBookingSuccess(true)
        setName("")
        setEmail("")
        setStartDate("")
        setEndDate("")
        setNotes("")
      } else {
        const errData = await res.json()
        setBookingError(errData.error || "Failed to submit reservation.")
      }
    } catch (err) {
      console.error(err)
      setBookingError("An error occurred submitting reservation.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !hub) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center py-20 bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl">
            <Info className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">{error || "Work Hub Not Found"}</h2>
            <Link href="/resources/coworking" className="text-primary hover:underline text-sm font-semibold flex items-center justify-center gap-1.5 mt-4">
              <ArrowLeft size={16} /> Back to Coworking Directory
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const facs = Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link href="/resources/coworking" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
              <ArrowLeft size={14} /> Back to Directory
            </Link>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Col: Photo, Description, facilities */}
            <div className="lg:col-span-2 space-y-8">
              {/* Photo Card */}
              <div className="h-96 md:h-[450px] bg-neutral-900 border border-[#1e1e1e] rounded-2xl overflow-hidden relative flex items-center justify-center shadow-lg">
                {hub.photoUrl ? (
                  <img src={hub.photoUrl} alt={hub.name} className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-24 h-24 text-[#333]" />
                )}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {hub.isPartner && (
                    <span className="flex items-center gap-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xl">
                      <Sparkles size={12} className="fill-black" /> System Partner
                    </span>
                  )}
                  {hub.isVerified && (
                    <span className="flex items-center gap-1 bg-green-500 text-black text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xl">
                      <CheckCircle size={12} className="fill-black" /> Verified WorkHub
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Stats */}
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
                  <MapPin size={14} />
                  {hub.city}, Nepal
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">{hub.name}</h1>
                <p className="text-muted text-sm leading-relaxed">📍 {hub.address}</p>

                <div className="flex items-center gap-6 pt-4 border-t border-[#1e1e1e]">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="text-lg">{hub.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted font-normal">({hub.totalReviews} verified reviews)</span>
                  </div>
                  {hub.website && (
                    <a href={hub.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full">
                      Visit Website ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-lg font-black text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-3">About this Workspace</h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{hub.description}</p>
              </div>

              {/* Vetted Amenities */}
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-lg font-black text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-3">Vetted Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {facs.map(f => (
                    <div key={f} className="flex items-center gap-3 p-3.5 bg-black border border-[#1e1e1e] rounded-xl text-sm text-foreground">
                      <div className="w-5 h-5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-400 flex-shrink-0">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Booking Request Form & Pricing */}
            <div className="space-y-8">
              {/* Pricing Cards */}
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-3">Membership Pricing</h3>
                <div className="space-y-3 pt-2">
                  {hub.priceDaily && (
                    <div className="flex justify-between items-center p-3 bg-black border border-[#1e1e1e] rounded-xl">
                      <span className="text-xs text-muted">Daily Hot Desk</span>
                      <span className="text-sm font-black text-primary">${hub.priceDaily} / day</span>
                    </div>
                  )}
                  {hub.priceMonthly && (
                    <div className="flex justify-between items-center p-3 bg-black border border-[#1e1e1e] rounded-xl">
                      <span className="text-xs text-muted">Monthly Unlimited</span>
                      <span className="text-sm font-black text-primary">${hub.priceMonthly} / month</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form Card */}
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-primary"></div>
                
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Pre-Book a Workspace
                </h3>
                <p className="text-muted text-xs leading-relaxed border-b border-[#1e1e1e] pb-3">
                  Submit a booking request to secure your hot desk or private seat before traveling to Nepal. The space manager will email you directly.
                </p>

                {bookingSuccess ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle size={24} />
                    </div>
                    <h4 className="font-bold text-foreground">Reservation Request Sent!</h4>
                    <p className="text-xs text-muted leading-relaxed">
                      Thank you! Your workspace application is pending. The management of <strong>{hub.name}</strong> will contact you at your email address to confirm seat availability.
                    </p>
                    <button onClick={() => setBookingSuccess(false)} className="text-xs text-primary font-bold hover:underline">
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookSubmit} className="space-y-4 pt-2">
                    {bookingError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                        {bookingError}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-3.5 h-3.5" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Damodar K."
                          className="w-full bg-black border border-[#222] rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-3.5 h-3.5" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="damodar@example.com"
                          className="w-full bg-black border border-[#222] rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          required
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          required
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Special Requests / Notes
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Need double monitor? Private Skype booth requests? Write here..."
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-yellow-500 disabled:opacity-50 text-black font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all flex justify-center items-center gap-1.5"
                    >
                      {submitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Submit Request ✓"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
