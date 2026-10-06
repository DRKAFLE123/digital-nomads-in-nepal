"use client"

import React from "react"
import { MapPin, ChevronDown } from "lucide-react"

export const NEPAL_CITIES = [
  { id: "All Cities", name: "All Nepal", count: 52, popular: true },
  { id: "Kathmandu", name: "Kathmandu", count: 21, popular: true, desc: "Capital hub & coworking epicenter" },
  { id: "Pokhara", name: "Pokhara", count: 9, popular: true, desc: "Lakeside remote work paradise" },
  { id: "Lalitpur", name: "Lalitpur", count: 7, popular: true, desc: "Jhamsikhel cafe & artisan hubs" },
  { id: "Mustang", name: "Mustang", count: 2, popular: true, desc: "High Himalayan Starlink mountain coliving" },
  { id: "Bhaktapur", name: "Bhaktapur", count: 4, popular: true, desc: "Heritage Newari town" },
  { id: "Butwal", name: "Butwal", count: 2, popular: false, desc: "Lumbini province commercial & transit hub" },
  { id: "Nepalgunj", name: "Nepalgunj", count: 2, popular: false, desc: "Western regional gateway hub" },
  { id: "Chitwan", name: "Chitwan", count: 1, popular: false, desc: "Jungle sanctuary & warm climate hub" },
  { id: "Birtamod", name: "Birtamod", count: 1, popular: false, desc: "Eastern Koshi Province commercial hub" },
  { id: "Dhangadhi", name: "Dhangadhi", count: 1, popular: false, desc: "Far-western regional tech center" },
  { id: "Janakpur", name: "Janakpur", count: 1, popular: false, desc: "Madhesh cultural center & work hub" },
  { id: "Mahendranagar", name: "Mahendranagar", count: 1, popular: false, desc: "Far-western border gateway hub" },
]

interface CityDiscoveryChipsProps {
  selectedCity: string
  onSelectCity: (cityId: string) => void
  totalResults?: number
}

export default function CityDiscoveryChips({
  selectedCity,
  onSelectCity,
  totalResults,
}: CityDiscoveryChipsProps) {
  const currentCityObj = NEPAL_CITIES.find(c => c.id === selectedCity) || NEPAL_CITIES[0]

  return (
    <div className="space-y-2.5">
      {/* Compact Header Line */}
      <div className="flex items-center justify-between gap-2.5 border-b border-[#242424] pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={16} className="text-[#FFD400] shrink-0" />
          <h2 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
            {selectedCity === "All Cities" ? (
              "Workspaces in Nepal"
            ) : (
              <>Spaces in <span className="text-[#FFD400]">{selectedCity}</span></>
            )}
          </h2>
          <span className="bg-[#141414] border border-[#242424] text-[#A1A1AA] font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
            {totalResults !== undefined ? totalResults : currentCityObj.count} spaces
          </span>
        </div>

        {/* City Select Dropdown Filter (Compact) */}
        <div className="relative min-w-[140px] sm:min-w-[190px] shrink-0">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#FFD400] pointer-events-none">
            <MapPin size={12} />
          </div>
          <select
            value={selectedCity}
            aria-label="Filter workspaces by city"
            onChange={(e) => onSelectCity(e.target.value)}
            className="w-full bg-[#141414] border border-[#242424] hover:border-[#FFD400] hover:bg-[#1c1809] hover:text-[#FFD400] hover:shadow-[0_0_12px_rgba(255,212,0,0.15)] rounded-xl pl-7 pr-7 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#FFD400] cursor-pointer appearance-none transition-all duration-200 shadow-xs"
          >
            {NEPAL_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#141414] text-white">
                {c.name} ({c.count})
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none">
            <ChevronDown size={12} />
          </div>
        </div>
      </div>

      {/* Single-Row Horizontal Scrollable City Pills (Saves massive vertical space on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        <span className="text-[10px] font-black text-[#71717A] uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Cities:
        </span>
        {NEPAL_CITIES.map((c) => {
          const isSelected = selectedCity === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCity(c.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 border whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#FFD400] text-black border-[#FFD400] shadow-sm font-extrabold -translate-y-0.5"
                  : "bg-[#141414] border-[#242424] text-[#A1A1AA] hover:border-[#FFD400] hover:text-[#FFD400] hover:bg-[#1c1809] hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(255,212,0,0.15)]"
              }`}
            >
              <span>{c.name}</span>
              <span
                className={`text-[9px] font-mono px-1 py-0.1 rounded ${
                  isSelected ? "bg-black/20 text-black font-extrabold" : "bg-[#1f1f1f] text-[#71717A]"
                }`}
              >
                {c.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
