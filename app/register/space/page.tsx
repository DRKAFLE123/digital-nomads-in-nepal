/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Loader2, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Wifi,
  Zap,
  Coffee,
  Utensils,
  Laptop,
  Users,
  Mountain,
  Phone,
  Clock,
  Egg,
  Soup,
  Cookie,
  Flame,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { 
  NEPAL_DISTRICT_DATA, 
  PROPERTY_CATEGORY_OPTIONS,
  FOOD_AND_DRINKS_OPTIONS
} from "@/lib/nepal-locations"

const POWER_AND_WIFI_FACILITIES = [
  { id: "wifi_100", label: "100+ Mbps Fiber Wi-Fi", nepali: "१००+ Mbps फाइबर इन्टरनेट", icon: Wifi },
  { id: "backup_power", label: "24/7 Power & Inverter / Generator", nepali: "२४ घण्टा बत्ती ब्याकअप", icon: Zap },
  { id: "dual_band", label: "Dual-Band Wi-Fi (5GHz + 2.4GHz)", nepali: "ड्युअल-ब्यान्ड राउटर", icon: Wifi },
]

const WORK_COMFORT_FACILITIES = [
  { id: "ergonomic", label: "Ergonomic Chairs & Desks", nepali: "आरामदायी कुर्सी र डेक्स", icon: Laptop },
  { id: "call_booth", label: "Quiet Zoom Call Booths", nepali: "कल बुथ र मिटिङ स्पेस", icon: Users },
  { id: "mountain_view", label: "Mountain View Terrace / Balcony", nepali: "रूफटप तथा हिमाल भ्यु", icon: Mountain },
  { id: "ac_heating", label: "Air Conditioning & Room Heating", nepali: "AC तथा हिटर", icon: Zap },
  { id: "access_247", label: "24/7 Space Access", nepali: "२४ घण्टा पहुँच", icon: Clock },
  { id: "clean_water", label: "Filtered Drinking Water (Free)", nepali: "पिउने पानी", icon: CheckCircle2 }
]

export default function MultiStepRegisterSpacePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  // Multi-step Wizard: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: PROPERTY NAME FIRST & CATEGORY / SUB-TYPE DROPDOWNS
  const [spaceName, setSpaceName] = useState("")
  const [mainCategory, setMainCategory] = useState("Work and Stay")
  const [subCategory, setSubCategory] = useState("Coliving & Coworking Hub (Work + Stay)")

  // Step 2: DISTRICT & CITY DROPDOWNS + OTHER MENTION + ADDRESS
  const [district, setDistrict] = useState("kaski")
  const [customDistrict, setCustomDistrict] = useState("")
  const [citySelect, setCitySelect] = useState("Pokhara (Lakeside)")
  const [customCity, setCustomCity] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")

  // Step 3: Power, Wi-Fi & Facilities
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    "100+ Mbps Fiber Wi-Fi",
    "24/7 Power & Inverter / Generator",
    "Specialty Coffee, Tea & Drinks",
    "Breakfast Available",
    "Lunch Available",
    "Dinner Available",
    "Ergonomic Chairs & Desks"
  ])

  // Step 3 Specific: Food & Drinks Management
  const [hasFoodService, setHasFoodService] = useState<boolean>(true)
  const [selectedFoodOptions, setSelectedFoodOptions] = useState<string[]>([
    "Breakfast Available",
    "Lunch Available",
    "Dinner Available",
    "Snacks & Light Bites",
    "Specialty Coffee, Tea & Drinks"
  ])
  const [hasSharedKitchen, setHasSharedKitchen] = useState<boolean>(true)
  const [isBreakfastIncluded, setIsBreakfastIncluded] = useState<boolean>(false)

  // Step 4: Pricing, Description & Account
  const [currency, setCurrency] = useState<"NPR" | "USD">("NPR")
  const [priceDaily, setPriceDaily] = useState("600")
  const [priceMonthly, setPriceMonthly] = useState("14000")
  const [description, setDescription] = useState("")

  // Unauthenticated Host Account Fields
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Active Category Definition
  const currentCategoryDef = PROPERTY_CATEGORY_OPTIONS.find(c => c.value === mainCategory) || PROPERTY_CATEGORY_OPTIONS[0]

  // Active District Definition
  const currentDistrictDef = NEPAL_DISTRICT_DATA.find(d => d.id === district) || NEPAL_DISTRICT_DATA[0]

  // Auto pre-fill if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !ownerName) setOwnerName(session.user.name)
      if (session.user.email && !email) setEmail(session.user.email)
    }
  }, [session, ownerName, email])

  // Determine Final Computed City
  const getComputedCity = () => {
    if (citySelect.toLowerCase().includes("other") || district === "other") {
      return customCity.trim() || currentDistrictDef.name
    }
    return citySelect.split("(")[0].trim() || citySelect
  }

  function toggleFacility(label: string) {
    setSelectedFacilities(prev => 
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
    )
  }

  function toggleFoodOption(label: string) {
    setSelectedFoodOptions(prev =>
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
    )
  }

  function handleNextStep() {
    setError("")

    if (currentStep === 1) {
      if (!spaceName.trim()) {
        setError("Please enter your Property / Space Name.")
        return
      }
      if (!mainCategory || !subCategory) {
        setError("Please select both a Property Category and Specific Sub Type.")
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      if (district === "other" && !customDistrict.trim()) {
        setError("Please mention your District Name.")
        return
      }
      if (citySelect.toLowerCase().includes("other") && !customCity.trim()) {
        setError("Please mention your exact City / Town Name.")
        return
      }
      if (!address.trim()) {
        setError("Please provide a street address or neighborhood landmark.")
        return
      }
      if (!phone.trim()) {
        setError("Please provide a WhatsApp or phone number for traveler inquiries.")
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      if (selectedFacilities.length === 0) {
        setError("Please select at least 1 facility.")
        return
      }
      setCurrentStep(4)
      return
    }
  }

  // Combine all facilities for final submission
  const getAggregatedFacilities = () => {
    const combined = [...selectedFacilities]
    
    if (hasFoodService) {
      selectedFoodOptions.forEach(opt => {
        if (!combined.includes(opt)) combined.push(opt)
      })
    }
    if (hasSharedKitchen && !combined.includes("Shared Guest Kitchen for Self-Cooking")) {
      combined.push("Shared Guest Kitchen for Self-Cooking")
    }
    if (isBreakfastIncluded && !combined.includes("Free Breakfast Included with Stay")) {
      combined.push("Free Breakfast Included with Stay")
    }

    return Array.from(new Set(combined))
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const finalCity = getComputedCity()
    const allFinalFacilities = getAggregatedFacilities()

    try {
      // If user is already logged in, register hub directly via /api/work-hubs/register
      if (isLoggedIn) {
        const finalDaily = currency === "USD" ? parseFloat(priceDaily || "5") : Math.round(parseFloat(priceDaily || "600") / 135)
        const finalMonthly = currency === "USD" ? parseFloat(priceMonthly || "85") : Math.round(parseFloat(priceMonthly || "14000") / 135)

        const res = await fetch("/api/work-hubs/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: spaceName.trim(),
            city: finalCity,
            address: address.trim(),
            description: description.trim() || `${spaceName.trim()} is a verified ${subCategory} located in ${finalCity}, Nepal, welcoming digital nomads, remote workers, and traveling creatives.`,
            facilities: allFinalFacilities,
            priceDaily: finalDaily,
            priceMonthly: finalMonthly,
            contactEmail: session?.user?.email || email.trim(),
            website: website.trim() || null,
            ownerEmail: session?.user?.email || email.trim(),
            ownerName: session?.user?.name || ownerName.trim(),
            spaceType: subCategory,
            openingHours: "24/7 Access",
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Failed to register property. Please try again.")
          setLoading(false)
          return
        }

        const slugParam = data.slug ? `&slug=${encodeURIComponent(data.slug)}` : ""
        router.push(`/owner/dashboard?registered=true${slugParam}`)
        return
      }

      // If user is NOT logged in, create host account & workhub via /api/auth/register-host
      if (!ownerName.trim() || !email.trim() || !password) {
        setError("Please complete your Host Manager details (Name, Email & Password).")
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long.")
        setLoading(false)
        return
      }

      const finalDaily = currency === "USD" ? parseFloat(priceDaily || "5") : Math.round(parseFloat(priceDaily || "600") / 135)
      const finalMonthly = currency === "USD" ? parseFloat(priceMonthly || "85") : Math.round(parseFloat(priceMonthly || "14000") / 135)

      const res = await fetch("/api/auth/register-host", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: ownerName.trim(),
          email: email.trim().toLowerCase(),
          password,
          spaceName: spaceName.trim(),
          city: finalCity,
          spaceType: subCategory,
          phone: phone.trim() || null,
          address: address.trim(),
          description: description.trim(),
          facilities: allFinalFacilities,
          priceDaily: finalDaily,
          priceMonthly: finalMonthly,
          openingHours: "24/7 Access",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to register property. Please check your details.")
        setLoading(false)
        return
      }

      // Auto login with new credentials
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      })

      const slugParam = data.hub?.slug ? `&slug=${encodeURIComponent(data.hub.slug)}` : ""

      if (loginRes?.error) {
        router.push(`/auth/signin?registered=true&callbackUrl=/owner/dashboard?registered=true${slugParam}`)
      } else {
        router.push(`/owner/dashboard?registered=true${slugParam}`)
      }
    } catch (err: any) {
      console.error("Multi-step property registration error:", err)
      setError("A connection error occurred. Please try again.")
      setLoading(false)
    }
  }

  const computedCityDisplay = getComputedCity()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/70 dark:bg-[#0A0A0B] pt-24 sm:pt-28 pb-20 px-3.5 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Session / Host Welcome Banner */}
          <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#023629] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Building2 size={18} />
              </div>
              <div>
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Logged in as {session?.user?.name || session?.user?.email}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Host Account
                    </span>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Nepal Host Space Registration Portal
                  </p>
                )}
                <p className="text-[11px] text-slate-500">
                  {isLoggedIn 
                    ? "Your new property will automatically attach to your Host Console."
                    : "Register your property in 4 easy steps. You'll manage listings in your Host Console."}
                </p>
              </div>
            </div>

            {!isLoggedIn && (
              <Link
                href="/auth/signin?callbackUrl=/register/space"
                className="text-xs font-bold text-[#C2410C] hover:text-[#9a3412] hover:underline px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-950/20 whitespace-nowrap self-end sm:self-auto"
              >
                Already have an account? Sign In →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            
            {/* ─────────────────────────────────────────────────────────────
                LEFT COLUMN: VALUE PROPOSITION & LIVE SUMMARY PREVIEW
               ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              
              <div className="space-y-2 sm:space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#023629]/10 dark:bg-[#FB923C]/20 text-[#023629] dark:text-[#FB923C] text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles size={13} />
                  <span>Verified Host Network Nepal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Register your property for <span className="text-[#023629] dark:text-[#FB923C]">remote workers</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join Nepal&apos;s curated network of fiber workspaces, hostels, coliving hubs, and nomad villas. Attract verified guests staying for weeks to months.
                </p>
              </div>

              {/* Dynamic Live Preview Card */}
              <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Live Listing Preview
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    0% Commission
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug truncate">
                        {spaceName.trim() || "Your Space / Property Name"}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[#C2410C] shrink-0" />
                        <span className="truncate">{computedCityDisplay}, Nepal</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#023629]/10 text-[#023629] dark:bg-[#FB923C]/20 dark:text-[#FB923C] shrink-0">
                      {mainCategory}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {subCategory}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Estimated Rate:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {currency === "NPR" ? `रू ${priceDaily} / day • रू ${priceMonthly} / mo` : `$${priceDaily} / day • $${priceMonthly} / mo`}
                    </span>
                  </div>

                  {/* Food & Dining Preview Badge */}
                  {hasFoodService && selectedFoodOptions.length > 0 && (
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#C2410C] font-semibold">
                      <Utensils size={12} />
                      <span className="truncate">
                        Food: {selectedFoodOptions.map(f => f.replace(" Available", "")).join(", ")}
                      </span>
                    </div>
                  )}

                  {selectedFacilities.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {selectedFacilities.slice(0, 4).map((fac, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          ✓ {fac}
                        </span>
                      ))}
                      {selectedFacilities.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-400 self-center">
                          +{selectedFacilities.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Core Host Perks */}
              <div className="space-y-2 pt-1 hidden sm:block">
                {[
                  "Hostels, Coliving, Hotels, Homestays & Coworking Hubs welcome",
                  "0% Platform Commission on direct monthly guest bookings",
                  "Direct WhatsApp & email inquiries from global nomads",
                  "Manage room availability, day passes & menus from Host Console",
                ].map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {perk}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* ─────────────────────────────────────────────────────────────
                RIGHT COLUMN: MULTI-STEP WIZARD CARD (MOBILE OPTIMIZED)
               ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-5 sm:p-8 transition-all">
                
                {/* Step Progress Indicator */}
                <div className="mb-5 sm:mb-6">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-[#023629] dark:text-[#FB923C] uppercase tracking-wider">
                      Step {currentStep} of 4 • {
                        currentStep === 1 ? "Property Name & Category" :
                        currentStep === 2 ? "District, City & Location" :
                        currentStep === 3 ? "Facilities & Food Service" :
                        "Pricing & Confirmation"
                      }
                    </span>
                    <span className="text-slate-400">
                      {currentStep === 1 ? "25%" : currentStep === 2 ? "50%" : currentStep === 3 ? "75%" : "100%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#023629] dark:bg-[#FB923C] h-full transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${currentStep * 25}%` }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STEP 1: PROPERTY NAME (FIRST) & ALL CATEGORY DROPDOWNS
                   ───────────────────────────────────────────────────────── */}
                {currentStep === 1 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Property Identity &amp; Type
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        First, give your property a clear name and select its category (Hostel, Coliving, Coworking, Hotel, Homestay):
                      </p>
                    </div>

                    {/* 1. PROPERTY NAME (FIRST FIELD) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Property / Space Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Annapurna Nomad Hostel & Coliving Hub"
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold placeholder:font-normal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Name that will appear on public listing cards, search results, and booking passes.
                      </p>
                    </div>

                    {/* 2. MAIN CATEGORY DROPDOWN */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Main Property Category (3 Types) *
                      </label>
                      <select
                        value={mainCategory}
                        onChange={(e) => {
                          const newCat = e.target.value
                          setMainCategory(newCat)
                          const catDef = PROPERTY_CATEGORY_OPTIONS.find(c => c.value === newCat)
                          if (catDef && catDef.subtypes.length > 0) {
                            setSubCategory(catDef.subtypes[0].value)
                          }
                          setError("")
                        }}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all cursor-pointer font-medium"
                      >
                        {PROPERTY_CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] font-semibold text-[#C2410C] mt-1">
                        {currentCategoryDef.nepali} • {currentCategoryDef.badge}
                      </p>
                    </div>

                    {/* 3. SUB CATEGORY DROPDOWN (HOSTEL, COLIVING, RETREAT, ETC.) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Specific Property Sub Type (Including Hostels, Stays &amp; Desks) *
                      </label>
                      <select
                        value={subCategory}
                        onChange={(e) => {
                          setSubCategory(e.target.value)
                          setError("")
                        }}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all cursor-pointer font-medium"
                      >
                        {currentCategoryDef.subtypes.map((sub) => (
                          <option key={sub.value} value={sub.value}>
                            {sub.label} ({sub.nepali})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {currentCategoryDef.subtypes.find(s => s.value === subCategory)?.tagline || "Choose the best match for your space."}
                      </p>
                    </div>

                    {/* Step 1 Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#023629] hover:bg-[#034a38] dark:bg-[#FB923C] dark:hover:bg-[#FB923C]/90 text-white dark:text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
                      >
                        <span>Continue to Location</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STEP 2: DISTRICT & CITY DROPDOWNS + OTHER MENTION
                   ───────────────────────────────────────────────────────── */}
                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        District, City &amp; Address
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Select your district and city from the dropdowns, or mention your specific town name:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      
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
                            setError("")
                          }}
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] cursor-pointer"
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
                            <label className="block text-[11px] font-bold text-[#C2410C] dark:text-[#FB923C] mb-1">
                              Mention District Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={customDistrict}
                              onChange={(e) => setCustomDistrict(e.target.value)}
                              placeholder="e.g. Palpa, Nuwakot, Lamjung, Morang"
                              className="w-full px-3.5 py-2 rounded-xl border border-orange-300 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
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
                          onChange={(e) => {
                            setCitySelect(e.target.value)
                            setError("")
                          }}
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] cursor-pointer"
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
                              Mention Your City / Town Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={customCity}
                              onChange={(e) => setCustomCity(e.target.value)}
                              placeholder="e.g. Ghandruk, Tansen, Kurintar, Sauraha Ward 4"
                              className="w-full px-3.5 py-2 rounded-xl border border-orange-300 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Street Address / Neighborhood Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lakeside Ward 6, Baidam (Near Hallanchowk)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all"
                      />
                    </div>

                    {/* Phone / WhatsApp & Website */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Direct WhatsApp / Phone *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="+977 9801234567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all"
                          />
                          <Phone size={14} className="absolute right-3.5 top-3 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Nomads use this to contact your front desk or manager directly.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Website / Social Page (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. instagram.com/yourspace"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all"
                        />
                      </div>
                    </div>

                    {/* Step 2 Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 rounded-lg cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 bg-[#023629] hover:bg-[#034a38] dark:bg-[#FB923C] dark:hover:bg-[#FB923C]/90 text-white dark:text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
                      >
                        <span>Continue to Facilities</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STEP 3: POWER, WI-FI, FOOD & NOMAD FACILITIES
                   ───────────────────────────────────────────────────────── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Power, Wi-Fi &amp; Food Services
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Select food availability and workspace amenities for remote workers:
                      </p>
                    </div>

                    {/* ───────────────────────────────────────────────────
                        FOOD & DRINKS MANAGEMENT CARD
                       ─────────────────────────────────────────────────── */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-4">
                      
                      {/* Master Food Service Switch */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-orange-200/80 dark:border-orange-900/40">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Utensils size={15} className="text-[#C2410C]" />
                            <span>Food &amp; Drinks Available on Premises?</span>
                          </span>
                          <p className="text-[11px] text-slate-500">
                            खाना, खाजा वा कफी/चिया तपाईंको प्रोपर्टीमा उपलब्ध छ?
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setHasFoodService(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              hasFoodService
                                ? "bg-[#023629] text-white shadow-xs"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            ✓ Yes Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasFoodService(false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              !hasFoodService
                                ? "bg-slate-700 text-white shadow-xs"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            No Food On-Site
                          </button>
                        </div>
                      </div>

                      {/* Food & Drink Options Checklist */}
                      {hasFoodService && (
                        <div className="space-y-3">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Select Available Meal &amp; Drink Options (कुन-कुन उपलब्ध छ?):
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Breakfast */}
                            <button
                              type="button"
                              onClick={() => toggleFoodOption("Breakfast Available")}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                selectedFoodOptions.includes("Breakfast Available")
                                  ? "border-[#023629] dark:border-[#FB923C] bg-white dark:bg-slate-900 font-bold shadow-2xs text-slate-900 dark:text-white"
                                  : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <Egg size={16} className="text-[#C2410C] shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs block leading-tight">Breakfast (ब्रेकफास्ट)</span>
                                <span className="text-[10px] text-slate-400 font-normal">Morning tea, toast, eggs, porridge</span>
                              </div>
                              {selectedFoodOptions.includes("Breakfast Available") && (
                                <Check size={14} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                              )}
                            </button>

                            {/* Lunch */}
                            <button
                              type="button"
                              onClick={() => toggleFoodOption("Lunch Available")}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                selectedFoodOptions.includes("Lunch Available")
                                  ? "border-[#023629] dark:border-[#FB923C] bg-white dark:bg-slate-900 font-bold shadow-2xs text-slate-900 dark:text-white"
                                  : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <Utensils size={16} className="text-[#C2410C] shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs block leading-tight">Lunch (लन्च / खाना)</span>
                                <span className="text-[10px] text-slate-400 font-normal">Nepali Dal Bhat, noodles, bowls</span>
                              </div>
                              {selectedFoodOptions.includes("Lunch Available") && (
                                <Check size={14} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                              )}
                            </button>

                            {/* Dinner */}
                            <button
                              type="button"
                              onClick={() => toggleFoodOption("Dinner Available")}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                selectedFoodOptions.includes("Dinner Available")
                                  ? "border-[#023629] dark:border-[#FB923C] bg-white dark:bg-slate-900 font-bold shadow-2xs text-slate-900 dark:text-white"
                                  : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <Soup size={16} className="text-[#C2410C] shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs block leading-tight">Dinner (डिनर / साँझको खाना)</span>
                                <span className="text-[10px] text-slate-400 font-normal">Curries, momos, warm evening meals</span>
                              </div>
                              {selectedFoodOptions.includes("Dinner Available") && (
                                <Check size={14} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                              )}
                            </button>

                            {/* Snacks */}
                            <button
                              type="button"
                              onClick={() => toggleFoodOption("Snacks & Light Bites")}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                selectedFoodOptions.includes("Snacks & Light Bites")
                                  ? "border-[#023629] dark:border-[#FB923C] bg-white dark:bg-slate-900 font-bold shadow-2xs text-slate-900 dark:text-white"
                                  : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <Cookie size={16} className="text-[#C2410C] shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs block leading-tight">Snacks &amp; Bites (खाजा)</span>
                                <span className="text-[10px] text-slate-400 font-normal">Pastries, sandwiches, pakodas, fries</span>
                              </div>
                              {selectedFoodOptions.includes("Snacks & Light Bites") && (
                                <Check size={14} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                              )}
                            </button>

                            {/* Drinks & Coffee (Spans 2 cols on desktop) */}
                            <button
                              type="button"
                              onClick={() => toggleFoodOption("Specialty Coffee, Tea & Drinks")}
                              className={`sm:col-span-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                selectedFoodOptions.includes("Specialty Coffee, Tea & Drinks")
                                  ? "border-[#023629] dark:border-[#FB923C] bg-white dark:bg-slate-900 font-bold shadow-2xs text-slate-900 dark:text-white"
                                  : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <Coffee size={16} className="text-[#C2410C] shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs block leading-tight">Specialty Coffee, Tea &amp; Beverages (कफी तथा पेय पदार्थ)</span>
                                <span className="text-[10px] text-slate-400 font-normal">Himalayan espresso, pour-over, masala chai, fresh juices</span>
                              </div>
                              {selectedFoodOptions.includes("Specialty Coffee, Tea & Drinks") && (
                                <Check size={14} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Additional Kitchen Facilities */}
                      <div className="pt-2 border-t border-orange-200/80 dark:border-orange-900/40 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer p-1.5 rounded-lg hover:bg-orange-100/50 dark:hover:bg-orange-950/40 transition-colors">
                          <input
                            type="checkbox"
                            checked={hasSharedKitchen}
                            onChange={(e) => setHasSharedKitchen(e.target.checked)}
                            className="rounded text-[#023629] focus:ring-[#023629]"
                          />
                          <Flame size={14} className="text-[#C2410C]" />
                          <span>Shared Guest Kitchen for Self-Cooking (साझा भान्सा)</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer p-1.5 rounded-lg hover:bg-orange-100/50 dark:hover:bg-orange-950/40 transition-colors">
                          <input
                            type="checkbox"
                            checked={isBreakfastIncluded}
                            onChange={(e) => setIsBreakfastIncluded(e.target.checked)}
                            className="rounded text-[#023629] focus:ring-[#023629]"
                          />
                          <Egg size={14} className="text-[#C2410C]" />
                          <span>Free Breakfast Included with Stay (ब्रेकफास्ट समावेश)</span>
                        </label>
                      </div>

                    </div>

                    {/* ───────────────────────────────────────────────────
                        POWER, WI-FI & WORK COMFORT
                       ─────────────────────────────────────────────────── */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Connectivity, Power &amp; Workspace Amenities:
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[...POWER_AND_WIFI_FACILITIES, ...WORK_COMFORT_FACILITIES].map((fac) => {
                          const FacIcon = fac.icon
                          const isChecked = selectedFacilities.includes(fac.label)
                          return (
                            <button
                              key={fac.id}
                              type="button"
                              onClick={() => toggleFacility(fac.label)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                isChecked
                                  ? "border-[#023629] dark:border-[#FB923C] bg-[#023629]/5 dark:bg-[#FB923C]/10 shadow-2xs"
                                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isChecked
                                  ? "bg-[#023629] dark:bg-[#FB923C] text-white dark:text-slate-950"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}>
                                <FacIcon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {fac.label}
                                  </h4>
                                  {isChecked && (
                                    <Check size={14} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[10px] font-semibold text-[#C2410C]">
                                  {fac.nepali}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Step 3 Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 rounded-lg cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 bg-[#023629] hover:bg-[#034a38] dark:bg-[#FB923C] dark:hover:bg-[#FB923C]/90 text-white dark:text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
                      >
                        <span>Continue to Pricing &amp; Submit</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STEP 4: PRICING, DESCRIPTION & SUBMIT / ACCOUNT
                   ───────────────────────────────────────────────────────── */}
                {currentStep === 4 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-5">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Pricing &amp; Host Confirmation
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Set your starting rates and review your space before publishing:
                      </p>
                    </div>

                    {/* Currency & Rates */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Starting Pricing Rates
                        </label>
                        <div className="flex items-center p-0.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setCurrency("NPR")}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              currency === "NPR"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                                : "text-slate-500"
                            }`}
                          >
                            NPR (रू)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrency("USD")}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              currency === "USD"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                                : "text-slate-500"
                            }`}
                          >
                            USD ($)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Daily Rate ({currency})
                          </label>
                          <input
                            type="number"
                            placeholder={currency === "NPR" ? "600" : "5"}
                            value={priceDaily}
                            onChange={(e) => setPriceDaily(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Monthly Rate ({currency})
                          </label>
                          <input
                            type="number"
                            placeholder={currency === "NPR" ? "14000" : "90"}
                            value={priceMonthly}
                            onChange={(e) => setPriceMonthly(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        * You can adjust individual dorm beds, private rooms, hot desk passes, and discount packages anytime in your Host Console.
                      </p>
                    </div>

                    {/* Brief Description */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Brief Property Bio / Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder={`e.g. Modern ${subCategory.toLowerCase()} in ${computedCityDisplay} with 100 Mbps dual-band fiber, 24/7 generator backup, quiet workspaces, and fresh organic meals.`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all"
                      />
                    </div>

                    {/* Host Account Details (Only if NOT logged in) */}
                    {!isLoggedIn ? (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Create Host Manager Account
                          </label>
                          <span className="text-[10px] text-slate-400">
                            Required to manage bookings
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Maya Sharma"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="manager@yourspace.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Password (min. 6 chars) *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                placeholder="Create login password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3.5 py-2 pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="shrink-0" />
                          <span>
                            Logged in as <strong>{session?.user?.name || session?.user?.email}</strong>. This property will be added directly to your Host Console.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step 4 Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 rounded-lg cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#023629] hover:bg-[#034a38] dark:bg-[#FB923C] dark:hover:bg-[#FB923C]/90 text-white dark:text-slate-950 font-bold px-7 py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Publishing to Host Console...</span>
                          </>
                        ) : (
                          <>
                            <span>Publish Property to Host Console</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
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
