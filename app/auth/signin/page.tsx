"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"

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

function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.73 1 .08 2.03-.48 2.65-1.23z" />
    </svg>
  )
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
        setError("Invalid email or password. If you are new, switch to 'Create an Account'.")
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
          // Automatically sign in upon registration
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
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0B0C] flex flex-col justify-center items-center px-4 py-16 transition-colors">
      <div className="w-full max-w-md">
        
        {/* Brand Logo & Editorial Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-3 group focus-visible:outline-none mb-3">
            <div className="relative w-20 sm:w-24 h-9 sm:h-10 overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/webisteofficiallogo-removebg-preview.png"
                alt="Digital Nomads in Nepal Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center select-none">
              <span className="font-black text-sm sm:text-base tracking-normal uppercase text-gray-900 dark:text-white leading-tight">
                DIGITAL NOMADS
              </span>
              <div className="w-full flex items-center justify-center gap-1.5 font-extrabold text-[9px] text-[#C2410C] dark:text-[#FB923C] tracking-[0.16em] uppercase leading-none mt-1 select-none text-center">
                <span className="opacity-60 font-medium select-none">—</span>
                <span>IN NEPAL</span>
                <span className="opacity-60 font-medium select-none">—</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
          
          {/* Header Title */}
          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-gray-900 dark:text-white mb-2 font-serif">
              Sign in or create an account
            </h1>
            <p className="text-xs sm:text-[13px] text-gray-500 dark:text-[#A8A8B0] leading-relaxed max-w-sm mx-auto">
              By continuing, including through our platform partners, you agree to our{" "}
              <Link href="/terms" className="text-[#C2410C] dark:text-[#FB923C] font-medium hover:underline">
                User Agreement
              </Link>{" "}
              (including{" "}
              <Link href="/terms#arbitration" className="text-[#C2410C] dark:text-[#FB923C] font-medium hover:underline">
                arbitration provisions
              </Link>
              ) and acknowledge our{" "}
              <Link href="/privacy" className="text-[#C2410C] dark:text-[#FB923C] font-medium hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Social Logins */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#E8E2D8] dark:border-[#26262A] rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-[#1A1A1D] hover:bg-[#FAF7F2] dark:hover:bg-[#222226] transition-colors shadow-2xs"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("apple")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#E8E2D8] dark:border-[#26262A] rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-[#1A1A1D] hover:bg-[#FAF7F2] dark:hover:bg-[#222226] transition-colors shadow-2xs"
            >
              <AppleIcon className="w-4 h-4 shrink-0" />
              <span>Continue with Apple</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#E8E2D8] dark:border-[#26262A] rounded-xl text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-[#1A1A1D] hover:bg-[#FAF7F2] dark:hover:bg-[#222226] transition-colors shadow-2xs"
            >
              <FacebookIcon className="w-4 h-4 shrink-0" />
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#E8E2D8] dark:border-[#26262A] w-full" />
            <span className="bg-white dark:bg-[#141416] px-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
              or continue with e-mail
            </span>
            <div className="border-t border-[#E8E2D8] dark:border-[#26262A] w-full" />
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] dark:bg-[#0B0B0C] border border-[#E8E2D8] dark:border-[#26262A] rounded-xl mb-5">
            <button
              type="button"
              onClick={() => {
                setMode("signin")
                setError("")
                setSuccess("")
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "register"
                  ? "bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {mode === "register" && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Maya Sharma"
                  className="w-full bg-[#FAF7F2] dark:bg-[#0B0B0C] border border-[#E8E2D8] dark:border-[#26262A] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#B45309] dark:focus:border-[#F5B301] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 block">
                E-mail address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[#FAF7F2] dark:bg-[#0B0B0C] border border-[#E8E2D8] dark:border-[#26262A] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] dark:focus:border-[#FB923C] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F2] dark:bg-[#0B0B0C] border border-[#E8E2D8] dark:border-[#26262A] rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] dark:focus:border-[#FB923C] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF7F2] dark:bg-[#0B0B0C] border border-[#E8E2D8] dark:border-[#26262A] rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] dark:focus:border-[#FB923C] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button (Solid Terracotta, White text passes AAA) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C2410C] hover:bg-[#9A3412] active:scale-[0.98] text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? "Processing..." : mode === "signin" ? "Continue with e-mail" : "Create Account & Continue"}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Footer toggle note */}
          <div className="mt-5 pt-4 border-t border-[#E8E2D8] dark:border-[#26262A] text-center">
            {mode === "signin" ? (
              <p className="text-xs text-gray-500 dark:text-[#A8A8B0]">
                New to Digital Nomads in Nepal?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register")
                    setError("")
                    setSuccess("")
                  }}
                  className="font-bold text-[#C2410C] dark:text-[#FB923C] hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-[#A8A8B0]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin")
                    setError("")
                    setSuccess("")
                  }}
                  className="font-bold text-[#C2410C] dark:text-[#FB923C] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
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
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0B0C] flex items-center justify-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Loading...</div>
        </div>
      }
    >
      <UnifiedAuthForm />
    </Suspense>
  )
}
