"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { 
  Star, 
  MapPin, 
  Mail, 
  Edit3, 
  Save, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Compass, 
  RefreshCw,
  Award
} from "lucide-react"

interface GuideProfile {
  id: string
  name: string
  bio: string
  location: string
  specialties: string[] | any
  photoUrl?: string | null
  contactEmail: string
  isVerified: boolean
  avgRating: number
  totalReviews: number
}

interface Inquiry {
  id: string
  nomadName: string
  nomadEmail: string
  trekName: string
  dates: string
  groupSize: number
  notes: string
  status: "PENDING" | "CONFIRMED"
}

// Sample initial fallback profile & inquiries for instant preview
const DEMO_GUIDE: GuideProfile = {
  id: "guide_pasang_101",
  name: "Pasang Nuru Sherpa",
  bio: "Certified high-altitude Himalayan trekking & mountain biking expert with 12+ years experience leading Annapurna, Mustang, and Everest Remote expeditions.",
  location: "Pokhara / Mustang",
  specialties: ["Annapurna Circuit", "Mustang Expedition", "Motorbike Tours", "High Altitude Safety", "Photography"],
  photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
  contactEmail: "pasang.sherpa@nomadnepal.com",
  isVerified: true,
  avgRating: 4.9,
  totalReviews: 24
}

const DEMO_INQUIRIES: Inquiry[] = [
  {
    id: "inq_901",
    nomadName: "Marcus Vance",
    nomadEmail: "marcus@remotedev.co",
    trekName: "Upper Mustang Overland & Starlink Workcation",
    dates: "Oct 10 - Oct 20, 2026",
    groupSize: 3,
    notes: "Looking for guided jeep transport + Starlink Wi-Fi accommodation stops in Marpha & Lo Manthang.",
    status: "PENDING"
  },
  {
    id: "inq_902",
    nomadName: "Elena Rostova",
    nomadEmail: "elena.r@nomadwriter.org",
    trekName: "Annapurna Base Camp Nomad Trek",
    dates: "Nov 01 - Nov 12, 2026",
    groupSize: 2,
    notes: "Need porter-guide service with quiet tea-houses equipped with solar battery power.",
    status: "CONFIRMED"
  }
]

export default function GuideDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [guideEmail, setGuideEmail] = useState("")
  const [guide, setGuide] = useState<GuideProfile>(DEMO_GUIDE)
  const [inquiries, setInquiries] = useState<Inquiry[]>(DEMO_INQUIRIES)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"PROFILE" | "INQUIRIES">("PROFILE")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/guides/dashboard")
    } else if (session?.user?.email) {
      setGuideEmail(session.user.email)
      fetchGuideData(session.user.email)
    } else {
      fetchGuideData("pasang.sherpa@nomadnepal.com")
    }
  }, [session, status, router])

  // Edit profile state
  const [editName, setEditName] = useState(DEMO_GUIDE.name)
  const [editBio, setEditBio] = useState(DEMO_GUIDE.bio)
  const [editLocation, setEditLocation] = useState(DEMO_GUIDE.location)
  const [editSpecialties, setEditSpecialties] = useState(
    Array.isArray(DEMO_GUIDE.specialties) ? DEMO_GUIDE.specialties.join(", ") : ""
  )
  const [editPhotoUrl, setEditPhotoUrl] = useState(DEMO_GUIDE.photoUrl || "")
  const [editContactEmail, setEditContactEmail] = useState(DEMO_GUIDE.contactEmail)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const fetchGuideData = async (email: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/guides?city=All`)
      if (res.ok) {
        const guidesList = await res.json()
        const matched = guidesList.find((g: any) => g.contactEmail.toLowerCase() === email.toLowerCase())
        if (matched) {
          setGuide(matched)
          setEditName(matched.name)
          setEditBio(matched.bio)
          setEditLocation(matched.location)
          setEditSpecialties(Array.isArray(matched.specialties) ? matched.specialties.join(", ") : "")
          setEditPhotoUrl(matched.photoUrl || "")
          setEditContactEmail(matched.contactEmail)
        }
      }
    } catch (err) {
      console.error("Failed to load guide data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuideData(guideEmail)
  }, [guideEmail])

  const handleAccountSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchGuideData(guideEmail)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const specsArray = editSpecialties.split(",").map(s => s.trim()).filter(Boolean)
      const res = await fetch(`/api/guides/${guide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          location: editLocation,
          specialties: specsArray,
          photoUrl: editPhotoUrl,
          contactEmail: editContactEmail
        })
      })

      if (res.ok) {
        setGuide(prev => ({
          ...prev,
          name: editName,
          bio: editBio,
          location: editLocation,
          specialties: specsArray,
          photoUrl: editPhotoUrl,
          contactEmail: editContactEmail
        }))
        setSuccessMessage("Local Expert profile updated successfully!")
        setTimeout(() => setSuccessMessage(""), 4000)
      }
    } catch (err) {
      console.error("Save profile error:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmInquiry = (id: string) => {
    setInquiries(prev =>
      prev.map(inq => (inq.id === id ? { ...inq, status: "CONFIRMED" as const } : inq))
    )
    setSuccessMessage("Trek inquiry confirmed!")
    setTimeout(() => setSuccessMessage(""), 4000)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="relative border-b border-gray-800/80 bg-gradient-to-b from-[#141414] to-[#0A0A0A] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 flex-shrink-0">
                <Image
                  src={guide.photoUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"}
                  alt={guide.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    <Award className="w-3 h-3" /> VERIFIED LOCAL EXPERT
                  </span>
                  <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" /> {guide.avgRating} ({guide.totalReviews} Reviews)
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  {guide.name} Dashboard
                </h1>
                <p className="text-gray-400 text-xs md:text-sm mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FFD400]" /> Base: {guide.location}
                </p>
              </div>
            </div>

            {/* Email Switcher Form */}
            <form onSubmit={handleAccountSearch} className="flex items-center gap-2 bg-[#181818] p-1.5 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 px-3 text-gray-400">
                <Mail className="w-4 h-4 text-[#FFD400]" />
                <input
                  type="email"
                  value={guideEmail}
                  onChange={e => setGuideEmail(e.target.value)}
                  placeholder="Expert email..."
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

          {/* Alert banner */}
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
        <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("PROFILE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeTab === "PROFILE"
                ? "bg-[#FFD400] text-black border-[#FFD400] shadow-md shadow-yellow-500/10"
                : "bg-[#141414] text-gray-400 border-gray-800 hover:text-white"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Edit Profile & Specialties
          </button>

          <button
            onClick={() => setActiveTab("INQUIRIES")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeTab === "INQUIRIES"
                ? "bg-[#FFD400] text-black border-[#FFD400] shadow-md shadow-yellow-500/10"
                : "bg-[#141414] text-gray-400 border-gray-800 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Trek & Tour Inquiries ({inquiries.length})
          </button>

          <Link
            href={`/guides/${guide.id}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A1A1A] text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white transition-colors flex items-center gap-1.5 ml-auto"
          >
            <Compass className="w-4 h-4 text-[#FFD400]" /> View Public Profile
          </Link>
        </div>

        {/* TAB 1: EDIT PROFILE */}
        {activeTab === "PROFILE" && (
          <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800/80 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Local Expert Profile Settings</h2>
                <p className="text-xs text-gray-400">Update your public guide listing details, base location, and specialties.</p>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Guide Profile"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Name / Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#161616] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Base Location (e.g. Pokhara, Mustang)</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full bg-[#161616] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Contact Email</label>
                <input
                  type="email"
                  value={editContactEmail}
                  onChange={e => setEditContactEmail(e.target.value)}
                  className="w-full bg-[#161616] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  value={editPhotoUrl}
                  onChange={e => setEditPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#161616] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 font-semibold mb-1">Guide Specialties (comma separated)</label>
                <input
                  type="text"
                  value={editSpecialties}
                  onChange={e => setEditSpecialties(e.target.value)}
                  placeholder="Annapurna Trekking, Mustang Expedition, Motorbike Tours, Photography"
                  className="w-full bg-[#161616] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 font-semibold mb-1">Bio & Experience Description</label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full bg-[#161616] border border-gray-700 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GUEST TREK INQUIRIES */}
        {activeTab === "INQUIRIES" && (
          <div className="space-y-4">
            {inquiries.map(inq => (
              <div
                key={inq.id}
                className="bg-[#121212] p-5 rounded-2xl border border-gray-800/80 hover:border-gray-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {inq.status === "PENDING" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> PENDING INQUIRY
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> CONFIRMED GUEST
                      </span>
                    )}

                    <span className="text-xs font-semibold text-[#FFD400]">
                      {inq.trekName}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    Nomad: {inq.nomadName} <span className="text-xs text-gray-400 font-mono">({inq.nomadEmail})</span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-gray-200">
                      <Calendar className="w-3.5 h-3.5 text-[#FFD400]" /> Dates: {inq.dates}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-900 border border-gray-800 rounded text-gray-300 font-medium">
                      Group Size: {inq.groupSize} People
                    </span>
                  </div>

                  {inq.notes && (
                    <p className="text-xs text-gray-300 italic bg-[#181818] p-2.5 rounded-xl border border-gray-800">
                      "{inq.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {inq.status === "PENDING" && (
                    <button
                      onClick={() => handleConfirmInquiry(inq.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept Trek Request
                    </button>
                  )}

                  <a
                    href={`mailto:${inq.nomadEmail}?subject=Re: ${inq.trekName} Inquiry`}
                    className="px-3 py-2 bg-[#222] text-gray-200 text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#FFD400]" /> Email Nomad
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
