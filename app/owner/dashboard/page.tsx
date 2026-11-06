"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Footer from "@/components/Footer"
import { 
  Building2, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  Edit3, 
  Save, 
  User, 
  MapPin, 
  PlusCircle, 
  RefreshCw,
  ArrowRight,
  Sparkles,
  Home,
  Eye,
  ExternalLink,
  Compass,
  Mountain,
  MessageSquare,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Check,
  Star,
  Award,
  Globe
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
  const searchParams = useSearchParams()
  const isJustRegistered = searchParams?.get("registered") === "true"
  const registeredSlug = searchParams?.get("slug") || ""

  // Core Data
  const [ownerEmail, setOwnerEmail] = useState("")
  const [hubs, setHubs] = useState<HubData[]>([])
  const [loading, setLoading] = useState(false)

  // Primary Airbnb Navigation Tabs: Today | Calendar | Listings | Messages
  const [mainNavTab, setMainNavTab] = useState<"TODAY" | "CALENDAR" | "LISTINGS" | "MESSAGES">("TODAY")
  
  // Today Sub-Filter: Today vs Upcoming
  const [todaySubFilter, setTodaySubFilter] = useState<"TODAY" | "UPCOMING">("TODAY")

  // Bookings / Inquiries Filter: All | Pending | Confirmed | Cancelled
  const [bookingFilter, setBookingFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL")
  
  // Header Profile Dropdown
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(isJustRegistered)
  const [dismissChecklist, setDismissChecklist] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Editing Space Listing State
  const [editingHubId, setEditingHubId] = useState<string | null>(null)
  const [editPriceDaily, setEditPriceDaily] = useState<number>(10)
  const [editPriceMonthly, setEditPriceMonthly] = useState<number>(180)
  const [editOpeningHours, setEditOpeningHours] = useState<string>("24/7 Access")
  const [editFacilities, setEditFacilities] = useState<string>("")
  const [updatingHub, setUpdatingHub] = useState(false)

  // Calendar Month State
  const [calendarDate, setCalendarDate] = useState(new Date())

  // Initial Load
  useEffect(() => {
    if (isJustRegistered) {
      setMainNavTab("LISTINGS")
      setShowCelebration(true)
    }
  }, [isJustRegistered])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/owner/dashboard")
    } else if (session?.user?.email) {
      const email = session.user.email
      setOwnerEmail(email)
      fetchHostData(email)
    }
  }, [session, status, router])

  // Fetch both Space Properties and Guide Profile
  const fetchHostData = async (email: string) => {
    if (!email) return
    setLoading(true)
    try {
      // 1. Fetch Work Hubs owned by user
      const hubsRes = await fetch(`/api/owner/hubs?email=${encodeURIComponent(email)}`)
      if (hubsRes.ok) {
        const data = await hubsRes.json()
        setHubs(Array.isArray(data) ? data : [])
      } else {
        setHubs([])
      }
    } catch (err) {
      console.error("Failed to load host data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Handle Hub Booking Status Update (Confirm / Decline)
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus })
      })

      if (res.ok) {
        setHubs(prev =>
          prev.map(hub => ({
            ...hub,
            bookings: hub.bookings.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
          }))
        )
        setSuccessMessage(`Reservation status successfully updated to ${newStatus}`)
        setTimeout(() => setSuccessMessage(""), 4000)
      }
    } catch (err) {
      console.error("Failed to update booking status:", err)
    }
  }

  // Save Hub Details
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
        setSuccessMessage("Property pricing & amenities successfully updated!")
        setTimeout(() => setSuccessMessage(""), 4000)
      }
    } catch (err) {
      console.error("Hub update error:", err)
    } finally {
      setUpdatingHub(false)
    }
  }

  // Aggregate Metrics
  const allBookings = hubs.flatMap(h => h.bookings || [])
  const pendingBookings = allBookings.filter(b => b.status === "PENDING")
  const confirmedBookings = allBookings.filter(b => b.status === "CONFIRMED")
  
  // Split Analytics by Booking Type (Work, Stay, Work + Stay)
  const workBookingsCount = allBookings.filter(b => {
    const n = (b.notes || "").toLowerCase()
    return n.includes("desk_only") || n.includes("hot_desk") || n.includes("dedicated_desk") || (!n.includes("stay") && !n.includes("coliving") && !n.includes("package") && !n.includes("room"))
  }).length

  const stayBookingsCount = allBookings.filter(b => {
    const n = (b.notes || "").toLowerCase()
    return n.includes("stay_coworking") || n.includes("stay") || n.includes("apartment") || n.includes("hostel") || n.includes("hotel") || n.includes("room")
  }).length

  const workAndStayBookingsCount = allBookings.filter(b => {
    const n = (b.notes || "").toLowerCase()
    return n.includes("workation") || n.includes("coliving") || n.includes("work_and_stay") || n.includes("package")
  }).length

  const totalBookingsCount = allBookings.length

  // Today's Bookings
  const todayDateStr = new Date().toISOString().slice(0, 10)
  const todayBookings = allBookings.filter(b => {
    const s = new Date(b.startDate).toISOString().slice(0, 10)
    const e = new Date(b.endDate).toISOString().slice(0, 10)
    return todayDateStr >= s && todayDateStr <= e
  })

  const upcomingBookings = allBookings.filter(b => {
    const s = new Date(b.startDate).toISOString().slice(0, 10)
    return s > todayDateStr
  })

  const activeReservations = todaySubFilter === "TODAY" ? todayBookings : upcomingBookings

  // User Initial
  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : (session?.user?.email ? session.user.email.charAt(0).toUpperCase() : "H")

  // Calendar Helpers
  const currentYear = calendarDate.getFullYear()
  const currentMonth = calendarDate.getMonth()
  const monthName = calendarDate.toLocaleString("en-US", { month: "long" })
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

  const prevMonth = () => setCalendarDate(new Date(currentYear, currentMonth - 1, 1))
  const nextMonth = () => setCalendarDate(new Date(currentYear, currentMonth + 1, 1))

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP AIRBNB-STYLE HOST NAVIGATION BAR
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0E0E10] border-b border-gray-200 dark:border-[#222225] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Identity */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#C2410C] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Mountain size={18} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight tracking-tight text-gray-900 dark:text-white">
                  Nomads<span className="text-[#C2410C]">Nepal</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Host Console
                </span>
              </div>
            </Link>

            {/* Center: Airbnb Primary Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
              {[
                { id: "TODAY", label: "Today" },
                { id: "CALENDAR", label: "Calendar" },
                { id: "LISTINGS", label: "Listings" },
                { id: "MESSAGES", label: "Messages" }
              ].map(tab => {
                const isActive = mainNavTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMainNavTab(tab.id as any)}
                    className={`relative px-4 py-6 text-sm font-semibold transition-colors ${
                      isActive 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-4 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right: Switch to Listing + Avatar Menu */}
            <div className="flex items-center gap-3">
              <Link
                href="/workspaces"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/80 hover:bg-blue-100/90 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 border border-blue-200/80 dark:border-blue-800/50 rounded-full transition-all shadow-xs group"
                title="Switch back to live listings"
              >
                <Compass size={13} className="text-blue-600 dark:text-blue-400 group-hover:rotate-45 transition-transform" />
                <span>Switch to listing</span>
              </Link>

              {/* Host Avatar & Dropdown Menu Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 border border-gray-300 dark:border-[#2D2D32] rounded-full hover:shadow-md transition-all duration-200 bg-white dark:bg-[#141416]"
                >
                  <Menu size={16} className="text-gray-600 dark:text-gray-400" />
                  <div className="w-8 h-8 rounded-full bg-[#C2410C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {userInitial}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#161618] border border-gray-200 dark:border-[#26262A] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-[#222225]">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {session?.user?.name || "Host Account"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{ownerEmail}</p>
                    </div>

                    <Link
                      href="/workspaces"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold text-blue-600 dark:text-blue-400"
                    >
                      Switch to listing (Live Site)
                    </Link>

                    <Link
                      href="/register/space"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#1F1F23] font-medium text-gray-700 dark:text-gray-200"
                    >
                      + List another workspace or stay
                    </Link>

                    <div className="border-t border-gray-100 dark:border-[#222225] my-1" />

                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Mobile Secondary Tab Bar */}
          <div className="flex md:hidden items-center justify-around border-t border-gray-100 dark:border-[#1F1F22] py-2">
            {[
              { id: "TODAY", label: "Today" },
              { id: "CALENDAR", label: "Calendar" },
              { id: "LISTINGS", label: "Listings" },
              { id: "MESSAGES", label: "Messages" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMainNavTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  mainNavTab === tab.id
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. AIRBNB-STYLE ACTION CHECKLIST CARD (Top Center)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full pt-6 pb-2">
        {/* Celebration Banner if just registered space */}
        {showCelebration && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎉</span>
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  Your Space Was Successfully Registered!
                </p>
                <p className="text-emerald-700 dark:text-emerald-400">
                  It is now live in your host console. Check your listing details or view it live.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {registeredSlug && (
                <Link
                  href={`/workspaces/${registeredSlug}`}
                  target="_blank"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  View Live
                </Link>
              )}
              <button
                onClick={() => setShowCelebration(false)}
                className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Airbnb Reference Action Card */}
        {!dismissChecklist && (
          <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4 transition-all hover:shadow-sm">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Badge with count */}
              <div className="relative shrink-0 w-11 h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1F23] border border-[#E8E2D8] dark:border-[#2D2D32] flex items-center justify-center">
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-[11px] flex items-center justify-center shadow-xs">
                  {hubs.length > 0 ? "✓" : "1"}
                </span>
                <Sparkles size={20} className="text-[#C2410C]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                  {hubs.length === 0 
                    ? "Complete your property listing" 
                    : "Your property listings are active & live on Nomads Nepal"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {hubs.length === 0
                    ? "Add photo gallery, fiber speeds & daily desk rates to publish"
                    : `${hubs.length} properties published and receiving booking inquiries`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={hubs.length === 0 ? "/register/space" : "/workspaces"}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-xs"
              >
                {hubs.length === 0 ? "Get Started" : "View Live Listings"}
              </Link>
              <button
                type="button"
                onClick={() => setDismissChecklist(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                title="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Global Toast Message */}
        {successMessage && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={15} />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN HOST CONTENT AREA
         ───────────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 w-full flex-1 py-6 space-y-6">

        {/* Phase 4: Host Split Analytics & Nomad Pass Network Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Split Analytics by Booking Type (8 cols) */}
          <div className="md:col-span-8 bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                  Bookings Breakdown
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Reservations by Offering Type
                </h3>
              </div>
              <span className="text-xs font-bold text-gray-500 font-mono">
                {totalBookingsCount} Total Bookings
              </span>
            </div>

            {/* Split Metrics */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-xl bg-[#1B4332]/5 border border-[#1B4332]/20">
                <div className="flex items-center gap-1.5 text-[#1B4332] dark:text-[#8FB89A] text-xs font-bold">
                  <span>💻</span> Work
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white mt-1 font-mono">
                  {workBookingsCount}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Hot &amp; Dedicated Desks</div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40">
                <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 text-xs font-bold">
                  <span>🛌</span> Stay
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white mt-1 font-mono">
                  {stayBookingsCount}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Rooms &amp; Apartments</div>
              </div>

              <div className="p-3 rounded-xl bg-[#C2410C]/5 border border-[#C2410C]/20">
                <div className="flex items-center gap-1.5 text-[#C2410C] dark:text-[#FB923C] text-xs font-bold">
                  <span>⚡</span> Work + Stay
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white mt-1 font-mono">
                  {workAndStayBookingsCount}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">All-Inclusive Packages</div>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-1.5 pt-0.5">
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${totalBookingsCount > 0 ? (workBookingsCount / totalBookingsCount) * 100 : 33.3}%` }}
                  className="bg-[#1B4332] h-full transition-all duration-300"
                  title="Work Bookings"
                />
                <div
                  style={{ width: `${totalBookingsCount > 0 ? (stayBookingsCount / totalBookingsCount) * 100 : 33.3}%` }}
                  className="bg-sky-600 h-full transition-all duration-300"
                  title="Stay Bookings"
                />
                <div
                  style={{ width: `${totalBookingsCount > 0 ? (workAndStayBookingsCount / totalBookingsCount) * 100 : 33.4}%` }}
                  className="bg-[#C2410C] h-full transition-all duration-300"
                  title="Work + Stay Packages"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" /> Work</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-600" /> Stay</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" /> Packages</span>
              </div>
            </div>
          </div>

          {/* Nomad Pass Multi-Hub Partner Network Card (4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-[#17251E] to-[#0D1812] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-black uppercase tracking-widest text-[#D6A06A] bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                  NETWORK PARTNER
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h4 className="text-sm font-black text-[#F5F5F0]">
                All-Nepal Nomad Pass
              </h4>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Your spaces are enabled for cross-city nomad passes in Kathmandu, Pokhara, Mustang &amp; Bandipur.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-gray-300 font-medium">Redemption:</span>
              <span className="font-bold text-[#8FB89A]">Auto-Settled</span>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════
            TAB 1: TODAY (Exact Airbnb Reference Screen)
           ═════════════════════════════════════════════════════════════ */}
        {mainNavTab === "TODAY" && (
          <div className="space-y-8">
            
            {/* Sub-Navigation Pills: [ Today ] [ Upcoming ] */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setTodaySubFilter("TODAY")}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  todaySubFilter === "TODAY"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#18181B] dark:text-gray-400 dark:hover:bg-[#222226]"
                }`}
              >
                Today ({todayBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setTodaySubFilter("UPCOMING")}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  todaySubFilter === "UPCOMING"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#18181B] dark:text-gray-400 dark:hover:bg-[#222226]"
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
            </div>

            {/* Empty State: Matching Airbnb Reference SVG Notebook Illustration */}
            {activeReservations.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4 max-w-md mx-auto">
                {/* 3D-Style Open Notebook with Ribbon Bookmark Illustration */}
                <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shadow underneath */}
                    <ellipse cx="60" cy="98" rx="42" ry="7" fill="#000000" fillOpacity="0.08" />
                    {/* Book Cover Edge */}
                    <rect x="18" y="34" width="84" height="60" rx="6" fill="#854D0E" />
                    {/* Pages Base */}
                    <rect x="20" y="32" width="80" height="60" rx="5" fill="#FAF6ED" stroke="#E2D7C3" strokeWidth="2" />
                    {/* Spine Divider */}
                    <line x1="60" y1="32" x2="60" y2="92" stroke="#D7C9B1" strokeWidth="2" strokeDasharray="2 2" />
                    {/* Left Page Rows */}
                    <line x1="28" y1="44" x2="52" y2="44" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="52" x2="52" y2="52" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="60" x2="48" y2="60" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="68" x2="52" y2="68" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="76" x2="44" y2="76" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    {/* Right Page Rows */}
                    <line x1="68" y1="44" x2="92" y2="44" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="68" y1="52" x2="92" y2="52" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="68" y1="60" x2="88" y2="60" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="68" y1="68" x2="92" y2="68" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    <line x1="68" y1="76" x2="84" y2="76" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                    {/* Ribbon Bookmark (Pink/Rose) */}
                    <path d="M57 26 V96 L60 90 L63 96 V26 Z" fill="#E11D48" />
                  </svg>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  You don’t have any reservations
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-normal leading-relaxed mb-6">
                  {hubs.length === 0
                    ? "To get booked, you’ll need to complete and publish your listing."
                    : "When digital nomads book desks, rooms, or treks, your reservations will appear here."}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {hubs.length === 0 ? (
                    <Link
                      href="/register/space"
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      + Complete your listing
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMainNavTab("LISTINGS")}
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      View your listings
                    </button>
                  )}
                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1C1C1F] border border-gray-200 dark:border-[#26262A] transition-colors"
                  >
                    View live site
                  </Link>
                </div>
              </div>
            ) : (
              /* Active Reservations Feed */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-[#222225]">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    {todaySubFilter === "TODAY" ? "Today's Active Stays & Check-ins" : "Upcoming Scheduled Reservations"}
                  </h3>
                  <span className="text-xs text-gray-500">{activeReservations.length} total</span>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-[#202024] bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl overflow-hidden shadow-xs">
                  {activeReservations.map((booking: any) => {
                    const hubObj = hubs.find(h => h.id === booking.hubId) || hubs[0]
                    const startDateFormatted = new Date(booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    const endDateFormatted = new Date(booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

                    return (
                      <div key={booking.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-[#18181B] transition-colors">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              booking.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : booking.status === "PENDING"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                            }`}>
                              {booking.status}
                            </span>
                            <span className="text-xs font-semibold text-[#C2410C]">
                              {hubObj?.name || "Workspace in Nepal"}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            {booking.nomadName} <span className="text-xs font-normal text-gray-400 font-mono">({booking.nomadEmail})</span>
                          </h4>

                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <CalendarIcon size={13} className="text-gray-400" />
                            <span>{startDateFormatted} → {endDateFormatted}</span>
                            {booking.notes && <span className="italic">· "{booking.notes}"</span>}
                          </p>
                        </div>

                        {/* Quick Approval Actions */}
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {booking.status !== "CONFIRMED" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 dark:border-[#333] hover:border-red-300 transition-colors"
                            >
                              Decline
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                <p className="text-xs font-medium text-gray-500">Live Properties</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {hubs.length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                <p className="text-xs font-medium text-gray-500">Pending Requests</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {pendingBookings.length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                <p className="text-xs font-medium text-gray-500">Confirmed Stays</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {confirmedBookings.length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                <p className="text-xs font-medium text-gray-500">Total Inquiries</p>
                <p className="text-xl sm:text-2xl font-bold text-[#C2410C] dark:text-[#FB923C] mt-1">
                  {allBookings.length}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            TAB 2: CALENDAR
           ═════════════════════════════════════════════════════════════ */}
        {mainNavTab === "CALENDAR" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {monthName} {currentYear}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage check-in availability and incoming guest bookings across Nepal.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-2 rounded-xl border border-gray-200 dark:border-[#2A2A2E] hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors"
                  aria-label="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 rounded-xl border border-gray-200 dark:border-[#2A2A2E] hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-4 sm:p-6 shadow-xs">
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 pb-2 border-b border-gray-100 dark:border-[#202024]">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="grid grid-cols-7 gap-1 pt-3">
                {/* Empty padding days */}
                {[...Array(firstDayOfWeek)].map((_, i) => (
                  <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-transparent" />
                ))}

                {/* Days of month */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1
                  const dayDate = new Date(currentYear, currentMonth, day)
                  const dateStr = dayDate.toISOString().slice(0, 10)
                  const isToday = dateStr === todayDateStr

                  // Check if any booking falls on this day
                  const dayBookings = allBookings.filter(b => {
                    const s = new Date(b.startDate).toISOString().slice(0, 10)
                    const e = new Date(b.endDate).toISOString().slice(0, 10)
                    return dateStr >= s && dateStr <= e
                  })

                  return (
                    <div
                      key={day}
                      className={`h-16 sm:h-20 p-1.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isToday
                          ? "border-[#C2410C] bg-[#C2410C]/5 dark:bg-[#C2410C]/10 font-bold"
                          : dayBookings.length > 0
                          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
                          : "border-gray-100 dark:border-[#202024] hover:border-gray-300 dark:hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isToday ? "text-[#C2410C]" : "text-gray-700 dark:text-gray-300"}`}>
                          {day}
                        </span>
                        {dayBookings.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      {dayBookings.length > 0 && (
                        <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                          {dayBookings[0].nomadName}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            TAB 3: LISTINGS (Pure Property Listings: Workspaces & Stays)
           ═════════════════════════════════════════════════════════════ */}
        {mainNavTab === "LISTINGS" && (
          <div className="space-y-6">
            
            {/* Header with Add Property Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#222225]">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                  Your Listed Properties ({hubs.length})
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Manage your active workspaces, coliving hubs, daily desk rates, and nomad stays across Nepal.
                </p>
              </div>

              <Link
                href="/register/space"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-xs transition-colors self-start sm:self-center"
              >
                <PlusCircle size={14} />
                <span>+ List another property</span>
              </Link>
            </div>

            {/* WORKSPACE / COLIVING PROPERTY LISTINGS GRID */}
            <div className="space-y-4">
              {hubs.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-dashed border-gray-300 dark:border-gray-700 text-center">
                  <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No properties listed yet</p>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Add your coworking space, workstation villa, or nomad stay to start receiving bookings.</p>
                  <Link
                    href="/register/space"
                    className="px-4 py-2 bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    + Add your first property
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hubs.map(hub => {
                    const isEditing = editingHubId === hub.id
                    return (
                      <div key={hub.id} className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                        {/* Image Thumbnail */}
                        <div className="relative aspect-video w-full bg-gray-100 dark:bg-[#1F1F22] overflow-hidden">
                          <img
                            src={hub.photoUrl ? (hub.photoUrl.startsWith("[") ? JSON.parse(hub.photoUrl)[0] : hub.photoUrl) : "/hero-bg.png"}
                            alt={hub.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {hub.city || "Nepal"}
                          </span>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                                {hub.name}
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} /> {hub.address}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-[#C2410C] shrink-0">
                              ${hub.priceDaily || 10}/day
                            </span>
                          </div>

                          {/* Editing Form Inline */}
                          {isEditing ? (
                            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-[#242428] text-xs">
                              <div>
                                <label className="block text-gray-500 font-semibold mb-1">Daily Rate ($USD)</label>
                                <input
                                  type="number"
                                  value={editPriceDaily}
                                  onChange={e => setEditPriceDaily(parseFloat(e.target.value) || 0)}
                                  className="w-full p-2 bg-gray-50 dark:bg-[#1C1C1F] border border-gray-200 dark:border-[#333] rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-500 font-semibold mb-1">Monthly Coliving Rate ($USD)</label>
                                <input
                                  type="number"
                                  value={editPriceMonthly}
                                  onChange={e => setEditPriceMonthly(parseFloat(e.target.value) || 0)}
                                  className="w-full p-2 bg-gray-50 dark:bg-[#1C1C1F] border border-gray-200 dark:border-[#333] rounded-lg"
                                />
                              </div>
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() => handleSaveHubDetails(hub.id)}
                                  disabled={updatingHub}
                                  className="flex-1 py-1.5 bg-[#C2410C] text-white font-bold rounded-lg"
                                >
                                  {updatingHub ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingHubId(null)}
                                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-[#222226]">
                              <Link
                                href={`/workspaces/${hub.slug}`}
                                target="_blank"
                                className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-gray-200 dark:border-[#2A2A2E] hover:bg-gray-50 dark:hover:bg-[#1C1C20] flex items-center justify-center gap-1.5"
                              >
                                <Eye size={13} />
                                <span>View Live Listing</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingHubId(hub.id)
                                  setEditPriceDaily(hub.priceDaily || 10)
                                  setEditPriceMonthly(hub.priceMonthly || 180)
                                  setEditOpeningHours(hub.openingHours || "24/7 Access")
                                  setEditFacilities(Array.isArray(hub.facilities) ? hub.facilities.join(", ") : "")
                                }}
                                className="px-3 py-2 text-xs font-bold rounded-xl bg-gray-100 dark:bg-[#1E1E22] hover:bg-gray-200 text-gray-800 dark:text-gray-200"
                              >
                                Edit Rates
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            TAB 4: MESSAGES & INQUIRIES
           ═════════════════════════════════════════════════════════════ */}
        {mainNavTab === "MESSAGES" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#222225]">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Nomad Inquiries &amp; Messages
                </h2>
                <p className="text-xs text-gray-500">
                  Connect with remote workers inquiring about desks, coliving stays, and guided treks.
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {allBookings.length} total messages
              </span>
            </div>

            {allBookings.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-[#141416] rounded-2xl border border-gray-200 dark:border-[#26262A] p-8">
                <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No incoming messages yet</p>
                <p className="text-xs text-gray-500 mt-1">When nomads send an enquiry or booking request, you can reply directly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allBookings.map((b: any) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {b.nomadName}
                        </span>
                        <span className="text-xs text-gray-400">({b.nomadEmail})</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        "{b.notes || "Inquired about workspace desk & power backup availability."}"
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Dates requested: {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <a
                        href={`mailto:${b.nomadEmail}?subject=Regarding your Nepal stay booking`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center gap-1.5"
                      >
                        <Mail size={13} />
                        <span>Email Nomad</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
