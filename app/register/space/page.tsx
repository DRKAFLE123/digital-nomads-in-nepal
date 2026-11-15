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
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Loader2, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Wifi,
  Zap,
  BedDouble,
  Laptop,
  Coffee,
  Briefcase,
  Users,
  Mountain,
  Home,
  HeartHandshake,
  Phone,
  DollarSign,
  Utensils,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export type MainCategory = "WORK_ONLY" | "WORK_AND_STAY" | "STAY_ONLY"

interface SubCategoryOption {
  id: string
  name: string
  nepali: string
  tagline: string
  icon: any
}

const CATEGORY_DEFINITIONS: Record<
  MainCategory,
  {
    title: string
    nepaliTitle: string
    badge: string
    subtitle: string
    icon: any
    subcategories: SubCategoryOption[]
  }
> = {
  WORK_ONLY: {
    title: "Work Only",
    nepaliTitle: "काम मात्र",
    badge: "Day Desks & Workspaces",
    subtitle: "For dedicated coworking hubs, cafe lounges, hot desks, private offices and meeting rooms.",
    icon: Laptop,
    subcategories: [
      {
        id: "coworking_hotdesk",
        name: "Coworking & Hot Desk Space",
        nepali: "साझा कोवर्किङ र हट डेस्क",
        tagline: "Flexible hot desks with 100+ Mbps fiber & backup power",
        icon: Laptop
      },
      {
        id: "hybrid_cafe",
        name: "Hybrid Cafe & Work Lounge",
        nepali: "वर्क-फ्रेन्डली क्याफे र लाउन्ज",
        tagline: "Specialty coffee, quiet seating & work-friendly ambience",
        icon: Coffee
      },
      {
        id: "private_office",
        name: "Private Dedicated Desk / Office",
        nepali: "प्राइभेट अफिस र केबिन",
        tagline: "Lockable private rooms or dedicated workstations for teams",
        icon: Briefcase
      },
      {
        id: "meeting_hub",
        name: "Meeting & Event Work Hub",
        nepali: "मिटिङ हल र सेमिनार स्पेस",
        tagline: "Conference rooms, podcast gear & workshop event seating",
        icon: Users
      }
    ]
  },
  WORK_AND_STAY: {
    title: "Work and Stay",
    nepaliTitle: "काम र बसाइ दुवै",
    badge: "Most Popular for Nomads",
    subtitle: "All-in-one coliving and workstation property. Rooms and verified high-speed workspaces under one roof.",
    icon: Building2,
    subcategories: [
      {
        id: "coliving_coworking",
        name: "Coliving & Coworking Hub (Work + Stay)",
        nepali: "कोलिभिङ र कोवर्किङ हब",
        tagline: "Dedicated nomad community with private/shared rooms & work hall",
        icon: Building2
      },
      {
        id: "nomad_hostel",
        name: "Digital Nomad Hostel & Coliving",
        nepali: "डिजिटल नोम्याड होस्टेल",
        tagline: "Budget-friendly social dorms/rooms with quiet fiber work room",
        icon: Users
      },
      {
        id: "work_hotel",
        name: "Work-Friendly Hotel & Resort",
        nepali: "वर्क-फ्रेन्डली होटल/रिसोर्ट",
        tagline: "Hospitality rooms with in-room desk, fiber Wi-Fi & restaurant",
        icon: BedDouble
      },
      {
        id: "himalayan_workation",
        name: "Himalayan Workation Retreat",
        nepali: "हिमालयन वर्केसन रिट्रिट",
        tagline: "Mountain-view peace, yoga, organic food & remote work setup",
        icon: Mountain
      }
    ]
  },
  STAY_ONLY: {
    title: "Stay Only",
    nepaliTitle: "बसाइ मात्र",
    badge: "Remote Living",
    subtitle: "Apartments, homestays, and villas with reliable high-speed fiber for independent remote workers.",
    icon: BedDouble,
    subcategories: [
      {
        id: "nomad_villa",
        name: "Long-Term Nomad Villa & Apartment",
        nepali: "लामो अवधिको भिल्ला वा अपार्टमेन्ट",
        tagline: "Self-contained apartments or villas for stays of 2 weeks to 6 months",
        icon: Home
      },
      {
        id: "boutique_homestay",
        name: "Boutique Guesthouse & Homestay",
        nepali: "होमस्टे र गेस्टहाउस",
        tagline: "Authentic local family homestay with verified high-speed Wi-Fi",
        icon: HeartHandshake
      },
      {
        id: "serviced_studio",
        name: "Serviced Studio for Remote Workers",
        nepali: "स्टुडियो अपार्टमेन्ट",
        tagline: "Compact private studio with kitchen, desk and weekly cleaning",
        icon: BedDouble
      }
    ]
  }
}

const POPULAR_CITIES = [
  { name: "Pokhara", badge: "Nomad Capital" },
  { name: "Kathmandu", badge: "Tech & Capital" },
  { name: "Lalitpur", badge: "Jhamsikhel & Sanepa" },
  { name: "Bhaktapur", badge: "Heritage & Peace" },
  { name: "Bandipur", badge: "Hilltop Workation" },
  { name: "Nagarkot", badge: "Sunrise & Forest" },
  { name: "Chitwan", badge: "Sauraha & Terai" },
  { name: "Lumbini", badge: "Peace & Culture" },
  { name: "Mustang", badge: "Himalayan High" },
  { name: "Other Region", badge: "Nepal" }
]

const FACILITY_OPTIONS = [
  // Connectivity & Power
  { id: "wifi_100", label: "100+ Mbps Fiber Wi-Fi", nepali: "१००+ Mbps फाइबर इन्टरनेट", group: "Power & Internet", icon: Wifi },
  { id: "backup_power", label: "24/7 Power & Inverter / Generator", nepali: "२४ घण्टा बत्ती ब्याकअप", group: "Power & Internet", icon: Zap },
  { id: "dual_band", label: "Dual-Band Wi-Fi (5GHz + 2.4GHz)", nepali: "ड्युअल-ब्यान्ड राउटर", group: "Power & Internet", icon: Wifi },
  // Food & Dining
  { id: "coffee", label: "Specialty Himalayan Coffee / Tea", nepali: "कफी तथा चिया बार", group: "Dining & Food", icon: Coffee },
  { id: "meals", label: "On-Site Snacks, Lunch & Dinner", nepali: "खाना तथा खाजाको सुविधा", group: "Dining & Food", icon: Utensils },
  { id: "kitchen", label: "Shared Kitchen for Guests", nepali: "साझा किचन", group: "Dining & Food", icon: Utensils },
  // Comfort & Work
  { id: "ergonomic", label: "Ergonomic Chairs & Desks", nepali: "आरामदायी कुर्सी र डेक्स", group: "Comfort & Work", icon: Laptop },
  { id: "call_booth", label: "Quiet Zoom Call Booths", nepali: "कल बुथ र मिटिङ स्पेस", group: "Comfort & Work", icon: Users },
  { id: "mountain_view", label: "Mountain View Terrace / Balcony", nepali: "रूफटप तथा हिमाल भ्यु", group: "Comfort & Work", icon: Mountain },
  { id: "ac_heating", label: "Air Conditioning & Room Heating", nepali: "AC तथा हिटर", group: "Comfort & Work", icon: Zap },
  { id: "access_247", label: "24/7 Space Access", nepali: "२४ घण्टा पहुँच", group: "Comfort & Work", icon: CheckCircle2 },
  { id: "clean_water", label: "Filtered Drinking Water (Free)", nepali: "पिउने पानी", group: "Comfort & Work", icon: CheckCircle2 }
]

export default function MultiStepRegisterSpacePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isLoggedIn = !!session?.user

  // Multi-step Wizard: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Category & Subcategory
  const [mainCategory, setMainCategory] = useState<MainCategory>("WORK_AND_STAY")
  const [subCategory, setSubCategory] = useState<string>("Coliving & Coworking Hub (Work + Stay)")

  // Step 2: Basic Info & Location
  const [spaceName, setSpaceName] = useState("")
  const [city, setCity] = useState("Pokhara")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")

  // Step 3: Power, Wi-Fi & Facilities
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    "100+ Mbps Fiber Wi-Fi",
    "24/7 Power & Inverter / Generator",
    "Specialty Himalayan Coffee / Tea",
    "On-Site Snacks, Lunch & Dinner",
    "Ergonomic Chairs & Desks"
  ])

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

  // Auto pre-fill if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !ownerName) setOwnerName(session.user.name)
      if (session.user.email && !email) setEmail(session.user.email)
    }
  }, [session, ownerName, email])

  function toggleFacility(label: string) {
    setSelectedFacilities(prev => 
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
    )
  }

  function handleNextStep() {
    setError("")

    if (currentStep === 1) {
      if (!subCategory) {
        setError("Please select a specific property subcategory.")
        return
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      if (!spaceName.trim()) {
        setError("Please enter your Space or Property Name.")
        return
      }
      if (!city) {
        setError("Please choose a city or region.")
        return
      }
      if (!address.trim()) {
        setError("Please provide a street or neighborhood address.")
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

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

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
            city: city.trim(),
            address: address.trim(),
            description: description.trim() || `${spaceName.trim()} is a verified ${subCategory} located in ${city.trim()}, Nepal, welcoming digital nomads, remote workers, and traveling creatives.`,
            facilities: selectedFacilities,
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
          city: city.trim(),
          spaceType: subCategory,
          phone: phone.trim() || null,
          address: address.trim(),
          description: description.trim(),
          facilities: selectedFacilities,
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/70 dark:bg-[#0A0A0B] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Session / Host Welcome Banner */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#023629] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Building2 size={18} />
              </div>
              <div>
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Logged in as {session?.user?.name || session?.user?.email}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Host Account
                    </span>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
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
                className="text-xs font-bold text-[#C2410C] hover:text-[#9a3412] hover:underline px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-950/20 whitespace-nowrap"
              >
                Already have an account? Sign In →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ─────────────────────────────────────────────────────────────
                LEFT COLUMN: VALUE PROPOSITION & LIVE SUMMARY PREVIEW
               ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#023629]/10 dark:bg-[#FB923C]/20 text-[#023629] dark:text-[#FB923C] text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles size={13} />
                  <span>Verified Host Network Nepal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Register your property for <span className="text-[#023629] dark:text-[#FB923C]">remote workers</span>
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join Nepal&apos;s curated network of fiber workspaces, coliving hubs, and nomad villas. Attract verified guests staying for weeks to months.
                </p>
              </div>

              {/* Dynamic Live Preview Card */}
              <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
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
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {spaceName.trim() || "Your Space / Property Name"}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[#C2410C]" />
                        <span>{city}, Nepal</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#023629]/10 text-[#023629] dark:bg-[#FB923C]/20 dark:text-[#FB923C] shrink-0">
                      {CATEGORY_DEFINITIONS[mainCategory].title}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {subCategory}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Estimated Rate:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {currency === "NPR" ? `रू ${priceDaily} / day • रू ${priceMonthly} / mo` : `$${priceDaily} / day • $${priceMonthly} / mo`}
                    </span>
                  </div>

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
              <div className="space-y-2.5 pt-2">
                {[
                  "0% Platform Commission on direct monthly guest bookings",
                  "Direct WhatsApp & email inquiries from nomads",
                  "Customized consoles for room availability & desk passes",
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
                RIGHT COLUMN: MULTI-STEP WIZARD CARD
               ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-6 sm:p-8 transition-all">
                
                {/* Step Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-[#023629] dark:text-[#FB923C] uppercase tracking-wider">
                      Step {currentStep} of 4 • {
                        currentStep === 1 ? "Category & Subcategory" :
                        currentStep === 2 ? "Location & Details" :
                        currentStep === 3 ? "Facilities & Food" :
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
                    STEP 1: 3 CATEGORIES & SUBCATEGORIES (EASY FOR NEPAL OWNERS)
                   ───────────────────────────────────────────────────────── */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Choose Property Category
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Select the primary purpose of your property, then pick its specific subcategory:
                      </p>
                    </div>

                    {/* 3 Main Category Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(["WORK_ONLY", "WORK_AND_STAY", "STAY_ONLY"] as MainCategory[]).map((catKey) => {
                        const cat = CATEGORY_DEFINITIONS[catKey]
                        const Icon = cat.icon
                        const isSelected = mainCategory === catKey
                        return (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => {
                              setMainCategory(catKey)
                              // Automatically set first subcategory of chosen main category
                              setSubCategory(cat.subcategories[0].name)
                              setError("")
                            }}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "border-[#023629] dark:border-[#FB923C] bg-[#023629]/5 dark:bg-[#FB923C]/10 shadow-xs ring-1 ring-[#023629] dark:ring-[#FB923C]"
                                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isSelected
                                    ? "bg-[#023629] dark:bg-[#FB923C] text-white dark:text-slate-950 shadow-xs"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                }`}>
                                  <Icon size={18} />
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-[#023629] dark:bg-[#FB923C] text-white dark:text-slate-950 flex items-center justify-center">
                                    <Check size={12} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {cat.title}
                              </h3>
                              <p className="text-[11px] font-semibold text-[#C2410C] mt-0.5">
                                {cat.nepaliTitle}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                {cat.badge}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Subcategories for Selected Main Category */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Select Specific Subcategory *
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {CATEGORY_DEFINITIONS[mainCategory].title} Options
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CATEGORY_DEFINITIONS[mainCategory].subcategories.map((sub) => {
                          const SubIcon = sub.icon
                          const isSubSelected = subCategory === sub.name
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                setSubCategory(sub.name)
                                setError("")
                              }}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                isSubSelected
                                  ? "border-[#023629] dark:border-[#FB923C] bg-[#023629]/5 dark:bg-[#FB923C]/10 shadow-2xs"
                                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSubSelected
                                  ? "bg-[#023629] dark:bg-[#FB923C] text-white dark:text-slate-950"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              }`}>
                                <SubIcon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {sub.name}
                                  </h4>
                                  {isSubSelected && (
                                    <Check size={14} className="text-[#023629] dark:text-[#FB923C] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[10px] font-semibold text-[#C2410C]">
                                  {sub.nepali}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                                  {sub.tagline}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Step 1 Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 bg-[#023629] hover:bg-[#034a38] dark:bg-[#FB923C] dark:hover:bg-[#FB923C]/90 text-white dark:text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
                      >
                        <span>Continue to Location</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STEP 2: LOCATION & CONTACT DETAILS
                   ───────────────────────────────────────────────────────── */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Property Details &amp; Location
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Where is your space situated in Nepal?
                      </p>
                    </div>

                    {/* Property Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Space / Property Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Annapurna Nomad Coliving & Work Hub"
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all"
                      />
                    </div>

                    {/* City Quick Selection Chips */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        City / Region *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                        {POPULAR_CITIES.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setCity(c.name)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              city === c.name
                                ? "border-[#023629] dark:border-[#FB923C] bg-[#023629]/10 dark:bg-[#FB923C]/20 text-[#023629] dark:text-[#FB923C] font-bold shadow-2xs"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-xs block leading-tight">{c.name}</span>
                            <span className="text-[9px] font-normal text-slate-400">{c.badge}</span>
                          </button>
                        ))}
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] transition-all"
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
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Power, Wi-Fi &amp; Facilities
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Select all amenities available on-site for remote workers:
                      </p>
                    </div>

                    {/* Facility Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {FACILITY_OPTIONS.map((fac) => {
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
                              <span className="text-[9px] text-slate-400">
                                {fac.group}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Step 3 Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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
                        * You can adjust individual room rates, hot desk passes, and discount packages anytime in your Host Console.
                      </p>
                    </div>

                    {/* Brief Description */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Brief Property Bio / Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder={`e.g. Modern ${subCategory.toLowerCase()} in ${city} with 100 Mbps dual-band fiber, 24/7 generator backup, quiet workspaces, and fresh organic meals.`}
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
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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
