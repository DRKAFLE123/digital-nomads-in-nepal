/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  MapPin,
  CheckCircle,
  Star,
  Sparkles,
  Building,
  Loader2,
  Clock,
  Layers,
  ArrowUpDown,
  Filter,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "All", label: "All Spaces" },
  { id: "hot_desk", label: "Hot Desks" },
  { id: "dedicated_desk", label: "Dedicated Desks" },
  { id: "private_office", label: "Private Rooms & Offices" },
  { id: "meeting_hall", label: "Meeting Halls" },
  { id: "24_7", label: "24/7 Access" },
];

const LOCATIONS = [
  "All Cities",
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bandipur",
  "Chitwan",
  "Mustang",
  "Lumbini",
];

const FACILITIES = [
  "All Amenities",
  "High-Speed Fiber",
  "Backup Generator",
  "Ergonomic Chairs",
  "Coffee & Tea",
  "Skype Booths",
  "Meeting Rooms",
  "Standing Desks",
  "24/7 Access",
  "Free Parking",
];

type Unit = {
  type: string;
  name: string;
  count: number;
  priceDaily?: number;
  priceMonthly?: number;
};

type Hub = {
  id: string;
  name: string;
  slug: string;
  city: string;
  description: string;
  address: string;
  spaceType?: string | null;
  openingHours?: string | null;
  units?: Unit[] | null;
  ownerEmail?: string | null;
  ownerName?: string | null;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isPartner: boolean;
  photoUrl: string | null;
  facilities: string[];
  priceDaily: number | null;
  priceMonthly: number | null;
};

export default function CoworkingMarketplacePage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All Cities");
  const [facility, setFacility] = useState("All Amenities");
  const [sort, setSort] = useState("rating");

  const loadHubs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city !== "All Cities") params.append("city", city);
      if (category !== "All") params.append("category", category);
      if (facility !== "All Amenities") params.append("facility", facility);
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);

      const res = await fetch(`/api/work-hubs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setHubs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [city, category, facility, search, sort]);

  useEffect(() => {
    loadHubs();
  }, [loadHubs]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Marketplace Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
            <div>
              <span className="text-primary text-xs font-black uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit mb-3">
                <Sparkles size={12} /> Coworking & WorkHub Marketplace
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
                Vetted Coworking Spaces & Desks
              </h1>
              <p className="text-muted text-base mt-2 max-w-3xl leading-relaxed">
                Compare hot desks, private executive rooms, and meeting halls across Nepal. Filter by fiber speed, generator resilience, and city location.
              </p>
            </div>
            <Link
              href="/resources/coworking/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFD700] hover:bg-white text-black font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-yellow-500/10 active:scale-95 whitespace-nowrap"
            >
              <Building size={16} /> Register Your Space
            </Link>
          </div>

          {/* E-Commerce Category Pills Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#1e1e1e]">
            {CATEGORY_TABS.map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategory(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    active
                      ? "bg-[#FFD700] text-black border-[#FFD700] shadow-md shadow-yellow-500/10"
                      : "bg-[#0d0d0d] border-[#222222] text-gray-400 hover:text-white hover:border-[#FFD700]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search, Location & Sorting Control Bar */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search space name, city, address, or amenities..."
                  className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              {/* City Filter */}
              <div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>
                      📍 {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-3.5 h-3.5" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full bg-black border border-[#222] rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Facility Filter Pills */}
            <div className="border-t border-[#1a1a1a] pt-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Filter size={12} className="text-primary" /> Filter by Vetted Amenities:
              </label>
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map((f) => {
                  const isActive = facility === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFacility(f)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isActive
                          ? "bg-primary text-black border-primary font-bold"
                          : "bg-black border-[#222] text-gray-400 hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Spaces Catalog Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : hubs.length === 0 ? (
            <div className="text-center py-24 bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl space-y-4">
              <Building className="w-12 h-12 text-muted mx-auto" />
              <h3 className="text-xl font-bold text-white">No Spaces Match Your Criteria</h3>
              <p className="text-muted text-sm max-w-md mx-auto">
                Try clearing your search query or selecting a different city or category.
              </p>
              <button
                onClick={() => {
                  setCategory("All");
                  setCity("All Cities");
                  setFacility("All Amenities");
                  setSearch("");
                }}
                className="px-6 py-2.5 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hubs.map((hub) => {
                const facs = Array.isArray(hub.facilities) ? (hub.facilities as string[]) : [];
                const units = Array.isArray(hub.units) ? (hub.units as Unit[]) : [];

                return (
                  <Link
                    key={hub.id}
                    href={`/resources/coworking/${hub.slug}`}
                    className="bg-[#0d0d0d] border border-[#1e1e1e] hover:border-primary/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Banner Image */}
                      <div className="h-56 bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                        {hub.photoUrl ? (
                          <img
                            src={hub.photoUrl}
                            alt={hub.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Building className="w-16 h-16 text-[#333]" />
                        )}

                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {hub.isPartner && (
                            <span className="flex items-center gap-1 bg-[#FFD700] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                              <Sparkles size={10} className="fill-black" /> System Partner
                            </span>
                          )}
                          {hub.isVerified && (
                            <span className="flex items-center gap-1 bg-green-500 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                              <CheckCircle size={10} className="fill-black" /> Vetted WorkHub
                            </span>
                          )}
                        </div>

                        {/* Price Badge */}
                        {(hub.priceMonthly || hub.priceDaily) && (
                          <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur border border-[#333] px-3 py-1.5 rounded-xl text-xs font-black text-[#FFD700] shadow-lg">
                            {hub.priceMonthly
                              ? `$${hub.priceMonthly}/mo`
                              : `$${hub.priceDaily}/day`}
                          </div>
                        )}
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-[#FFD700] font-bold uppercase tracking-wide">
                            <MapPin size={13} /> {hub.city}
                          </div>
                          {hub.openingHours && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                              <Clock size={11} className="text-gray-500" /> {hub.openingHours}
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                            {hub.name}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1 truncate">
                            📍 {hub.address}
                          </p>
                        </div>

                        <p className="text-muted text-xs leading-relaxed line-clamp-2">
                          {hub.description}
                        </p>

                        {/* Room & Unit Inventory Badges */}
                        {units.length > 0 && (
                          <div className="pt-2 border-t border-[#181818] space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                              <Layers size={10} /> Available Units & Inventory:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {units.map((unit, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-bold px-2 py-0.5 bg-[#161616] text-[#FFD700] border border-[#2a2a2a] rounded-md"
                                >
                                  {unit.count} {unit.name || unit.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Facility Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {facs.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[10px] font-semibold px-2 py-0.5 bg-white/5 text-gray-300 rounded border border-white/5"
                            >
                              {f}
                            </span>
                          ))}
                          {facs.length > 3 && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-white/5 text-gray-500 rounded border border-white/5">
                              +{facs.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Rating Strip */}
                    <div className="px-6 py-3.5 border-t border-[#1e1e1e] flex items-center justify-between bg-black/40 text-xs">
                      <div className="flex items-center gap-1 font-semibold text-white">
                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span>{hub.rating.toFixed(1)}</span>
                        <span className="text-gray-500 font-normal">
                          ({hub.totalReviews} reviews)
                        </span>
                      </div>
                      <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Book Space →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
