"use client"

import React from "react"
import { Filter, X, RotateCcw, Check, SlidersHorizontal, MapPin, Building, DollarSign, Wifi, Zap } from "lucide-react"

export const CATEGORY_OPTIONS = [
  { id: "All", label: "All Spaces" },
  { id: "hot_desk", label: "Hot Desks" },
  { id: "dedicated_desk", label: "Dedicated Desks" },
  { id: "private_office", label: "Private Offices" },
  { id: "meeting_hall", label: "Meeting Rooms" },
  { id: "coliving", label: "Coliving & Work" },
  { id: "virtual_office", label: "Virtual Offices" },
]

export const POPULAR_AMENITIES = [
  { id: "24/7 Access", label: "24/7 Access", icon: Zap },
  { id: "High-Speed Fiber", label: "High-Speed Fiber", icon: Wifi },
  { id: "100+ Mbps", label: "100+ Mbps Speed" },
  { id: "Backup Generator", label: "Generator Backup" },
  { id: "Solar", label: "Solar / Inverter" },
  { id: "Ergonomic Chairs", label: "Ergonomic Chairs" },
  { id: "Quiet Space", label: "Quiet Focus Room" },
  { id: "Phone Booths", label: "Phone Booths" },
  { id: "Coffee & Tea", label: "Free Coffee & Tea" },
  { id: "Meeting Rooms", label: "Meeting Rooms" },
  { id: "Air Conditioning", label: "Air Conditioning" },
  { id: "Long-Term Friendly", label: "Long-Term Friendly" },
]

export const SIDEBAR_CITIES = [
  { id: "All Cities", label: "All Nepal Cities", count: 52 },
  { id: "Kathmandu", label: "Kathmandu", count: 21 },
  { id: "Pokhara", label: "Pokhara", count: 9 },
  { id: "Lalitpur", label: "Lalitpur (Jhamsikhel)", count: 7 },
  { id: "Mustang", label: "Mustang (Starlink)", count: 2 },
  { id: "Bhaktapur", label: "Bhaktapur", count: 4 },
  { id: "Butwal", label: "Butwal", count: 2 },
  { id: "Chitwan", label: "Chitwan", count: 1 },
]

interface WorkspaceSidebarFilterProps {
  category: string
  onSelectCategory: (cat: string) => void
  selectedCity: string
  onSelectCity: (city: string) => void
  selectedFacilities: string[]
  onToggleFacility: (facility: string) => void
  onClearAll: () => void
  totalCount?: number
  isMobileDrawer?: boolean
  onCloseMobile?: () => void
}

export default function WorkspaceSidebarFilter({
  category,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  selectedFacilities,
  onToggleFacility,
  onClearAll,
  totalCount,
  isMobileDrawer = false,
  onCloseMobile,
}: WorkspaceSidebarFilterProps) {
  const hasActiveFilters =
    category !== "All" ||
    selectedCity !== "All Cities" ||
    selectedFacilities.length > 0

  return (
    <aside className="w-full flex flex-col space-y-5 text-sm">
      {/* Header / Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#FFD400]" />
          <span className="font-extrabold uppercase tracking-wider text-xs text-white">
            Filters
          </span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-bold text-[#FFD400] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={10} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Category / Space Type (E-commerce Radio List) */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Building size={12} className="text-[#FFD400]" /> Space Type
        </span>
        <div className="space-y-1">
          {CATEGORY_OPTIONS.map((opt) => {
            const isSelected = category === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectCategory(opt.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#FFD400] text-black font-extrabold shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-[#161616]"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={13} className="stroke-[3]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Destination / City */}
      <div className="space-y-2.5 pt-2 border-t border-[#242424]">
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <MapPin size={12} className="text-[#FFD400]" /> Location &amp; City
        </span>
        <div className="space-y-1">
          {SIDEBAR_CITIES.map((c) => {
            const isSelected = selectedCity === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCity(c.id)}
                className={`group/city w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left cursor-pointer border ${
                  isSelected
                    ? "bg-[#FFD400] text-black border-[#FFD400] font-extrabold shadow-sm"
                    : "text-gray-300 border-transparent hover:text-[#FFD400] hover:bg-[#1c1809] hover:border-[#FFD400]/60 hover:translate-x-1.5 hover:shadow-[0_0_12px_rgba(255,212,0,0.12)]"
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <MapPin
                    size={11}
                    className={`shrink-0 transition-transform duration-200 ${
                      isSelected
                        ? "text-black"
                        : "text-[#71717A] group-hover/city:text-[#FFD400] group-hover/city:scale-110"
                    }`}
                  />
                  <span>{c.label}</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 transition-colors duration-200 ${
                    isSelected
                      ? "bg-black/20 text-black font-bold"
                      : "text-[#71717A] bg-[#1a1a1a] group-hover/city:text-[#FFD400] group-hover/city:bg-[#FFD400]/15"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Amenities Checkbox List */}
      <div className="space-y-2.5 pt-2 border-t border-[#242424]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Zap size={12} className="text-[#FFD400]" /> Key Amenities
          </span>
          {selectedFacilities.length > 0 && (
            <span className="text-[10px] text-[#FFD400] font-bold">
              {selectedFacilities.length} selected
            </span>
          )}
        </div>
        <div className="space-y-1.5 pr-1">
          {POPULAR_AMENITIES.map((amenity) => {
            const isChecked = selectedFacilities.includes(amenity.id)
            return (
              <label
                key={amenity.id}
                onClick={() => onToggleFacility(amenity.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs cursor-pointer select-none transition-all ${
                  isChecked
                    ? "bg-[#FFD400]/10 border border-[#FFD400]/40 text-white font-bold shadow-xs"
                    : "hover:bg-[#161616] hover:border-[#282828] text-gray-300 border border-transparent hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      isChecked
                        ? "bg-[#FFD400] border-[#FFD400] text-black"
                        : "border-[#3a3a3a] bg-[#141414]"
                    }`}
                  >
                    {isChecked && <Check size={11} className="stroke-[3]" />}
                  </div>
                  <span>{amenity.label}</span>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Coliving / Stay Shortcut Promotion Card */}
      <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1c1809] to-[#121212] border border-[#FFD400]/30 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD400]">
            🛌 Work + Coliving
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FFD400] text-black font-bold">
            Live &amp; Work
          </span>
        </div>
        <p className="text-[11px] text-gray-300 leading-snug">
          Looking for rooms with ergonomic desks &amp; Starlink?
        </p>
        <button
          type="button"
          onClick={() => onSelectCategory("coliving")}
          className="w-full mt-1 py-1.5 rounded-lg bg-[#FFD400] hover:bg-[#FFE033] text-black font-extrabold text-[11px] transition-all text-center block cursor-pointer"
        >
          Filter Coliving Workhubs →
        </button>
      </div>

      {/* Mobile Drawer Footer Actions */}
      {isMobileDrawer && (
        <div className="sticky bottom-0 pt-4 pb-2 bg-[#0F0F0F] border-t border-[#242424] flex items-center gap-2 mt-auto">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex-1 py-3 bg-[#1a1a1a] hover:bg-[#252525] text-white font-bold text-xs rounded-xl transition-all text-center"
            >
              Reset All
            </button>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 py-3 bg-[#FFD400] hover:bg-[#FFE033] text-black font-black text-xs rounded-xl transition-all shadow-md text-center"
          >
            Apply Filters ({totalCount !== undefined ? totalCount : "Spaces"})
          </button>
        </div>
      )}
    </aside>
  )
}
