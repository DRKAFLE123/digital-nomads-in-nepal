"use client"

import React from "react"
import { MapPin, Navigation, Compass } from "lucide-react"
import { Hub } from "./WorkspaceCard"

interface WorkspaceMapSplitProps {
  hubs: Hub[]
  selectedCity?: string
  onSelectHub?: (hub: Hub) => void
}

export default function WorkspaceMapSplit({
  hubs,
  selectedCity = "Kathmandu",
  onSelectHub,
}: WorkspaceMapSplitProps) {
  return (
    <div className="h-[750px] w-full bg-[#101010] border border-[#242424] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between p-6">
      {/* Map Background Placeholder Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Map Header Overlay */}
      <div className="relative z-10 flex items-center justify-between bg-black/80 backdrop-blur border border-[#282828] p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Navigation size={18} className="text-amber-400 animate-pulse" />
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Nepal Workspace Interactive Map</h4>
            <p className="text-[11px] text-gray-400">Showing {hubs.length} verified work hubs in {selectedCity}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full">
          Live GPS View
        </span>
      </div>

      {/* Simulated Map Markers Grid */}
      <div className="relative z-10 flex-1 my-6 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto pr-1">
        {hubs.map((hub, index) => (
          <button
            key={hub.id}
            onClick={() => onSelectHub && onSelectHub(hub)}
            className="group p-3 bg-[#161616]/90 border border-[#282828] hover:border-amber-400 rounded-xl text-left transition-all hover:scale-[1.02] shadow-lg backdrop-blur"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono">
                ${hub.priceMonthly || hub.priceDaily || 80}/mo
              </span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
              {hub.name}
            </p>
            <p className="text-[10px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-amber-400" /> {hub.address}
            </p>
          </button>
        ))}
      </div>

      {/* Map Footer Overlay */}
      <div className="relative z-10 bg-black/80 backdrop-blur border border-[#282828] p-3 rounded-2xl flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Compass size={13} className="text-amber-400" /> Click pins to highlight workspace cards
        </span>
        <span className="text-[11px] font-mono text-emerald-400 font-bold">100% Fiber & Generator Verified</span>
      </div>
    </div>
  )
}
