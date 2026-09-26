"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Users, Building, X } from "lucide-react"

export default function StickyCommunityCTA() {
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
    <div className="fixed bottom-4 inset-x-3 max-w-[390px] mx-auto z-[90] md:hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center justify-between gap-1.5 p-1.5 bg-black/90 dark:bg-[#121212]/95 backdrop-blur-xl border border-white/15 dark:border-[#2C2C2C] rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.55)]">
        {/* Book Space Primary Action Button */}
        <Link
          href="/resources/coworking#book"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#FFD400] hover:bg-[#FFE033] text-black font-extrabold py-2.5 px-3 rounded-full text-xs shadow-md shadow-[#FFD400]/20 active:scale-95 transition-all whitespace-nowrap"
        >
          <Building size={14} className="shrink-0" />
          <span>Book Space</span>
        </Link>

        {/* Join Community Secondary Action Button */}
        <Link
          href="/community"
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 px-3 rounded-full text-xs border border-white/15 active:scale-95 transition-all whitespace-nowrap"
        >
          <Users size={14} className="text-[#FFD400] shrink-0" />
          <span>Join Nomads</span>
        </Link>

        {/* Discreet Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-0.5 cursor-pointer"
          aria-label="Dismiss action bar"
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </div>,
    document.body
  )
}
