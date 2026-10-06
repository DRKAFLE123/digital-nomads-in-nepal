"use client"

import React, { useState } from "react"
import { Filter, X, Check, SlidersHorizontal, RotateCcw } from "lucide-react"

export const ALL_AMENITY_FILTERS = [
  "High-Speed Fiber",
  "50+ Mbps",
  "100+ Mbps",
  "200+ Mbps",
  "500+ Mbps",
  "Backup Generator",
  "Inverter",
  "UPS",
  "Solar",
  "Ergonomic Chairs",
  "Coffee & Tea",
  "Phone Booths",
  "Meeting Rooms",
  "Standing Desks",
  "24/7 Access",
  "Quiet Space",
  "Video Call Friendly",
  "Free Parking",
  "Air Conditioning",
  "Kitchen",
  "Printing",
  "Long-Term Friendly",
]

interface FilterDrawerProps {
  selectedFacilities: string[]
  onToggleFacility: (facility: string) => void
  onClearAll: () => void
}

export default function FilterDrawer({
  selectedFacilities,
  onToggleFacility,
  onClearAll,
}: FilterDrawerProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = selectedFacilities.filter(f => f !== "All Amenities").length

  return (
    <div>
      {/* Desktop Inline Compact Chips */}
      <div className="hidden lg:block space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <SlidersHorizontal size={12} className="text-amber-400" /> FILTER BY WORK-FRIENDLY AMENITIES
          </span>
          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              <RotateCcw size={11} /> Clear filters ({activeCount})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_AMENITY_FILTERS.slice(0, 12).map((item) => {
            const isSelected = selectedFacilities.includes(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => onToggleFacility(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-amber-400 text-black border-amber-400 font-bold shadow-sm"
                    : "bg-[#141414] border-[#262626] text-gray-300 hover:border-gray-500 hover:text-white"
                }`}
              >
                {isSelected && <Check size={11} className="inline-block mr-1 stroke-[3]" />}
                {item}
              </button>
            )
          })}
          
          <button
            onClick={() => setMobileOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e1e1e] border border-[#333] text-amber-400 hover:bg-[#252525] transition-all flex items-center gap-1"
          >
            + {ALL_AMENITY_FILTERS.length - 12} More Filters...
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Filter Button */}
      <div className="block lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-xs font-bold text-white hover:border-[#FFD400]/50 transition-all cursor-pointer"
        >
          <Filter size={13} className="text-[#FFD400]" />
          <span>Filter Amenities</span>
          {activeCount > 0 ? (
            <span className="bg-[#FFD400] text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {activeCount} active
            </span>
          ) : (
            <span className="text-[10px] text-[#71717A]">(All)</span>
          )}
        </button>
      </div>

      {/* Mobile Drawer / Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md bg-[#0F0F0F] border-l border-[#242424] h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#242424] pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Work-Friendly Amenities</h3>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#1a1a1a]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Filter List */}
              <div className="space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                  Select amenities to filter spaces:
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITY_FILTERS.map((item) => {
                    const isSelected = selectedFacilities.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => onToggleFacility(item)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? "bg-amber-400 text-black border-amber-400 shadow-md"
                            : "bg-[#161616] border-[#282828] text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        {isSelected && <Check size={12} className="inline-block mr-1 stroke-[3]" />}
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-6 border-t border-[#242424] flex items-center gap-3">
              <button
                onClick={() => {
                  onClearAll()
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-[#333] text-gray-300 font-bold text-xs hover:bg-[#1a1a1a] transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 text-black font-black text-xs hover:bg-yellow-300 transition-all shadow-md shadow-amber-400/20"
              >
                Apply Filters ({activeCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
