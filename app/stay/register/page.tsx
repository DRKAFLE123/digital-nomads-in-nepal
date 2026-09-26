/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Home,
  Loader2,
  CheckCircle,
  User,
  Layers,
  Upload,
  Image as ImageIcon,
  Lock,
  UserPlus,
  LogIn,
  X,
  ShieldCheck,
} from "lucide-react";

const LOCATIONS = [
  "Kathmandu",
  "Pokhara",
  "Mustang",
  "Lalitpur",
  "Bandipur",
  "Chitwan",
  "Lumbini",
  "Nagarkot",
];

const PROPERTY_TYPES = [
  "Coliving Hub (Work + Stay)",
  "Digital Nomad Hostel",
  "Work-Friendly Hotel & Resort",
  "Long-Term Nomad Apartment",
];

const STAY_FACILITIES = [
  "Starlink Satellite Wi-Fi",
  "High-Speed Fiber (100+ Mbps)",
  "24/7 Solar / Generator Backup",
  "Ergonomic Desk in Room",
  "Rooftop / Shared Coworking Space",
  "Breakfast Included",
  "Private Call Booths",
  "Community Dinners & Events",
  "Full Kitchen Access",
  "Washing Machine / Laundry",
  "Daily Housekeeping",
  "Fewa Lake / Mountain View",
];

export default function StayRegisterPage() {
  const { data: session, status } = useSession();

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("Coliving Hub (Work + Stay)");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Cover Photo State
  const [photoMode, setPhotoMode] = useState<"file" | "url">("file");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Room Inventory & Pricing
  const [colivingSuiteCount, setColivingSuiteCount] = useState("3");
  const [colivingSuiteMonthly, setColivingSuiteMonthly] = useState("450");
  const [colivingSuiteNightly, setColivingSuiteNightly] = useState("25");

  const [privateRoomCount, setPrivateRoomCount] = useState("4");
  const [privateRoomMonthly, setPrivateRoomMonthly] = useState("350");
  const [privateRoomNightly, setPrivateRoomNightly] = useState("20");

  const [dormBedCount, setDormBedCount] = useState("8");
  const [dormBedMonthly, setDormBedMonthly] = useState("180");
  const [dormBedNightly, setDormBedNightly] = useState("10");

  const [facilities, setFacilities] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      if (!ownerName && session.user.name) setOwnerName(session.user.name);
      if (!ownerEmail && session.user.email) setOwnerEmail(session.user.email);
      if (!contactEmail && session.user.email) setContactEmail(session.user.email);
    }
  }, [session, ownerName, ownerEmail, contactEmail]);

  function toggleFacility(f: string) {
    setFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/work-hubs/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPhotoUrl(data.url);
      } else {
        const errData = await res.json();
        setUploadError(errData.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Error uploading cover image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const unitsPayload = [
      {
        type: "coliving_room",
        name: "🛌 Coliving Work & Stay Suite (Room + Desk)",
        count: parseInt(colivingSuiteCount) || 0,
        priceMonthly: parseFloat(colivingSuiteMonthly) || 0,
        priceDaily: parseFloat(colivingSuiteNightly) || 0,
      },
      {
        type: "private_room",
        name: "Private Room + Workstation",
        count: parseInt(privateRoomCount) || 0,
        priceMonthly: parseFloat(privateRoomMonthly) || 0,
        priceDaily: parseFloat(privateRoomNightly) || 0,
      },
      {
        type: "dorm_bed",
        name: "Digital Nomad Dorm Bed",
        count: parseInt(dormBedCount) || 0,
        priceMonthly: parseFloat(dormBedMonthly) || 0,
        priceDaily: parseFloat(dormBedNightly) || 0,
      },
    ];

    const finalPhotoPayload = photoUrl || null;

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
          photoUrl: finalPhotoPayload,
          ownerEmail: ownerEmail || session?.user?.email,
          ownerName: ownerName || session?.user?.name,
          spaceType: propertyType,
          openingHours: "24/7 Access & Front Desk",
          priceDaily: parseFloat(dormBedNightly) || parseFloat(colivingSuiteNightly) || 15,
          priceMonthly: parseFloat(colivingSuiteMonthly) || parseFloat(privateRoomMonthly) || 300,
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
      <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#FFD400] selection:text-black">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/stay"
              className="inline-flex items-center gap-2 text-[#FFD400] hover:underline transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Stays Directory
            </Link>
          </div>

          <div className="mb-8 space-y-2">
            <span className="text-[#FFD400] text-xs font-black uppercase tracking-widest flex items-center gap-1.5 bg-[#FFD400]/10 border border-[#FFD400]/30 px-3 py-1 rounded-full w-fit">
              <Home size={14} /> Partner Accommodations Network
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Register Your Stay or Coliving Space
            </h1>
            <p className="text-[#A1A1AA] text-sm leading-relaxed font-medium">
              List your coliving hub, hotel, digital nomad hostel, or long-term apartment with verified Wi-Fi speed & backup power guarantees.
            </p>
          </div>

          {/* AUTHENTICATION GUARD */}
          {status === "loading" ? (
            <div className="bg-[#121212] border border-[#242424] rounded-3xl p-12 text-center shadow-xl">
              <Loader2 className="w-10 h-10 text-[#FFD400] animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-white">Checking Account Authorization...</p>
            </div>
          ) : status === "unauthenticated" ? (
            <div className="bg-[#121212] border border-[#242424] rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 bg-[#FFD400]/10 border-2 border-[#FFD400]/30 text-[#FFD400] rounded-full flex items-center justify-center mx-auto">
                <Lock size={36} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-2xl font-black text-white">
                  Sign In Required to Register
                </h2>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  To ensure property authenticity and allow space owners to update availability, please sign in before listing your stay or coliving space.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                <Link
                  href="/auth/signin?callbackUrl=/stay/register"
                  className="flex items-center justify-center gap-2 bg-[#FFD400] hover:bg-[#FFE033] text-black font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#FFD400]/15"
                >
                  <LogIn size={16} /> Sign In to Account
                </Link>
                <Link
                  href="/auth/register?callbackUrl=/stay/register"
                  className="flex items-center justify-center gap-2 bg-[#181818] border border-[#2e2e2e] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all hover:bg-[#222]"
                >
                  <UserPlus size={16} /> Create Free Account
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-10 shadow-2xl">
              {success ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    Property Submitted Successfully!
                  </h2>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-md mx-auto">
                    Your property submission is logged under owner email{" "}
                    <strong className="text-white">{ownerEmail}</strong>. Our verification team will contact you to verify Wi-Fi speed and power backup setup before activating your listing.
                  </p>
                  <div className="pt-6 flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setName("");
                        setAddress("");
                        setDescription("");
                        setPhotoUrl("");
                      }}
                      className="bg-[#181818] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#222] transition-all text-xs uppercase tracking-wider border border-[#2e2e2e]"
                    >
                      Register Another Property
                    </button>
                    <Link
                      href="/stay"
                      className="bg-[#FFD400] text-black font-extrabold px-8 py-3 rounded-xl hover:bg-[#FFE033] transition-all text-xs uppercase tracking-wider shadow-md shadow-[#FFD400]/20"
                    >
                      View Stays Directory
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

                  {/* Section 1: Property Owner */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#242424] pb-3 flex items-center gap-2">
                      <User className="text-[#FFD400]" size={16} /> 1. Property Owner Account (Logged In)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                          Owner / Host Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all placeholder-[#71717A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                          Contact Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          placeholder="owner@property.com"
                          className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all placeholder-[#71717A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Property Details */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#242424] pb-3 flex items-center gap-2">
                      <Home className="text-[#FFD400]" size={16} /> 2. Property & Location Info
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                        Property Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Kathmandu Nomad Coliving Hub / Lakeside Nomad Suites"
                        className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all placeholder-[#71717A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                          City / Region *
                        </label>
                        <select
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all cursor-pointer"
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
                        <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                          Exact Address / Area *
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Jhamsikhel, Lalitpur or Lakeside Street 6, Pokhara"
                          className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all placeholder-[#71717A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                        Official Website or Social Page (Optional)
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourstaynepal.com"
                        className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all placeholder-[#71717A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                        Property Classification *
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all cursor-pointer"
                      >
                        {PROPERTY_TYPES.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                        Property Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe room amenities, Wi-Fi speed (Starlink / Fiber), power backup system, quiet work areas, and community vibes..."
                        className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400] transition-all placeholder-[#71717A] resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Section 3: Room Inventory & Rates */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#242424] pb-3 flex items-center gap-2">
                      <Layers className="text-[#FFD400]" size={16} /> 3. Room & Suite Inventory (Monthly & Nightly Rates)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Coliving Work & Stay Suite */}
                      <div className="p-4 bg-[#141414] border border-[#242424] rounded-2xl space-y-3">
                        <div className="font-extrabold text-white text-xs uppercase tracking-wider">
                          🛌 Coliving Suite (Room + Desk)
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Available Count</label>
                            <input
                              type="number"
                              value={colivingSuiteCount}
                              onChange={(e) => setColivingSuiteCount(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Monthly Rate ($)</label>
                            <input
                              type="number"
                              value={colivingSuiteMonthly}
                              onChange={(e) => setColivingSuiteMonthly(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Nightly Rate ($)</label>
                            <input
                              type="number"
                              value={colivingSuiteNightly}
                              onChange={(e) => setColivingSuiteNightly(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Private Room */}
                      <div className="p-4 bg-[#141414] border border-[#242424] rounded-2xl space-y-3">
                        <div className="font-extrabold text-white text-xs uppercase tracking-wider">
                          🚪 Private Room + Workstation
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Available Count</label>
                            <input
                              type="number"
                              value={privateRoomCount}
                              onChange={(e) => setPrivateRoomCount(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Monthly Rate ($)</label>
                            <input
                              type="number"
                              value={privateRoomMonthly}
                              onChange={(e) => setPrivateRoomMonthly(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Nightly Rate ($)</label>
                            <input
                              type="number"
                              value={privateRoomNightly}
                              onChange={(e) => setPrivateRoomNightly(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dorm Bed */}
                      <div className="p-4 bg-[#141414] border border-[#242424] rounded-2xl space-y-3">
                        <div className="font-extrabold text-white text-xs uppercase tracking-wider">
                          🛏️ Dorm Bed / Shared Room
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Available Beds</label>
                            <input
                              type="number"
                              value={dormBedCount}
                              onChange={(e) => setDormBedCount(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Monthly Rate ($)</label>
                            <input
                              type="number"
                              value={dormBedMonthly}
                              onChange={(e) => setDormBedMonthly(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#A1A1AA] font-bold block mb-1">Nightly Rate ($)</label>
                            <input
                              type="number"
                              value={dormBedNightly}
                              onChange={(e) => setDormBedNightly(e.target.value)}
                              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD400]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Facilities Checklist */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#242424] pb-3 flex items-center gap-2">
                      <ShieldCheck className="text-[#FFD400]" size={16} /> 4. Work & Nomad Amenities Checklist
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {STAY_FACILITIES.map((f) => {
                        const checked = facilities.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => toggleFacility(f)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                              checked
                                ? "bg-[#FFD400]/10 border-[#FFD400] text-[#FFD400]"
                                : "bg-[#141414] border-[#242424] text-[#A1A1AA] hover:border-gray-600 hover:text-white"
                            }`}
                          >
                            <span>{f}</span>
                            {checked && <CheckCircle size={14} className="text-[#FFD400]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 5: Photos & Submission */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#242424] pb-3 flex items-center gap-2">
                      <ImageIcon className="text-[#FFD400]" size={16} /> 5. Property Photos & Submit
                    </h3>

                    {/* Dual Cover Photo */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                          Cover Image
                        </label>
                        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#242424] text-xs">
                          <button
                            type="button"
                            onClick={() => setPhotoMode("file")}
                            className={`px-3 py-1 rounded-lg font-bold transition-all ${
                              photoMode === "file" ? "bg-[#FFD400] text-black" : "text-[#A1A1AA]"
                            }`}
                          >
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotoMode("url")}
                            className={`px-3 py-1 rounded-lg font-bold transition-all ${
                              photoMode === "url" ? "bg-[#FFD400] text-black" : "text-[#A1A1AA]"
                            }`}
                          >
                            Image URL Link
                          </button>
                        </div>
                      </div>

                      {photoMode === "file" ? (
                        <div className="border-2 border-dashed border-[#242424] hover:border-[#FFD400]/50 rounded-2xl p-6 text-center bg-[#141414]">
                          {uploadingImage ? (
                            <Loader2 className="w-8 h-8 text-[#FFD400] animate-spin mx-auto" />
                          ) : photoUrl ? (
                            <div className="relative max-w-md mx-auto rounded-xl overflow-hidden border border-[#242424]">
                              <img src={photoUrl} alt="Preview" className="w-full h-40 object-cover" />
                              <button
                                type="button"
                                onClick={() => setPhotoUrl("")}
                                className="absolute top-2 right-2 bg-black/80 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer space-y-2 block">
                              <Upload className="w-8 h-8 text-[#71717A] mx-auto" />
                              <p className="text-xs font-bold text-white">Click or drag property image here</p>
                              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                          )}
                        </div>
                      ) : (
                        <input
                          type="url"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/your-property-photo"
                          className="w-full bg-[#141414] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD400]"
                        />
                      )}
                      {uploadError && (
                        <p className="text-xs text-red-400 font-semibold">{uploadError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#FFD400] hover:bg-[#FFE033] text-black font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-[#FFD400]/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Submitting Property...
                        </>
                      ) : (
                        "Submit Property for Verification →"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
