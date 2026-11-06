"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Footer from "@/components/Footer"
import { 
  Mountain, 
  Compass, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Star, 
  Edit3, 
  Save, 
  Eye, 
  CheckCircle2, 
  MessageSquare, 
  Menu, 
  ExternalLink,
  Award,
  Calendar,
  Sparkles
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
  bio: string
  location: string
  specialties: string[] | any
  photoUrl?: string | null
  contactEmail: string
  website?: string | null
  isVerified: boolean
  avgRating: number
  totalReviews: number
  reviews?: GuideReview[]
}

export default function GuideDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [guide, setGuide] = useState<GuideData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"PROFILE" | "INQUIRIES" | "REVIEWS">("PROFILE")

  // Editing State
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [specialties, setSpecialties] = useState("")
  const [website, setWebsite] = useState("")
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/guides/dashboard")
    } else if (session?.user?.email) {
      fetchGuideProfile(session.user.email)
    }
  }, [session, status, router])

  const fetchGuideProfile = async (email: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/guides?city=All`)
      if (res.ok) {
        const allGuides = await res.json()
        const matched = Array.isArray(allGuides)
          ? allGuides.find((g: any) => g.contactEmail?.toLowerCase() === email.toLowerCase())
          : null

        if (matched) {
          // Fetch full profile with reviews
          const fullRes = await fetch(`/api/guides/${matched.id}`)
          if (fullRes.ok) {
            const fullGuide = await fullRes.json()
            setGuide(fullGuide)
            setBio(fullGuide.bio || "")
            setLocation(fullGuide.location || "")
            setSpecialties(Array.isArray(fullGuide.specialties) ? fullGuide.specialties.join(", ") : "")
            setWebsite(fullGuide.website || "")
          } else {
            setGuide(matched)
            setBio(matched.bio || "")
            setLocation(matched.location || "")
            setSpecialties(Array.isArray(matched.specialties) ? matched.specialties.join(", ") : "")
            setWebsite(matched.website || "")
          }
        } else {
          setGuide(null)
        }
      }
    } catch (err) {
      console.error("Failed to load guide profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!guide) return
    setSaving(true)
    try {
      const specArray = specialties.split(",").map(s => s.trim()).filter(Boolean)
      const res = await fetch(`/api/guides/${guide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          location,
          specialties: specArray,
          website: website || null
        })
      })

      if (res.ok) {
        const data = await res.json()
        setGuide(prev => prev ? {
          ...prev,
          bio,
          location,
          specialties: specArray,
          website
        } : null)
        setIsEditing(false)
        setSuccessMessage("Your guide credentials & bio were successfully updated!")
        setTimeout(() => setSuccessMessage(""), 4000)
      }
    } catch (err) {
      console.error("Save guide error:", err)
    } finally {
      setSaving(false)
    }
  }

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "G"

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (AIRBNB LOCAL EXPERT CONSOLE)
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0E0E10] border-b border-gray-200 dark:border-[#222225] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Identity */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Mountain size={18} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight tracking-tight text-gray-900 dark:text-white">
                  Nomads<span className="text-emerald-600">Nepal</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Local Expert Console
                </span>
              </div>
            </Link>

            {/* Center: Tabs */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
              {[
                { id: "PROFILE", label: "Profile & Credentials" },
                { id: "INQUIRIES", label: "Trek Inquiries" },
                { id: "REVIEWS", label: `Reviews (${guide?.totalReviews || 0})` }
              ].map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
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

            {/* Right: Switch to Listing / Guides + Profile Menu */}
            <div className="flex items-center gap-3">
              <Link
                href="/guides"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/80 hover:bg-blue-100/90 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 border border-blue-200/80 dark:border-blue-800/50 rounded-full transition-all shadow-xs group"
                title="Switch back to live guide directory"
              >
                <Compass size={13} className="text-blue-600 dark:text-blue-400 group-hover:rotate-45 transition-transform" />
                <span>Switch to listing</span>
              </Link>

              {/* Guide Avatar & Dropdown Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 border border-gray-300 dark:border-[#2D2D32] rounded-full hover:shadow-md transition-all duration-200 bg-white dark:bg-[#141416]"
                >
                  <Menu size={16} className="text-gray-600 dark:text-gray-400" />
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {userInitial}
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#161618] border border-gray-200 dark:border-[#26262A] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-[#222225]">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {guide?.name || session?.user?.name || "Local Guide"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{session?.user?.email}</p>
                    </div>

                    <Link
                      href="/guides"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold text-blue-600 dark:text-blue-400"
                    >
                      Switch to listing (Guide Directory)
                    </Link>

                    {guide && (
                      <Link
                        href={`/guides/${guide.id}`}
                        target="_blank"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#1F1F23] font-medium text-gray-700 dark:text-gray-200"
                      >
                        View Live Public Profile
                      </Link>
                    )}

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

          {/* Mobile Tab Bar */}
          <div className="flex md:hidden items-center justify-around border-t border-gray-100 dark:border-[#1F1F22] py-2">
            {[
              { id: "PROFILE", label: "Profile" },
              { id: "INQUIRIES", label: "Inquiries" },
              { id: "REVIEWS", label: "Reviews" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === tab.id
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
          2. MAIN CONTENT
         ───────────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 w-full flex-1 py-8">

        {/* Global Toast */}
        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-400">Loading guide console...</p>
          </div>
        ) : !guide ? (
          /* Empty State: Not yet registered as guide */
          <div className="p-8 sm:p-12 rounded-3xl bg-gray-50 dark:bg-[#141416] border border-dashed border-gray-300 dark:border-gray-700 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Mountain size={28} />
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              No Guide Profile Registered
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Connect with digital nomads looking for certified trekking guides, alpine leaders, and cultural city tours in Nepal.
            </p>
            <Link
              href="/guides/register"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              + Register as Local Guide
            </Link>
          </div>
        ) : (
          <>
            {/* ═════════════════════════════════════════════════════════
                TAB 1: PROFILE & CREDENTIALS
               ═════════════════════════════════════════════════════════ */}
            {activeTab === "PROFILE" && (
              <div className="space-y-6">
                
                {/* Hero Profile Card */}
                <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-[#222225]">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 dark:border-[#2A2A2E] shrink-0">
                        <img
                          src={guide.photoUrl || "/hero-bg.png"}
                          alt={guide.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {guide.name}
                          </h2>
                          {guide.isVerified && (
                            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <ShieldCheck size={12} /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                          <MapPin size={13} /> {guide.location || "Nepal"} · <Mail size={13} /> {guide.contactEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/guides/${guide.id}`}
                        target="_blank"
                        className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-[#2A2A2E] hover:bg-gray-50 dark:hover:bg-[#1C1C20] flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>View Live</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        {isEditing ? "Cancel" : "Edit Credentials"}
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form */}
                  {isEditing ? (
                    <div className="pt-6 space-y-4 text-xs">
                      <div>
                        <label className="block text-gray-500 font-semibold mb-1">Bio & Himalayan Guide Background</label>
                        <textarea
                          rows={4}
                          value={bio}
                          onChange={e => setBio(e.target.value)}
                          className="w-full p-3 bg-gray-50 dark:bg-[#1C1C1F] border border-gray-200 dark:border-[#333] rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Base Location</label>
                          <input
                            type="text"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 dark:bg-[#1C1C1F] border border-gray-200 dark:border-[#333] rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Specialties (comma-separated)</label>
                          <input
                            type="text"
                            value={specialties}
                            onChange={e => setSpecialties(e.target.value)}
                            placeholder="Annapurna, Mardi Himal, Photography, Culture"
                            className="w-full p-2.5 bg-gray-50 dark:bg-[#1C1C1F] border border-gray-200 dark:border-[#333] rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-500 font-semibold mb-1">Website or Portfolio URL</label>
                        <input
                          type="url"
                          value={website}
                          onChange={e => setWebsite(e.target.value)}
                          placeholder="https://..."
                          className="w-full p-2.5 bg-gray-50 dark:bg-[#1C1C1F] border border-gray-200 dark:border-[#333] rounded-xl"
                        />
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">About Guide</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{guide.bio}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Trek Specialties & Routes</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(guide.specialties) && guide.specialties.map((s, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#1C1C20] text-gray-800 dark:text-gray-200 text-xs font-medium">
                              🏔️ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Guide Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                    <p className="text-xs font-medium text-gray-500">Average Rating</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star size={18} className="fill-amber-400 text-amber-400" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                    <p className="text-xs font-medium text-gray-500">Nomad Reviews</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {guide.totalReviews || 0}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A]">
                    <p className="text-xs font-medium text-gray-500">Verification Status</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                      {guide.isVerified ? "✓ Verified Outdoor Leader" : "Pending Verification"}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                TAB 2: TREK INQUIRIES & MESSAGES
               ═════════════════════════════════════════════════════════ */}
            {activeTab === "INQUIRIES" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#222225]">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Nomad Trek Inquiries
                    </h3>
                    <p className="text-xs text-gray-500">
                      Requests received from digital nomads looking for guided alpine treks and cultural tours.
                    </p>
                  </div>
                </div>

                <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] text-center">
                  <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">All inquiries are current</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    When digital nomads message you via your public profile ({guide.contactEmail}), notifications and inquiries will show here.
                  </p>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                TAB 3: REVIEWS & TESTIMONIALS
               ═════════════════════════════════════════════════════════ */}
            {activeTab === "REVIEWS" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#222225]">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Client Reviews ({guide.reviews?.length || 0})
                    </h3>
                    <p className="text-xs text-gray-500">
                      Feedback and ratings from nomads who explored Nepal with you.
                    </p>
                  </div>
                </div>

                {!guide.reviews || guide.reviews.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] text-center">
                    <Star className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No reviews yet</p>
                    <p className="text-xs text-gray-500 mt-1">After completing a guided trek, nomads can rate your service directly on your profile.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-[#202024] bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl overflow-hidden shadow-xs">
                    {guide.reviews.map(rev => (
                      <div key={rev.id} className="p-4 sm:p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                              {rev.user?.name || "Verified Nomad"}
                            </span>
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      <Footer />
    </div>
  )
}
