/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Mountain, ShieldCheck, Wifi, Users } from "lucide-react"

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function UnifiedAuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const initialMode = searchParams.get("mode") === "register" ? "register" : "signin"

  const [mode, setMode] = useState<"signin" | "register">(initialMode)

  // Sign In Form States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Registration Specific States
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSocialLogin(provider: string) {
    setError("")
    try {
      await signIn(provider, { callbackUrl })
    } catch {
      setError(`Unable to connect with ${provider}. Please continue with email.`)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (mode === "signin") {
      // Sign In Flow
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      setLoading(false)

      if (result?.error) {
        setError("Invalid email or password. If you are new, switch to 'Create Account'.")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } else {
      // Registration Flow
      if (password !== confirmPassword) {
        setError("Passwords do not match.")
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error ?? "Registration failed.")
          setLoading(false)
        } else {
          setSuccess("Account created successfully! Signing you in...")
          const signInRes = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })

          setLoading(false)

          if (signInRes?.ok) {
            router.push(callbackUrl)
            router.refresh()
          } else {
            setMode("signin")
            setSuccess("Account created! Please enter your password to sign in.")
          }
        }
      } catch {
        setError("Something went wrong. Please check your connection and try again.")
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#0B0B0C] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        
        {/* Brand Header for Mobile */}
        <div className="lg:hidden text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#023629] flex items-center justify-center text-white shadow-xs">
              <Mountain size={16} />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              Digital Nomads <span className="text-[#CD6003]">in Nepal</span>
            </span>
          </Link>
        </div>

        {/* Two-Column Card Container (GuideMeet Screenshot Benchmark) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero & Community Highlights (Visible on lg+) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
                <div className="w-9 h-9 rounded-xl bg-[#023629] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Mountain size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    Digital Nomads <span className="text-[#CD6003]">in Nepal</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Live • Work • Explore
                  </span>
                </div>
              </Link>

              <h1 className="text-3xl xl:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                Continue your journey and reconnect with <span className="text-blue-600">explorers</span>
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed max-w-md">
                Connect with licensed mountain guides, verified fiber workspaces, and fellow digital nomads to create meaningful travel & work experiences across Nepal.
              </p>
            </div>

            {/* Nomad Community Avatars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Nomad"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Guide"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Nomad"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                    alt="Host"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">1,200+ Remote Workers & Guides</p>
                  <p className="text-[11px] text-slate-500">Kathmandu • Pokhara • Bandipur • Everest</p>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>0% Commission Direct Guide Hiring</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                  <Wifi size={12} className="text-blue-600" />
                  <span>Verified 100+ Mbps Fiber Stays</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Compact Auth Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
              
              {/* Top Mode Switcher Pill */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin")
                    setError("")
                    setSuccess("")
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "signin"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register")
                    setError("")
                    setSuccess("")
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "register"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Header Title */}
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {mode === "signin" ? "Log in to Your Account" : "Create Your Account"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === "signin" 
                    ? "Enter your credentials to continue." 
                    : "Fill in your details to start exploring and managing."}
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-red-700 dark:text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-emerald-800 dark:text-emerald-400 text-xs flex items-start gap-2">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  INPUT BOXES IN UPPER SIDE (NO SCROLLING REQUIRED)
                 ───────────────────────────────────────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name (Registration only) */}
                {mode === "register" && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Maya Sharma"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                )}

                {/* Email Address (Upper Side) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Password (Upper Side) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {mode === "signin" && (
                      <Link
                        href="/auth/forgot-password"
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Enter your password"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Registration only) */}
                {mode === "register" && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Re-enter your password"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {loading 
                      ? "Processing..." 
                      : mode === "signin" 
                      ? "Log in" 
                      : "Create Account & Sign In"}
                  </span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-[#141416] px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  or
                </span>
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              </div>

              {/* Clean Google Social Login */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </button>

              {/* Quick Switch Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
                {mode === "signin" ? (
                  <p>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register")
                        setError("")
                        setSuccess("")
                      }}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin")
                        setError("")
                        setSuccess("")
                      }}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </p>
                )}
              </div>

              {/* Micro Legal Disclaimer */}
              <p className="text-[10px] text-slate-400 text-center mt-3 leading-tight">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-slate-600">Terms</Link> and{" "}
                <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loading...</div>
        </div>
      }
    >
      <UnifiedAuthForm />
    </Suspense>
  )
}
