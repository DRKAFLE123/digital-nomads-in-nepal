/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  ArrowRight,
  ShieldCheck,
  Check,
  Star,
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
  const router = useRouter();
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const fileList = Array.from(files);
      const uploadedUrls: string[] = [];

      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/work-hubs/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        } else {
          const errData = await res.json();
          setError(errData.error || `Upload failed for ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        if (!photoUrl) {
          setPhotoUrl(uploadedUrls[0]);
          if (uploadedUrls.length > 1) {
            setAdditionalPhotos((prev) => [...prev, ...uploadedUrls.slice(1)]);
          }
        } else {
          setAdditionalPhotos((prev) => [...prev, ...uploadedUrls]);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Try a direct image URL instead.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoInput.trim()) return;
    const url = newPhotoInput.trim();
    if (!photoUrl) {
      setPhotoUrl(url);
    } else {
      setAdditionalPhotos((prev) => [...prev, url]);
    }
    setNewPhotoInput("");
  };

  const handleRemovePhoto = (index: number) => {
    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveCoverPhoto = () => {
    if (additionalPhotos.length > 0) {
      setPhotoUrl(additionalPhotos[0]);
      setAdditionalPhotos((prev) => prev.slice(1));
    } else {
      setPhotoUrl("");
    }
  };

  const handleMakeCover = (index: number) => {
    const currentCover = photoUrl;
    const selectedPhoto = additionalPhotos[index];
    setPhotoUrl(selectedPhoto);
    setAdditionalPhotos((prev) => {
      const copy = [...prev];
      copy[index] = currentCover;
      return copy.filter(Boolean);
    });
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

    // Require 1 Cover Photo + at least 3 additional photos (4 total)
    if (!photoUrl) {
      setError("Please provide a Main Cover Photo for your property.");
      setLoading(false);
      return;
    }

    if (additionalPhotos.length < 3) {
      setError(
        `Please upload at least 3 photos along with your main cover photo (minimum 4 photos required). Currently provided: ${1 + additionalPhotos.length} of 4.`
      );
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
        const data = await res.json();
        setSuccess(true);
        // Instant Airbnb-style redirect to Host Dashboard
        setTimeout(() => {
          const slugParam = data.hub?.slug ? `&slug=${encodeURIComponent(data.hub.slug)}` : "";
          router.push(`/owner/dashboard?registered=true${slugParam}`);
        }, 1200);
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
              className="inline-flex items-center gap-2 text-[#C2410C] dark:text-[#FB923C] hover:underline transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>

          <div className="mb-8">
            <span className="text-[#C2410C] dark:text-[#FB923C] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
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
              <Loader2 className="w-8 h-8 text-[#C2410C] animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-3">Verifying authentication status...</p>
            </div>
          ) : !session ? (
            <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 bg-[#C2410C]/10 border-2 border-[#C2410C]/30 text-[#C2410C] dark:text-[#FB923C] rounded-full flex items-center justify-center mx-auto">
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
                  className="flex items-center justify-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md"
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
                <div className="text-center py-12 space-y-5">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                    Space Successfully Listed!
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                    Your space has been registered under owner email{" "}
                    <strong className="text-foreground">{ownerEmail || session?.user?.email}</strong>.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] text-xs font-bold">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Redirecting to your Airbnb-style Host Dashboard...</span>
                  </div>
                  <div className="pt-4 flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/owner/dashboard?registered=true"
                      className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-8 py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md shadow-[#C2410C]/20 flex items-center gap-2"
                    >
                      <span>Open Host Dashboard</span>
                      <ArrowRight size={14} />
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

                  {/* 6. PHOTOS & GALLERY (Enforce 1 Cover + 3 Additional Photos = 4 Total) */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                          <span>Property Photography</span>
                          <span className="text-xs font-bold text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/10 px-2 py-0.5 rounded-full">
                            Min 4 Photos Required
                          </span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          High-resolution photos increase bookings by over 300%. Add 1 Main Cover + at least 3 gallery photos.
                        </p>
                      </div>

                      {/* Live Counter Badge */}
                      <div className="self-start sm:self-auto">
                        {((photoUrl ? 1 : 0) + additionalPhotos.length) >= 4 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                            <CheckCircle size={13} />
                            <span>{(photoUrl ? 1 : 0) + additionalPhotos.length} / 4 Uploaded (Ready)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <span>📸 {(photoUrl ? 1 : 0) + additionalPhotos.length} / 4 Uploaded</span>
                            <span className="font-normal text-[11px]">({4 - ((photoUrl ? 1 : 0) + additionalPhotos.length)} more needed)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Upload Actions (Supports multi-select files + URL entry) */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                        <Upload size={14} />
                        <span>{uploading ? "Uploading Photos..." : "Upload Photos (Select Multiple)"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-muted-foreground">or add direct image URL:</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newPhotoInput}
                        onChange={(e) => setNewPhotoInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... or direct image link"
                        className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoUrl}
                        className="bg-muted hover:bg-muted/80 text-foreground font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                      >
                        + Add Image URL
                      </button>
                    </div>

                    {/* 4 Required Slots Visual Guide */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                      {/* Slot 1: Cover Photo */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-[#C2410C]/40 bg-[#FAF7F2] dark:bg-[#141416] flex flex-col items-center justify-center text-center p-3 group">
                        {photoUrl ? (
                          <>
                            <img src={photoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                            <span className="absolute top-2 left-2 bg-[#C2410C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              ✓ Main Cover
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveCoverPhoto}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                              title="Remove cover photo"
                            >
                              <X size={13} />
                            </button>
                            <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium truncate max-w-[90%]">
                              Primary Thumbnail
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mb-1.5">
                              <Star size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Slot 1: Cover Photo</span>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">Required</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Hero image for cards</span>
                          </div>
                        )}
                      </div>

                      {/* Slot 2: Workspace Setup */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-[#E8E2D8] dark:border-[#26262A] bg-[#FAF7F2] dark:bg-[#141416] flex flex-col items-center justify-center text-center p-3 group">
                        {additionalPhotos[0] ? (
                          <>
                            <img src={additionalPhotos[0]} alt="Workspace setup" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                            <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Photo 1
                            </span>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMakeCover(0)}
                                className="px-2 py-0.5 bg-black/70 hover:bg-[#C2410C] text-white text-[9px] font-bold rounded-full transition-colors"
                                title="Make this the Cover Photo"
                              >
                                Set Cover
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(0)}
                                className="p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                              >
                                <X size={13} />
                              </button>
                            </div>
                            <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium">
                              Work Desks &amp; Chairs
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#202024] text-gray-600 dark:text-gray-300 flex items-center justify-center mb-1.5">
                              <Building size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Slot 2: Workspace</span>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">Required</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Desks, fiber, monitors</span>
                          </div>
                        )}
                      </div>

                      {/* Slot 3: Bedrooms & Facilities */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-[#E8E2D8] dark:border-[#26262A] bg-[#FAF7F2] dark:bg-[#141416] flex flex-col items-center justify-center text-center p-3 group">
                        {additionalPhotos[1] ? (
                          <>
                            <img src={additionalPhotos[1]} alt="Rooms" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                            <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Photo 2
                            </span>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMakeCover(1)}
                                className="px-2 py-0.5 bg-black/70 hover:bg-[#C2410C] text-white text-[9px] font-bold rounded-full transition-colors"
                              >
                                Set Cover
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(1)}
                                className="p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                              >
                                <X size={13} />
                              </button>
                            </div>
                            <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium">
                              Room / Coliving Suite
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#202024] text-gray-600 dark:text-gray-300 flex items-center justify-center mb-1.5">
                              <BedDouble size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Slot 3: Living / Room</span>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">Required</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Bedroom, cafe or lounge</span>
                          </div>
                        )}
                      </div>

                      {/* Slot 4: Views / Common Areas */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-[#E8E2D8] dark:border-[#26262A] bg-[#FAF7F2] dark:bg-[#141416] flex flex-col items-center justify-center text-center p-3 group">
                        {additionalPhotos[2] ? (
                          <>
                            <img src={additionalPhotos[2]} alt="Views" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                            <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Photo 3
                            </span>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMakeCover(2)}
                                className="px-2 py-0.5 bg-black/70 hover:bg-[#C2410C] text-white text-[9px] font-bold rounded-full transition-colors"
                              >
                                Set Cover
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(2)}
                                className="p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                              >
                                <X size={13} />
                              </button>
                            </div>
                            <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium">
                              Terrace / Mountain View
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#202024] text-gray-600 dark:text-gray-300 flex items-center justify-center mb-1.5">
                              <Compass size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Slot 4: View / Common</span>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">Required</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Terrace, kitchen or view</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Extra Gallery Photos (Slot 5+) */}
                    {additionalPhotos.length > 3 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Additional Gallery Photos ({additionalPhotos.length - 3})
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {additionalPhotos.slice(3).map((p, idx) => {
                            const realIdx = idx + 3;
                            return (
                              <div key={realIdx} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                                <img src={p} alt={`Photo ${realIdx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute top-1 right-1 flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMakeCover(realIdx)}
                                    className="px-1.5 py-0.5 bg-black/70 hover:bg-[#C2410C] text-white text-[8px] font-bold rounded-full transition-colors"
                                  >
                                    Cover
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(realIdx)}
                                    className="p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SUBMISSION BUTTON */}
                  <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {((photoUrl ? 1 : 0) + additionalPhotos.length) < 4 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          ⚠️ Upload at least {4 - ((photoUrl ? 1 : 0) + additionalPhotos.length)} more photo(s) to enable submission.
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ All 4 minimum photos provided. Ready to publish!
                        </span>
                      )}
                    </p>

                    <button
                      type="submit"
                      disabled={loading || uploading || ((photoUrl ? 1 : 0) + additionalPhotos.length) < 4}
                      className="w-full sm:w-auto bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#C2410C]/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Publishing &amp; Taking to Dashboard...</span>
                        </>
                      ) : (
                        <span>Publish Space Listing →</span>
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
