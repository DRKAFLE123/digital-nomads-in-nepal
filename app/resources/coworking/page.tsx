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
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  X,
  Zap,
} from "lucide-react";
import WorkspaceCard, { Hub } from "@/components/coworking/WorkspaceCard";
import WorkspaceSidebarFilter, {
  CATEGORY_OPTIONS,
} from "@/components/coworking/WorkspaceSidebarFilter";
import { NEPAL_CITIES } from "@/components/coworking/CityDiscoveryChips";
import WorkspaceMapSplit from "@/components/coworking/WorkspaceMapSplit";

const SORT_OPTIONS = [
  { id: "lowest_price", label: "price: low to high" },
  { id: "highest_price", label: "price: high to low" },
  { id: "rating", label: "recommended" },
  { id: "highest_rated", label: "highest rated" },
  { id: "highest_speed", label: "speed: fast to slow" },
  { id: "most_reviewed", label: "most reviewed" },
  { id: "newest", label: "newest added" },
];

const QUICK_SEARCH_TAGS = [
  "Pokhara",
  "Kathmandu",
  "Lalitpur",
  "Mustang",
  "24/7",
  "Coliving",
  "Starlink",
  "Quiet Focus",
  "Hot Desks",
  "Private Offices",
];

export default function CoworkingMarketplacePage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sort, setSort] = useState("lowest_price");
  const [viewMode, setViewMode] = useState<"grid" | "split">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const loadHubs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCity !== "All Cities") params.append("city", selectedCity);
      if (category !== "All") params.append("category", category);
      if (selectedFacilities.length > 0)
        params.append("facility", selectedFacilities.join(","));
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
    setSort("lowest_price");
  }

  const activeFilterCount =
    (category !== "All" ? 1 : 0) +
    (selectedCity !== "All Cities" ? 1 : 0) +
    selectedFacilities.length +
    (search ? 1 : 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pt-20 pb-20 font-sans selection:bg-amber-400 selection:text-black">
        {/* HERO SECTION (Compact & Clean) */}
        <section className="relative w-full bg-[#080808] border-b border-[#1f1f1f] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#242424_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Building size={13} />
              COWORKING &amp; WORKHUB MARKETPLACE
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Work from anywhere in Nepal.
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-medium">
              Vetted workspaces &amp; coliving hubs with verified fiber Wi-Fi, battery backups and nomad communities.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#marketplace"
                className="px-5 py-2 bg-[#FFD400] hover:bg-[#FFE033] text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-400/15 text-center active:scale-95"
              >
                Browse Workspaces ↓
              </a>
              <Link
                href="/resources/coworking/register"
                className="px-5 py-2 bg-[#141414] hover:bg-[#1c1c1c] border border-[#2e2e2e] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <PlusCircle size={15} className="text-amber-400" />
                Register Your Space
              </Link>
            </div>
          </div>
        </section>

        {/* MARKETPLACE MAIN SECTION (E-Commerce Style Layout) */}
        <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
          {/* SEARCH & FILTERS BOX: Search Bar on TOP, Filter Buttons BELOW in small letters */}
          <div className="bg-[#0F0F0F] border border-[#242424] rounded-2xl p-3 sm:p-4 shadow-lg space-y-2.5">
            {/* 1. TOP: Full-Width Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search space name, city, area, address, or amenities..."
                className="w-full bg-[#141414] border border-[#242424] hover:border-[#383838] focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400]/40 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-all shadow-inner"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71717A] hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 2. BELOW: Filter Buttons Row (Filters, City, Sort) - Small Letters & Premium Mobile Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
              {/* Button Controls Grid (3 equal columns on mobile) */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#161616] hover:bg-[#202020] border border-[#282828] hover:border-[#FFD400]/60 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                  aria-label="Open Filters Drawer"
                >
                  <SlidersHorizontal size={13} className="text-[#FFD400] shrink-0" />
                  <span className="truncate lowercase">filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-[#FFD400] text-black text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* City Dropdown */}
                <div className="group/city relative w-full sm:w-44 md:w-48">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#FFD400] pointer-events-none transition-transform duration-200 group-hover/city:scale-110">
                    <MapPin size={12} />
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Filter workspaces by city"
                    className="w-full bg-[#161616] border border-[#282828] hover:border-[#FFD400] hover:bg-[#1c1809] hover:text-[#FFD400] hover:shadow-[0_0_15px_rgba(255,212,0,0.18)] rounded-xl pl-7 pr-6 py-2 text-xs font-semibold text-[#F5F5F5] focus:outline-none focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400] cursor-pointer appearance-none transition-all duration-200 truncate shadow-xs"
                  >
                    {NEPAL_CITIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#141414] text-white">
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71717A] group-hover/city:text-[#FFD400] group-hover/city:translate-y-[-40%] pointer-events-none transition-all duration-200">
                    <ChevronDown size={12} />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="group/sort relative w-full sm:w-44 md:w-48">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71717A] group-hover/sort:text-[#FFD400] pointer-events-none transition-colors duration-200">
                    <ArrowUpDown size={12} />
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort Workspaces"
                    className="w-full bg-[#161616] border border-[#282828] hover:border-[#FFD400] hover:bg-[#1c1809] hover:text-[#FFD400] hover:shadow-[0_0_15px_rgba(255,212,0,0.18)] rounded-xl pl-7 pr-6 py-2 text-xs font-semibold text-[#F5F5F5] focus:outline-none focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400] cursor-pointer appearance-none transition-all duration-200 truncate shadow-xs"
                  >
                    {SORT_OPTIONS.map((so) => (
                      <option key={so.id} value={so.id} className="bg-[#141414] text-white">
                        {so.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71717A] group-hover/sort:text-[#FFD400] group-hover/sort:translate-y-[-40%] pointer-events-none transition-all duration-200">
                    <ChevronDown size={12} />
                  </div>
                </div>
              </div>

              {/* Quick Keywords Chips (Right side on desktop, scroll row on mobile) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5 sm:pt-0">
                <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wide shrink-0 mr-0.5 hidden md:inline">
                  Quick:
                </span>
                {["Pokhara", "Kathmandu", "24/7 Access", "Coliving", "Starlink", "Quiet Space"].map((kw) => {
                  const isActive =
                    search.toLowerCase() === kw.toLowerCase() ||
                    (kw === "Coliving" && category === "coliving") ||
                    (kw === "24/7 Access" && selectedFacilities.includes("24/7 Access")) ||
                    (kw === "Starlink" && selectedFacilities.includes("High-Speed Fiber")) ||
                    (kw === "Quiet Space" && selectedFacilities.includes("Quiet Space"))

                  return (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        if (kw === "Coliving") {
                          setCategory(category === "coliving" ? "All" : "coliving")
                        } else if (kw === "24/7 Access") {
                          toggleFacility("24/7 Access")
                        } else if (kw === "Quiet Space") {
                          toggleFacility("Quiet Space")
                        } else if (kw === "Starlink") {
                          toggleFacility("High-Speed Fiber")
                        } else {
                          setSearch(search.toLowerCase() === kw.toLowerCase() ? "" : kw)
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#FFD400] text-black border-[#FFD400] font-bold shadow-xs -translate-y-0.5"
                          : "bg-[#141414] border-[#262626] text-[#A1A1AA] hover:border-[#FFD400] hover:text-[#FFD400] hover:bg-[#1c1809] hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(255,212,0,0.15)]"
                      }`}
                    >
                      <span>{kw}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN E-COMMERCE LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: DESKTOP STICKY FILTER SIDEBAR (Width: 3/12 cols) */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain bg-[#0F0F0F] border border-[#242424] rounded-3xl p-5 shadow-xl custom-scrollbar">
              <WorkspaceSidebarFilter
                category={category}
                onSelectCategory={setCategory}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                selectedFacilities={selectedFacilities}
                onToggleFacility={toggleFacility}
                onClearAll={handleClearFilters}
                totalCount={hubs.length}
              />
            </div>

            {/* RIGHT COLUMN: WORKSPACE RESULTS & GRID (Width: 9/12 cols) */}
            <div className="col-span-1 lg:col-span-9 space-y-4">
              {/* Results Meta Bar: Counts & View Switcher */}
              <div className="flex items-center justify-between pb-1 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-white">
                    {hubs.length} {hubs.length === 1 ? "Space" : "Spaces"} Available
                  </span>
                  {selectedCity !== "All Cities" && (
                    <span className="text-xs text-[#FFD400] font-bold">
                      in {selectedCity}
                    </span>
                  )}
                  {category !== "All" && (
                    <span className="text-[11px] text-[#A1A1AA] bg-[#1a1a1a] px-2 py-0.5 rounded-full border border-[#242424]">
                      {CATEGORY_OPTIONS.find((c) => c.id === category)?.label}
                    </span>
                  )}
                </div>

                {/* Grid vs Map Toggle */}
                <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#242424]">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#FFD400] text-black shadow-xs"
                        : "text-[#71717A] hover:text-white"
                    }`}
                    title="Grid View"
                  >
                    <Grid size={13} /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode("split")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      viewMode === "split"
                        ? "bg-[#FFD400] text-black shadow-xs"
                        : "text-[#71717A] hover:text-white"
                    }`}
                    title="Split Map View"
                  >
                    <Map size={13} /> Map
                  </button>
                </div>
              </div>

              {/* Workspaces List Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-[440px] bg-[#121212] border border-[#242424] rounded-3xl p-5 space-y-4 animate-pulse"
                    >
                      <div className="h-44 bg-[#1a1a1a] rounded-2xl" />
                      <div className="h-6 w-3/4 bg-[#1a1a1a] rounded" />
                      <div className="h-4 w-1/2 bg-[#1a1a1a] rounded" />
                      <div className="h-10 bg-[#1a1a1a] rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : hubs.length === 0 ? (
                <div className="bg-[#0F0F0F] border border-[#242424] rounded-3xl p-10 text-center space-y-4 my-4">
                  <Building size={42} className="mx-auto text-[#71717A]" />
                  <h3 className="text-lg font-bold text-white">No workspaces found</h3>
                  <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
                    No verified workspace listings matched your active filters in {selectedCity}. Try adjusting search terms or resetting filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 bg-[#FFD400] text-black font-extrabold text-xs rounded-xl hover:bg-[#FFE033] transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer"
                  >
                    <RotateCcw size={13} /> Reset All Filters
                  </button>
                </div>
              ) : viewMode === "split" ? (
                /* Map Split View */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1 scrollbar-none">
                    {hubs.map((hub) => (
                      <WorkspaceCard key={hub.id} hub={hub} />
                    ))}
                  </div>
                  <div className="lg:col-span-7">
                    <WorkspaceMapSplit hubs={hubs} selectedCity={selectedCity} />
                  </div>
                </div>
              ) : (
                /* Standard 3-Column Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {hubs.map((hub) => (
                    <WorkspaceCard key={hub.id} hub={hub} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* VERIFICATION PROOF BANNER */}
          <div className="bg-gradient-to-r from-[#121212] via-[#161616] to-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Digital Nomads in Nepal Verified Standard</h3>
                <p className="text-xs text-[#A1A1AA] mt-1 max-w-xl">
                  Every workspace with the <strong className="text-emerald-400">✓ Himalayan Verified</strong> badge undergoes live speed tests, generator load tests, and physical address checks.
                </p>
              </div>
            </div>
            <Link
              href="/resources/coworking/register"
              className="px-5 py-2.5 bg-[#FFD400] text-black font-extrabold text-xs rounded-xl hover:bg-[#FFE033] transition-all whitespace-nowrap shadow-md shadow-amber-400/20"
            >
              Get Your Space Verified →
            </Link>
          </div>
        </section>

        {/* MOBILE LEFT SLIDER DRAWER MODAL */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-In Drawer from Left */}
            <div className="relative w-4/5 max-w-xs sm:max-w-sm h-full bg-[#0F0F0F] border-r border-[#242424] shadow-2xl z-10 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-left duration-200">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-3">
                <span className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[#FFD400]" /> Filter Workspaces
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white cursor-pointer"
                  aria-label="Close Filter Drawer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sidebar Filters Inside Mobile Drawer */}
              <WorkspaceSidebarFilter
                category={category}
                onSelectCategory={setCategory}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                selectedFacilities={selectedFacilities}
                onToggleFacility={toggleFacility}
                onClearAll={handleClearFilters}
                totalCount={hubs.length}
                isMobileDrawer={true}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
