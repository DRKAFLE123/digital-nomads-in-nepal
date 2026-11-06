/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WorkabilityScoreBadge from "@/components/coworking/WorkabilityScoreBadge"
import WorkspaceReviewsSection from "@/components/coworking/WorkspaceReviewsSection"
import { ArrowLeft, MapPin, CheckCircle, Star, Loader2, Calendar, Info, Building, ShieldCheck, Wifi, Zap, ExternalLink, Maximize2, X, ChevronLeft, ChevronRight, ImageIcon, MessageSquare, Layers, Edit3 } from "lucide-react"

import BookingModalCard from "@/components/coworking/BookingModalCard"
import EnquiryModalCard from "@/components/coworking/EnquiryModalCard"
import InternalLinkingEngine from "@/components/InternalLinkingEngine"

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
  ownerEmail?: string | null
  website: string | null
  updatedAt?: string
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

export default function CoworkingDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [hub, setHub] = useState<Hub | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.slug?.toLowerCase().includes("sofa")) {
      router.replace("/")
    }
  }, [params.slug, router])

  // Gallery, Lightbox, Enquiry & Booking Modal State
  const [selectedImgIdx, setSelectedImgIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [selectedUnitType, setSelectedUnitType] = useState("hot_desk")

  const isOwner = Boolean(
    session?.user?.email &&
      hub &&
      (session.user.email.toLowerCase() === hub.contactEmail?.toLowerCase() ||
        session.user.email.toLowerCase() === hub.ownerEmail?.toLowerCase())
  )

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0A0A0B] flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-[#C2410C] animate-spin" />
      </div>
    )
  }

  if (error || !hub) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FBF9F5] dark:bg-[#0A0A0B] pt-32 pb-24 px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center py-20 bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl shadow-sm">
            <Info className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error || "Work Hub Not Found"}</h2>
            <Link href="/resources/coworking" className="text-[#C2410C] hover:underline text-sm font-semibold flex items-center justify-center gap-1.5 mt-4">
              <ArrowLeft size={16} /> Back to Coworking Directory
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const facs = Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []
  const photos = parsePhotos(hub.photoUrl)
  const activePhoto = photos[selectedImgIdx] || photos[0] || null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FBF9F5] dark:bg-[#0A0A0B] text-gray-900 dark:text-[#F5F5F4] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Breadcrumb & Navigation + Host Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/resources/coworking" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#C2410C] dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#141416] px-3.5 py-2 rounded-xl border border-[#E8E2D8] dark:border-[#26262A] shadow-xs">
                <ArrowLeft size={14} /> Back to Workspaces
              </Link>
              {isOwner && (
                <Link
                  href="/owner/dashboard?tab=LISTINGS"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white transition-all shadow-sm"
                  title="Switch to Host Dashboard to edit this listing"
                >
                  <Edit3 size={13} />
                  <span>Switch to Host Console (Edit Listing)</span>
                </Link>
              )}
            </div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#A1A1AA]">
              <Link href="/resources/coworking" className="hover:text-gray-900 dark:hover:text-white transition-colors">Nepal Workspaces</Link>
              <span>/</span>
              <span className="text-[#C2410C] dark:text-[#FB923C] font-semibold">{hub.city}</span>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-bold">{hub.name}</span>
            </nav>
          </div>

          {/* Hero Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Main Content (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Photo Gallery Banner with Badges & Thumbnail Strip */}
              <div className="space-y-3">
                <div className="h-96 md:h-[440px] bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl overflow-hidden relative shadow-md flex items-center justify-center group">
                  {activePhoto ? (
                    <img src={activePhoto} alt={`${hub.name} Coworking Space in ${hub.city}, Nepal`} className="w-full h-full object-cover transition-all duration-300" />
                  ) : (
                    <Building className="w-24 h-24 text-gray-300 dark:text-[#333]" />
                  )}

                  {/* Expand Lightbox Button */}
                  {activePhoto && (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="absolute top-6 right-6 bg-black/60 hover:bg-[#C2410C] text-white p-2.5 rounded-full transition-all backdrop-blur z-20 shadow-lg"
                      title="View full screen gallery"
                    >
                      <Maximize2 size={16} />
                    </button>
                  )}

                  <div className="absolute top-6 left-6 flex flex-wrap gap-2.5 z-10">
                    {hub.isPartner && (
                      <span className="flex items-center gap-1.5 bg-[#C2410C] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                        <Building size={13} className="fill-white" /> System Partner
                      </span>
                    )}
                    {hub.isVerified && (
                      <span className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                        <CheckCircle size={13} className="fill-white" /> Verified WorkHub
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-6 right-6 z-10">
                    <WorkabilityScoreBadge
                      compact
                      score={96}
                      rating={hub.rating}
                      reviewsCount={hub.totalReviews}
                      facilities={facs}
                    />
                  </div>
                </div>

                {/* Clickable Thumbnail Gallery Row */}
                {photos.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {photos.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImgIdx(i)}
                        className={`relative w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white dark:bg-[#141416] ${
                          selectedImgIdx === i
                            ? "border-[#C2410C] ring-2 ring-[#C2410C]/30 scale-105"
                            : "border-[#E8E2D8] dark:border-[#242424] opacity-70 hover:opacity-100 hover:border-gray-400"
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Header Title & Rating Box */}
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D8] dark:border-[#26262A] pb-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#C2410C] dark:text-[#FB923C] font-bold uppercase tracking-wider">
                      <MapPin size={14} />
                      {hub.city}, Nepal
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{hub.name}</h1>
                    <p className="text-gray-500 dark:text-[#A1A1AA] text-sm flex items-center gap-1.5">📍 {hub.address}</p>
                  </div>
                  
                  {hub.website && (
                    <a
                      href={hub.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/5 dark:bg-[#C2410C]/10 hover:bg-[#C2410C]/15 dark:hover:bg-[#C2410C]/20 border border-[#C2410C]/30 px-4 py-2.5 rounded-xl transition-all self-start sm:self-center"
                    >
                      Visit Space Website <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-6 text-sm text-gray-500 dark:text-[#A1A1AA]">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                    <Star className="w-5 h-5 text-[#EA580C] fill-[#EA580C]" />
                    <span className="text-lg font-mono">{hub.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 dark:text-[#A1A1AA] font-normal">({hub.totalReviews} verified nomad reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-[#22C55E] bg-emerald-50 dark:bg-[#22C55E]/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-[#22C55E]/20">
                    <ShieldCheck size={14} /> Vetted Remote Work Ready
                  </div>
                  {hub.updatedAt && (
                    <div className="text-xs text-gray-500 dark:text-[#A1A1AA] flex items-center gap-1 font-medium">
                      <span>•</span>
                      <span>Verified {new Date(hub.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Checklist Banner */}
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-extrabold text-[#C2410C] dark:text-[#FB923C] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} /> Verified Remote Work Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#F8F6F0] dark:bg-[#1C1C20] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                      <Wifi size={14} className="text-[#C2410C] dark:text-[#FB923C]" /> High-Speed Fiber
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA]">100+ Mbps dual-WAN backup line</p>
                  </div>
                  <div className="bg-[#F8F6F0] dark:bg-[#1C1C20] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                      <Zap size={14} className="text-[#C2410C] dark:text-[#FB923C]" /> 24/7 Power Backup
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA]">Auto Generator + UPS Inverter</p>
                  </div>
                  <div className="bg-[#F8F6F0] dark:bg-[#1C1C20] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                      <CheckCircle size={14} className="text-emerald-600 dark:text-[#22C55E]" /> Verified Seat Access
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA]">Guaranteed hot desk availability</p>
                  </div>
                </div>
              </div>

              {/* Workability Score Detailed Component */}
              <WorkabilityScoreBadge
                score={96}
                internetSpeed="150 Mbps Fiber"
                powerBackup="Generator + UPS Dual System"
                rating={hub.rating}
                reviewsCount={hub.totalReviews}
                facilities={facs}
              />

              {/* Description */}
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider border-b border-[#E8E2D8] dark:border-[#26262A] pb-3">
                  About this Workspace
                </h2>
                <p className="text-gray-600 dark:text-[#A1A1AA] text-sm leading-relaxed whitespace-pre-line">
                  {hub.description}
                </p>
              </div>

              {/* Available Seat Types & Room Options Section */}
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#26262A] pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] flex items-center gap-1.5">
                      <Layers size={13} /> Building Inventory & Room Options
                    </span>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">Available Seat Types & Rooms</h2>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    Vetted Ergonomic Desks • 24/7 Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Hot Desks */}
                  <div className="bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] hover:border-[#C2410C]/50 rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between group shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Hot Desks / Flexi Seats</span>
                        <span className="text-xs font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                          ${hub.priceDaily || 5}/day
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 dark:text-[#22C55E] font-extrabold bg-emerald-50 dark:bg-[#22C55E]/10 border border-emerald-200 dark:border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> 12 Seats Available
                        </span>
                        <span className="text-gray-500 dark:text-[#A1A1AA]">Open Seating</span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-[#A1A1AA] leading-relaxed">
                        Flexible desk seating in open collaborative hub with high-speed fiber WiFi and power outlets.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitType("hot_desk")
                        setBookingModalOpen(true)
                      }}
                      className="w-full bg-gray-900 hover:bg-[#C2410C] dark:bg-[#26262A] dark:hover:bg-[#C2410C] text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Calendar size={13} /> Reserve Hot Desk
                    </button>
                  </div>

                  {/* Dedicated Fixed Desks */}
                  <div className="bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] hover:border-[#C2410C]/50 rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between group shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Dedicated Fixed Desks</span>
                        <span className="text-xs font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                          ${hub.priceMonthly || 120}/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 dark:text-[#22C55E] font-extrabold bg-emerald-50 dark:bg-[#22C55E]/10 border border-emerald-200 dark:border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> 5 Desks Available
                        </span>
                        <span className="text-gray-500 dark:text-[#A1A1AA]">Personal Locker</span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-[#A1A1AA] leading-relaxed">
                        Reserved personal desk space with ergonomic chair, lockable storage cabinet, and monitor mount.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitType("dedicated_desk")
                        setBookingModalOpen(true)
                      }}
                      className="w-full bg-gray-900 hover:bg-[#C2410C] dark:bg-[#26262A] dark:hover:bg-[#C2410C] text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Calendar size={13} /> Reserve Fixed Desk
                    </button>
                  </div>

                  {/* Executive Private Offices */}
                  <div className="bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] hover:border-[#C2410C]/50 rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between group shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Private Executive Rooms</span>
                        <span className="text-xs font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                          From $350/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 dark:text-[#22C55E] font-extrabold bg-emerald-50 dark:bg-[#22C55E]/10 border border-emerald-200 dark:border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> 2 Rooms Available
                        </span>
                        <span className="text-gray-500 dark:text-[#A1A1AA]">2-8 Team Capacity</span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-[#A1A1AA] leading-relaxed">
                        Private lockable office rooms for teams of 2 to 8 members with dedicated AC and keycard security.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitType("private_room")
                        setBookingModalOpen(true)
                      }}
                      className="w-full bg-gray-900 hover:bg-[#C2410C] dark:bg-[#26262A] dark:hover:bg-[#C2410C] text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Calendar size={13} /> Reserve Private Room
                    </button>
                  </div>

                  {/* Coliving Work & Stay Suite */}
                  <div className="bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#C2410C]/40 hover:border-[#C2410C] rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xs">
                    <div className="absolute top-0 right-0 bg-[#C2410C] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg">
                      ROOM + WORKSTATION
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">🛌 Coliving Work & Stay</span>
                        <span className="text-xs font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                          From $450/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 dark:text-[#22C55E] font-extrabold bg-emerald-50 dark:bg-[#22C55E]/10 border border-emerald-200 dark:border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> 3 Suites Available
                        </span>
                        <span className="text-[#C2410C] dark:text-[#FB923C] font-semibold">Room Included</span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-[#A1A1AA] leading-relaxed">
                        Private accommodation room + dedicated ergonomic desk with Starlink Wi-Fi, 24/7 solar power & breakfast.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitType("coliving_room")
                        setBookingModalOpen(true)
                      }}
                      className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md shadow-[#C2410C]/20"
                    >
                      <Calendar size={13} /> Reserve Coliving Suite
                    </button>
                  </div>

                  {/* Meeting Halls & Conference */}
                  <div className="bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] hover:border-[#C2410C]/50 rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between group sm:col-span-2 shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Meeting Halls & Event Space</span>
                        <span className="text-xs font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                          From $40/day
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 dark:text-[#22C55E] font-extrabold bg-emerald-50 dark:bg-[#22C55E]/10 border border-emerald-200 dark:border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> 1 Hall Available
                        </span>
                        <span className="text-gray-500 dark:text-[#A1A1AA]">4K Projector & Video Call Setup</span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-[#A1A1AA] leading-relaxed">
                        Fully equipped conference room with 4K projector, whiteboard, video call setup, and tea service.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitType("meeting_hall")
                        setBookingModalOpen(true)
                      }}
                      className="w-full bg-gray-900 hover:bg-[#C2410C] dark:bg-[#26262A] dark:hover:bg-[#C2410C] text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Calendar size={13} /> Book Meeting Room
                    </button>
                  </div>
                </div>
              </div>

              {/* Nomad Reviews & Photo Gallery */}
              <WorkspaceReviewsSection
                hubName={hub.name}
                avgRating={hub.rating}
                totalReviews={hub.totalReviews}
              />
            </div>

            {/* Right Sticky Sidebar: Desk Rates & Reserve Now / Send Enquiry CTAs */}
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                {/* Visual Top Bar Accent */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#C2410C]"></div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} className="text-[#C2410C] dark:text-[#FB923C]" />
                    Desk Rates & Membership
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA]">
                    Vetted workspace seats with guaranteed internet & power backup.
                  </p>
                </div>

                {/* Rates List */}
                <div className="space-y-3">
                  {hub.priceDaily && (
                    <div className="flex justify-between items-center p-3.5 bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl">
                      <span className="text-xs text-gray-600 dark:text-[#A1A1AA] font-medium">Daily Hot Desk</span>
                      <span className="text-base font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                        ${hub.priceDaily} <span className="text-[10px] text-gray-500 dark:text-[#A1A1AA] font-normal">/ day</span>
                      </span>
                    </div>
                  )}
                  {hub.priceMonthly && (
                    <div className="flex justify-between items-center p-3.5 bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl">
                      <span className="text-xs text-gray-600 dark:text-[#A1A1AA] font-medium">Monthly Unlimited</span>
                      <span className="text-base font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                        ${hub.priceMonthly} <span className="text-[10px] text-gray-500 dark:text-[#A1A1AA] font-normal">/ mo</span>
                      </span>
                    </div>
                  )}

                  {/* Included Perks */}
                  <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl text-[11px] text-emerald-900 dark:text-emerald-300 space-y-1.5">
                    <p className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-200">
                      <CheckCircle size={13} className="text-emerald-600 dark:text-[#22C55E]" /> Included in Membership:
                    </p>
                    <p className="leading-relaxed">
                      Unlimited high-speed WiFi, tea/coffee access, generator power backup, ergonomic seating.
                    </p>
                  </div>
                </div>

                {/* DUAL CTA BUTTONS (RESERVE NOW + SEND ENQUIRY) */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(true)}
                    className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs py-4 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-[#C2410C]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Calendar size={15} /> Reserve Now
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(true)}
                    className="w-full bg-[#F8F6F0] hover:bg-gray-100 dark:bg-[#1E1E22] dark:hover:bg-[#25252A] border border-[#E8E2D8] dark:border-[#333] hover:border-[#C2410C]/40 text-gray-800 dark:text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <MessageSquare size={14} className="text-[#C2410C] dark:text-[#FB923C]" /> Send Enquiry
                  </button>
                </div>

                <p className="text-[10px] text-center text-gray-500 dark:text-[#71717A] font-semibold">
                  ⚡ Instant Seat Request — No Upfront Payment Required
                </p>
              </div>
            </div>

          </div>

          {/* Automated Internal Linking Engine */}
          <InternalLinkingEngine 
            type="workspace" 
            city={hub.city} 
            entityName={hub.name} 
          />
        </div>
      </main>

      {/* MOBILE STICKY FLOATING CTA BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#121212]/95 border-t border-[#E8E2D8] dark:border-[#242424] p-3.5 sm:hidden backdrop-blur-md flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider block">Desk Rate</span>
          <span className="text-sm font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
            {hub.priceMonthly ? `$${hub.priceMonthly}/mo` : hub.priceDaily ? `$${hub.priceDaily}/day` : "Vetted Seat"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEnquiryModalOpen(true)}
            className="bg-[#F8F6F0] dark:bg-[#1F1F1F] border border-[#E8E2D8] dark:border-[#333] text-gray-700 dark:text-white font-bold text-xs px-3.5 py-3 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95"
            title="Send enquiry"
          >
            <MessageSquare size={14} className="text-[#C2410C] dark:text-[#FB923C]" />
          </button>
          <button
            type="button"
            onClick={() => setBookingModalOpen(true)}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-all shadow-md shadow-[#C2410C]/20 flex items-center gap-1.5 active:scale-95"
          >
            <Calendar size={14} /> Reserve Now
          </button>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX GALLERY MODAL */}
      {lightboxOpen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#FB923C] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50"
          >
            <X size={24} />
          </button>

          {/* Lightbox Main Image */}
          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={photos[selectedImgIdx]}
              alt={`${hub.name} photo ${selectedImgIdx + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
            />

            {/* Prev / Next controls */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImgIdx((prev: number) => (prev - 1 + photos.length) % photos.length)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#C2410C] text-white p-3 rounded-full transition-all border border-white/10 shadow-xl"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImgIdx((prev: number) => (prev + 1) % photos.length)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#C2410C] text-white p-3 rounded-full transition-all border border-white/10 shadow-xl"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-4 py-1.5 rounded-full text-xs font-mono text-white flex items-center gap-2">
              <ImageIcon size={14} className="text-[#FB923C]" />
              {selectedImgIdx + 1} of {photos.length}
            </div>
          </div>
        </div>
      )}

      {/* ENQUIRY MODAL CARD */}
      <EnquiryModalCard
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        hub={hub}
      />

      {/* 2-COLUMN SPLIT BOOKING MODAL CARD */}
      <BookingModalCard
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        hub={hub}
        initialUnitType={selectedUnitType}
      />

      <Footer />
    </>
  )
}
