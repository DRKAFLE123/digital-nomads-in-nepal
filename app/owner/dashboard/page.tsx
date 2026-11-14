"use client"

import { useState, useEffect, Suspense } from "react"
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
  Globe,
  EyeOff,
  Upload,
  Sliders,
  Loader2,
  Camera,
  LayoutDashboard,
  Bell,
  Settings,
  CreditCard,
  ChevronDown,
  LogOut,
  CalendarCheck
} from "lucide-react"

interface HubData {
  id: string
  name: string
  slug: string
  city: string
  address: string
  description?: string
  spaceType: string
  priceDaily?: number | null
  priceMonthly?: number | null
  openingHours?: string | null
  photoUrl?: string | null
  contactEmail: string
  website?: string | null
  published?: boolean
  ownerEmail?: string | null
  ownerName?: string | null
  facilities: string[]
  bookings: any[]
}

const POPULAR_AMENITIES = [
  "High-Speed Fiber Wi-Fi (100+ Mbps)",
  "24/7 Power Backup (Generator / Solar)",
  "Ergonomic Chairs & Workstations",
  "Soundproof Call Booths",
  "Free Organic Himalayan Coffee & Tea",
  "Mountain View Rooftop",
  "Air Conditioning & Heating",
  "Community Events & Masterminds",
  "Coliving Rooms / Stays Available",
  "24/7 Hot Showers",
  "Shared Kitchen Access",
  "Printing & Document Scanning",
  "Yoga & Meditation Deck",
  "Secure Scooter / Bike Parking",
  "Private Lockers & Storage",
  "24/7 Keycard / Smart Access",
  "Outdoor Garden Workspaces",
  "Standing Desks"
]

function OwnerDashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isJustRegistered = searchParams?.get("registered") === "true"
  const registeredSlug = searchParams?.get("slug") || ""

  // Core Data
  const [ownerEmail, setOwnerEmail] = useState("")
  const [hubs, setHubs] = useState<HubData[]>([])
  const [loading, setLoading] = useState(false)

  // Primary Navigation Tabs: Dashboard | Listings | Reservations | Calendar | Messages | Reviews | Payouts | Settings
  type OwnerNavTab = "DASHBOARD" | "LISTINGS" | "RESERVATIONS" | "CALENDAR" | "MESSAGES" | "REVIEWS" | "PAYOUTS" | "SETTINGS"
  const [mainNavTab, setMainNavTab] = useState<OwnerNavTab>("DASHBOARD")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  
  // Today Sub-Filter: Today vs Upcoming
  const [todaySubFilter, setTodaySubFilter] = useState<"TODAY" | "UPCOMING">("TODAY")

  // Bookings / Inquiries Filter: All | Pending | Confirmed | Cancelled
  const [bookingFilter, setBookingFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL")
  
  // Header Profile Dropdown
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(isJustRegistered)
  const [dismissChecklist, setDismissChecklist] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Email verification resend state
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  const handleResendVerification = async () => {
    if (!session?.user?.email) return
    setResendingEmail(true)
    setResendStatus(null)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
      const data = await res.json()
      setResendStatus(data.message || "Fresh verification link sent!")
    } catch {
      setResendStatus("Failed to send verification link.")
    } finally {
      setResendingEmail(false)
    }
  }

  // Full Property Editor & Visibility State
  const [editingHub, setEditingHub] = useState<HubData | null>(null)
  const [editName, setEditName] = useState("")
  const [editCity, setEditCity] = useState("Kathmandu")
  const [editAddress, setEditAddress] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editSpaceType, setEditSpaceType] = useState("Coworking Space")
  const [editPriceDaily, setEditPriceDaily] = useState<number>(10)
  const [editPriceMonthly, setEditPriceMonthly] = useState<number>(180)
  const [editOpeningHours, setEditOpeningHours] = useState("24/7 Access")
  const [editPhotoUrl, setEditPhotoUrl] = useState("")
  const [editFacilities, setEditFacilities] = useState<string[]>([])
  const [customFeatureInput, setCustomFeatureInput] = useState("")
  const [editPublished, setEditPublished] = useState<boolean>(true)
  const [editWebsite, setEditWebsite] = useState("")
  const [editContactEmail, setEditContactEmail] = useState("")
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [updatingHub, setUpdatingHub] = useState(false)
  const [togglingHubId, setTogglingHubId] = useState<string | null>(null)
  const [listingFilter, setListingFilter] = useState<"ALL" | "LIVE" | "DRAFT">("ALL")

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

  // Open Full Property Editor Modal
  const handleOpenEditModal = (hub: HubData) => {
    setEditingHub(hub)
    setEditName(hub.name || "")
    setEditCity(hub.city || "Kathmandu")
    setEditAddress(hub.address || "")
    setEditDescription(hub.description || "")
    setEditSpaceType(hub.spaceType || "Coworking Space")
    setEditPriceDaily(hub.priceDaily ?? 10)
    setEditPriceMonthly(hub.priceMonthly ?? 180)
    setEditOpeningHours(hub.openingHours || "24/7 Access")
    
    let photo = hub.photoUrl || ""
    if (photo.startsWith("[")) {
      try {
        const parsed = JSON.parse(photo)
        if (Array.isArray(parsed) && parsed.length > 0) photo = parsed[0]
      } catch (e) {}
    }
    setEditPhotoUrl(photo)

    let facs: string[] = []
    if (Array.isArray(hub.facilities)) {
      facs = [...hub.facilities]
    } else if (typeof hub.facilities === "string") {
      try {
        const parsed = JSON.parse(hub.facilities)
        if (Array.isArray(parsed)) facs = parsed
      } catch (e) {
        facs = (hub.facilities as string).split(",").map(s => s.trim()).filter(Boolean)
      }
    }
    setEditFacilities(facs)
    setEditPublished(hub.published !== false)
    setEditWebsite(hub.website || "")
    setEditContactEmail(hub.contactEmail || session?.user?.email || "")
  }

  // Feature Toggling
  const handleToggleFeature = (feat: string) => {
    setEditFacilities(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    )
  }

  const handleAddCustomFeature = () => {
    const trimmed = customFeatureInput.trim()
    if (!trimmed) return
    if (!editFacilities.includes(trimmed)) {
      setEditFacilities(prev => [...prev, trimmed])
    }
    setCustomFeatureInput("")
  }

  const handleRemoveFeature = (feat: string) => {
    setEditFacilities(prev => prev.filter(f => f !== feat))
  }

  // Cover Photo Uploader
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/work-hubs/upload", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setEditPhotoUrl(data.url)
        }
      } else {
        const err = await res.json()
        alert(err.error || "Failed to upload photo")
      }
    } catch (err) {
      console.error("Upload error:", err)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingPhoto(false)
    }
  }

  // Instant Toggle: Live vs Draft / Unlisted
  const handleTogglePublishStatus = async (hub: HubData) => {
    const current = hub.published !== false
    const nextStatus = !current
    setTogglingHubId(hub.id)
    try {
      const res = await fetch("/api/owner/hubs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubId: hub.id,
          published: nextStatus
        })
      })

      if (res.ok) {
        setHubs(prev =>
          prev.map(h => (h.id === hub.id ? { ...h, published: nextStatus } : h))
        )
        setSuccessMessage(
          nextStatus
            ? `"${hub.name}" is now LIVE in the directory!`
            : `"${hub.name}" is now UNLISTED (Saved as Draft).`
        )
        setTimeout(() => setSuccessMessage(""), 4500)
      } else {
        alert("Failed to update listing status")
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err)
    } finally {
      setTogglingHubId(null)
    }
  }

  // Save All Listing Details from Modal
  const handleSaveHubEdits = async () => {
    if (!editingHub) return
    setUpdatingHub(true)
    try {
      const payload = {
        hubId: editingHub.id,
        name: editName.trim(),
        city: editCity.trim(),
        address: editAddress.trim(),
        description: editDescription.trim(),
        spaceType: editSpaceType,
        priceDaily: Number(editPriceDaily) || 0,
        priceMonthly: Number(editPriceMonthly) || 0,
        openingHours: editOpeningHours.trim(),
        photoUrl: editPhotoUrl.trim(),
        facilities: editFacilities,
        published: editPublished,
        website: editWebsite.trim(),
        contactEmail: editContactEmail.trim().toLowerCase()
      }

      const res = await fetch("/api/owner/hubs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setHubs(prev =>
          prev.map(h =>
            h.id === editingHub.id
              ? {
                  ...h,
                  ...payload
                }
              : h
          )
        )
        setEditingHub(null)
        setSuccessMessage(`"${editName}" listing details updated successfully!`)
        setTimeout(() => setSuccessMessage(""), 4500)
      } else {
        const err = await res.json()
        alert(err.error || "Failed to update property details")
      }
    } catch (err) {
      console.error("Hub save error:", err)
      alert("Error saving property details")
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

  // Filtered Hubs (All vs Live vs Draft)
  const filteredHubs = hubs.filter(hub => {
    if (listingFilter === "LIVE") return hub.published !== false
    if (listingFilter === "DRAFT") return hub.published === false
    return true
  })

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
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. STATIONARY FIXED LEFT SIDEBAR (Never Scrolls Away)
         ───────────────────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:sticky top-0 z-40 h-screen w-64 bg-white dark:bg-[#121214] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Top: Brand Logo */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-16 px-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer" title="Digital Nomads in Nepal">
              {/* Official Mountain & Wi-Fi Mark */}
              <div className="relative h-8 w-12 overflow-hidden flex-shrink-0">
                <Image
                  src="/branding/logo-mark.svg"
                  alt="Digital Nomads in Nepal Logo"
                  fill
                  className="object-contain object-left dark:hidden"
                  priority
                  unoptimized
                />
                <Image
                  src="/branding/logo-mark-white.svg"
                  alt="Digital Nomads in Nepal Logo"
                  fill
                  className="object-contain object-left hidden dark:block"
                  priority
                  unoptimized
                />
              </div>

              {/* Official Name & Subtitle */}
              <div className="flex flex-col items-start text-left">
                <span className="font-black text-xs tracking-tight uppercase text-slate-900 dark:text-white leading-tight">
                  DIGITAL NOMADS
                </span>
                <span className="font-bold text-[9px] tracking-widest uppercase text-[#CD6003] dark:text-[#E8923C] leading-none mt-0.5">
                  IN NEPAL
                </span>
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                  HOST CONSOLE
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items (8 options) */}
          <div className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {[
              { id: "DASHBOARD", label: "Dashboard", icon: LayoutDashboard },
              { id: "LISTINGS", label: "My Properties", icon: Building2, badge: hubs.length > 0 ? `${hubs.length}` : undefined },
              { id: "RESERVATIONS", label: "Reservations", icon: CheckCircle2, badge: pendingBookings.length > 0 ? `${pendingBookings.length} new` : undefined, badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" },
              { id: "CALENDAR", label: "Calendar", icon: CalendarIcon },
              { id: "MESSAGES", label: "Messages", icon: MessageSquare, badge: allBookings.length > 0 ? `${allBookings.length}` : undefined },
              { id: "REVIEWS", label: "Reviews", icon: Star },
              { id: "PAYOUTS", label: "Plan & Payouts", icon: DollarSign },
              { id: "SETTINGS", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon
              const active = mainNavTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMainNavTab(item.id as OwnerNavTab)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#023629] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !active && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${item.badgeColor || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom Public Directory Quick Link */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
          <Link
            href="/workspaces"
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300 group"
          >
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-[#C2410C]" />
              <span>Public Directory</span>
            </div>
            <ExternalLink size={12} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. RIGHT MAIN WORKSPACE (INDEPENDENT SCROLL)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">

        {/* Sticky Top App Bar */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="hidden sm:inline">Host Console</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-slate-900 dark:text-white capitalize">
                {mainNavTab.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* + List Space CTA */}
            <Link
              href="/register/space"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#023629] hover:bg-[#034a38] rounded-xl transition-all shadow-xs"
            >
              <PlusCircle size={13} />
              <span className="hidden sm:inline">+ List Another Space</span>
              <span className="sm:hidden">+ Space</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={16} />
                {pendingBookings.length > 0 && (
                  <span className="w-2 h-2 bg-[#C2410C] rounded-full absolute top-1.5 right-1.5 animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#161618] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-3 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white">Host Notifications</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{pendingBookings.length} new</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingBookings.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-xs">
                        No pending guest bookings. All clear!
                      </div>
                    ) : (
                      pendingBookings.slice(0, 3).map((b) => (
                        <div key={b.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => { setMainNavTab("RESERVATIONS"); setNotifOpen(false); }}>
                          <p className="font-bold text-slate-900 dark:text-white">{b.nomadName} requested a desk</p>
                          <p className="text-[11px] text-slate-500">{new Date(b.startDate).toLocaleDateString()} • Pending confirmation</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Shortcut */}
            <button
              type="button"
              onClick={() => setMainNavTab("MESSAGES")}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative cursor-pointer"
              title="Nomad Inquiries"
            >
              <MessageSquare size={16} />
              {allBookings.length > 0 && (
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute top-1.5 right-1.5" />
              )}
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 pl-2 border border-slate-200 dark:border-slate-700 rounded-full hover:shadow-xs transition-all bg-white dark:bg-[#141416] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#023629] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userInitial}
                </div>
                <ChevronDown size={13} className="text-slate-400 pr-1" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#161618] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {session?.user?.name || "Host Account"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{ownerEmail}</p>
                  </div>
                  <Link
                    href="/workspaces"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-[#023629] dark:text-[#FB923C]"
                  >
                    View Public Directory
                  </Link>
                  <Link
                    href="/register/space"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200"
                  >
                    + List Another Space
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 font-medium cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Email Verification Alert Banner */}
        {session?.user && !(session.user as any)?.emailVerified && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
              <span className="text-amber-600">⚠️</span>
              <p className="font-medium">
                Please verify your email address (<strong>{session?.user?.email}</strong>) to activate direct guest bookings.
              </p>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="ml-auto underline font-bold hover:text-amber-950 dark:hover:text-amber-100 flex-shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {resendingEmail ? "Sending link..." : resendStatus || "Resend Email Link"}
              </button>
            </div>
          </div>
        )}

        {/* Independent Scrollable Main Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">

          {/* Global Toast Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={15} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 1: DASHBOARD OVERVIEW
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "DASHBOARD" && (
            <div className="space-y-6">
              
              {/* Celebration Banner if just registered space */}
              {showCelebration && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between gap-3 text-xs">
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
                      className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Action Checklist Card */}
              {!dismissChecklist && (
                <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0 w-11 h-11 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1F23] border border-[#E8E2D8] dark:border-[#2D2D32] flex items-center justify-center">
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#023629] text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
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
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#023629] text-white hover:bg-[#034a38] transition-colors shadow-xs"
                    >
                      {hubs.length === 0 ? "Get Started" : "View Live Listings"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDismissChecklist(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg cursor-pointer"
                      title="Dismiss"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Split Analytics & Nomad Pass Network Section */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
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

              {/* Sub-Navigation Pills: Today vs Upcoming Arrivals */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTodaySubFilter("TODAY")}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    todaySubFilter === "TODAY"
                      ? "bg-[#023629] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#18181B] dark:text-gray-400"
                  }`}
                >
                  Today ({todayBookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTodaySubFilter("UPCOMING")}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    todaySubFilter === "UPCOMING"
                      ? "bg-[#023629] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#18181B] dark:text-gray-400"
                  }`}
                >
                  Upcoming ({upcomingBookings.length})
                </button>
              </div>

              {/* Active Reservations Feed or Notebook Illustration */}
              {activeReservations.length === 0 ? (
                <div className="text-center py-12 sm:py-16 px-4 max-w-md mx-auto">
                  <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="60" cy="98" rx="42" ry="7" fill="#000000" fillOpacity="0.08" />
                      <rect x="18" y="34" width="84" height="60" rx="6" fill="#854D0E" />
                      <rect x="20" y="32" width="80" height="60" rx="5" fill="#FAF6ED" stroke="#E2D7C3" strokeWidth="2" />
                      <line x1="60" y1="32" x2="60" y2="92" stroke="#D7C9B1" strokeWidth="2" strokeDasharray="2 2" />
                      <line x1="28" y1="44" x2="52" y2="44" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="28" y1="52" x2="52" y2="52" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="28" y1="60" x2="48" y2="60" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="28" y1="68" x2="52" y2="68" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="28" y1="76" x2="44" y2="76" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="68" y1="44" x2="92" y2="44" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="68" y1="52" x2="92" y2="52" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="68" y1="60" x2="88" y2="60" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="68" y1="68" x2="92" y2="68" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="68" y1="76" x2="84" y2="76" stroke="#C4B79E" strokeWidth="2" strokeLinecap="round" />
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
                        className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#023629] text-white hover:bg-[#034a38] transition-colors shadow-sm"
                      >
                        + Complete your listing
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setMainNavTab("LISTINGS")}
                        className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#023629] text-white hover:bg-[#034a38] transition-colors shadow-sm cursor-pointer"
                      >
                        View your listings
                      </button>
                    )}
                    <Link
                      href="/workspaces"
                      className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1C1C1F] border border-gray-200 dark:border-[#26262A] transition-colors"
                    >
                      View live site
                    </Link>
                  </div>
                </div>
              ) : (
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

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            {booking.status !== "CONFIRMED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}
                            {booking.status !== "CANCELLED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 dark:border-[#333] hover:border-red-300 transition-colors cursor-pointer"
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
                <div className="p-4 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                  <p className="text-xs font-medium text-gray-500">Live Properties</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {hubs.length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                  <p className="text-xs font-medium text-gray-500">Pending Requests</p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {pendingBookings.length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                  <p className="text-xs font-medium text-gray-500">Confirmed Stays</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {confirmedBookings.length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                  <p className="text-xs font-medium text-gray-500">Total Inquiries</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#C2410C] dark:text-[#FB923C] mt-1">
                    {allBookings.length}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 2: LISTINGS (My Properties)
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "LISTINGS" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#222225]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                    Your Listed Properties ({hubs.length})
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Manage visibility (Live vs Draft), cover photos, amenities, desk pricing, and nomad stays across Nepal.
                  </p>
                </div>

                <Link
                  href="/register/space"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#023629] hover:bg-[#034a38] text-white shadow-xs transition-colors self-start sm:self-center"
                >
                  <PlusCircle size={14} />
                  <span>+ List another property</span>
                </Link>
              </div>

              {/* Filter Pills: All / Live / Draft */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setListingFilter("ALL")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    listingFilter === "ALL"
                      ? "bg-[#023629] text-white shadow-xs"
                      : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  All Properties ({hubs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setListingFilter("LIVE")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    listingFilter === "LIVE"
                      ? "bg-[#023629] text-white shadow-xs"
                      : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Live in Directory ({hubs.filter(h => h.published !== false).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setListingFilter("DRAFT")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    listingFilter === "DRAFT"
                      ? "bg-amber-700 text-white shadow-xs"
                      : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Draft / Unlisted ({hubs.filter(h => h.published === false).length})</span>
                </button>
              </div>

              {/* Property Grid */}
              <div className="space-y-4">
                {filteredHubs.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#141416] border border-dashed border-gray-300 dark:border-gray-700 text-center">
                    <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {listingFilter === "ALL"
                        ? "No properties listed yet"
                        : listingFilter === "LIVE"
                        ? "No live properties currently published"
                        : "No draft / unlisted properties"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-4">
                      {listingFilter === "ALL"
                        ? "Add your coworking space, workstation villa, or nomad stay to start receiving bookings."
                        : "You can toggle any listing between Live and Draft at any time."}
                    </p>
                    {listingFilter === "ALL" && (
                      <Link
                        href="/register/space"
                        className="px-4 py-2 bg-[#023629] text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        + Add your first property
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredHubs.map(hub => {
                      const isLive = hub.published !== false
                      const isToggling = togglingHubId === hub.id
                      
                      let hubPhoto = hub.photoUrl || "/hero-bg.png"
                      if (hubPhoto.startsWith("[")) {
                        try {
                          const parsed = JSON.parse(hubPhoto)
                          if (Array.isArray(parsed) && parsed.length > 0) hubPhoto = parsed[0]
                        } catch (e) {}
                      }

                      let facList: string[] = []
                      if (Array.isArray(hub.facilities)) facList = hub.facilities
                      else if (typeof hub.facilities === "string") {
                        try {
                          const parsed = JSON.parse(hub.facilities)
                          if (Array.isArray(parsed)) facList = parsed
                        } catch (e) {
                          facList = (hub.facilities as string).split(",").map(s => s.trim()).filter(Boolean)
                        }
                      }

                      return (
                        <div
                          key={hub.id}
                          className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Photo Preview */}
                            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                              <img
                                src={hubPhoto}
                                alt={hub.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                {isLive ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    LIVE
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                                    <EyeOff size={11} />
                                    DRAFT / UNLISTED
                                  </span>
                                )}
                              </div>

                              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                {hub.spaceType || "Coworking Space"}
                              </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-5 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                                    {hub.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <MapPin size={12} className="text-[#C2410C]" />
                                    <span>{hub.address || hub.city}</span>
                                  </p>
                                </div>
                              </div>

                              {hub.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                  {hub.description}
                                </p>
                              )}

                              {/* Facility Tags */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {facList.slice(0, 3).map((f) => (
                                  <span
                                    key={f}
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1E1E22] text-gray-700 dark:text-gray-300"
                                  >
                                    {f}
                                  </span>
                                ))}
                                {facList.length > 3 && (
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#1E1E22] text-gray-500">
                                    +{facList.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Card Actions Footer */}
                          <div className="p-4 pt-3 border-t border-gray-100 dark:border-[#222225] bg-gray-50/50 dark:bg-[#161619] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {/* Edit Modal Trigger */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(hub)}
                                className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-[#202024] transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 size={12} />
                                <span>Edit Listing</span>
                              </button>

                              {/* View Live */}
                              <Link
                                href={`/workspaces/${hub.slug}`}
                                target="_blank"
                                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#202024] transition-colors flex items-center gap-1"
                              >
                                <ExternalLink size={12} />
                                <span className="hidden sm:inline">View Live</span>
                              </Link>
                            </div>

                            {/* Instant Live / Unlist Toggle */}
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => handleTogglePublishStatus(hub)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isLive
                                  ? "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              }`}
                              title={isLive ? "Hide listing from public directory (Save as Draft)" : "Publish listing to directory"}
                            >
                              {isToggling ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : isLive ? (
                                <>
                                  <EyeOff size={13} />
                                  <span>Unlist (Draft)</span>
                                </>
                              ) : (
                                <>
                                  <Eye size={13} />
                                  <span>Make Live</span>
                                </>
                              )}
                            </button>
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
              TAB 3: RESERVATIONS CONSOLE
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "RESERVATIONS" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#222225]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                    Reservations &amp; Guest Bookings
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Review incoming desk &amp; stay requests, confirm arrivals, and manage bookings.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setBookingFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        bookingFilter === filter
                          ? "bg-[#023629] text-white shadow-xs"
                          : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {allBookings.filter(b => bookingFilter === "ALL" ? true : b.status === bookingFilter).length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#141416] rounded-2xl border border-gray-200 dark:border-[#26262A] p-8">
                  <CheckCircle2 className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No {bookingFilter.toLowerCase()} reservations found</p>
                  <p className="text-xs text-gray-500 mt-1">When nomads book your space, their reservations will be listed here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-[#202024] bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl overflow-hidden shadow-xs">
                  {allBookings
                    .filter(b => bookingFilter === "ALL" ? true : b.status === bookingFilter)
                    .map((booking: any) => {
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

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            {booking.status !== "CONFIRMED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}
                            {booking.status !== "CANCELLED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 dark:border-[#333] hover:border-red-300 transition-colors cursor-pointer"
                              >
                                Decline
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

          {/* ═════════════════════════════════════════════════════════════
              TAB 4: CALENDAR
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "CALENDAR" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#222225]">
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
                    className="p-2 rounded-xl border border-gray-200 dark:border-[#2A2A2E] hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors cursor-pointer"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-2 rounded-xl border border-gray-200 dark:border-[#2A2A2E] hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors cursor-pointer"
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
                  {[...Array(firstDayOfWeek)].map((_, i) => (
                    <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-transparent" />
                  ))}

                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1
                    const dayDate = new Date(currentYear, currentMonth, day)
                    const dateStr = dayDate.toISOString().slice(0, 10)
                    const isToday = dateStr === todayDateStr

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
              TAB 5: MESSAGES & INQUIRIES
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "MESSAGES" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#222225]">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Nomad Inquiries &amp; Messages
                  </h2>
                  <p className="text-xs text-gray-500">
                    Connect with remote workers inquiring about desks, coliving stays, and power backup.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  {allBookings.length} total inquiries
                </span>
              </div>

              {allBookings.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#141416] rounded-2xl border border-gray-200 dark:border-[#26262A] p-8">
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
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#023629] hover:bg-[#034a38] text-white flex items-center gap-1.5 shadow-xs transition-colors"
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

          {/* ═════════════════════════════════════════════════════════════
              TAB 6: REVIEWS
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "REVIEWS" && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-gray-200 dark:border-[#222225]">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Guest Reviews &amp; Ratings
                </h2>
                <p className="text-xs text-gray-500">
                  Feedback from verified remote workers who worked and stayed at your spaces.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] text-center">
                  <span className="text-3xl font-black text-amber-500">5.0</span>
                  <div className="flex justify-center text-amber-500 text-sm my-1">★★★★★</div>
                  <p className="text-xs text-gray-500 font-semibold">Overall Rating</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] text-center">
                  <span className="text-3xl font-black text-[#023629] dark:text-[#FB923C]">100%</span>
                  <p className="text-xs text-gray-500 font-semibold mt-2">Wi-Fi Reliability</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] text-center">
                  <span className="text-3xl font-black text-[#C2410C]">0%</span>
                  <p className="text-xs text-gray-500 font-semibold mt-2">Power Cut Impact</p>
                </div>
              </div>

              <div className="p-8 text-center bg-white dark:bg-[#141416] rounded-2xl border border-gray-200 dark:border-[#26262A]">
                <Star className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No public reviews yet</p>
                <p className="text-xs text-gray-500 mt-1">Reviews from guests who complete their stay will automatically appear here.</p>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 7: PAYOUTS & BILLING
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "PAYOUTS" && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-gray-200 dark:border-[#222225]">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Plan &amp; Payouts
                </h2>
                <p className="text-xs text-gray-500">
                  Manage payout accounts, Nomad Pass redemptions, and direct guest settlements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Host Settlement Method</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">ACTIVE</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Direct Local Bank Settlement</h4>
                  <p className="text-xs text-gray-500">
                    All-Nepal Nomad Pass passes and direct bookings are transferred to your Nepali bank account (eSewa / Khalti / Fonepay or direct IBAN).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Platform Commission</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">0% PROMO</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">0% Platform Fee on Direct Bookings</h4>
                  <p className="text-xs text-gray-500">
                    You keep 100% of revenue from remote workers who connect with you directly on Digital Nomads in Nepal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 8: SETTINGS
             ═════════════════════════════════════════════════════════════ */}
          {mainNavTab === "SETTINGS" && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-gray-200 dark:border-[#222225]">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Host Profile &amp; Settings
                </h2>
                <p className="text-xs text-gray-500">
                  Update your contact email, notification preferences, and host information.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Host Contact Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={ownerEmail || session?.user?.email || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">This email receives guest booking alerts and messages.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Host Full Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={session?.user?.name || "Host Partner"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
      {/* ─────────────────────────────────────────────────────────────
          EDIT PROPERTY & FEATURES MODAL
         ───────────────────────────────────────────────────────────── */}
      {editingHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-[#26262A] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-[#222225] bg-gray-50/70 dark:bg-[#161619] sticky top-0 z-10">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  Edit Property Listing
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Update visibility, cover photo, amenities, and details for {editingHub.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingHub(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#202024] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* 1. VISIBILITY / DRAFT TOGGLE */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-[#26262A] bg-gray-50 dark:bg-[#161618] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">
                      Listing Status &amp; Visibility
                    </span>
                    {editPublished ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        ● LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full">
                        ○ DRAFT / UNLISTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {editPublished
                      ? "Your property is actively listed in the Nepal workspace directory and can receive inquiries."
                      : "Unlisted: Hidden from public search and category feeds. Only you can view it."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditPublished(!editPublished)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                    editPublished
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-[#023629] text-white hover:bg-[#034a38] cursor-pointer"
                  }`}
                >
                  {editPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{editPublished ? "Unlist (Draft)" : "Make Live"}</span>
                </button>
              </div>

              {/* 2. COVER PHOTO */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Cover Photo
                  </label>
                  <span className="text-[11px] text-gray-400">
                    JPEG, PNG, WebP up to 5MB
                  </span>
                </div>

                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 dark:border-[#26262A] bg-gray-100 dark:bg-[#1E1E22]">
                  {editPhotoUrl ? (
                    <img
                      src={editPhotoUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                      <Camera size={28} />
                      <span className="text-xs">No cover image uploaded</span>
                    </div>
                  )}

                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-xs font-bold">Uploading Cover Photo...</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1E1E22] hover:bg-gray-200 dark:hover:bg-[#28282D] text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    <Upload size={14} />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={editPhotoUrl}
                    onChange={e => setEditPhotoUrl(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="flex-[2] p-2 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 3. BASIC DETAILS */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Property Info
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Space Type *
                    </label>
                    <select
                      value={editSpaceType}
                      onChange={e => setEditSpaceType(e.target.value)}
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Coworking Space">Coworking Space</option>
                      <option value="Coliving & Workation">Coliving &amp; Workation</option>
                      <option value="Workstation Villa">Workstation Villa</option>
                      <option value="Hostel with Dedicated Desks">Hostel with Dedicated Desks</option>
                      <option value="Cafe & Cowork">Cafe &amp; Cowork</option>
                      <option value="Private Studio Hub">Private Studio Hub</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={e => setEditCity(e.target.value)}
                      placeholder="e.g. Kathmandu, Pokhara, Lalitpur"
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Full Address *
                    </label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={e => setEditAddress(e.target.value)}
                      placeholder="e.g. Thamel, Ward 26, Kathmandu"
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Daily Desk Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editPriceDaily}
                      onChange={e => setEditPriceDaily(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Monthly Coliving/Desk ($ USD)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editPriceMonthly}
                      onChange={e => setEditPriceMonthly(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={editOpeningHours}
                      onChange={e => setEditOpeningHours(e.target.value)}
                      placeholder="e.g. 24/7 Access or 8 AM - 10 PM"
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    About this Space (Description for Nomads)
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Describe your internet speed, vibe, community, surrounding cafes, power backup..."
                    className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 4. FEATURES & AMENITIES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Amenities &amp; Nomad Features ({editFacilities.length} selected)
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Click to toggle
                  </span>
                </div>

                {/* Popular Amenities Chips */}
                <div className="flex flex-wrap gap-2">
                  {POPULAR_AMENITIES.map(amenity => {
                    const selected = editFacilities.includes(amenity)
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleFeature(amenity)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left flex items-center gap-1.5 ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-gray-50 dark:bg-[#1A1A1E] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#2C2C30] hover:border-gray-400"
                        }`}
                      >
                        {selected ? <Check size={12} className="stroke-[3]" /> : null}
                        <span>{amenity}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Custom Feature Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={customFeatureInput}
                    onChange={e => setCustomFeatureInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddCustomFeature()
                      }
                    }}
                    placeholder="Add custom feature (e.g. Pet Friendly, Sound Studio)..."
                    className="flex-1 p-2 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFeature}
                    className="px-3 py-2 bg-gray-200 dark:bg-[#222226] hover:bg-gray-300 dark:hover:bg-[#2C2C32] text-xs font-semibold rounded-xl text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    + Add
                  </button>
                </div>

                {/* Active Custom Features Display */}
                {editFacilities.filter(f => !POPULAR_AMENITIES.includes(f)).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editFacilities.filter(f => !POPULAR_AMENITIES.includes(f)).map(customFeat => (
                      <span
                        key={customFeat}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      >
                        <span>{customFeat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(customFeat)}
                          className="hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. CONTACT & EXTERNAL LINKS */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Host Contact &amp; Links
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Contact / Inquiries Email *
                    </label>
                    <input
                      type="email"
                      value={editContactEmail}
                      onChange={e => setEditContactEmail(e.target.value)}
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Website / Booking Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={e => setEditWebsite(e.target.value)}
                      placeholder="https://yourspace.com"
                      className="w-full p-2.5 text-xs bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#2E2E33] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-[#222225] bg-gray-50 dark:bg-[#141416] flex items-center justify-end gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setEditingHub(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1E1E22] text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingHub || uploadingPhoto}
                onClick={handleSaveHubEdits}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#023629] hover:bg-[#034a38] text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {updatingHub ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default function OwnerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#080808] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            Loading Host Console...
          </div>
        </div>
      }
    >
      <OwnerDashboardContent />
    </Suspense>
  )
}
