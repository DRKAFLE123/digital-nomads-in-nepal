"use client"
import { useState } from "react"
import { Info, X } from "lucide-react"

export default function AffiliateDisclaimer() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-card border border-border border-l-4 border-l-primary p-4 text-sm text-muted-foreground flex items-start sm:items-center gap-3 relative mb-8 rounded-r-lg shadow-sm">
      <Info className="text-primary flex-shrink-0 mt-0.5 sm:mt-0" size={20} />
      <p className="flex-grow leading-relaxed pr-6">
        <strong className="text-foreground">Disclosure:</strong> This post contains affiliate links. If you buy something through these links, we may earn a small commission at no extra cost to you. This helps support our community.
      </p>
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute right-3 top-3 sm:top-1/2 sm:-translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss disclaimer"
      >
        <X size={18} />
      </button>
    </div>
  )
}
