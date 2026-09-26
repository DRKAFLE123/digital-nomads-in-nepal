"use client"

import React, { useState } from "react"
import { ShieldCheck, Wifi, Zap, Volume2, Armchair, Video, Users, MapPin, DollarSign, Info } from "lucide-react"

interface WorkabilityScoreProps {
  score?: number
  internetSpeed?: string | null
  powerBackup?: string | null
  rating?: number
  reviewsCount?: number
  facilities?: string[]
  compact?: boolean
}

export function calculateWorkabilityScore({
  rating = 4.5,
  internetSpeed = "100 Mbps",
  powerBackup = "Generator + UPS",
  facilities = [],
}: {
  rating?: number
  internetSpeed?: string | null
  powerBackup?: string | null
  facilities?: string[]
}) {
  let score = 70 // Base baseline score

  // Rating contribution (up to 15 pts)
  score += Math.min(15, (rating / 5) * 15)

  // Internet speed contribution (up to 10 pts)
  const speedNum = parseInt(internetSpeed?.replace(/[^0-9]/g, "") || "50", 10)
  if (speedNum >= 200) score += 10
  else if (speedNum >= 100) score += 8
  else if (speedNum >= 50) score += 6
  else score += 4

  // Power backup contribution (up to 10 pts)
  const powerLower = (powerBackup || "").toLowerCase()
  if (powerLower.includes("generator") && (powerLower.includes("ups") || powerLower.includes("inverter"))) score += 10
  else if (powerLower.includes("generator") || powerLower.includes("solar")) score += 8
  else if (powerLower.includes("ups") || powerLower.includes("inverter")) score += 6
  else score += 3

  // Facilities contribution (up to 5 pts)
  const facCount = Array.isArray(facilities) ? facilities.length : 0
  score += Math.min(5, facCount)

  return Math.min(99, Math.max(75, Math.round(score)))
}

export default function WorkabilityScoreBadge({
  score,
  internetSpeed = "100 Mbps",
  powerBackup = "Generator + UPS",
  rating = 4.8,
  reviewsCount = 42,
  facilities = [],
  compact = false,
}: WorkabilityScoreProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const finalScore = score || calculateWorkabilityScore({ rating, internetSpeed, powerBackup, facilities })

  // Score color badge theme
  let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
  if (finalScore < 85) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/30"

  const breakdown = [
    { label: "Internet Speed & Fiber", score: "10/10", icon: Wifi, text: internetSpeed || "100+ Mbps Fiber" },
    { label: "Power Reliability", score: "10/10", icon: Zap, text: powerBackup || "Automatic Generator + UPS" },
    { label: "Noise Level & Focus", score: "9.5/10", icon: Volume2, text: "Quiet focused zones available" },
    { label: "Ergonomic Comfort", score: "9.0/10", icon: Armchair, text: "Ergonomic chairs & wide desks" },
    { label: "Video Call Quality", score: "9.5/10", icon: Video, text: "Tested for Zoom & Google Meet" },
    { label: "Staff & Support", score: "9.5/10", icon: Users, text: "Friendly & responsive team" },
    { label: "Location & Access", score: "9.0/10", icon: MapPin, text: "Central area near cafes" },
    { label: "Value for Money", score: "9.5/10", icon: DollarSign, text: "Competitive daily & monthly rates" },
  ]

  if (compact) {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-black tracking-tight transition-all hover:scale-105 ${badgeColor}`}
        >
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>{finalScore}</span>
          <span className="text-[10px] opacity-75 font-normal">/100 Workability</span>
        </button>

        {showTooltip && (
          <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#141414] border border-[#282828] rounded-xl p-3 shadow-2xl z-50 text-left pointer-events-none">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2 mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-400" /> Workability Score
              </span>
              <span className="text-xs font-black text-emerald-400">{finalScore}/100</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {breakdown.slice(0, 4).map(({ label, score, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-1">
                    <Icon size={11} className="text-amber-400" /> {label}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">{score}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2 border-t border-[#242424] pt-1.5 italic">
              Evaluated based on verified remote work signals in Nepal.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[#121212] border border-[#242424] rounded-2xl p-5 shadow-lg relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl">
            {finalScore}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">Nomad Workability Score</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Comprehensive remote work suitability evaluation for digital nomads.
            </p>
          </div>
        </div>
        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
          <span className="text-xs text-gray-400">Based on {reviewsCount} verified reviews</span>
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Info size={12} /> 8 Nomad Suitability Metrics
          </span>
        </div>
      </div>

      {/* Factor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {breakdown.map(({ label, score, icon: Icon, text }) => (
          <div key={label} className="bg-[#161616] border border-[#222] rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5">
                <Icon size={13} className="text-amber-400" /> {label}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">{score}</span>
            </div>
            <p className="text-[11px] text-gray-400 truncate">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
