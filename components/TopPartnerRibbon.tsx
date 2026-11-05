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
      className={`w-full bg-[#0A0A0A]/95 dark:bg-[#070707]/95 border-b border-white/10 dark:border-white/5 backdrop-blur-sm z-50 transition-all duration-300 ${
        isScrolled ? "h-0 opacity-0 pointer-events-none -translate-y-full overflow-hidden" : "h-8 sm:h-9 opacity-100 translate-y-0"
      }`}
      aria-label="Host and Partner Announcement"
    >
      <div className="w-full h-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] sm:text-xs">
        
        {/* Left: Indicator & Hook */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-300 min-w-0 truncate">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5B301] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5B301]"></span>
          </span>
          <span className="hidden md:inline font-medium text-zinc-300 truncate">
            Host a workspace, coliving stay, or guide nomads in Nepal?
          </span>
          <span className="md:hidden font-semibold text-zinc-200 truncate">
            Hosts &amp; Guides:
          </span>
        </div>

        {/* Right: Partner Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/register/space"
            className="inline-flex items-center gap-1 font-semibold text-[#FB923C] hover:text-[#FDBA74] transition-colors py-0.5 px-1.5 sm:px-2 rounded-md hover:bg-white/5 active:scale-95 text-[10.5px] sm:text-xs"
          >
            <Building2 className="w-3 h-3" />
            <span>List Space</span>
            <span className="hidden lg:inline text-[10px] text-zinc-400 font-normal">(Stay / Work)</span>
          </Link>

          <span className="text-zinc-600 select-none">•</span>

          <Link
            href="/local-guides/register"
            className="inline-flex items-center gap-1 font-semibold text-zinc-300 hover:text-white transition-colors py-0.5 px-1.5 sm:px-2 rounded-md hover:bg-white/5 active:scale-95 text-[10.5px] sm:text-xs"
          >
            <Compass className="w-3 h-3 text-[#FB923C]" />
            <span>Join as Guide</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
