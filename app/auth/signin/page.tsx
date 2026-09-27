"use client"
import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Invalid email or password.")
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo & Brand Name */}
        <div className="text-center mb-8 sm:mb-10">
          <Link href="/" className="inline-flex items-center justify-center gap-3 sm:gap-3.5 group focus-visible:outline-none">
            <div className="relative w-[76px] sm:w-[88px] md:w-[96px] h-8 sm:h-9 md:h-10 overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105">
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
              <span className="font-black text-sm sm:text-base md:text-lg tracking-normal uppercase text-foreground leading-tight group-hover:text-primary transition-colors">
                DIGITAL NOMADS
              </span>
              <div className="w-full flex items-center justify-center gap-1.5 font-extrabold text-[9px] sm:text-[10px] text-primary tracking-[0.16em] uppercase leading-none mt-1 select-none text-center">
                <span className="text-primary/60 font-medium select-none">—</span>
                <span>IN NEPAL</span>
                <span className="text-primary/60 font-medium select-none">—</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">Sign in to your account</h1>
          <p className="text-muted text-xs sm:text-sm mb-6 sm:mb-8">Access your workspaces, guide profile &amp; community account.</p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg pl-4 pr-11 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
