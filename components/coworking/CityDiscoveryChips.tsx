"use client"

import React from "react"
import { MapPin, ChevronDown } from "lucide-react"

export const NEPAL_CITIES = [
  { id: "All Cities", name: "All Nepal Cities", count: 52, popular: true },
  { id: "Kathmandu", name: "Kathmandu", count: 21, popular: true, desc: "Capital hub & coworking epicenter" },
  { id: "Pokhara", name: "Pokhara", count: 9, popular: true, desc: "Lakeside remote work paradise" },
  { id: "Lalitpur", name: "Lalitpur", count: 7, popular: true, desc: "Jhamsikhel cafe & artisan hubs" },
  { id: "Bhaktapur", name: "Bhaktapur", count: 4, popular: true, desc: "Heritage Newari town" },
  { id: "Butwal", name: "Butwal", count: 2, popular: false, desc: "Lumbini province commercial & transit hub" },
  { id: "Nepalgunj", name: "Nepalgunj", count: 2, popular: false, desc: "Western regional gateway hub" },
  { id: "Mustang", name: "Mustang", count: 2, popular: false, desc: "High Himalayan Starlink mountain coliving" },
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
    <div className="space-y-4">
      {/* Header Line with City Dropdown Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424] pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <MapPin size={18} className="text-[#FFD400]" />
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {selectedCity === "All Cities" ? (
              "Coworking Spaces in Nepal"
            ) : (
              <>Coworking Spaces in <span className="text-[#FFD400]">{selectedCity}</span></>
            )}
          </h2>
          <span className="bg-[#141414] border border-[#242424] text-[#A1A1AA] font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
            {totalResults !== undefined ? totalResults : currentCityObj.count} spaces available
          </span>
        </div>

        {/* City Select Dropdown Filter */}
        <div className="relative min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD400] pointer-events-none">
            <MapPin size={14} />
          </div>
          <select
            value={selectedCity}
            aria-label="Filter workspaces by city"
            onChange={(e) => onSelectCity(e.target.value)}
            className="w-full bg-[#141414] border border-[#242424] hover:border-[#FFD400]/50 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FFD400] cursor-pointer appearance-none transition-all shadow-sm"
          >
            {NEPAL_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#141414] text-white">
                {c.name} ({c.count} spaces)
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Popular City Filter Pills (Flex Wrap - No horizontal scrollbar!) */}
      <div className="flex items-center flex-wrap gap-2 pt-1">
        <span className="text-[11px] font-extrabold text-[#71717A] uppercase tracking-wider mr-1">
          Popular Cities:
        </span>
        {NEPAL_CITIES.map((c) => {
          const isSelected = selectedCity === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCity(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? "bg-[#FFD400] text-black border-[#FFD400] shadow-md shadow-[#FFD400]/20 scale-[1.02]"
                  : "bg-[#141414] border-[#242424] text-[#A1A1AA] hover:border-[#FFD400]/40 hover:text-white"
              }`}
            >
              <span>{c.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
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

