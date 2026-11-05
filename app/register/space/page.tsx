/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Building,
  Home,
  Sparkles,
  Loader2,
  CheckCircle,
  User,
  Layers,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Lock,
  UserPlus,
  LogIn,
  X,
  Wifi,
  Zap,
  BedDouble,
  Compass,
} from "lucide-react";

type SpaceCategory = "workspace" | "stay" | "hybrid";

const LOCATIONS = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bandipur",
  "Chitwan",
  "Mustang",
  "Lumbini",
  "Nagarkot",
];

const WORKSPACE_SPACE_TYPES = [
  "Coworking & Hot Desk Hub",
  "Executive Private Office Hub",
  "Hybrid Work Cafe & Hub",
  "Creative Event & Workshop Space",
];

const STAY_SPACE_TYPES = [
  "Coliving Hub (Work + Stay)",
  "Digital Nomad Hostel",
  "Work-Friendly Hotel & Resort",
  "Long-Term Nomad Apartment",
];

const HYBRID_SPACE_TYPES = [
  "Coliving & Coworking Hub",
  "Nomad Villa (Live & Work)",
  "Coworking Hub with On-Site Rooms",
];

const ALL_FACILITIES = [
  "High-Speed Fiber (100+ Mbps)",
  "Starlink Satellite Wi-Fi",
  "Backup Generator (24/7)",
  "Solar Power Inverter",
  "Ergonomic Chairs",
  "Dedicated Desks",
  "Private Call Booths",
  "Meeting Rooms",
  "Coliving Suites",
  "Private Ensuite Bedrooms",
  "Community Kitchen",
  "Tea & Specialty Coffee",
  "24/7 Access",
  "Phewa Lake / Mountain View",
  "Outdoor Terrace / Garden",
  "Free Parking",
];

export default function UnifiedRegisterSpacePage() {
  const { data: session, status } = useSession();

  // Mode Selection: "workspace" | "stay" | "hybrid"
  const [category, setCategory] = useState<SpaceCategory>("hybrid");

  // Owner Info
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  // Space Details
  const [name, setName] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [openingHours, setOpeningHours] = useState("24/7 Access");
  const [spaceType, setSpaceType] = useState("Coliving & Coworking Hub");

  // Inventory & Pricing (Work)
  const [hotDeskCount, setHotDeskCount] = useState("10");
  const [hotDeskPrice, setHotDeskPrice] = useState("65");
  const [dedicatedDeskCount, setDedicatedDeskCount] = useState("5");
  const [dedicatedDeskPrice, setDedicatedDeskPrice] = useState("95");
  const [privateOfficeCount, setPrivateOfficeCount] = useState("2");
  const [meetingHallCount, setMeetingHallCount] = useState("1");

  // Inventory & Pricing (Stay)
  const [privateRoomCount, setPrivateRoomCount] = useState("4");
  const [privateRoomMonthly, setPrivateRoomMonthly] = useState("320");
  const [dormBedCount, setDormBedCount] = useState("8");
  const [dormBedMonthly, setDormBedMonthly] = useState("160");

  // Amenities
  const [facilities, setFacilities] = useState<string[]>([
    "High-Speed Fiber (100+ Mbps)",
    "Backup Generator (24/7)",
    "Ergonomic Chairs",
    "24/7 Access",
  ]);

  // Photos
  const [photoUrl, setPhotoUrl] = useState("");
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [newPhotoInput, setNewPhotoInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Populate owner defaults from session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !ownerName) setOwnerName(session.user.name);
      if (session.user.email && !ownerEmail) setOwnerEmail(session.user.email);
      if (session.user.email && !contactEmail) setContactEmail(session.user.email);
    }
  }, [session, ownerName, ownerEmail, contactEmail]);

  // Adjust default spaceType when category changes
  const handleCategoryChange = (cat: SpaceCategory) => {
    setCategory(cat);
    if (cat === "workspace") {
      setSpaceType(WORKSPACE_SPACE_TYPES[0]);
    } else if (cat === "stay") {
      setSpaceType(STAY_SPACE_TYPES[0]);
    } else {
      setSpaceType(HYBRID_SPACE_TYPES[0]);
    }
  };

  const toggleFacility = (facility: string) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/work-hubs/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (!photoUrl) {
          setPhotoUrl(data.url);
        } else {
          setAdditionalPhotos((prev) => [...prev, data.url]);
        }
      } else {
        const errData = await res.json();
        setError(errData.error || "Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Try a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoInput.trim()) return;
    if (!photoUrl) {
      setPhotoUrl(newPhotoInput.trim());
    } else {
      setAdditionalPhotos((prev) => [...prev, newPhotoInput.trim()]);
    }
    setNewPhotoInput("");
  };

  const handleRemovePhoto = (index: number) => {
    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !city || !address || !description || !contactEmail) {
      setError("Please fill in all mandatory fields.");
      setLoading(false);
      return;
    }

    // Build unified units payload
    const unitsPayload: Array<{ type: string; name: string; count: number; priceMonthly?: number }> = [];

    if (category === "workspace" || category === "hybrid") {
      if (parseInt(hotDeskCount, 10) > 0) {
        unitsPayload.push({
          type: "hot_desk",
          name: "Hot Desk Pass",
          count: parseInt(hotDeskCount, 10),
          priceMonthly: parseFloat(hotDeskPrice) || 60,
        });
      }
      if (parseInt(dedicatedDeskCount, 10) > 0) {
        unitsPayload.push({
          type: "dedicated_desk",
          name: "Dedicated Desk",
          count: parseInt(dedicatedDeskCount, 10),
          priceMonthly: parseFloat(dedicatedDeskPrice) || 90,
        });
      }
      if (parseInt(privateOfficeCount, 10) > 0) {
        unitsPayload.push({
          type: "private_room",
          name: "Private Team Office",
          count: parseInt(privateOfficeCount, 10),
        });
      }
      if (parseInt(meetingHallCount, 10) > 0) {
        unitsPayload.push({
          type: "meeting_hall",
          name: "Meeting / Conference Room",
          count: parseInt(meetingHallCount, 10),
        });
      }
    }

    if (category === "stay" || category === "hybrid") {
      if (parseInt(privateRoomCount, 10) > 0) {
        unitsPayload.push({
          type: "coliving_room",
          name: "Private Ensuite Coliving Bedroom",
          count: parseInt(privateRoomCount, 10),
          priceMonthly: parseFloat(privateRoomMonthly) || 300,
        });
      }
      if (parseInt(dormBedCount, 10) > 0) {
        unitsPayload.push({
          type: "coliving_dorm",
          name: "Shared Nomad Dorm Suite",
          count: parseInt(dormBedCount, 10),
          priceMonthly: parseFloat(dormBedMonthly) || 150,
        });
      }
    }

    // Photos payload
    const allPhotos = [photoUrl, ...additionalPhotos].filter(Boolean);
    const finalPhotoPayload = allPhotos.length > 1 ? JSON.stringify(allPhotos) : photoUrl || null;

    // Determine representative monthly & daily price
    let effectiveMonthly: number | null = null;
    let effectiveDaily: number | null = null;

    if (category === "workspace") {
      effectiveMonthly = parseFloat(hotDeskPrice) || parseFloat(dedicatedDeskPrice) || null;
      effectiveDaily = effectiveMonthly ? Math.round(effectiveMonthly / 18) : 5;
    } else if (category === "stay") {
      effectiveMonthly = parseFloat(privateRoomMonthly) || parseFloat(dormBedMonthly) || null;
      effectiveDaily = effectiveMonthly ? Math.round(effectiveMonthly / 25) : 15;
    } else {
      effectiveMonthly = parseFloat(hotDeskPrice) || parseFloat(privateRoomMonthly) || null;
      effectiveDaily = 6;
    }

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
          spaceType,
          openingHours,
          priceDaily: effectiveDaily,
          priceMonthly: effectiveMonthly,
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
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20 dark:bg-background text-foreground pt-32 pb-24 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>

          <div className="mb-8">
            <span className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sparkles size={14} /> Host & Space Partner Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              List Your Space in Nepal
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
              Register your coworking hub, digital nomad coliving stay, or hybrid live-and-work property. Reach thousands of verified remote workers visiting Nepal.
            </p>
          </div>

          {/* AUTH GUARD */}
          {status === "loading" ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-xl">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-3">Verifying authentication status...</p>
            </div>
          ) : !session ? (
            <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 bg-primary/10 border-2 border-primary/30 text-amber-600 dark:text-primary rounded-full flex items-center justify-center mx-auto">
                <Lock size={36} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-2xl font-black text-foreground">
                  Sign In Required to List a Space
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To ensure listing authenticity and enable your Owner Console for managing reservations, please sign in or create a host account.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                <Link
                  href="/auth/signin?callbackUrl=/register/space"
                  className="flex items-center justify-center gap-2 bg-[#F5B301] hover:bg-[#E0A200] text-[#1A1A1C] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  <LogIn size={15} /> Sign In
                </Link>
                <Link
                  href="/auth/signin?callbackUrl=/register/space&mode=register"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-[#141416] hover:bg-gray-50 dark:hover:bg-[#1F1F23] border border-[#E8E2D8] dark:border-[#26262A] text-gray-800 dark:text-gray-200 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
                >
                  <UserPlus size={15} /> Create Account
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-2xl">
              {success ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-foreground">
                    Space Application Submitted!
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                    Your space has been registered under owner email{" "}
                    <strong className="text-foreground">{ownerEmail}</strong>. Our team will verify your Wi-Fi speeds and backup power capabilities before activating the public badge.
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
                      className="bg-muted text-foreground font-bold px-6 py-3 rounded-xl hover:bg-muted/80 transition-all text-xs uppercase tracking-wider border border-border"
                    >
                      Register Another Property
                    </button>
                    <Link
                      href="/workspaces"
                      className="bg-primary text-black font-black px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all text-xs uppercase tracking-wider shadow-md shadow-primary/20"
                    >
                      View Directory
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* 1. INTERACTIVE CATEGORY SELECTOR */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Step 1: What Type of Space Are You Listing?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => handleCategoryChange("workspace")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                          category === "workspace"
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-background border-border text-muted-foreground hover:border-zinc-500"
                        }`}
                      >
                        <Building size={24} className="mb-2" />
                        <span className="font-bold text-sm text-foreground">Coworking Space</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Desks & Meeting Rooms</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCategoryChange("stay")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                          category === "stay"
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-background border-border text-muted-foreground hover:border-zinc-500"
                        }`}
                      >
                        <Home size={24} className="mb-2" />
                        <span className="font-bold text-sm text-foreground">Nomad Stay</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Coliving, Hostel, Flat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCategoryChange("hybrid")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                          category === "hybrid"
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-background border-border text-muted-foreground hover:border-zinc-500"
                        }`}
                      >
                        <Sparkles size={24} className="mb-2" />
                        <span className="font-bold text-sm text-foreground">Hybrid (Both)</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Workspaces & Overnight Beds</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. BASIC PROPERTY INFORMATION */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-base font-bold text-foreground">Basic Property Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                          Property / Hub Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Himalayan WorkHub & Coliving"
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                          City / Region *
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        >
                          {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                          Specific Category / Space Type
                        </label>
                        <select
                          value={spaceType}
                          onChange={(e) => setSpaceType(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        >
                          {(category === "workspace"
                            ? WORKSPACE_SPACE_TYPES
                            : category === "stay"
                            ? STAY_SPACE_TYPES
                            : HYBRID_SPACE_TYPES
                          ).map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                          Opening Hours / Access Policy
                        </label>
                        <input
                          type="text"
                          value={openingHours}
                          onChange={(e) => setOpeningHours(e.target.value)}
                          placeholder="e.g. 24/7 Access or 08:00 - 20:00"
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                        Street Address & Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Lakeside Ward 6, Near Center Point, Pokhara"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                        Property Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your internet reliability, noise levels, community vibe, and walking proximity to cafes/lakes..."
                        className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. DYNAMIC INVENTORY & PRICING */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-base font-bold text-foreground">Unit Inventory & Pricing</h3>

                    {/* Workspace Units */}
                    {(category === "workspace" || category === "hybrid") && (
                      <div className="bg-background/60 border border-border p-4 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                          <Building size={14} /> Workspace Desks & Meeting Areas
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Hot Desks (Count)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={hotDeskCount}
                              onChange={(e) => setHotDeskCount(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Hot Desk ($/mo)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={hotDeskPrice}
                              onChange={(e) => setHotDeskPrice(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Dedicated Desks
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={dedicatedDeskCount}
                              onChange={(e) => setDedicatedDeskCount(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Meeting Rooms
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={meetingHallCount}
                              onChange={(e) => setMeetingHallCount(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stay Units */}
                    {(category === "stay" || category === "hybrid") && (
                      <div className="bg-background/60 border border-border p-4 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                          <BedDouble size={14} /> Coliving Bedrooms & Overnight Suites
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Private Rooms (Count)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={privateRoomCount}
                              onChange={(e) => setPrivateRoomCount(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Private Room ($/mo)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={privateRoomMonthly}
                              onChange={(e) => setPrivateRoomMonthly(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Dorm Beds (Count)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={dormBedCount}
                              onChange={(e) => setDormBedCount(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Dorm Bed ($/mo)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={dormBedMonthly}
                              onChange={(e) => setDormBedMonthly(e.target.value)}
                              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. VERIFIED AMENITIES CHECKLIST */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="text-base font-bold text-foreground">Verified Amenities & Power/Wi-Fi</h3>
                    <p className="text-xs text-muted-foreground">
                      Select all features available at this location:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ALL_FACILITIES.map((fac) => {
                        const selected = facilities.includes(fac);
                        return (
                          <button
                            key={fac}
                            type="button"
                            onClick={() => toggleFacility(fac)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              selected
                                ? "bg-primary text-black border-primary"
                                : "bg-background border-border text-muted-foreground hover:border-zinc-500"
                            }`}
                          >
                            {fac}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. CONTACT & EXTERNAL LINKS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                        Booking / Inquiries Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="bookings@yourspace.com"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                        Website or Social Page
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourhub.com or Instagram URL"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* 6. PHOTOS & GALLERY */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-base font-bold text-foreground">Property Photography</h3>
                    <p className="text-xs text-muted-foreground">
                      Upload or paste high-resolution photos of your workstation setup and rooms.
                    </p>

                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <Upload size={14} />
                        <span>{uploading ? "Uploading..." : "Upload Photo File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-muted-foreground">or paste image URL below:</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newPhotoInput}
                        onChange={(e) => setNewPhotoInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... or direct image link"
                        className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoUrl}
                        className="bg-muted hover:bg-muted/80 text-foreground font-bold px-4 py-2 rounded-xl text-xs"
                      >
                        Add Photo
                      </button>
                    </div>

                    {/* Preview Gallery */}
                    {(photoUrl || additionalPhotos.length > 0) && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {photoUrl && (
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/40 group">
                            <img src={photoUrl} alt="Cover" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-black/80 text-[10px] text-primary font-bold px-1.5 py-0.5 rounded">
                              Main Cover
                            </span>
                          </div>
                        )}
                        {additionalPhotos.map((p, idx) => (
                          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                            <img src={p} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SUBMISSION BUTTON */}
                  <div className="pt-6 border-t border-border flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="bg-primary hover:bg-yellow-400 text-black font-black px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Submitting Registration...</span>
                        </>
                      ) : (
                        <span>Publish Space Listing</span>
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
