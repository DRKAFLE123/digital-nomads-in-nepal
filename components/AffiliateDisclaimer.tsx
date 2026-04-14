"use client"
import { useState } from "react"
import { Info, X } from "lucide-react"

export default function AffiliateDisclaimer() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-[#141414] border border-[#222222] border-l-4 border-l-[#FFD700] p-4 text-sm text-[#A0A0A0] flex items-start sm:items-center gap-3 relative mb-8 rounded-r-lg">
      <Info className="text-[#FFD700] flex-shrink-0 mt-0.5 sm:mt-0" size={20} />
      <p className="flex-grow leading-relaxed pr-6">
        <strong className="text-white">Disclosure:</strong> This post contains affiliate links. If you buy something through these links, we may earn a small commission at no extra cost to you. This helps support our community.
      </p>
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute right-3 top-3 sm:top-1/2 sm:-translate-y-1/2 text-[#A0A0A0] hover:text-white transition-colors"
        aria-label="Dismiss disclaimer"
      >
        <X size={18} />
      </button>
    </div>
  )
}
