"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Building, X, MessageSquare, UserPlus } from "lucide-react"
import { useSession } from "next-auth/react"

export default function StickyCommunityCTA() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isDismissed) return

    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (!isVisible || isDismissed || !mounted) return null

  return createPortal(
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] inset-x-3.5 max-w-[340px] mx-auto z-[90] md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between gap-1 p-1 bg-slate-950/92 dark:bg-[#101012]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-[0_16px_40px_-6px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
        {/* Find a Space Primary Action Button */}
        <Link
          href="/workspaces"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-extrabold py-2 px-3 rounded-full text-[12.5px] shadow-sm shadow-[#C2410C]/25 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <Building size={13.5} className="shrink-0" />
          <span>Find a space</span>
        </Link>

        {/* Sign up / Community Secondary Action Button */}
        <Link
          href={session ? "/community" : "/auth/signin"}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-bold py-2 px-3 rounded-full text-[12.5px] border border-white/15 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          {session ? (
            <>
              <MessageSquare size={13.5} className="text-[#FB923C] shrink-0" />
              <span>Community</span>
            </>
          ) : (
            <>
              <UserPlus size={13.5} className="text-[#FB923C] shrink-0" />
              <span>Sign up</span>
            </>
          )}
        </Link>

        {/* Discreet Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-0.5 cursor-pointer"
          aria-label="Dismiss action bar"
          title="Dismiss"
        >
          <X size={13.5} />
        </button>
      </div>
    </div>,
    document.body
  )
}
