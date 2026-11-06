"use client"

import React from "react"
import Link from "next/link"
import { Building2, Compass, ArrowRight, Sparkles } from "lucide-react"

interface TopPartnerRibbonProps {
  isScrolled?: boolean
}

export default function TopPartnerRibbon({ isScrolled = false }: TopPartnerRibbonProps) {
  return (
    <div
      className={`w-full bg-[#17251E] dark:bg-[#111A15] border-b border-[#23382D] text-[#F5F5F0] backdrop-blur-sm z-50 transition-all duration-300 ${
        isScrolled ? "h-0 opacity-0 pointer-events-none -translate-y-full overflow-hidden" : "h-8 sm:h-9 opacity-100 translate-y-0"
      }`}
      aria-label="Host and Partner Announcement"
    >
      <div className="w-full h-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] sm:text-xs">
        
        {/* Left: Indicator & Hook */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[#F5F5F0] min-w-0 truncate">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="hidden md:inline font-medium text-[#F5F5F0] truncate">
            Host a workspace, coliving stay, or guide nomads in Nepal?
          </span>
          <span className="md:hidden font-semibold text-[#F5F5F0] truncate">
            Hosts &amp; Guides:
          </span>
        </div>

        {/* Right: Partner Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/register/space"
            className="inline-flex items-center gap-1.5 font-semibold text-[#F5F5F0] hover:text-white transition-colors py-0.5 px-1.5 sm:px-2 rounded-md hover:bg-white/10 active:scale-95 text-[10.5px] sm:text-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-[#C58B55]" />
            <span>List Space</span>
            <span className="hidden lg:inline text-[10px] text-white/60 font-normal">(Stay / Work)</span>
          </Link>

          <span className="text-white/30 select-none">•</span>

          <Link
            href="/local-guides/register"
            className="inline-flex items-center gap-1.5 font-semibold text-[#D6A06A] hover:text-[#E5B483] transition-colors py-0.5 px-1.5 sm:px-2 rounded-md hover:bg-white/10 active:scale-95 text-[10.5px] sm:text-xs"
          >
            <Compass className="w-3.5 h-3.5 text-[#D6A06A]" />
            <span>Join as Guide</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
