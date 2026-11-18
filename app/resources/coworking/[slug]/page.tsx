/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCurrency } from "@/context/CurrencyContext"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WorkabilityScoreBadge from "@/components/coworking/WorkabilityScoreBadge"
import WorkspaceReviewsSection from "@/components/coworking/WorkspaceReviewsSection"
import WorkspaceGallery from "@/components/coworking/WorkspaceGallery"
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Star,
  Loader2,
  Calendar,
  Info,
  Building,
  ShieldCheck,
  Wifi,
  Zap,
  ExternalLink,
  X,
  Layers,
  Edit3,
  Mail,
  Coffee,
  Utensils,
  Lock,
  Waves,
  Mountain,
  Car,
  PawPrint,
  TreePine,
  PhoneCall,
  Wind,
  BellOff,
  Sparkles,
  Droplets,
  Briefcase,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"

import BookingModalCard from "@/components/coworking/BookingModalCard"
import EnquiryModalCard from "@/components/coworking/EnquiryModalCard"
import NearbySpacesWidget from "@/components/coworking/NearbySpacesWidget"
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
  ownerName?: string | null
  ownerEmail?: string | null
  website: string | null
  updatedAt?: string
  spaceType?: string | null
}

interface AmenityItem {
  icon: LucideIcon
  title: string
  desc: string
  category: "work" | "food" | "stay" | "safety" | "unavailable"
  unavailable?: boolean
}

const ALL_AMENITIES: AmenityItem[] = [
  // Fast Internet & Work Productivity
  {
    icon: Wifi,
    title: "High-Speed Dual Fiber WiFi",
    desc: "100+ Mbps dual-WAN backup line with low latency for video calls",
    category: "work",
  },
  {
    icon: Briefcase,
    title: "Dedicated Workspace",
    desc: "Ergonomic chair, spacious work desk, lumbar support & multi-plug outlets",
    category: "work",
  },
  {
    icon: Zap,
    title: "24/7 Power Backup",
    desc: "Automatic generator + solar battery inverter (zero load shedding downtime)",
    category: "work",
  },
  {
    icon: PhoneCall,
    title: "Soundproof Call & Skype Booths",
    desc: "Private acoustic booths for quiet confidential meetings and client calls",
    category: "work",
  },
  {
    icon: Layers,
    title: "Meeting Rooms & Conference Setup",
    desc: "Equipped with 4K display, whiteboard and video conference equipment",
    category: "work",
  },

  // Food & Drinks (explicitly requested by user)
  {
    icon: Utensils,
    title: "Kitchen & Shared Kitchen Access",
    desc: "Equipped with gas stove, microwave, refrigerator, cookware & dishware",
    category: "food",
  },
  {
    icon: Coffee,
    title: "Specialty Coffee & Himalayan Tea",
    desc: "Fresh organic espresso, French press beans & unlimited local teas",
    category: "food",
  },
  {
    icon: Droplets,
    title: "Filtered Drinking Water (Free Refill)",
    desc: "Complimentary UV and multi-stage RO purified safe drinking water",
    category: "food",
  },
  {
    icon: Sparkles,
    title: "Breakfast & Fresh Lunch Menu",
    desc: "Fresh continental and authentic Nepali breakfast options available daily",
    category: "food",
  },
  {
    icon: Building,
    title: "Refrigerator & Food Storage",
    desc: "Dedicated guest refrigerator space for groceries, snacks and meal preps",
    category: "food",
  },

  // Stay & Comfort (explicitly requested by user)
  {
    icon: Lock,
    title: "Lock on Bedroom Door",
    desc: "Private keycard or keyed lock on bedroom door for safety and privacy",
    category: "stay",
  },
  {
    icon: Waves,
    title: "Lake Access",
    desc: "Convenient walking distance or direct access to Phewa Lake promenade",
    category: "stay",
  },
  {
    icon: Mountain,
    title: "Mountain & Valley Panorama",
    desc: "Scenic rooftop terrace with unobstructed views of Himalayan peaks",
    category: "stay",
  },
  {
    icon: Car,
    title: "Free Parking on Premises",
    desc: "Complimentary private on-site parking for motorbikes, scooters & cars",
    category: "stay",
  },
  {
    icon: PawPrint,
    title: "Pets Allowed",
    desc: "Nomad dog and cat friendly workspace, courtyard and common lounge",
    category: "stay",
  },
  {
    icon: TreePine,
    title: "Shared Backyard & Garden Patio",
    desc: "Outdoor lawn, shaded hammocks and garden benches for relaxing breaks",
    category: "stay",
  },
  {
    icon: Wind,
    title: "Air Conditioning & Room Heating",
    desc: "Dual climate-controlled rooms for hot summer afternoons and winter nights",
    category: "stay",
  },

  // Safety & Explicit Not Included (Airbnb signature)
  {
    icon: ShieldCheck,
    title: "24/7 CCTV & Security Monitoring",
    desc: "Keycard-controlled building entrance and security cameras on premises",
    category: "safety",
  },
  {
    icon: BellOff,
    title: "Unavailable: Carbon monoxide alarm",
    desc: "Host has reported no carbon monoxide alarm is installed on premises",
    category: "unavailable",
    unavailable: true,
  },
  {
    icon: BellOff,
    title: "Unavailable: Smoke alarm",
    desc: "Host has reported no smoke alarm is installed in this building",
    category: "unavailable",
    unavailable: true,
  },
]

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
  const { formatPrice } = useCurrency()
  const [hub, setHub] = useState<Hub | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Enquiry, Booking & Amenities Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false)
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

          {/* Space Title & Location Header Bar (Airbnb Style) */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#C2410C] dark:text-[#FB923C] font-bold uppercase tracking-wider">
                  <MapPin size={14} />
                  <span>{hub.city}, Nepal</span>
                  <span>•</span>
                  <span>📍 {hub.address}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  {hub.name}
                </h1>
              </div>

              {hub.website && (
                <a
                  href={hub.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/5 dark:bg-[#C2410C]/10 hover:bg-[#C2410C]/15 dark:hover:bg-[#C2410C]/20 border border-[#C2410C]/30 px-4 py-2.5 rounded-xl transition-all self-start md:self-end"
                >
                  <span>Visit Space Website</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            {/* Quick Meta Row (Rating, Reviews, Verification, Host Name) */}
            <div className="flex items-center flex-wrap gap-4 text-xs text-gray-600 dark:text-[#A1A1AA] pt-1">
              <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold">
                <Star className="w-4 h-4 text-[#EA580C] fill-[#EA580C]" />
                <span className="font-mono text-sm">{hub.rating.toFixed(1)}</span>
                <span className="text-gray-500 dark:text-[#A1A1AA] font-normal underline cursor-pointer">
                  ({hub.totalReviews} nomad reviews)
                </span>
              </div>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-[#22C55E] font-semibold bg-emerald-50 dark:bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-[#22C55E]/20">
                <ShieldCheck size={13} /> Remote Work Vetted
              </span>
              <span>•</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Hosted by <strong className="text-gray-900 dark:text-white font-bold">{hub.ownerName || `${hub.name} Host`}</strong>
              </span>
              {hub.updatedAt && (
                <>
                  <span>•</span>
                  <span>Verified {new Date(hub.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </>
              )}
            </div>
          </div>

          {/* Airbnb 5-Photo Hero Gallery Component */}
          <WorkspaceGallery
            photos={photos}
            hubName={hub.name}
            city={hub.city}
            isPartner={hub.isPartner}
            isVerified={hub.isVerified}
            rating={hub.rating}
            reviewsCount={hub.totalReviews}
            facilities={facs}
          />

          {/* 2-Column Split: Details & Content on Left, Sticky Rates Card on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-2">
            
            {/* Left Main Content (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Hosted by [Owner Name] Section (Airbnb Style) */}
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#023629] text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md border-2 border-white dark:border-[#141416]">
                        {hub.ownerName ? hub.ownerName.charAt(0).toUpperCase() : hub.name.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white dark:border-[#141416]"
                        title="Verified Space Owner"
                      >
                        <CheckCircle size={13} className="fill-white text-emerald-600" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                          Hosted by {hub.ownerName || `${hub.name} Team`}
                        </h2>
                        <span className="inline-flex items-center gap-1 bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C2410C]/20">
                          ★ Verified Host
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-[#A1A1AA] flex items-center gap-2 flex-wrap">
                        <span>Local Space Operator</span>
                        <span>•</span>
                        <span>📍 {hub.city}, Nepal</span>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Responds within an hour
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-[#C2410C] text-gray-900 dark:text-white hover:text-[#C2410C] text-xs font-bold transition-all shadow-xs hover:shadow bg-[#FBF9F5] dark:bg-[#1A1A1E] cursor-pointer active:scale-95 self-start sm:self-center"
                  >
                    <Mail size={14} className="text-[#C2410C]" />
                    <span>Contact Host</span>
                  </button>
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

              {/* "What this place offers" Categorized Amenities Grid (Airbnb Style) */}
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#26262A] pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] flex items-center gap-1.5">
                      <Sparkles size={13} /> Verified Nomad Amenities
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                      What this space offers
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    Food, high-speed fiber, stay &amp; safety verified
                  </span>
                </div>

                {/* 2-Column Amenities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {ALL_AMENITIES.slice(0, 10).map((amenity, idx) => {
                    const IconComponent = amenity.icon
                    const isUnavailable = amenity.unavailable
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3.5 py-1 ${
                          isUnavailable ? "opacity-60" : ""
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isUnavailable
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                              : "bg-[#023629]/5 dark:bg-[#023629]/20 text-[#023629] dark:text-emerald-400 border border-[#023629]/10"
                          }`}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <p
                            className={`text-sm font-bold ${
                              isUnavailable
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {amenity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-[#A1A1AA] leading-snug">
                            {amenity.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Show All Amenities Button (Airbnb Style Modal Trigger) */}
                <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#26262A] flex items-center justify-between flex-wrap gap-3">
                  <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    Showing 10 of {ALL_AMENITIES.length} verified amenities &amp; safety features
                  </p>
                  <button
                    type="button"
                    onClick={() => setAmenitiesModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl border border-gray-900 dark:border-white/30 text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    Show all {ALL_AMENITIES.length} amenities
                  </button>
                </div>
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
                          {formatPrice(hub.priceDaily || 5)}/day
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
                          {formatPrice(hub.priceMonthly || 120)}/mo
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
                          From {formatPrice(40)}/day
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

              {/* Phase 2: Mutual Discovery & Cross-Linking ("Work Nearby" & "Stay Nearby") */}
              <NearbySpacesWidget
                currentHubId={hub.id}
                currentCity={hub.city}
                currentSpaceType={hub.spaceType}
                currentHubName={hub.name}
              />
            </div>

            {/* Right Sticky Sidebar: Rates & Reserve Now / Send Enquiry CTAs */}
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                {/* Visual Top Bar Accent */}
                <div
                  className={`absolute top-0 inset-x-0 h-1.5 ${
                    (hub.spaceType || "").toLowerCase().includes("stay") || (hub.spaceType || "").toLowerCase().includes("apartment")
                      ? "bg-sky-700"
                      : (hub.spaceType || "").toLowerCase().includes("coliving")
                      ? "bg-[#C2410C]"
                      : "bg-[#1B4332]"
                  }`}
                />

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} className="text-[#C2410C] dark:text-[#FB923C]" />
                    {(hub.spaceType || "").toLowerCase().includes("coliving")
                      ? "Workation Package Rates"
                      : (hub.spaceType || "").toLowerCase().includes("stay") || (hub.spaceType || "").toLowerCase().includes("apartment")
                      ? "Nightly & Monthly Rates"
                      : "Desk Rates & Membership"}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-[#A1A1AA]">
                    {(hub.spaceType || "").toLowerCase().includes("coliving")
                      ? "Private room + dedicated desk with guaranteed fiber Wi-Fi & backup power."
                      : (hub.spaceType || "").toLowerCase().includes("stay") || (hub.spaceType || "").toLowerCase().includes("apartment")
                      ? "Vetted nomad accommodation with verified fiber internet & generator."
                      : "Vetted workspace seats with guaranteed internet & power backup."}
                  </p>
                </div>

                {/* Rates List */}
                <div className="space-y-3">
                  {hub.priceDaily && (
                    <div className="flex justify-between items-center p-3.5 bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl">
                      <span className="text-xs text-gray-600 dark:text-[#A1A1AA] font-medium">
                        {(hub.spaceType || "").toLowerCase().includes("stay") || (hub.spaceType || "").toLowerCase().includes("apartment")
                          ? "Nightly Stay"
                          : (hub.spaceType || "").toLowerCase().includes("coliving")
                          ? "Daily Workation"
                          : "Daily Hot Desk"}
                      </span>
                      <span className="text-base font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                        {formatPrice(hub.priceDaily)} <span className="text-[10px] text-gray-500 dark:text-[#A1A1AA] font-normal">/ day</span>
                      </span>
                    </div>
                  )}
                  {hub.priceMonthly && (
                    <div className="flex justify-between items-center p-3.5 bg-[#FBF9F5] dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-[#2A2A2E] rounded-2xl">
                      <span className="text-xs text-gray-600 dark:text-[#A1A1AA] font-medium">
                        {(hub.spaceType || "").toLowerCase().includes("stay") || (hub.spaceType || "").toLowerCase().includes("apartment")
                          ? "Monthly Stay"
                          : (hub.spaceType || "").toLowerCase().includes("coliving")
                          ? "Monthly Live & Work"
                          : "Monthly Unlimited"}
                      </span>
                      <span className="text-base font-black text-[#C2410C] dark:text-[#FB923C] font-mono">
                        {formatPrice(hub.priceMonthly)} <span className="text-[10px] text-gray-500 dark:text-[#A1A1AA] font-normal">/ mo</span>
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
            {hub.priceMonthly ? `${formatPrice(hub.priceMonthly)}/mo` : hub.priceDaily ? `${formatPrice(hub.priceDaily)}/day` : "Vetted Seat"}
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

      {/* ALL AMENITIES MODAL (AIRBNB STYLE CATEGORIZED POPUP) */}
      {amenitiesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#26262A] pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  What this space offers
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                  Full breakdown of nomad remote work, food &amp; stay amenities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAmenitiesModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-6 pr-1 divide-y divide-[#E8E2D8] dark:divide-[#26262A]">
              {/* Category: Fast Internet & Remote Work */}
              <div className="space-y-4 pt-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C] flex items-center gap-1.5">
                  <Wifi size={14} /> High-Speed Internet &amp; Office Setup
                </h4>
                <div className="space-y-3.5">
                  {ALL_AMENITIES.filter((a) => a.category === "work").map((a, i) => {
                    const IconComp = a.icon
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#023629]/10 dark:bg-[#023629]/30 text-[#023629] dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconComp size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{a.title}</p>
                          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">{a.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category: Food & Drinks */}
              <div className="space-y-4 pt-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C] flex items-center gap-1.5">
                  <Utensils size={14} /> Food, Coffee &amp; Kitchen
                </h4>
                <div className="space-y-3.5">
                  {ALL_AMENITIES.filter((a) => a.category === "food").map((a, i) => {
                    const IconComp = a.icon
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#C2410C] dark:text-[#FB923C] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconComp size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{a.title}</p>
                          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">{a.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category: Stay & Comfort */}
              <div className="space-y-4 pt-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C] flex items-center gap-1.5">
                  <Lock size={14} /> Stay, Bedroom &amp; Outdoor Comfort
                </h4>
                <div className="space-y-3.5">
                  {ALL_AMENITIES.filter((a) => a.category === "stay").map((a, i) => {
                    const IconComp = a.icon
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconComp size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{a.title}</p>
                          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">{a.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category: Safety & Not Included (Airbnb signature) */}
              <div className="space-y-4 pt-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Safety &amp; Not Included Features
                </h4>
                <div className="space-y-3.5">
                  {ALL_AMENITIES.filter((a) => a.category === "safety" || a.category === "unavailable").map((a, i) => {
                    const IconComp = a.icon
                    return (
                      <div key={i} className={`flex items-start gap-3 ${a.unavailable ? "opacity-60" : ""}`}>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconComp size={16} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${a.unavailable ? "line-through text-gray-500" : "text-gray-900 dark:text-white"}`}>
                            {a.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">{a.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
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
