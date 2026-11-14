/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Footer from "@/components/Footer"
import { 
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  Compass,
  Star,
  CreditCard,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Upload,
  Save,
  Loader2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Check,
  Plus,
  Trash2,
  Calendar,
  Eye,
  Mountain,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Camera,
  Image as ImageIcon,
  Play
} from "lucide-react"

interface GuideReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  user?: { name: string }
}

interface GuideData {
  id: string
  name: string
  tagline?: string | null
  bio: string
  location: string
  specialties: string[] | any
  photoUrl?: string | null
  contactEmail: string
  phone?: string | null
  whatsapp?: string | null
  website?: string | null
  languages?: string[] | any
  experienceYears?: number | null
  licensedSince?: number | null
  licenseNumber?: string | null
  certifications?: string[] | any
  guidingAreas?: string[] | any
  galleryPhotos?: string[] | any
  isVerified: boolean
  profileStatus: string
  avgRating: number
  totalReviews: number
  reviews?: GuideReview[]
}

const COMMON_LANGUAGES = [
  "Nepali", "English", "Hindi", "French", "German", "Spanish", "Italian", "Chinese", "Japanese", "Russian"
]

const COMMON_CERTIFICATIONS = [
  "Govt. Licensed Trekking Guide (KEEP/NATHM)",
  "High-Altitude First Aid Training (Nepal Red Cross)",
  "Wilderness First Responder (WFR)",
  "Mountaineering Basic & Advanced (NMA)",
  "Leave No Trace (LNT) Master Educator",
  "Cultural Heritage & Shamanic Storytelling"
]

function GuideDashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isJustJoined = searchParams.get("welcome") === "true"

  const [guide, setGuide] = useState<GuideData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "PROFILE" | "EXPERIENCES" | "INQUIRIES" | "REVIEWS" | "BILLING">("DASHBOARD")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  // Profile Form State
  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [website, setWebsite] = useState("")
  const [specialties, setSpecialties] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState<number>(5)
  const [licensedSince, setLicensedSince] = useState<number>(2018)
  const [licenseNumber, setLicenseNumber] = useState("")
  const [certifications, setCertifications] = useState<string[]>([])
  const [guidingAreas, setGuidingAreas] = useState<string[]>([])
  const [photoUrl, setPhotoUrl] = useState("")
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([])
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const [saving, setSaving] = useState(false)
  const [successToast, setSuccessToast] = useState("")
  const [errorToast, setErrorToast] = useState("")
  const [uploading, setUploading] = useState(false)

  // Email verification resend state
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/local-guides/dashboard")
    } else if (session?.user?.email) {
      loadProfile(session.user.email)
    }
  }, [session, status, router])

  async function loadProfile(email: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/guides?city=All")
      if (res.ok) {
        const all = await res.json()
        const matched = Array.isArray(all)
          ? all.find((g: any) => g.contactEmail?.toLowerCase() === email.toLowerCase())
          : null

        if (matched) {
          const detailRes = await fetch(`/api/guides/${matched.id}`)
          const full = detailRes.ok ? await detailRes.json() : matched
          setGuide(full)

          // Populate edit fields
          setName(full.name || "")
          setTagline(full.tagline || "")
          setBio(full.bio || "")
          setLocation(full.location || "")
          setPhone(full.phone || "")
          setWhatsapp(full.whatsapp || "")
          setWebsite(full.website || "")
          setSpecialties(Array.isArray(full.specialties) ? full.specialties : [])
          setLanguages(Array.isArray(full.languages) ? full.languages : ["Nepali", "English"])
          setExperienceYears(full.experienceYears || 5)
          setLicensedSince(full.licensedSince || 2018)
          setLicenseNumber(full.licenseNumber || "")
          setCertifications(Array.isArray(full.certifications) ? full.certifications : [])
          setGuidingAreas(Array.isArray(full.guidingAreas) ? full.guidingAreas : [])
          setPhotoUrl(full.photoUrl || "")

          let parsedGallery: string[] = []
          if (Array.isArray(full.galleryPhotos)) {
            parsedGallery = full.galleryPhotos
          } else if (typeof full.galleryPhotos === "string") {
            try {
              parsedGallery = JSON.parse(full.galleryPhotos)
            } catch {
              parsedGallery = []
            }
          }
          setGalleryPhotos(parsedGallery)
        }
      }
    } catch (err) {
      console.error("Load guide profile error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Handle Photo Upload
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setErrorToast("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/guides/upload", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setPhotoUrl(data.url)
        setSuccessToast("Photo uploaded successfully! Remember to save profile.")
      } else {
        setErrorToast("Upload failed. Please upload a JPG or PNG under 5MB.")
      }
    } catch {
      setErrorToast("Network error uploading photo.")
    } finally {
      setUploading(false)
    }
  }

  // Handle Multi-Photo Gallery Upload
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingGallery(true)
    setErrorToast("")

    try {
      const uploadedUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append("file", files[i])
        const res = await fetch("/api/guides/upload", {
          method: "POST",
          body: formData,
        })
        if (res.ok) {
          const data = await res.json()
          if (data.url) uploadedUrls.push(data.url)
        }
      }
      if (uploadedUrls.length > 0) {
        setGalleryPhotos((prev) => [...prev, ...uploadedUrls])
        setSuccessToast(`Added ${uploadedUrls.length} photo(s) to your gallery! Remember to save profile.`)
        setTimeout(() => setSuccessToast(""), 4000)
      } else {
        setErrorToast("Upload failed for selected files. Ensure JPG or PNG under 5MB.")
      }
    } catch {
      setErrorToast("Network error uploading gallery photos.")
    } finally {
      setUploadingGallery(false)
      // reset file input
      e.target.value = ""
    }
  }

  function removeGalleryPhoto(indexToRemove: number) {
    setGalleryPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Save Profile Handler
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!guide) return

    setSaving(true)
    setErrorToast("")
    setSuccessToast("")

    try {
      const res = await fetch(`/api/guides/${guide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          bio,
          location,
          phone,
          whatsapp,
          website,
          specialties,
          languages,
          experienceYears,
          licensedSince,
          licenseNumber,
          certifications,
          guidingAreas,
          photoUrl,
          galleryPhotos,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setGuide(data.guide)
        setSuccessToast("Profile saved & updated live!")
        setTimeout(() => setSuccessToast(""), 4000)
      } else {
        setErrorToast("Failed to save changes. Please try again.")
      }
    } catch (err: any) {
      setErrorToast("Network error saving profile.")
    } finally {
      setSaving(false)
    }
  }

  // Resend Email Verification
  async function handleResendVerification() {
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
      setResendStatus("Failed to send verification email.")
    } finally {
      setResendingEmail(false)
    }
  }

  // Calculate Profile Completion %
  const completionItems = [
    { label: "Account created & registered", done: true, points: 20 },
    { label: "Base location & contact set", done: Boolean(location && (phone || whatsapp)), points: 20 },
    { label: "Profile portrait photo uploaded", done: Boolean(photoUrl), points: 20 },
    { label: "Detailed bio & trekking philosophy", done: Boolean(bio && bio.length > 60), points: 20 },
    { label: "Spoken languages & certifications", done: Boolean(languages.length > 0 && certifications.length > 0), points: 20 },
  ]
  const completionPercentage = completionItems.reduce((acc, curr) => curr.done ? acc + curr.points : acc, 0)
  const isEmailVerified = Boolean((session?.user as any)?.emailVerified)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 animate-spin text-[#023629] mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading your Guide Console...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          TOP HEADER: Clean White Bar with Live Site Switcher
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between shadow-xs">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#023629] flex items-center justify-center text-white font-black text-sm shadow-xs">
              <Mountain size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">
                Digital Nomads <span className="text-[#CD6003]">in Nepal</span>
              </span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                Local Expert Console
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Switch to Live Site Pill + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Switch to Live Public Listing */}
          {guide && (
            <Link
              href={`/local-guides/${guide.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-all shadow-xs"
              title="Preview your public profile live on the website"
            >
              <Eye size={13} />
              <span className="hidden sm:inline">Preview Live Profile</span>
              <ExternalLink size={11} className="opacity-70" />
            </Link>
          )}

          <Link
            href="/local-guides"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          >
            <span>Guide Directory</span>
          </Link>

          {/* User avatar indicator */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#023629] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {guide?.name?.charAt(0).toUpperCase() || "G"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                {guide?.name || "Local Guide"}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Online</span>
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          EMAIL VERIFICATION ALERT BANNER
         ───────────────────────────────────────────────────────────── */}
      {!isEmailVerified && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
            <p className="font-medium">
              Please verify your email address (<strong>{session?.user?.email}</strong>) to activate full directory visibility.
            </p>
            <button
              onClick={handleResendVerification}
              disabled={resendingEmail}
              className="ml-auto underline font-bold hover:text-amber-950 flex-shrink-0 disabled:opacity-50"
            >
              {resendingEmail ? "Sending link..." : resendStatus || "Resend Email Link"}
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN BODY: Sidebar Navigation + Bright White Workspace
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        
        {/* ─── LEFT SIDEBAR (GuideMeet Clean Style) ─── */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r lg:border border-slate-200/80 lg:rounded-2xl shadow-xl lg:shadow-xs p-4 flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="space-y-1 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-3 py-1">
              Main Menu
            </p>
            {[
              { id: "DASHBOARD", label: "Dashboard", icon: LayoutDashboard },
              { id: "PROFILE", label: "My Profile & Bio", icon: UserCircle },
              { id: "EXPERIENCES", label: "Treks & Tours", icon: Compass },
              { id: "INQUIRIES", label: "Nomad Inquiries", icon: MessageSquare, badge: "New" },
              { id: "REVIEWS", label: `Reviews (${guide?.totalReviews || 0})`, icon: Star },
              { id: "BILLING", label: "Plan & Billing", icon: CreditCard },
            ].map((item) => {
              const Icon = item.icon
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !active && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Quick Guide Card in Sidebar */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  {guide?.isVerified ? "Verified Expert" : "Application Pending"}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {guide?.isVerified 
                  ? "Your profile is verified and active on Digital Nomads in Nepal."
                  : "Complete 100% of your profile to qualify for fast-track verification."}
              </p>
            </div>
          </div>
        </aside>

        {/* ─── MAIN RIGHT CONTENT CANVAS (BRIGHT WHITE) ─── */}
        <main className="flex-1 min-w-0">
          
          {/* Success / Error Toasts */}
          {successToast && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              <span>{successToast}</span>
            </div>
          )}
          {errorToast && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <span>{errorToast}</span>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 1: DASHBOARD HOME (GuideMeet style welcome & checklist)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "DASHBOARD" && (
            <div className="space-y-6">
              
              {/* Top Video Learning Tutorials (GuideMeet Screenshot Benchmark) */}
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Learn about GuideMeet & Local Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Video 1 */}
                  <div className="group relative bg-slate-900 rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 shadow-xs border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
                      alt="Find a Trusted Local Guide"
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 flex flex-col justify-between p-5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                          <Play size={14} className="fill-white translate-x-0.5" />
                        </span>
                        <span className="text-[11px] font-bold text-white/90">Tutorial 01</span>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                          Find a Trusted Local Guide for Your Next Trip | GuideMeet
                        </h3>
                        <p className="text-[11px] text-white/70 mt-1 line-clamp-1">
                          How remote workers connect and hire certified Himalayan guides directly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Video 2 */}
                  <div className="group relative bg-blue-900 rounded-2xl overflow-hidden aspect-16/9 sm:aspect-21/9 shadow-xs border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80"
                      alt="Guide Profile Completion Video"
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-950/30 to-blue-950/30 flex flex-col justify-between p-5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md">
                          <Play size={14} className="fill-white translate-x-0.5" />
                        </span>
                        <span className="text-[11px] font-bold text-white/90">Guide Walkthrough</span>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                          Guide Profile Completion Video
                        </h3>
                        <p className="text-[11px] text-white/70 mt-1 line-clamp-1">
                          Step-by-step tutorial to craft a 100% verified profile with 5-photo mosaic.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Hero Banner (GuideMeet Style with Initial Avatar) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden flex-shrink-0 relative shadow-2xs flex items-center justify-center">
                    {photoUrl ? (
                      <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-xl text-blue-700">
                        {name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "DA"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Hi {name ? name.split(" ")[0] : "Guide"}, welcome to GuideMeet Console 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Add your details, experience, languages, and photos to get verified and go live.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("PROFILE")}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs flex-shrink-0"
                >
                  <span>Complete Your Profile</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Onboarding Progress Checklist (GuideMeet style) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Profile Completion Progress</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Complete all steps to unlock the Verified Badge & top ranking.</p>
                  </div>
                  <span className="text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {completionPercentage}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                {/* Checklist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {completionItems.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium border transition-colors ${
                        item.done 
                          ? "bg-emerald-50/60 border-emerald-200/70 text-emerald-900" 
                          : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.done ? "bg-emerald-600 text-white" : "border-2 border-slate-300 text-transparent"
                      }`}>
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {!item.done && (
                        <button
                          onClick={() => setActiveTab("PROFILE")}
                          className="text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          Add +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Cards (Clean white tiles) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Profile Views", val: "1,240+", icon: Eye, change: "+18% this month" },
                  { label: "Direct Inquiries", val: "14", icon: MessageSquare, change: "Direct WhatsApp/Email" },
                  { label: "Client Rating", val: guide?.avgRating ? `${guide.avgRating.toFixed(1)} ★` : "5.0 ★", icon: Star, change: `${guide?.totalReviews || 0} Reviews` },
                  { label: "Verification Status", val: guide?.isVerified ? "Verified" : "Under Review", icon: ShieldCheck, change: "Nepal Tourism License" },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                          <Icon size={14} />
                        </div>
                      </div>
                      <p className="text-xl font-black text-slate-900">{stat.val}</p>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">{stat.change}</p>
                    </div>
                  )
                })}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 2: MY PROFILE & CREDENTIALS (Bishnu KC Style Editor)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "PROFILE" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
              
              <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Guide Profile & Credentials</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This information appears on your live public page at{" "}
                    <Link href={`/local-guides/${guide?.id}`} target="_blank" className="text-blue-600 font-bold underline">
                      /local-guides/{guide?.id}
                    </Link>
                  </p>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 bg-[#023629] hover:bg-[#023629]/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* 1. Photo & Identity Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="relative w-20 h-20 rounded-full bg-white border-2 border-slate-200 overflow-hidden flex-shrink-0 shadow-xs">
                    {photoUrl ? (
                      <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-400">
                        {name?.charAt(0) || "G"}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-xs font-bold text-slate-800">Profile Portrait Photo</p>
                    <p className="text-[11px] text-slate-500">
                      Upload a clean, high-resolution portrait in outdoor trekking gear or cultural attire. (Max 5MB)
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                      <Upload size={13} />
                      <span>{uploading ? "Uploading..." : "Upload New Photo"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* 1.5. Trek & Tour Photo Gallery (Bishnu KC 5-Photo Mosaic) */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Camera size={16} className="text-[#023629]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          Trek & Tour Photo Gallery (Bishnu KC Mosaic Showcase)
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        The first 4–5 photos form your prominent signature mosaic on your public profile. Extra photos open in your full-screen lightbox!
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#023629] hover:bg-[#023629]/90 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs self-start sm:self-auto flex-shrink-0">
                      {uploadingGallery ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Plus size={13} />
                          <span>Add Trek Photos</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                        disabled={uploadingGallery}
                      />
                    </label>
                  </div>

                  {galleryPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {galleryPhotos.map((url, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs"
                        >
                          <img
                            src={url}
                            alt={`Trek photo ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-1.5 left-1.5">
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md backdrop-blur-md shadow-xs ${
                              idx === 0 
                                ? "bg-amber-500 text-slate-950 font-black" 
                                : idx < 5 
                                ? "bg-black/70 text-white" 
                                : "bg-slate-800/60 text-slate-200"
                            }`}>
                              {idx === 0 ? "Cover (Hero)" : idx < 5 ? `Mosaic #${idx + 1}` : `#${idx + 1}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryPhoto(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-xs"
                            title="Remove photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-300 bg-white/50 space-y-2">
                      <ImageIcon size={28} className="mx-auto text-slate-400" />
                      <p className="text-xs font-semibold text-slate-700">No custom trek photos uploaded yet</p>
                      <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                        Your public profile will use default Nepal Himalayan photography until you upload your own trail, mountain, and client trekking moments.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#023629] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Professional Headline / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Licensed Trekking Guide & Shaman"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#023629] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Location, WhatsApp & Contact Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Base Location / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Panauti, Kavre / Pokhara"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#023629] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Direct WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+977 98..."
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#023629] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Public Website / Portfolio
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#023629] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Experience Years & Guiding License # */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Guiding Since (Year)
                    </label>
                    <input
                      type="number"
                      min="1990"
                      max="2026"
                      value={licensedSince}
                      onChange={(e) => setLicensedSince(parseInt(e.target.value) || 2020)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Govt. License Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NATHM-TG-4819"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm"
                    />
                  </div>
                </div>

                {/* 5. Spoken Languages (Multi-select pills) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Spoken Languages (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_LANGUAGES.map((lang) => {
                      const selected = languages.includes(lang)
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguages(selected ? languages.filter((l) => l !== lang) : [...languages, lang])
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            selected
                              ? "bg-[#023629] text-white border-[#023629]"
                              : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}{lang}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 6. Certifications & Badges */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Certifications & Safety Training
                  </label>
                  <div className="space-y-2">
                    {COMMON_CERTIFICATIONS.map((cert) => {
                      const selected = certifications.includes(cert)
                      return (
                        <label 
                          key={cert}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                            selected ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {
                              setCertifications(selected ? certifications.filter((c) => c !== cert) : [...certifications, cert])
                            }}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{cert}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* 7. Detailed Bio / Guiding Philosophy (Bishnu KC style) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    About Me & Guiding Philosophy *
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Explain your routes, safety ethos, storytelling, and what travelers experience when trekking with you.
                  </p>
                  <textarea
                    rows={6}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your background, trekking routes you specialize in, altitude safety approach, and local heritage..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#023629] focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-[#023629] hover:bg-[#023629]/90 text-white font-bold text-sm px-7 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>{saving ? "Saving Changes..." : "Save Guide Profile"}</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 3: EXPERIENCES & TOURS
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "EXPERIENCES" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Treks & Experience Packages</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Offer curated multi-day treks or cultural day trips directly to nomads.</p>
                </div>
                <button
                  onClick={() => alert("Experience creation modal is coming in next release!")}
                  className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Sample / Live Experience cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Signature Trek
                    </span>
                    <span className="text-xs font-bold text-slate-600">3–5 Days</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {location} Hidden Valley & Cultural Ridge Trek
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Panoramic Himalayan sunrise vistas, local homestay dining, and traditional storytelling through ancient village trails.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs font-bold text-slate-800">
                    <span>Est. NPR 4,500 / day</span>
                    <span className="text-emerald-600 font-semibold text-[11px]">✓ Active on Profile</span>
                  </div>
                </div>

                <div className="border border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2">
                  <Compass size={28} className="text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">Add another tour or day hike</p>
                  <p className="text-[11px] text-slate-500 max-w-xs">List cultural day trips, photography walks, or high-altitude summits.</p>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 4: INQUIRIES & MESSAGES
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "INQUIRIES" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-black text-slate-900">Direct Nomad Inquiries</h2>
                <p className="text-xs text-slate-500 mt-0.5">Connect with travelers reaching out from your public profile.</p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      DN
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">David Miller (Remote Engineer)</p>
                      <p className="text-[10px] text-slate-500">From Germany • Planning visit for next month</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Yesterday</span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">
                  &ldquo;Hi! I am working remotely from Pokhara for 3 weeks and looking for a 4-day trek with reliable Wi-Fi viewpoints. Are you available next week?&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://wa.me/9779865575108"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <span>Reply on WhatsApp</span>
                  </a>
                  <a
                    href="mailto:contact@digitalnomadsinnepal.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Email Traveler</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 5: REVIEWS
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "REVIEWS" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-black text-slate-900">Verified Client Reviews</h2>
                <p className="text-xs text-slate-500 mt-0.5">Reviews left by verified digital nomads and travelers on your profile.</p>
              </div>

              {guide?.reviews && guide.reviews.length > 0 ? (
                <div className="space-y-4">
                  {guide.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{rev.user?.name || "Verified Nomad"}</span>
                        <span className="text-amber-500 font-bold text-xs">{"★".repeat(rev.rating)}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Star size={32} className="mx-auto text-amber-400 opacity-60" />
                  <p className="text-xs font-bold text-slate-700">No reviews yet</p>
                  <p className="text-[11px] text-slate-500">Your reviews will appear here once travelers complete tours with you.</p>
                </div>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 6: PLAN & BILLING (GuideMeet comparison tiers)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "BILLING" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
              
              {/* Header with Monthly / Yearly toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Plan & Billing</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose the visibility tier that fits your mountain guiding career.
                  </p>
                </div>

                {/* Monthly / Yearly Toggle */}
                <div className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200/80 self-start sm:self-auto">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      billingCycle === "monthly"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      billingCycle === "yearly"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Yearly <span className="text-[10px] text-emerald-400 font-extrabold ml-1">Save 20%</span>
                  </button>
                </div>
              </div>

              {/* 4 Tiers Grid (GuideMeet Screenshot Exact Match) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* 1. Free */}
                <div className="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between bg-white shadow-2xs hover:shadow-xs transition-shadow relative">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider mb-3">
                      Current Plan
                    </span>
                    <h3 className="text-lg font-black text-slate-900">Free</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                      Best for testing the platform and creating a basic public presence.
                    </p>

                    <div className="my-5">
                      <span className="text-3xl font-black text-slate-900">$0</span>
                      <span className="text-xs text-slate-500 font-medium"> /month</span>
                    </div>

                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold cursor-default"
                    >
                      Selected Plan
                    </button>

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Public guide profile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Profile approval</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>1 guide category</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>1 destination</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Basic messaging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>3 new inquiry threads / month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Professional (RECOMMENDED) */}
                <div className="rounded-2xl border-2 border-blue-600 p-6 flex flex-col justify-between bg-white shadow-md relative">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider mb-3">
                      Recommended
                    </span>
                    <h3 className="text-lg font-black text-slate-900">Professional</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                      Best for serious solo guides who want a stronger presence and better trust.
                    </p>

                    <div className="my-5">
                      <span className="text-3xl font-black text-slate-900">
                        ${billingCycle === "yearly" ? "20" : "25"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium"> /month</span>
                    </div>

                    <button
                      onClick={() => alert("Professional plan selection will be activated during guide payments launch!")}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Choose Professional
                    </button>

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Up to 3 guide categories</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Up to 5 destinations</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>20 profile photos + intro video</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Verified badge eligibility</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Up to 3 experience packages</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>GuideMeet messaging & inquiries</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>4 Guide Insights per month</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Basic analytics</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Growth */}
                <div className="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between bg-white shadow-2xs hover:shadow-xs transition-shadow">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider mb-3">
                      Scale
                    </span>
                    <h3 className="text-lg font-black text-slate-900">Growth</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                      Best for growth-focused guides who want more visibility, content, and service options.
                    </p>

                    <div className="my-5">
                      <span className="text-3xl font-black text-slate-900">
                        ${billingCycle === "yearly" ? "79" : "99"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium"> /month</span>
                    </div>

                    <button
                      onClick={() => alert("Growth plan selection will be activated during guide payments launch!")}
                      className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold transition-all"
                    >
                      Choose Growth
                    </button>

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Up to 10 guide categories</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Up to 15 destinations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>50 profile photos + intro video</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>10 Guide Insights / month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Up to 10 experiences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Consultation & booking listing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Advanced analytics & priority</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Elite */}
                <div className="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between bg-white shadow-2xs hover:shadow-xs transition-shadow">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider mb-3">
                      Agency / Top Guide
                    </span>
                    <h3 className="text-lg font-black text-slate-900">Elite</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                      Best for senior or top guides who want the strongest visibility and added website support.
                    </p>

                    <div className="my-5">
                      <span className="text-3xl font-black text-slate-900">
                        ${billingCycle === "yearly" ? "119" : "149"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium"> /month</span>
                    </div>

                    <button
                      onClick={() => alert("Elite plan selection will be activated during guide payments launch!")}
                      className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold transition-all"
                    >
                      Choose Elite
                    </button>

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Everything in Growth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Highest visibility placement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Up to 15 experiences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>20 Guide Insights / month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Personal website design</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Website SEO setup</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Highest priority support</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  )
}

export default function GuideDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#023629]" />
      </div>
    }>
      <GuideDashboardContent />
    </Suspense>
  )
}
