/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  ArrowUpDown,
  RotateCcw,
  Grid,
  Map,
  PlusCircle,
  ShieldCheck,
  Building,
} from "lucide-react";
import WorkspaceCard, { Hub } from "@/components/coworking/WorkspaceCard";
import CityDiscoveryChips from "@/components/coworking/CityDiscoveryChips";
import FilterDrawer from "@/components/coworking/FilterDrawer";
import WorkspaceMapSplit from "@/components/coworking/WorkspaceMapSplit";

const CATEGORY_TABS = [
  { id: "All", label: "All Spaces" },
  { id: "hot_desk", label: "Hot Desks" },
  { id: "dedicated_desk", label: "Dedicated Desks" },
  { id: "private_office", label: "Private Offices" },
  { id: "meeting_hall", label: "Meeting Rooms" },
  { id: "coliving", label: "🛌 Coliving (Live & Work)" },
  { id: "virtual_office", label: "Virtual Offices" },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Recommended" },
  { id: "highest_rated", label: "Highest Rated" },
  { id: "lowest_price", label: "Lowest Price" },
  { id: "highest_speed", label: "Highest Internet Speed" },
  { id: "most_reviewed", label: "Most Reviewed" },
  { id: "newest", label: "Newest" },
  { id: "most_booked", label: "Most Booked" },
];

export default function CoworkingMarketplacePage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sort, setSort] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "split">("grid");

  const loadHubs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCity !== "All Cities") params.append("city", selectedCity);
      if (category !== "All") params.append("category", category);
      if (selectedFacilities.length > 0) params.append("facility", selectedFacilities.join(","));
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);

      const res = await fetch(`/api/work-hubs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setHubs(data);
      }
    } catch (err) {
      console.error("Failed to load work hubs:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, category, selectedFacilities, search, sort]);

  useEffect(() => {
    loadHubs();
  }, [loadHubs]);

  function toggleFacility(f: string) {
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function handleClearFilters() {
    setSearch("");
    setCategory("All");
    setSelectedCity("All Cities");
    setSelectedFacilities([]);
    setSort("rating");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pt-24 pb-24 font-sans selection:bg-amber-400 selection:text-black">
        {/* HERO SECTION */}
        <section className="relative w-full bg-[#080808] border-b border-[#1f1f1f] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#242424_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-5">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Building size={14} />
              COWORKING & WORKHUB MARKETPLACE
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Work from anywhere in Nepal.
            </h1>
            <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-medium">
              Vetted Coworking Spaces & Desks. Find reliable coworking spaces, private offices and work-friendly spaces with verified Wi-Fi, power backup and nomad-friendly amenities.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#marketplace"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FFD400] hover:bg-[#FFE033] text-black font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-amber-400/15 text-center active:scale-95"
              >
                Explore Workspaces ↓
              </a>
              <Link
                href="/resources/coworking/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#141414] hover:bg-[#1c1c1c] border border-[#2e2e2e] text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <PlusCircle size={16} className="text-amber-400" />
                Register Your Space
              </Link>
            </div>
          </div>
        </section>

        {/* MARKETPLACE MAIN SECTION */}
        <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
          {/* LONG-TERM COLIVING BANNER */}
          <div className="bg-gradient-to-r from-[#171407] via-[#1F1A0A] to-[#171407] border border-[#FFD400]/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#FFD400_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD400]/15 border border-[#FFD400]/30 flex items-center justify-center text-2xl shrink-0">
                🛌
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  ✓ Room + Workspace Packages
                </div>
                <h3 className="text-lg font-black text-white">Looking for Long-Term Accommodation + Workspace?</h3>
                <p className="text-xs text-[#A1A1AA] max-w-2xl font-medium">
                  Staying 7 to 30+ days in Mustang, Pokhara, or Kathmandu? Explore verified Coliving stays, Work-Hostels, and Nomad Suites with dedicated desks, backup power & Starlink Wi-Fi.
                </p>
              </div>
            </div>
            <Link
              href="/stay"
              className="w-full md:w-auto px-6 py-3 bg-[#FFD400] hover:bg-[#FFE033] text-black font-extrabold text-xs rounded-2xl transition-all whitespace-nowrap shadow-lg shadow-amber-400/20 text-center shrink-0 active:scale-95 flex items-center justify-center gap-2"
            >
              Browse Work & Stay Options ➔
            </Link>
          </div>

          {/* CATEGORIES BAR */}
          <div className="flex items-center justify-between border-b border-[#1f1f1f] overflow-x-auto scrollbar-none pb-2">
            <div className="flex items-center gap-2">
              {CATEGORY_TABS.map((tab) => {
                const active = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategory(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      active
                        ? "bg-[#FFD400] text-black border-[#FFD400] shadow-md"
                        : "bg-[#0F0F0F] border-[#242424] text-[#A1A1AA] hover:border-gray-600 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop View Mode Toggle */}
            <div className="hidden lg:flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#242424]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === "grid" ? "bg-[#FFD400] text-black" : "text-[#71717A] hover:text-white"
                }`}
                title="3-Column Grid View"
              >
                <Grid size={15} /> Grid
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === "split" ? "bg-[#FFD400] text-black" : "text-[#71717A] hover:text-white"
                }`}
                title="Split Map View"
              >
                <Map size={15} /> Map Split
              </button>
            </div>
          </div>

          {/* SEARCH & FILTERS CONTAINER */}
          <div className="bg-[#0F0F0F] border border-[#242424] rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            {/* Search Input & Sort Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A] w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search space name, city, area, address, or amenities..."
                  className="w-full bg-[#141414] border border-[#242424] rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400]/40 transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none">
                  <ArrowUpDown size={14} />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-[#141414] border border-[#242424] rounded-2xl pl-10 pr-8 py-3.5 text-xs sm:text-sm text-[#F5F5F5] focus:outline-none focus:border-[#FFD400] cursor-pointer appearance-none"
                >
                  {SORT_OPTIONS.map((so) => (
                    <option key={so.id} value={so.id}>
                      {so.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Work-Friendly Amenity Filters Drawer/Chips */}
            <FilterDrawer
              selectedFacilities={selectedFacilities}
              onToggleFacility={toggleFacility}
              onClearAll={handleClearFilters}
            />

            {/* City Discovery Selector Chips */}
            <CityDiscoveryChips
              selectedCity={selectedCity}
              onSelectCity={(cityId) => setSelectedCity(cityId)}
              totalResults={hubs.length}
            />
          </div>

          {/* WORKSPACE CARDS GRID OR SPLIT VIEW */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[460px] bg-[#121212] border border-[#242424] rounded-3xl p-5 space-y-4 animate-pulse"
                >
                  <div className="h-48 bg-[#1a1a1a] rounded-2xl" />
                  <div className="h-6 w-3/4 bg-[#1a1a1a] rounded" />
                  <div className="h-4 w-1/2 bg-[#1a1a1a] rounded" />
                  <div className="h-10 bg-[#1a1a1a] rounded-xl" />
                  <div className="h-10 bg-[#1a1a1a] rounded-xl" />
                </div>
              ))}
            </div>
          ) : hubs.length === 0 ? (
            <div className="bg-[#0F0F0F] border border-[#242424] rounded-3xl p-12 text-center space-y-4 my-8">
              <Building size={48} className="mx-auto text-[#71717A]" />
              <h3 className="text-xl font-bold text-white">No workspaces found</h3>
              <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
                No verified workspace listings matched your query or filters in {selectedCity}. Try selecting another city or clearing your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-[#FFD400] text-black font-extrabold text-xs rounded-xl hover:bg-[#FFE033] transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-400/20"
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            </div>
          ) : viewMode === "split" ? (
            /* DESKTOP MAP SPLIT VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 40% Workspace Cards List */}
              <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-2">
                {hubs.map((hub) => (
                  <WorkspaceCard key={hub.id} hub={hub} />
                ))}
              </div>
              {/* Right 60% Map View */}
              <div className="lg:col-span-7">
                <WorkspaceMapSplit hubs={hubs} selectedCity={selectedCity} />
              </div>
            </div>
          ) : (
            /* 3-COLUMN DESKTOP GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hubs.map((hub) => (
                <WorkspaceCard key={hub.id} hub={hub} />
              ))}
            </div>
          )}

          {/* VERIFICATION PROOF BANNER */}
          <div className="bg-gradient-to-r from-[#121212] via-[#161616] to-[#121212] border border-[#242424] rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Digital Nomads in Nepal Verified Standard</h3>
                <p className="text-xs text-[#A1A1AA] mt-1 max-w-xl">
                  Every workspace with the <strong className="text-emerald-400">✓ Himalayan Verified</strong> badge undergo speed tests, generator load tests, and physical address checks.
                </p>
              </div>
            </div>
            <Link
              href="/resources/coworking/register"
              className="px-6 py-3 bg-[#FFD400] text-black font-extrabold text-xs rounded-xl hover:bg-[#FFE033] transition-all whitespace-nowrap shadow-md shadow-amber-400/20"
            >
              Get Your Space Verified →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
