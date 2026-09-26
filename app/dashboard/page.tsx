"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { RefreshCw } from "lucide-react"

export default function SmartRoleDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard")
      return
    }

    if (status === "authenticated" && session?.user?.email) {
      // Fetch role status to redirect to exact role-tailored dashboard
      fetch(`/api/auth/me?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.role === "ADMIN") {
            router.replace("/admin")
          } else if (data.isOwner || data.role === "OWNER") {
            router.replace("/owner/dashboard")
          } else if (data.isGuide || data.role === "GUIDE") {
            router.replace("/guides/dashboard")
          } else {
            router.replace("/nomad/bookings")
          }
        })
        .catch(() => {
          router.replace("/nomad/bookings")
        })
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/30 flex items-center justify-center text-[#FFD400] mb-6 animate-pulse">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Loading Your Role Dashboard...
        </h1>
        <p className="text-gray-400 text-sm max-w-sm">
          Directing you to your customized portal based on your account role.
        </p>
      </main>

      <Footer />
    </div>
  )
}
