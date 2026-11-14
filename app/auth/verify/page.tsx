"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError("No verification token was provided in the link.")
      return
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()
        if (res.ok && data.success) {
          setSuccess(true)
        } else {
          setError(data.error || "Verification failed. The token may be expired or invalid.")
        }
      } catch (err: any) {
        setError("Network error occurred during verification. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [token])

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-card border border-border/80 rounded-2xl shadow-xl p-8 sm:p-10 text-center">
      {loading && (
        <div className="py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-[#023629] dark:text-[#FB923C] animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Verifying your email...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we validate your credentials.</p>
        </div>
      )}

      {!loading && success && (
        <div className="py-6 space-y-6">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">Email Verified!</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your partner account is now fully verified. You have full access to manage your listings and profile.
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <Link
              href="/local-guides/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#023629] hover:bg-[#023629]/90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <span>Go to Guide Dashboard</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/owner/dashboard"
              className="w-full inline-flex items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground py-2 transition-colors"
            >
              Or open Space Owner Dashboard →
            </Link>
          </div>
        </div>
      )}

      {!loading && !success && (
        <div className="py-6 space-y-6">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
            <XCircle size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">Verification Failed</h2>
            <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed font-medium">
              {error}
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <Link
              href="/auth/signin"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#023629] hover:bg-[#023629]/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/60 dark:bg-background pt-32 pb-24 px-4 flex items-center justify-center">
        <Suspense fallback={
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
