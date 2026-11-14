"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { 
  Mountain, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Loader2, 
  Check, 
  ArrowRight,
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
  "Mustang & Manang",
  "Solukhumbu (Everest Region)",
  "Langtang Valley",
  "Other Region",
]

const PRIMARY_SPECIALTIES = [
  "Trekking & High-Altitude Hiking",
  "Cultural, Heritage & Shamanic Tours",
  "Photography & Filmmaking Expeditions",
  "Foodie, Culinary & Tea Tasting",
  "Yoga, Meditation & Wellness",
  "Rock Climbing & Adventure Sports",
  "Day Hikes & Hidden Viewpoints",
  "Wildlife & Jungle Safari",
]

export default function GuideQuickRegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [location, setLocation] = useState("Pokhara")
  const [primarySpecialty, setPrimarySpecialty] = useState("Trekking & High-Altitude Hiking")
  const [phone, setPhone] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleQuickJoin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim() || !email.trim() || !password || !location) {
      setError("Please fill in all required fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)

    try {
      // 1. Create User & Guide record
      const res = await fetch("/api/auth/register-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          location,
          primarySpecialty,
          phone: phone.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create account. Please try again.")
        setLoading(false)
        return
      }

      // 2. Auto-login via NextAuth
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      })

      if (loginRes?.error) {
        // If auto-login fails, redirect to signin with message
        router.push("/auth/signin?registered=true&callbackUrl=/local-guides/dashboard")
      } else {
        // Direct redirect into their bright white dashboard with welcome prompt!
        router.push("/local-guides/dashboard?welcome=true")
      }
    } catch (err: any) {
      console.error("Quick join error:", err)
      setError("A network error occurred. Please check your connection and try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/70 dark:bg-[#0A0A0B] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* ─────────────────────────────────────────────────────────────
                LEFT COLUMN: VALUE PROPOSITION & SOCIAL PROOF (GuideMeet style)
               ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[#023629] dark:text-emerald-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles size={14} className="text-[#FB923C]" />
                <span>Local Expert Network</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  Share Nepal with <span className="text-[#023629] dark:text-[#FB923C]">global nomads</span> & explorers
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join Nepal&apos;s fastest-growing platform connecting remote workers, backpackers, and travelers with certified local guides and cultural hosts.
                </p>
              </div>

              {/* Social Proof: Avatars of verified local guides */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                      alt="Local Guide"
                    />
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Trekking Expert"
                    />
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                      alt="Cultural Guide"
                    />
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Mountain Guide"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      {"★".repeat(5)} <span className="text-slate-900 dark:text-white font-black ml-1">5.0</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Join 50+ verified guides across Nepal
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Core Guiding Benefits */}
              <div className="space-y-3.5">
                {[
                  "0% Platform Commission on direct WhatsApp/email inquiries",
                  "Verified Guide Badge with official license recognition",
                  "Direct inquiries from high-budget digital nomads & long-stayers",
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
                    Join as a Local Expert
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Fast initial sign-up. Complete remaining details & photos from your dashboard.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-sm font-medium animate-in fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleQuickJoin} className="space-y-5">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pasang Nuru Sherpa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        WhatsApp / Mobile (Optional)
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

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Password (min. 6 characters) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Location & Specialty Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Base Location / City *
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                        Primary Specialty *
                      </label>
                      <select
                        value={primarySpecialty}
                        onChange={(e) => setPrimarySpecialty(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#023629] dark:focus:ring-[#FB923C] text-sm transition-all"
                      >
                        {PRIMARY_SPECIALTIES.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms acceptance note */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-slate-800 dark:hover:text-slate-200">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-slate-800 dark:hover:text-slate-200">
                      Privacy Policy
                    </Link>
                    . You can customize all your profile photos, bios, and licenses in your dashboard.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Account & Opening Dashboard...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account & Open Dashboard</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {/* Sign In Alternative */}
                  <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Already registered as a guide?{" "}
                      <Link
                        href="/auth/signin?callbackUrl=/local-guides/dashboard"
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Sign in to Dashboard →
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
