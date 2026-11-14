"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
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
  Wifi,
  Zap,
  BedDouble,
  Compass,
  Phone
} from "lucide-react"

const LOCATIONS = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bhaktapur",
  "Bandipur",
  "Chitwan",
  "Lumbini",
  "Nagarkot",
  "Mustang",
  "Other Region",
]

const SPACE_CATEGORIES = [
  "Coliving & Coworking Hub (Work + Stay)",
  "Coworking & Hot Desk Space",
  "Digital Nomad Hostel & Coliving",
  "Work-Friendly Hotel & Resort",
  "Long-Term Nomad Villa & Apartment",
  "Hybrid Cafe & Work Lounge",
]

export default function QuickRegisterSpacePage() {
  const router = useRouter()

  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [spaceName, setSpaceName] = useState("")
  const [city, setCity] = useState("Pokhara")
  const [spaceType, setSpaceType] = useState("Coliving & Coworking Hub (Work + Stay)")
  const [phone, setPhone] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleQuickRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!ownerName.trim() || !email.trim() || !password || !spaceName.trim() || !city) {
      setError("Please fill in all required fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)

    try {
      // 1. Create Owner User & WorkHub draft
      const res = await fetch("/api/auth/register-host", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: ownerName.trim(),
          email: email.trim(),
          password,
          spaceName: spaceName.trim(),
          city,
          spaceType,
          phone: phone.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to register property. Please try again.")
        setLoading(false)
        return
      }

      // 2. Auto-login via NextAuth
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      })

      const slugParam = data.hub?.slug ? `&slug=${encodeURIComponent(data.hub.slug)}` : ""

      if (loginRes?.error) {
        router.push(`/auth/signin?registered=true&callbackUrl=/owner/dashboard?registered=true${slugParam}`)
      } else {
        // Immediate redirect to Host Dashboard with welcome banner
        router.push(`/owner/dashboard?registered=true${slugParam}`)
      }
    } catch (err: any) {
      console.error("Host registration error:", err)
      setError("A network error occurred. Please check your connection and try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/70 dark:bg-[#0A0A0B] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* ─────────────────────────────────────────────────────────────
                LEFT COLUMN: VALUE PROPOSITION FOR HOSTS
               ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-[#CD6003] dark:text-[#FB923C] text-xs font-bold tracking-wide uppercase">
                <Building2 size={14} />
                <span>Space Partner Program</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  List your space for <span className="text-[#023629] dark:text-[#FB923C]">remote workers</span> in Nepal
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join Nepal&apos;s leading network of verified coworking hubs, coliving properties, and nomad stays. Attract high-intent remote workers staying for weeks to months.
                </p>
              </div>

              {/* Social Proof Images of Workspaces */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=120&q=80"
                      alt="Coworking Space"
                    />
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=120&q=80"
                      alt="Coliving Hub"
                    />
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=120&q=80"
                      alt="Nomad Cafe"
                    />
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80"
                      alt="Work Hub"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <ShieldCheck size={16} /> <span>Verified Host Network</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Featured in Kathmandu, Pokhara, Lalitpur & Bandipur
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Core Host Benefits */}
              <div className="space-y-3.5">
                {[
                  "0% Platform Commission on direct monthly guest bookings",
                  "Direct guest WhatsApp & email inquiries into your console",
                  "Custom listings for Hot Desks, Private Offices & Coliving Rooms",
                ].map((perk, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {perk}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* ─────────────────────────────────────────────────────────────
                RIGHT COLUMN: CLEAN WHITE QUICK-JOIN CARD
               ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none p-8 sm:p-10 transition-all">
                
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Register Your Property
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Fast 1-minute registration. Add photos, pricing & amenities from your Host Console.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-sm font-medium animate-in fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleQuickRegister} className="space-y-5">
                  
                  {/* Space / Property Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Space / Property Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annapurna Nomad Hub & Coliving"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                    />
                  </div>

                  {/* Owner Name & Contact Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Host / Manager Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@yourspace.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Password & WhatsApp Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Password (min. 6 chars) *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Create password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        WhatsApp / Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+977 98..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* City & Category Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        City / Location *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      >
                        {LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Property Category *
                      </label>
                      <select
                        value={spaceType}
                        onChange={(e) => setSpaceType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      >
                        {SPACE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms note */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                    By listing your space, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-slate-800 dark:hover:text-slate-200">
                      Partner Terms
                    </Link>
                    . You can add full room/desk photos, pricing in USD/NPR, and Wi-Fi speeds from your Host Console.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#023629] hover:bg-[#023629]/90 dark:bg-[#FB923C] dark:hover:bg-[#FB923C]/90 text-white dark:text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Registering Space & Opening Console...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Host Account & Open Console</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {/* Sign In Alternative */}
                  <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Already registered your space?{" "}
                      <Link
                        href="/auth/signin?callbackUrl=/owner/dashboard"
                        className="font-bold text-[#023629] dark:text-[#FB923C] hover:underline"
                      >
                        Sign in to Host Console →
                      </Link>
                    </p>
                  </div>

                </form>

              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
