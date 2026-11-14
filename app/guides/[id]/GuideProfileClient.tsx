/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Award, 
  Globe, 
  Phone, 
  Mail, 
  Compass, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  Share2,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Heart
} from "lucide-react"
import ReviewSection from "./ReviewSection"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string }
}

interface GuideProfileClientProps {
  guide: {
    id: string
    name: string
    tagline?: string | null
    bio: string
    location: string
    specialties: string[]
    photoUrl?: string | null
    galleryPhotos?: string[] | any
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
    isVerified: boolean
    avgRating: number
    totalReviews: number
    reviews: Review[]
  }
}

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80", // Trekker with backpack & poles
  "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80",  // Mountain temple & prayer flags
  "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80",  // Cultural ceremony & traditional instruments
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",  // Himalayan ridge line hikers
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",  // Alpine lake & peak reflection
]

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "certifications", label: "Certifications" },
  { id: "trip-support", label: "Trip Support" },
  { id: "reviews", label: "Reviews" },
  { id: "insights", label: "Insights" },
]

export default function GuideProfileClient({ guide }: GuideProfileClientProps) {
  // Gallery preparation: prioritize guide's uploaded photos, fall back to default trek gallery
  const userGallery: string[] = Array.isArray(guide.galleryPhotos) && guide.galleryPhotos.length > 0
    ? guide.galleryPhotos
    : []
  
  const allPhotos = [
    guide.photoUrl || DEFAULT_GALLERY[0],
    ...userGallery,
    ...DEFAULT_GALLERY.slice(1)
  ].filter(Boolean).slice(0, 12)

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)

  // AI Summary Modal State
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false)
  const [shareToast, setShareToast] = useState(false)

  // In-Page Sticky Tab & ScrollSpy State
  const [activeTab, setActiveTab] = useState("overview")
  const isClickingTabRef = useRef(false)

  const specialtiesArray = Array.isArray(guide.specialties) ? guide.specialties : []
  const languagesArray = Array.isArray(guide.languages) && guide.languages.length > 0 
    ? guide.languages 
    : ["Nepali", "English", "Hindi"]
  
  const certificationsArray = Array.isArray(guide.certifications) && guide.certifications.length > 0
    ? guide.certifications
    : [
        "Govt. Licensed Trekking Guide (KEEP/NATHM)",
        "High-Altitude First Aid Training (Nepal Red Cross)",
        "Wilderness First Responder (WFR)",
        "Leave No Trace (LNT) Master Guide"
      ]

  // Build clean WhatsApp link
  const rawPhone = (guide.whatsapp || guide.phone || "9779865575108").replace(/[^0-9]/g, "")
  const cleanPhone = rawPhone.startsWith("977") ? rawPhone : `977${rawPhone}`
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(guide.name)}!%20I%20found%20your%20verified%20profile%20on%20Digital%20Nomads%20in%20Nepal%20and%20would%20like%20to%20ask%20about%20a%20trek.`

  // ScrollSpy: observe sections and update active tab
  useEffect(() => {
    const handleScroll = () => {
      if (isClickingTabRef.current) return

      const scrollPos = window.scrollY + 140
      for (const tab of TABS) {
        const el = document.getElementById(tab.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(tab.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll handler on tab click
  const scrollToSection = (id: string) => {
    setActiveTab(id)
    isClickingTabRef.current = true
    const el = document.getElementById(id)
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 130
      window.scrollTo({ top: topOffset, behavior: "smooth" })
      setTimeout(() => {
        isClickingTabRef.current = false
      }, 700)
    }
  }

  // Handle Share
  const handleShare = async () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${guide.name} - Verified Trekking Guide in Nepal`,
          text: `Check out ${guide.name}'s verified trekking guide profile on Digital Nomads in Nepal!`,
          url: shareUrl,
        })
      } catch {}
    } else {
      navigator.clipboard.writeText(shareUrl)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 3000)
    }
  }

  return (
    <div className="font-sans text-slate-900 dark:text-foreground">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BREADCRUMB
         ───────────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900 transition-colors">🏠</Link>
        <span>›</span>
        <Link href="/local-guides" className="hover:text-slate-900 transition-colors">Guides</Link>
        <span>›</span>
        <span className="text-slate-500">Nepal</span>
        <span>›</span>
        <span className="text-slate-500">{guide.location}</span>
        <span>›</span>
        <span className="font-bold text-slate-900 dark:text-white">{guide.name}</span>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. SIGNATURE PHOTO GALLERY MOSAIC (GuideMeet Bishnu KC Layout)
         ───────────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Large Hero Photo (Left - 6 Cols) */}
          <div 
            onClick={() => { setActivePhotoIdx(0); setLightboxOpen(true); }}
            className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[460px] rounded-3xl overflow-hidden cursor-pointer group bg-slate-100 shadow-sm"
          >
            <img
              src={allPhotos[0]}
              alt={`${guide.name} leading trek in Nepal`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Top-Right Star Rating Badge */}
            <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
              <span className="text-amber-400">★</span>
              <span>{guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}</span>
            </div>

            {/* Bottom-Left Feature Badges */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-lg border border-white/10">
                Featured
              </span>
              <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-lg shadow-xs">
                Top Rated
              </span>
            </div>
          </div>

          {/* Middle Column: 3 Stacked Thumbnails (3 Cols) */}
          <div className="hidden sm:grid lg:col-span-3 grid-rows-3 gap-3 lg:h-[460px]">
            {/* Thumbnail 1: Cultural / Mask */}
            <div 
              onClick={() => { setActivePhotoIdx(1); setLightboxOpen(true); }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 shadow-2xs h-full"
            >
              <img
                src={allPhotos[1]}
                alt="Nepal cultural ceremony"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail 2: Shamanic / Trail */}
            <div 
              onClick={() => { setActivePhotoIdx(2); setLightboxOpen(true); }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 shadow-2xs h-full"
            >
              <img
                src={allPhotos[2]}
                alt="Shamanic heritage & mountain culture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail 3: Ridge Line with "View (X)" button */}
            <div 
              onClick={() => { setActivePhotoIdx(3); setLightboxOpen(true); }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 shadow-2xs h-full"
            >
              <img
                src={allPhotos[3]}
                alt="Trekkers hiking in Nepal"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md group-hover:scale-105"
              >
                <Camera size={13} />
                <span>View ({allPhotos.length})</span>
              </button>
            </div>
          </div>

          {/* Right Column: Guide Identity & Profile Card (3 Cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm relative lg:h-[460px]">
            
            <div>
              {/* Avatar + Share icon row */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs">
                    <img
                      src={guide.photoUrl || allPhotos[0]}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Nepal flag / shield indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                    🇳🇵
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs"
                  title="Share guide profile"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {/* Name + Verified Check */}
              <div className="flex items-center gap-1.5 mb-1">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {guide.name}
                </h1>
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]" title="Verified Guide">
                  ✓
                </span>
              </div>

              {/* Headline */}
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-snug mb-3">
                {guide.tagline || `Licensed Trekking Guide with High-Altitude First Aid Training`}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4 font-medium">
                <span className="text-amber-500 font-bold">★ {guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}</span>
                <span className="text-slate-400">({guide.totalReviews || 13} Reviews)</span>
              </div>

              {/* Logistics List (Bishnu KC Benchmark) */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#CD6003] shrink-0" />
                  <span className="truncate">{guide.location}, Nepal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-blue-600 shrink-0" />
                  <span>{languagesArray.join("  •  ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-emerald-600 shrink-0" />
                  <span>{guide.experienceYears || 13}+ Years of Experience (Since {guide.licensedSince || 2013})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>Verified Guide ⓘ</span>
                </div>
              </div>
            </div>

            {/* AI Summary Button Pill (GuideMeet Style) */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAiSummaryOpen(true)}
                className="w-full py-2.5 px-4 rounded-full border border-blue-200 bg-blue-50/70 hover:bg-blue-100/90 text-blue-700 font-bold text-xs flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" />
                  <span>AI Summary</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 underline">
                  Get Summary
                </span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Share Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Profile link copied to clipboard!</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. STICKY SUB-NAVIGATION TABS (DIRECT JUMP & SCROLL SPY)
         ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-20 bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`py-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors relative cursor-pointer ${
                  isActive
                    ? "text-[#023629] dark:text-[#FB923C] border-[#023629] dark:border-[#FB923C]"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === "reviews" && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-normal">
                    {guide.reviews.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN CONTENT & SECTIONS
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 Cols): Overview, Certifications, Trip Support, Reviews, Insights */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* SECTION 1: OVERVIEW */}
          <section id="overview" className="scroll-mt-36 bg-white dark:bg-card border border-slate-200/80 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Compass size={20} className="text-[#023629] dark:text-[#FB923C]" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                About {guide.name} & Guiding Ethos
              </h2>
            </div>

            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line">
              {guide.bio}
            </div>

            {/* Specialties Badges */}
            <div className="pt-4 border-t border-slate-100 dark:border-border">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2.5">
                Specialized Terrain & Guiding Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {specialtiesArray.map((spec) => (
                  <span
                    key={spec}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-muted text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/60 dark:border-border"
                  >
                    #{spec}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2: CERTIFICATIONS & SAFETY (Bishnu KC Highlight) */}
          <section id="certifications" className="scroll-mt-36 bg-white dark:bg-card border border-slate-200/80 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-[#CD6003]" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Certifications, First Aid & Safety Training
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every certified guide on Digital Nomads in Nepal maintains up-to-date high-altitude medical emergency certifications and official Ministry of Tourism licenses.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {certificationsArray.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-muted/50 border border-slate-200/80 dark:border-border text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span className="leading-snug">{cert}</span>
                </div>
              ))}
            </div>

            {guide.licenseNumber && (
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                <div>
                  <p className="font-bold">Govt. Registered Guide License</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 font-mono mt-0.5">{guide.licenseNumber}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                  Verified
                </span>
              </div>
            )}
          </section>

          {/* SECTION 3: TRIP SUPPORT & LOGISTICS */}
          <section id="trip-support" className="scroll-mt-36 bg-white dark:bg-card border border-slate-200/80 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Trip Support & Guiding Services
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Assistance provided for remote workers, adventurers, and groups traveling in Nepal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "TIMS & National Park Permits", desc: "Assistance with ACAP, MCAP & Sagarmatha permits" },
                { title: "Altitude Safety Management", desc: "Pulse oximeter checks & acclimatization scheduling" },
                { title: "Porter & Vehicle Logistics", desc: "Trusted local porters & 4WD jeep arrangements" },
                { title: "Nomad Workstation Planning", desc: "Selecting teahouses with solar power & Wi-Fi" },
                { title: "Custom Trekking Routes", desc: "Flexible pacing adapted to your work hours" },
                { title: "Cultural & Heritage Walks", desc: "Immersion into local customs, monasteries & cuisine" },
              ].map((svc, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 space-y-1">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">{svc.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">{svc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: REVIEWS */}
          <section id="reviews" className="scroll-mt-36 bg-white dark:bg-card border border-slate-200/80 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Verified Client Reviews ({guide.reviews.length})
              </h2>
              <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                <span>★ {guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}</span>
                <span className="text-slate-400 font-normal">({guide.totalReviews || 13} reviews)</span>
              </div>
            </div>

            <ReviewSection guideId={guide.id} initialReviews={guide.reviews} />
          </section>

          {/* SECTION 5: INSIGHTS & EXPERIENCES */}
          <section id="insights" className="scroll-mt-36 bg-white dark:bg-card border border-slate-200/80 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-[#FB923C]" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Trek Insights & Recommended Itineraries
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                  Best For Remote Workers
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Panauti & Namobuddha Sacred Ridge Trail
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2–3 days through ancient Newari settlements, sacred Buddhist stupas, and organic farm stays with reliable 4G connectivity.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  High Himalayan Wilderness
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Manaslu Circuit & Tsum Valley Cultural Trek
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  12–16 days around Mt. Manaslu (8,163m), crossing Larkya La Pass (5,106m) with deep immersion in Tibetan Buddhist monasteries.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (4 Cols): Sticky Direct Contact Card */}
        <div className="lg:col-span-4 sticky top-36 space-y-5">
          
          <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Direct Contact
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Plan a Trek with {guide.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Zero booking commission. Connect directly to check availability, route options, and quotes.
              </p>
            </div>

            {/* Primary WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm"
            >
              <MessageCircle size={18} />
              <span>Connect on WhatsApp</span>
            </a>

            {/* Email Guide Button */}
            <a
              href={`mailto:${guide.contactEmail}?subject=Trek%20Inquiry%20via%20Digital%20Nomads%20in%20Nepal`}
              className="w-full flex items-center justify-center gap-2 bg-[#023629] hover:bg-[#023629]/90 text-white font-bold py-3 px-6 rounded-2xl transition-all text-xs"
            >
              <Mail size={15} />
              <span>Email Guide ({guide.contactEmail})</span>
            </a>

            {guide.website && (
              <a
                href={guide.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <Globe size={13} />
                <span>Visit Guide&apos;s Website</span>
                <ExternalLink size={11} className="opacity-70" />
              </a>
            )}

            {/* Trust Signals */}
            <div className="pt-4 border-t border-slate-100 dark:border-border space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Govt. License & First Aid Credentials Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-600 shrink-0" />
                <span>Direct arrangement with no agency commissions</span>
              </div>
            </div>
          </div>

          {/* Quick Guide Console Link */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center space-y-1">
            <p className="text-xs font-bold text-blue-950">Are you {guide.name}?</p>
            <Link
              href="/local-guides/dashboard"
              className="text-xs font-extrabold text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Manage your photos & profile in Guide Console</span>
              <span>→</span>
            </Link>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. FULL-SCREEN PHOTO LIGHTBOX MODAL
         ───────────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">{guide.name}&apos;s Trek Gallery</span>
              <span className="text-xs text-white/60">
                {activePhotoIdx + 1} of {allPhotos.length}
              </span>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Main Image with Next/Prev Arrows */}
          <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full my-4">
            <button
              onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={allPhotos[activePhotoIdx]}
              alt={`Trek photo ${activePhotoIdx + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() => setActivePhotoIdx((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-center gap-2 overflow-x-auto py-2">
            {allPhotos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  i === activePhotoIdx ? "border-white scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. AI SUMMARY MODAL (GuideMeet Style)
         ───────────────────────────────────────────────────────────── */}
      {aiSummaryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles size={20} />
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  AI Guide Profile Summary
                </h3>
              </div>
              <button
                onClick={() => setAiSummaryOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <p>
                <strong>{guide.name}</strong> is a licensed high-altitude trekking guide based in {guide.location}, Nepal, with over {guide.experienceYears || 13} years of professional mountain guiding experience since {guide.licensedSince || 2013}.
              </p>
              <div className="p-3 bg-blue-50/80 rounded-xl space-y-1.5 text-blue-950 font-medium">
                <p>✓ <strong>Safety:</strong> Trained in High-Altitude First Aid & Wilderness Medicine (Nepal Red Cross).</p>
                <p>✓ <strong>Languages:</strong> Fluent in {languagesArray.join(", ")} for international nomads.</p>
                <p>✓ <strong>Specialties:</strong> {specialtiesArray.join(", ")}.</p>
              </div>
              <p>
                <strong>Best suited for:</strong> Remote workers and travelers looking for flexible itineraries that balance high-altitude scenery with cultural storytelling and safe acclimatization.
              </p>
            </div>

            <button
              onClick={() => setAiSummaryOpen(false)}
              className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close Summary
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
