"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GuideDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/owner/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0B]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Opening Host & Guide Console...</p>
      </div>
    </div>
  )
}
