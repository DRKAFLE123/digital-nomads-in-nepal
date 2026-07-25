/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Building,
  Mail,
  MapPin,
  Loader2,
  CheckCircle,
  User,
  Clock,
  LayoutGrid,
  Layers,
  Sparkles,
} from "lucide-react";

const LOCATIONS = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bandipur",
  "Chitwan",
  "Mustang",
  "Lumbini",
];

const SPACE_TYPES = [
  "Coworking & Hot Desk Hub",
  "Executive Private Office Hub",
  "Hybrid Work Cafe & Hub",
  "Creative Event & Workshop Space",
];

const FACILITIES_OPTIONS = [
  "High-Speed Fiber",
  "Backup Generator",
  "Ergonomic Chairs",
  "Coffee & Tea",
  "Skype Booths",
  "Meeting Rooms",
  "Standing Desks",
  "Phewa Lake View",
  "Outdoor Terrace",
  "Community Kitchen",
  "24/7 Access",
  "Free Parking",
];

export default function SpaceRegisterPage() {
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [spaceType, setSpaceType] = useState("Coworking & Hot Desk Hub");
  const [openingHours, setOpeningHours] = useState("24/7 Access");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Unit Inventory Counts & Rates
  const [hotDeskCount, setHotDeskCount] = useState("10");
  const [hotDeskPrice, setHotDeskPrice] = useState("80");

  const [dedicatedDeskCount, setDedicatedDeskCount] = useState("5");
  const [dedicatedDeskPrice, setDedicatedDeskPrice] = useState("120");

  const [privateRoomCount, setPrivateRoomCount] = useState("2");
  const [privateRoomPrice, setPrivateRoomPrice] = useState("350");

  const [meetingHallCount, setMeetingHallCount] = useState("1");
  const [meetingHallPrice, setMeetingHallPrice] = useState("15");

  const [facilities, setFacilities] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleFacility(f: string) {
    setFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const unitsPayload = [
      {
        type: "hot_desk",
        name: "Hot Desks / Flexi Seats",
        count: parseInt(hotDeskCount) || 0,
        priceMonthly: parseFloat(hotDeskPrice) || 0,
      },
      {
        type: "dedicated_desk",
        name: "Dedicated Fixed Desks",
        count: parseInt(dedicatedDeskCount) || 0,
        priceMonthly: parseFloat(dedicatedDeskPrice) || 0,
      },
      {
        type: "private_room",
        name: "Private Executive Offices / Rooms",
        count: parseInt(privateRoomCount) || 0,
        priceMonthly: parseFloat(privateRoomPrice) || 0,
      },
      {
        type: "meeting_hall",
        name: "Meeting Halls / Conference Rooms",
        count: parseInt(meetingHallCount) || 0,
        priceDaily: parseFloat(meetingHallPrice) || 0,
      },
    ];

    try {
      const res = await fetch("/api/work-hubs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          address,
          description,
          contactEmail,
          website: website || null,
          photoUrl: photoUrl || null,
          ownerEmail,
          ownerName,
          spaceType,
          openingHours,
          priceDaily: parseFloat(hotDeskPrice) ? (parseFloat(hotDeskPrice) / 20) : null,
          priceMonthly: parseFloat(hotDeskPrice) || parseFloat(dedicatedDeskPrice) || null,
          facilities,
          units: unitsPayload,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Submission failed. Please check required fields.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/resources/coworking"
              className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Directory
            </Link>
          </div>

          <div className="mb-8">
            <span className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sparkles size={14} /> Workspace Partner Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Register Your Coworking Space
            </h1>
            <p className="text-muted text-sm mt-1">
              List your workspace, hot desks, private rooms, and meeting halls across multiple locations under one owner account.
            </p>
          </div>

          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 sm:p-8 shadow-xl">
            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-black text-white">
                  Workspace Submitted Successfully!
                </h2>
                <p className="text-muted text-sm leading-relaxed max-w-md mx-auto">
                  Your coworking space application is logged under owner email{" "}
                  <strong className="text-white">{ownerEmail}</strong>. Our testing team will review your unit inventory and fiber/power generator backup capabilities before activating your listing.
                </p>
                <div className="pt-6 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setName("");
                      setAddress("");
                      setDescription("");
                    }}
                    className="bg-[#222] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#333] transition-all text-xs uppercase tracking-wider"
                  >
                    Register Another Location
                  </button>
                  <Link
                    href="/resources/coworking"
                    className="bg-[#FFD700] text-black font-black px-8 py-3 rounded-xl hover:bg-white transition-all text-xs uppercase tracking-wider shadow"
                  >
                    Back to Marketplace
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                    {error}
                  </div>
                )}

                {/* Section 1: Space Owner Profile */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-3 flex items-center gap-2">
                    <User className="text-primary" size={16} /> 1. Space Owner Account (Multi-Location Support)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Owner / Manager Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Damodar Kafle"
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Owner Email (Use same email for multiple locations) *
                      </label>
                      <input
                        type="email"
                        required
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="owner@workplace.com"
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Space & Location Info */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-3 flex items-center gap-2">
                    <Building className="text-primary" size={16} /> 2. Space & Location Details
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Workspace Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Impact Hub Pokhara / WorkAround Kathmandu"
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        City Location *
                      </label>
                      <select
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                      >
                        <option value="">Select City...</option>
                        {LOCATIONS.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Exact Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Lakeside Ward 6, Pokhara"
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Space Classification Category
                      </label>
                      <select
                        value={spaceType}
                        onChange={(e) => setSpaceType(e.target.value)}
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                      >
                        {SPACE_TYPES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Operating Hours
                      </label>
                      <input
                        type="text"
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                        placeholder="24/7 Access or 7:00 AM - 10:00 PM"
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Workspace Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe fiber ISP details, generator backup latency, cafe services, seating comfort..."
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 3: Rooms, Desks & Unit Inventory */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-3 flex items-center gap-2">
                    <Layers className="text-primary" size={16} /> 3. Units & Inventory (Rooms, Desks, Meeting Halls)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hot Desks */}
                    <div className="p-4 bg-black border border-[#222] rounded-xl space-y-3">
                      <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Hot Desks / Flexi Seats</span>
                        <span className="text-primary font-mono text-[10px]">Per Month</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Available Count</label>
                          <input
                            type="number"
                            value={hotDeskCount}
                            onChange={(e) => setHotDeskCount(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Monthly Rate ($)</label>
                          <input
                            type="number"
                            value={hotDeskPrice}
                            onChange={(e) => setHotDeskPrice(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Desks */}
                    <div className="p-4 bg-black border border-[#222] rounded-xl space-y-3">
                      <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Dedicated Fixed Desks</span>
                        <span className="text-primary font-mono text-[10px]">Per Month</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Available Count</label>
                          <input
                            type="number"
                            value={dedicatedDeskCount}
                            onChange={(e) => setDedicatedDeskCount(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Monthly Rate ($)</label>
                          <input
                            type="number"
                            value={dedicatedDeskPrice}
                            onChange={(e) => setDedicatedDeskPrice(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Private Rooms */}
                    <div className="p-4 bg-black border border-[#222] rounded-xl space-y-3">
                      <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Private Executive Rooms</span>
                        <span className="text-primary font-mono text-[10px]">Per Month</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Available Rooms</label>
                          <input
                            type="number"
                            value={privateRoomCount}
                            onChange={(e) => setPrivateRoomCount(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Monthly Rate ($)</label>
                          <input
                            type="number"
                            value={privateRoomPrice}
                            onChange={(e) => setPrivateRoomPrice(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Meeting Halls */}
                    <div className="p-4 bg-black border border-[#222] rounded-xl space-y-3">
                      <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Meeting Halls / Conference</span>
                        <span className="text-primary font-mono text-[10px]">Per Day</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Halls Count</label>
                          <input
                            type="number"
                            value={meetingHallCount}
                            onChange={(e) => setMeetingHallCount(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Daily Rate ($)</label>
                          <input
                            type="number"
                            value={meetingHallPrice}
                            onChange={(e) => setMeetingHallPrice(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Contact & Facilities */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-3 flex items-center gap-2">
                    <Mail className="text-primary" size={16} /> 4. Contacts & Vetted Amenities
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Public Booking Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="bookings@workplace.com"
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Website Link
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://workplace.com"
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Cover Photo URL
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/your-workspace-photo"
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Select Vetted Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FACILITIES_OPTIONS.map((f) => {
                        const selected = facilities.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => toggleFacility(f)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                              selected
                                ? "bg-primary text-black border-primary"
                                : "bg-black border-[#222] text-muted hover:border-gray-600 hover:text-white"
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6 border-t border-[#1e1e1e]">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FFD700] hover:bg-white disabled:opacity-50 text-black font-black py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/10"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Submit Workspace Application ✓"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
