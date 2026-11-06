"use client"

import React from "react"
import { Filter, X, RotateCcw, Check, SlidersHorizontal, MapPin, Building, DollarSign, Wifi, Zap } from "lucide-react"

export const SPACE_TYPES_BY_OFFERING: Record<string, Array<{ id: string; label: string }>> = {
  all: [
    { id: "All", label: "All Space Types" },
    { id: "hot_desk", label: "Hot Desks" },
    { id: "dedicated_desk", label: "Dedicated Desks" },
    { id: "private_office", label: "Private Offices" },
    { id: "coliving", label: "Coliving & Work" },
    { id: "apartment", label: "Nomad Apartments" },
    { id: "hostel", label: "Hostels & Pods" },
    { id: "lodge", label: "Lodges & Homestays" },
  ],
  work: [
    { id: "All", label: "All Workspaces" },
    { id: "hot_desk", label: "Hot Desks" },
    { id: "dedicated_desk", label: "Dedicated Desks" },
    { id: "private_office", label: "Private Offices" },
    { id: "meeting_hall", label: "Meeting Rooms" },
    { id: "work_cafe", label: "Work-Friendly Cafes" },
  ],
  stay: [
    { id: "All", label: "All Nomad Stays" },
    { id: "apartment", label: "Nomad Apartments & Studios" },
    { id: "hostel", label: "Hostels & Nomad Pods" },
    { id: "lodge", label: "Guesthouses & Mountain Lodges" },
    { id: "hotel", label: "Boutique Nomad Hotels" },
    { id: "villa", label: "Homestays & Villas" },
  ],
  work_and_stay: [
    { id: "All", label: "All Work + Stay Packages" },
    { id: "coliving", label: "Coliving Communities" },
    { id: "room_desk", label: "Room + Dedicated Desk" },
    { id: "workation_hub", label: "Workation Retreats" },
    { id: "long_stay", label: "Monthly Live & Work" },
  ],
}

// Flattened list for label lookups and backward compatibility
export const CATEGORY_OPTIONS: Array<{ id: string; label: string }> = [
  ...SPACE_TYPES_BY_OFFERING.all,
  ...SPACE_TYPES_BY_OFFERING.work,
  ...SPACE_TYPES_BY_OFFERING.stay,
  ...SPACE_TYPES_BY_OFFERING.work_and_stay,
].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))

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

export const OFFERING_TYPES = [
  { id: "all", label: "All Spaces", icon: "✨" },
  { id: "work", label: "Work", sub: "Coworking & Desks", icon: "💻" },
  { id: "stay", label: "Stay", sub: "Nomad Living & Rooms", icon: "🛌" },
  { id: "work_and_stay", label: "Work + Stay", sub: "Coliving & Packages", icon: "⚡" },
] as const

interface WorkspaceSidebarFilterProps {
  offeringType?: "all" | "work" | "stay" | "work_and_stay"
  onSelectOfferingType?: (type: "all" | "work" | "stay" | "work_and_stay") => void
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
  offeringType = "all",
  onSelectOfferingType,
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
    offeringType !== "all" ||
    category !== "All" ||
    selectedCity !== "All Cities" ||
    selectedFacilities.length > 0

  const currentSpaceTypes =
    SPACE_TYPES_BY_OFFERING[offeringType] || SPACE_TYPES_BY_OFFERING.all

  const getSpaceTypeActiveClasses = () => {
    if (offeringType === "work_and_stay") {
      return "bg-[#C2410C] text-white border-[#C2410C] font-extrabold shadow-sm"
    }
    if (offeringType === "stay") {
      return "bg-sky-700 text-white border-sky-700 font-extrabold shadow-sm"
    }
    if (offeringType === "work") {
      return "bg-[#1B4332] text-white border-[#1B4332] font-extrabold shadow-sm"
    }
    return "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white font-extrabold shadow-sm"
  }

  return (
    <aside className="w-full flex flex-col space-y-5 text-sm">
      {/* Header / Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8] dark:border-[#242424]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#C2410C] dark:text-[#FB923C]" />
          <span className="font-extrabold uppercase tracking-wider text-xs text-gray-900 dark:text-white">
            Filters
          </span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-bold text-[#C2410C] dark:text-[#FB923C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={10} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 0. Primary Marketplace Mode (Work / Stay / Work + Stay) */}
      {onSelectOfferingType && (
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="text-[#1B4332] dark:text-[#8FB89A]">◈</span> Marketplace Mode
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {OFFERING_TYPES.map((opt) => {
              const isSelected = offeringType === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelectOfferingType(opt.id)
                    onSelectCategory("All")
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer border ${
                    isSelected
                      ? opt.id === "work_and_stay"
                        ? "bg-[#C2410C] text-white border-[#C2410C] font-extrabold shadow-sm"
                        : opt.id === "stay"
                        ? "bg-sky-700 text-white border-sky-700 font-extrabold shadow-sm"
                        : opt.id === "work"
                        ? "bg-[#1B4332] text-white border-[#1B4332] font-extrabold shadow-sm"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white font-extrabold shadow-sm"
                      : "bg-[#F8F6F0] dark:bg-[#161618] border-[#E8E2D8] dark:border-[#28282D] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  {isSelected && <Check size={13} className="stroke-[3]" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 1. Dynamic Space Type by Marketplace Mode */}
      <div className="space-y-2.5 pt-2 border-t border-[#E8E2D8] dark:border-[#242424]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Building size={12} className="text-[#C2410C] dark:text-[#FB923C]" />
            <span>
              {offeringType === "stay"
                ? "Stay Type"
                : offeringType === "work"
                ? "Workspace Type"
                : offeringType === "work_and_stay"
                ? "Package Type"
                : "Space Type"}
            </span>
          </span>
          {category !== "All" && (
            <button
              type="button"
              onClick={() => onSelectCategory("All")}
              className="text-[10px] font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {currentSpaceTypes.map((opt) => {
            const isSelected = category === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectCategory(opt.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer border ${
                  isSelected
                    ? getSpaceTypeActiveClasses()
                    : "bg-[#F8F6F0] dark:bg-[#161618] border-[#E8E2D8] dark:border-[#28282D] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400"
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
      <div className="space-y-2.5 pt-2 border-t border-[#E8E2D8] dark:border-[#242424]">
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <MapPin size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> Location &amp; City
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
                    ? "bg-[#C2410C] text-white border-[#C2410C] font-extrabold shadow-sm"
                    : "text-gray-700 dark:text-gray-300 border-transparent hover:text-[#C2410C] dark:hover:text-white hover:bg-[#C2410C]/5 dark:hover:bg-[#C2410C]/10 hover:border-[#C2410C]/30 hover:translate-x-1.5"
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <MapPin
                    size={11}
                    className={`shrink-0 transition-transform duration-200 ${
                      isSelected
                        ? "text-white"
                        : "text-gray-400 dark:text-[#71717A] group-hover/city:text-[#C2410C] dark:group-hover/city:text-[#FB923C] group-hover/city:scale-110"
                    }`}
                  />
                  <span>{c.label}</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 transition-colors duration-200 ${
                    isSelected
                      ? "bg-white/20 text-white font-bold"
                      : "text-gray-500 dark:text-[#71717A] bg-gray-100 dark:bg-[#1a1a1a] group-hover/city:text-[#C2410C] dark:group-hover/city:text-white group-hover/city:bg-[#C2410C]/10"
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
      <div className="space-y-2.5 pt-2 border-t border-[#E8E2D8] dark:border-[#242424]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Zap size={12} className="text-[#C2410C] dark:text-[#FB923C]" /> Key Amenities
          </span>
          {selectedFacilities.length > 0 && (
            <span className="text-[10px] text-[#C2410C] dark:text-[#FB923C] font-bold">
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
                    ? "bg-[#C2410C]/10 border border-[#C2410C]/40 text-gray-900 dark:text-white font-bold shadow-xs"
                    : "hover:bg-gray-100 dark:hover:bg-[#161616] text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-[#282828] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      isChecked
                        ? "bg-[#C2410C] border-[#C2410C] text-white"
                        : "border-gray-300 dark:border-[#3a3a3a] bg-white dark:bg-[#141414]"
                    }`}
                  >
                    {isChecked && <Check size={11} className="stroke-[3] text-white" />}
                  </div>
                  <span>{amenity.label}</span>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Coliving / Stay Shortcut Promotion Card */}
      <div className="p-3 rounded-2xl bg-[#FBF9F5] dark:bg-gradient-to-br dark:from-[#1c1809] dark:to-[#121212] border border-[#E8E2D8] dark:border-[#C2410C]/30 text-xs space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C]">
            🛌 Work + Coliving
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C2410C] text-white font-bold">
            Live &amp; Work
          </span>
        </div>
        <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
          Looking for rooms with ergonomic desks &amp; Starlink?
        </p>
        <button
          type="button"
          onClick={() => onSelectCategory("coliving")}
          className="w-full mt-1 py-1.5 rounded-lg bg-[#C2410C] hover:bg-[#9A3412] text-white font-extrabold text-[11px] transition-all text-center block cursor-pointer shadow-xs"
        >
          Filter Coliving Workhubs →
        </button>
      </div>

      {/* Mobile Drawer Footer Actions */}
      {isMobileDrawer && (
        <div className="sticky bottom-0 pt-4 pb-2 bg-white dark:bg-[#0F0F0F] border-t border-[#E8E2D8] dark:border-[#242424] flex items-center gap-2 mt-auto">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] text-gray-800 dark:text-white font-bold text-xs rounded-xl transition-all text-center"
            >
              Reset All
            </button>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 py-3 bg-[#C2410C] hover:bg-[#9A3412] text-white font-black text-xs rounded-xl transition-all shadow-md text-center"
          >
            Apply Filters ({totalCount !== undefined ? totalCount : "Spaces"})
          </button>
        </div>
      )}
    </aside>
  )
}
