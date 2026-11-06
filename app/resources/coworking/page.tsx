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
  const [offeringType, setOfferingType] = useState<"all" | "work" | "stay" | "work_and_stay">("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sort, setSort] = useState("lowest_price");
  const [viewMode, setViewMode] = useState<"grid" | "split">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL search params if navigated via /workspaces?type=stay etc.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("type") || new URLSearchParams(window.location.search).get("offeringType");
      if (q === "work" || q === "stay" || q === "work_and_stay") {
        setOfferingType(q);
      }
    }
  }, []);

  const loadHubs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (offeringType !== "all") params.append("offeringType", offeringType);
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
  }, [offeringType, selectedCity, category, selectedFacilities, search, sort]);

  useEffect(() => {
    loadHubs();
  }, [loadHubs]);

  function toggleFacility(f: string) {
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function handleClearFilters() {
    setOfferingType("all");
    setSearch("");
    setCategory("All");
    setSelectedCity("All Cities");
    setSelectedFacilities([]);
    setSort("lowest_price");
  }

  const activeFilterCount =
    (offeringType !== "all" ? 1 : 0) +
    (category !== "All" ? 1 : 0) +
    (selectedCity !== "All Cities" ? 1 : 0) +
    selectedFacilities.length +
    (search ? 1 : 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FBF9F5] dark:bg-[#0A0A0B] text-gray-900 dark:text-[#F5F5F5] pt-20 pb-20 font-sans selection:bg-[#C2410C] selection:text-white">
        {/* HERO SECTION (Compact & Clean) */}
        <section className="relative w-full bg-white dark:bg-[#080808] border-b border-[#E8E2D8] dark:border-[#1f1f1f] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#E8E2D8_1px,transparent_1px)] dark:bg-[radial-gradient(#242424_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C2410C]/10 border border-[#C2410C]/25 text-[#C2410C] dark:text-[#FB923C] text-xs font-black uppercase tracking-widest">
              <Building size={13} />
              COWORKING &amp; WORKHUB MARKETPLACE
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white max-w-3xl mx-auto leading-tight">
              Work from anywhere in Nepal.
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-medium">
              Vetted workspaces &amp; coliving hubs with verified fiber Wi-Fi, battery backups and nomad communities.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#marketplace"
                className="px-5 py-2 bg-[#C2410C] hover:bg-[#9A3412] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#C2410C]/20 text-center active:scale-95"
              >
                Browse Workspaces ↓
              </a>
              <Link
                href="/resources/coworking/register"
                className="px-5 py-2 bg-white dark:bg-[#141416] hover:bg-gray-50 dark:hover:bg-[#1c1c1f] border border-[#E8E2D8] dark:border-[#2e2e32] text-gray-800 dark:text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 text-center shadow-xs"
              >
                <PlusCircle size={15} className="text-[#C2410C] dark:text-[#FB923C]" />
                Register Your Space
              </Link>
            </div>
          </div>
        </section>

        {/* MARKETPLACE MAIN SECTION (E-Commerce Style Layout) */}
        <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
          {/* SEARCH & FILTERS BOX: Search Bar on TOP, Filter Buttons BELOW in small letters */}
          <div className="bg-white dark:bg-[#0F0F11] border border-[#E8E2D8] dark:border-[#242428] rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
            {/* 0. MARKETPLACE MODE SWITCHER (All Spaces | Work | Stay | Work + Stay) */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F5F2EB] dark:bg-[#161618] rounded-xl border border-[#E8E2D8] dark:border-[#26262A] overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setOfferingType("all")}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  offeringType === "all"
                    ? "bg-white dark:bg-[#202024] text-gray-900 dark:text-white shadow-xs border border-black/5 dark:border-white/10 font-extrabold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>✨</span>
                <span>All Spaces</span>
              </button>
              <button
                type="button"
                onClick={() => setOfferingType("work")}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  offeringType === "work"
                    ? "bg-[#1B4332] text-white shadow-sm font-extrabold"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#1B4332] dark:hover:text-white"
                }`}
              >
                <span>💻</span>
                <span>Work</span>
              </button>
              <button
                type="button"
                onClick={() => setOfferingType("stay")}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  offeringType === "stay"
                    ? "bg-sky-700 text-white shadow-sm font-extrabold"
                    : "text-gray-600 dark:text-gray-400 hover:text-sky-700 dark:hover:text-white"
                }`}
              >
                <span>🛌</span>
                <span>Stay</span>
              </button>
              <button
                type="button"
                onClick={() => setOfferingType("work_and_stay")}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  offeringType === "work_and_stay"
                    ? "bg-[#C2410C] text-white shadow-sm font-extrabold"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#C2410C] dark:hover:text-white"
                }`}
              >
                <span>⚡</span>
                <span>Work + Stay</span>
              </button>
            </div>

            {/* 1. Full-Width Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#71717A] w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search space name, city, area, address, or amenities..."
                className="w-full bg-[#FBF9F5] dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] hover:border-gray-400 dark:hover:border-[#38383E] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]/40 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-[#F5F5F5] placeholder-gray-500 dark:placeholder-[#71717A] focus:outline-none transition-all shadow-inner"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
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
                  className="lg:hidden flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#F8F6F0] hover:bg-gray-100 dark:bg-[#161618] dark:hover:bg-[#202024] border border-[#E8E2D8] dark:border-[#28282D] hover:border-[#C2410C]/60 rounded-xl text-xs font-semibold text-gray-800 dark:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                  aria-label="Open Filters Drawer"
                >
                  <SlidersHorizontal size={13} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />
                  <span className="truncate lowercase">filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-[#C2410C] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* City Dropdown */}
                <div className="group/city relative w-full sm:w-44 md:w-48">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C2410C] dark:text-[#FB923C] pointer-events-none transition-transform duration-200 group-hover/city:scale-110">
                    <MapPin size={12} />
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Filter workspaces by city"
                    className="w-full bg-[#F8F6F0] dark:bg-[#161618] border border-[#E8E2D8] dark:border-[#28282D] hover:border-[#C2410C] hover:bg-[#C2410C]/5 dark:hover:bg-[#1f1917] hover:text-[#C2410C] dark:hover:text-[#FB923C] rounded-xl pl-7 pr-6 py-2 text-xs font-semibold text-gray-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] cursor-pointer appearance-none transition-all duration-200 truncate shadow-xs"
                  >
                    {NEPAL_CITIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-white dark:bg-[#141416] text-gray-900 dark:text-white">
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover/city:text-[#C2410C] dark:group-hover/city:text-[#FB923C] group-hover/city:translate-y-[-40%] pointer-events-none transition-all duration-200">
                    <ChevronDown size={12} />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="group/sort relative w-full sm:w-44 md:w-48">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover/sort:text-[#C2410C] dark:group-hover/sort:text-[#FB923C] pointer-events-none transition-colors duration-200">
                    <ArrowUpDown size={12} />
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort Workspaces"
                    className="w-full bg-[#F8F6F0] dark:bg-[#161618] border border-[#E8E2D8] dark:border-[#28282D] hover:border-[#C2410C] hover:bg-[#C2410C]/5 dark:hover:bg-[#1f1917] hover:text-[#C2410C] dark:hover:text-[#FB923C] rounded-xl pl-7 pr-6 py-2 text-xs font-semibold text-gray-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] cursor-pointer appearance-none transition-all duration-200 truncate shadow-xs"
                  >
                    {SORT_OPTIONS.map((so) => (
                      <option key={so.id} value={so.id} className="bg-white dark:bg-[#141416] text-gray-900 dark:text-white">
                        {so.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover/sort:text-[#C2410C] dark:group-hover/sort:text-[#FB923C] group-hover/sort:translate-y-[-40%] pointer-events-none transition-all duration-200">
                    <ChevronDown size={12} />
                  </div>
                </div>
              </div>

              {/* Quick Keywords Chips (Right side on desktop, scroll row on mobile) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5 sm:pt-0">
                <span className="text-[10px] font-bold text-gray-400 dark:text-[#71717A] uppercase tracking-wide shrink-0 mr-0.5 hidden md:inline">
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
                          ? "bg-[#C2410C] text-white border-[#C2410C] font-bold shadow-xs -translate-y-0.5"
                          : "bg-[#F8F6F0] dark:bg-[#141416] border-[#E8E2D8] dark:border-[#26262A] text-gray-600 dark:text-[#A1A1AA] hover:border-[#C2410C] hover:text-[#C2410C] dark:hover:text-[#FB923C] hover:bg-[#C2410C]/5 hover:-translate-y-0.5 shadow-xs"
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
            <div className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain bg-white dark:bg-[#0F0F11] border border-[#E8E2D8] dark:border-[#242428] rounded-3xl p-5 shadow-sm custom-scrollbar">
              <WorkspaceSidebarFilter
                offeringType={offeringType}
                onSelectOfferingType={setOfferingType}
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                    {hubs.length} {hubs.length === 1 ? "Space" : "Spaces"} Available
                  </span>
                  {offeringType !== "all" && (
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full text-white ${
                        offeringType === "work_and_stay"
                          ? "bg-[#C2410C]"
                          : offeringType === "stay"
                          ? "bg-sky-700"
                          : "bg-[#1B4332]"
                      }`}
                    >
                      {offeringType === "work_and_stay"
                        ? "⚡ Work + Stay"
                        : offeringType === "stay"
                        ? "🛌 Stay"
                        : "💻 Work"}
                    </span>
                  )}
                  {selectedCity !== "All Cities" && (
                    <span className="text-xs text-[#C2410C] dark:text-[#FB923C] font-bold">
                      in {selectedCity}
                    </span>
                  )}
                  {category !== "All" && (
                    <span className="text-[11px] text-gray-600 dark:text-[#A1A1AA] bg-[#F8F6F0] dark:bg-[#1a1a1c] px-2 py-0.5 rounded-full border border-[#E8E2D8] dark:border-[#26262A]">
                      {CATEGORY_OPTIONS.find((c) => c.id === category)?.label}
                    </span>
                  )}
                </div>

                {/* Grid vs Map Toggle */}
                <div className="flex items-center gap-1 bg-white dark:bg-[#121214] p-1 rounded-xl border border-[#E8E2D8] dark:border-[#26262A] shadow-xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#C2410C] text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-900 dark:text-[#71717A] dark:hover:text-white"
                    }`}
                    title="Grid View"
                  >
                    <Grid size={13} /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode("split")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      viewMode === "split"
                        ? "bg-[#C2410C] text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-900 dark:text-[#71717A] dark:hover:text-white"
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
                      className="h-[440px] bg-white dark:bg-[#121214] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-5 space-y-4 animate-pulse shadow-xs"
                    >
                      <div className="h-44 bg-gray-100 dark:bg-[#1a1a1c] rounded-2xl" />
                      <div className="h-6 w-3/4 bg-gray-100 dark:bg-[#1a1a1c] rounded" />
                      <div className="h-4 w-1/2 bg-gray-100 dark:bg-[#1a1a1c] rounded" />
                      <div className="h-10 bg-gray-100 dark:bg-[#1a1a1c] rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : hubs.length === 0 ? (
                <div className="bg-white dark:bg-[#0F0F11] border border-[#E8E2D8] dark:border-[#242428] rounded-3xl p-10 text-center space-y-4 my-4 shadow-sm">
                  <Building size={42} className="mx-auto text-gray-400 dark:text-[#71717A]" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">No workspaces found</h3>
                  <p className="text-xs text-gray-500 dark:text-[#A1A1AA] max-w-md mx-auto">
                    No verified workspace listings matched your active filters in {selectedCity}. Try adjusting search terms or resetting filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 bg-[#C2410C] text-white font-extrabold text-xs rounded-xl hover:bg-[#9A3412] transition-all inline-flex items-center gap-1.5 shadow-md shadow-[#C2410C]/20 cursor-pointer"
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
          <div className="bg-white dark:bg-[#121214] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm mt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Digital Nomads in Nepal Verified Standard</h3>
                <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mt-1 max-w-xl">
                  Every workspace with the <strong className="text-emerald-700 dark:text-emerald-400">✓ Himalayan Verified</strong> badge undergoes live speed tests, generator load tests, and physical address checks.
                </p>
              </div>
            </div>
            <Link
              href="/resources/coworking/register"
              className="px-5 py-2.5 bg-[#C2410C] text-white font-extrabold text-xs rounded-xl hover:bg-[#9A3412] transition-all whitespace-nowrap shadow-md shadow-[#C2410C]/20"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-In Drawer from Left */}
            <div className="relative w-4/5 max-w-xs sm:max-w-sm h-full bg-white dark:bg-[#0F0F11] border-r border-[#E8E2D8] dark:border-[#242428] shadow-2xl z-10 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-left duration-200">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8] dark:border-[#242428] mb-3">
                <span className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[#C2410C] dark:text-[#FB923C]" /> Filter Workspaces
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  aria-label="Close Filter Drawer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sidebar Filters Inside Mobile Drawer */}
              <WorkspaceSidebarFilter
                offeringType={offeringType}
                onSelectOfferingType={(type) => {
                  setOfferingType(type);
                  setMobileFilterOpen(false);
                }}
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
