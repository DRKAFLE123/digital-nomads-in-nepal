/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { 
  Building2, 
  MapPin, 
  Camera, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowLeft, 
  Loader2, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Wifi,
  Zap,
  Coffee,
  Utensils,
  Laptop,
  Users,
  Mountain,
  DollarSign,
  Phone,
  Clock
} from "lucide-react"
import { 
  NEPAL_DISTRICT_DATA, 
  PROPERTY_CATEGORY_OPTIONS, 
  CategoryOption 
} from "@/lib/nepal-locations"

const ALL_FACILITIES = [
  { id: "wifi_100", label: "High-Speed Fiber (100+ Mbps)", nepali: "१००+ Mbps फाइबर इन्टरनेट", icon: Wifi },
  { id: "power_backup", label: "Backup Power Generator (24/7)", nepali: "२४ घण्टा बत्ती ब्याकअप", icon: Zap },
  { id: "coffee", label: "Specialty Himalayan Coffee / Tea", nepali: "कफी तथा चिया बार", icon: Coffee },
  { id: "meals", label: "On-Site Snacks, Lunch & Dinner", nepali: "खाना तथा खाजाको सुविधा", icon: Utensils },
  { id: "kitchen", label: "Shared Kitchen for Guests", nepali: "साझा किचन", icon: Utensils },
  { id: "ergonomic", label: "Ergonomic Workstations", nepali: "आरामदायी कुर्सी र डेक्स", icon: Laptop },
  { id: "call_booth", label: "Quiet Zoom Call Booths", nepali: "कल बुथ र मिटिङ स्पेस", icon: Users },
  { id: "terrace", label: "Mountain View Rooftop / Terrace", nepali: "रूफटप तथा हिमाल भ्यु", icon: Mountain },
  { id: "access_247", label: "24/7 Access", nepali: "२४ घण्टा पहुँच", icon: Clock },
]

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const hubId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form Fields — Property Name FIRST
  const [name, setName] = useState("")
  
  // Category & Sub Type in Dropdowns
  const [mainCategory, setMainCategory] = useState("Work and Stay")
  const [spaceType, setSpaceType] = useState("Coliving & Coworking Hub (Work + Stay)")

  // District & City in Dropdowns + custom mention
  const [district, setDistrict] = useState("kaski")
  const [customDistrict, setCustomDistrict] = useState("")
  const [citySelect, setCitySelect] = useState("Pokhara (Lakeside)")
  const [customCity, setCustomCity] = useState("")
  const [address, setAddress] = useState("")

  // Contact & Social
  const [contactEmail, setContactEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")

  // Pricing & Hours
  const [priceDaily, setPriceDaily] = useState<number | string>(5)
  const [priceMonthly, setPriceMonthly] = useState<number | string>(85)
  const [openingHours, setOpeningHours] = useState("24/7 Access")

  // Visibility, Cover Photo & Facilities
  const [published, setPublished] = useState(true)
  const [photoUrl, setPhotoUrl] = useState("")
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [facilities, setFacilities] = useState<string[]>([])
  const [description, setDescription] = useState("")

  // Fetch Existing Hub Data
  useEffect(() => {
    if (!hubId || status === "loading") return
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/owner/properties/${hubId}/edit`)
      return
    }

    async function loadHub() {
      try {
        setLoading(true)
        setError("")
        const res = await fetch(`/api/owner/hubs/${hubId}`)
        if (!res.ok) {
          const errData = await res.json()
          setError(errData.error || "Failed to load property details")
          setLoading(false)
          return
        }

        const hub = await res.json()
        setName(hub.name || "")
        setAddress(hub.address || "")
        setDescription(hub.description || "")
        setPriceDaily(hub.priceDaily ?? 5)
        setPriceMonthly(hub.priceMonthly ?? 85)
        setOpeningHours(hub.openingHours || "24/7 Access")
        setContactEmail(hub.contactEmail || "")
        setWebsite(hub.website || "")
        setPublished(hub.published ?? true)

        // Parse Photo
        let photo = hub.photoUrl || ""
        if (photo.startsWith("[")) {
          try {
            const parsed = JSON.parse(photo)
            if (Array.isArray(parsed) && parsed.length > 0) photo = parsed[0]
          } catch (e) {}
        }
        setPhotoUrl(photo)

        // Parse Facilities
        if (Array.isArray(hub.facilities)) {
          setFacilities(hub.facilities)
        } else if (typeof hub.facilities === "string") {
          try {
            const parsed = JSON.parse(hub.facilities)
            if (Array.isArray(parsed)) setFacilities(parsed)
          } catch (e) {}
        }

        // Map Space Type & Main Category
        const st = hub.spaceType || "Coliving & Coworking Hub (Work + Stay)"
        setSpaceType(st)
        const matchedCategory = PROPERTY_CATEGORY_OPTIONS.find(c => 
          c.subtypes.some(s => s.value.toLowerCase() === st.toLowerCase())
        )
        if (matchedCategory) {
          setMainCategory(matchedCategory.value)
        }

        // Map District & City
        const hubCity = hub.city || "Pokhara"
        let foundDistrict = NEPAL_DISTRICT_DATA.find(d => 
          d.cities.some(c => c.toLowerCase().includes(hubCity.toLowerCase())) ||
          hubCity.toLowerCase().includes(d.name.toLowerCase())
        )

        if (foundDistrict) {
          setDistrict(foundDistrict.id)
          const matchedCity = foundDistrict.cities.find(c => c.toLowerCase().includes(hubCity.toLowerCase()))
          if (matchedCity) {
            setCitySelect(matchedCity)
          } else {
            setCitySelect("Other City / Town in " + foundDistrict.name)
            setCustomCity(hubCity)
          }
        } else {
          setDistrict("other")
          setCustomDistrict(hubCity)
          setCitySelect("Other City / Town (अन्य सहर / स्थान)")
          setCustomCity(hubCity)
        }

      } catch (err: any) {
        console.error("Error loading hub:", err)
        setError("Network error while loading property details.")
      } finally {
        setLoading(false)
      }
    }

    loadHub()
  }, [hubId, status, router])

  // Active Category Definition
  const currentCategoryDef = PROPERTY_CATEGORY_OPTIONS.find(c => c.value === mainCategory) || PROPERTY_CATEGORY_OPTIONS[0]

  // Active District Definition
  const currentDistrictDef = NEPAL_DISTRICT_DATA.find(d => d.id === district) || NEPAL_DISTRICT_DATA[0]

  // Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/work-hubs/upload", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setPhotoUrl(data.url)
        setSuccess("Cover photo uploaded successfully!")
        setTimeout(() => setSuccess(""), 4000)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to upload photo")
      }
    } catch {
      setError("Network error uploading photo")
    } finally {
      setUploadingPhoto(false)
    }
  }

  // Toggle facility
  const toggleFacility = (label: string) => {
    setFacilities(prev =>
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
    )
  }

  // Save Edits Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSaving(true)

    try {
      // Determine final city
      let finalCity = citySelect
      if (citySelect.toLowerCase().includes("other") || district === "other") {
        finalCity = customCity.trim() || currentDistrictDef.name
      } else {
        // Strip out parenthetical additions if clean name needed
        finalCity = citySelect.split("(")[0].trim() || citySelect
      }

      const payload = {
        hubId,
        name: name.trim(),
        city: finalCity,
        address: address.trim(),
        description: description.trim(),
        spaceType,
        priceDaily: Number(priceDaily) || 0,
        priceMonthly: Number(priceMonthly) || 0,
        openingHours: openingHours.trim(),
        photoUrl: photoUrl.trim(),
        facilities,
        published,
        website: website.trim(),
        contactEmail: contactEmail.trim().toLowerCase()
      }

      const res = await fetch("/api/owner/hubs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setSuccess(`"${name}" updated successfully!`)
        setTimeout(() => {
          router.push("/owner/dashboard")
        }, 1200)
      } else {
        const err = await res.json()
        setError(err.error || "Failed to update property details")
      }
    } catch (err: any) {
      console.error("Save error:", err)
      setError("Error saving property details. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0B0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#023629] dark:text-[#FB923C]" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Loading Property Details...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#0B0B0D] text-slate-900 dark:text-white font-sans pb-24">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/owner/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Host Console</span>
          </Link>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
              <span>Edit Property: {name || "Untitled Space"}</span>
            </h1>
            <p className="text-[11px] text-slate-500">
              Host Console • Dedicated Property Editor
            </p>
          </div>
        </div>

        {/* Live Status Switch */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              published
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            }`}
          >
            {published ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>{published ? "● Live Listing" : "○ Draft (Unlisted)"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 shadow-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5 shadow-xs">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* ─────────────────────────────────────────────────────────────
              SECTION 1: PROPERTY IDENTITY (NAME FIRST!)
             ───────────────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#023629] dark:text-[#FB923C]">
                Section 1 • Identity &amp; Classification
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Property Name &amp; Category
              </h2>
            </div>

            {/* 1. PROPERTY NAME (FIRST) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Property / Space Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Annapurna Nomad Coliving & Work Hub"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold placeholder:font-normal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The primary display name shown across search cards and nomad directories.
              </p>
            </div>

            {/* 2. CATEGORY & SUB TYPE IN DROPDOWNS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Main Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Main Property Category (3 Types) *
                </label>
                <select
                  value={mainCategory}
                  onChange={(e) => {
                    const newCat = e.target.value
                    setMainCategory(newCat)
                    const def = PROPERTY_CATEGORY_OPTIONS.find(c => c.value === newCat)
                    if (def && def.subtypes.length > 0) {
                      setSpaceType(def.subtypes[0].value)
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                >
                  {PROPERTY_CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#C2410C] font-semibold mt-1">
                  {currentCategoryDef.nepali}
                </p>
              </div>

              {/* Sub Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Specific Property Sub Type *
                </label>
                <select
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                >
                  {currentCategoryDef.subtypes.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label} ({sub.nepali})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {currentCategoryDef.subtypes.find(s => s.value === spaceType)?.tagline || "Select specific classification"}
                </p>
              </div>

            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 2: LOCATION (DISTRICT, CITY DROPDOWN & STREET ADDRESS)
             ───────────────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#023629] dark:text-[#FB923C]">
                Section 2 • Nepal Location &amp; Contact
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                District, City &amp; Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* District Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  District (जिल्ला) *
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    const newDist = e.target.value
                    setDistrict(newDist)
                    const dDef = NEPAL_DISTRICT_DATA.find(d => d.id === newDist)
                    if (dDef && dDef.cities.length > 0) {
                      setCitySelect(dDef.cities[0])
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                >
                  {NEPAL_DISTRICT_DATA.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.nepali})
                    </option>
                  ))}
                </select>

                {/* If Other District Selected */}
                {district === "other" && (
                  <div className="mt-2.5">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mention District Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customDistrict}
                      onChange={(e) => setCustomDistrict(e.target.value)}
                      placeholder="e.g. Palpa, Nuwakot, Lamjung"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629]"
                    />
                  </div>
                )}
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  City / Town (सहर / स्थान) *
                </label>
                <select
                  value={citySelect}
                  onChange={(e) => setCitySelect(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                >
                  {currentDistrictDef.cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* If Other City is chosen in Dropdown */}
                {(citySelect.toLowerCase().includes("other") || district === "other") && (
                  <div className="mt-2.5">
                    <label className="block text-[11px] font-bold text-[#C2410C] dark:text-[#FB923C] mb-1">
                      Mention Your Exact City / Town Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="e.g. Ghandruk, Tansen, Kurintar, Sauraha Ward 4"
                      className="w-full px-3.5 py-2 rounded-xl border border-orange-300 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Street Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Street Address &amp; Neighborhood Landmark *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Lakeside Ward 6, Baidam (Near Center Point / Hallanchowk)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
              />
            </div>

            {/* Contact Email & Direct WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Public Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="manager@yourspace.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Website / Social Page (Optional)
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. instagram.com/yourspace"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629]"
                />
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 3: COVER PHOTO & MEDIA
             ───────────────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#023629] dark:text-[#FB923C]">
                  Section 3 • Visual Presentation
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Cover Photo
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                JPEG, PNG, WebP up to 5MB
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              
              <div className="sm:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <Camera size={26} />
                    <span className="text-xs">No cover image</span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-7 space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors">
                    {uploadingPhoto ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    <span>{uploadingPhoto ? "Uploading..." : "Upload from Device"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl("")}
                      className="text-xs text-red-500 hover:underline px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 4: AMENITIES & FACILITIES
             ───────────────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#023629] dark:text-[#FB923C]">
                Section 4 • Amenities &amp; Food
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Power, Wi-Fi &amp; Facilities
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ALL_FACILITIES.map((fac) => {
                const isSelected = facilities.includes(fac.label)
                const FacIcon = fac.icon
                return (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => toggleFacility(fac.label)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "border-[#023629] dark:border-[#FB923C] bg-[#023629]/5 dark:bg-[#FB923C]/10 shadow-2xs"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#023629] dark:bg-[#FB923C] text-white dark:text-slate-950"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      <FacIcon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {fac.label}
                        </span>
                        {isSelected && (
                          <Check size={13} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#C2410C]">
                        {fac.nepali}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 5: PRICING, HOURS & BIO
             ───────────────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#023629] dark:text-[#FB923C]">
                Section 5 • Pricing &amp; Bio
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Rates &amp; Property Description
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Daily Desk / Room Rate (USD $)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={priceDaily}
                  onChange={(e) => setPriceDaily(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Monthly Rate (USD $)
                </label>
                <input
                  type="number"
                  step="1"
                  value={priceMonthly}
                  onChange={(e) => setPriceMonthly(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="e.g. 24/7 Access"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Property Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workspace, rooms, community atmosphere, and view..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] transition-all"
              />
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-6 z-20 p-4 bg-white/95 dark:bg-[#141418]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
            <Link
              href="/owner/dashboard"
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#023629] hover:bg-[#034a38] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving Property Changes...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  )
}
