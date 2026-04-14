"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, X } from "lucide-react"

export default function StickyCommunityCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (isDismissed) return

    const handleScroll = () => {
      // Show CTA only after scrolling down a bit
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 md:hidden bg-[#0B0B0B] border-t border-[#FFD700]/30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] p-4 transform transition-transform duration-300 translate-y-0">
      <div className="flex items-center justify-between gap-4">
        <Link 
          href="/community" 
          className="flex-grow flex items-center justify-center gap-2 bg-[#FFD700] text-black font-bold py-3 px-4 rounded-md text-sm active:scale-95 transition-transform"
        >
          <Users size={18} />
          Join 2,000+ Nepal Nomads &rarr;
        </Link>
        <button 
          onClick={() => setIsDismissed(true)} 
          className="text-[#A0A0A0] p-2"
          aria-label="Dismiss community CTA"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  )
}
