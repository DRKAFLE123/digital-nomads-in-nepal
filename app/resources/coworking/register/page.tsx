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
  "Coworking Hub with On-Site Coliving",
  "Coliving & Coworking Hub",
  "Executive Private Office Hub",
  "Hybrid Work Cafe & Hub",
  "Creative Event & Workshop Space",
];

const FACILITIES_OPTIONS = [
  "High-Speed Fiber",
  "Starlink Satellite Wi-Fi",
  "Backup Generator",
  "Coliving Suites",
  "On-Site Bedrooms",
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
  const { data: session, status } = useSession();

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
  
  // Cover Photo State (File Upload vs URL link)
  const [photoMode, setPhotoMode] = useState<"file" | "url">("file");
  const [photoUrl, setPhotoUrl] = useState("");
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Unit Inventory Counts & Rates
  const [hotDeskCount, setHotDeskCount] = useState("10");
  const [hotDeskPrice, setHotDeskPrice] = useState("80");

  const [dedicatedDeskCount, setDedicatedDeskCount] = useState("5");
  const [dedicatedDeskPrice, setDedicatedDeskPrice] = useState("120");

  const [privateRoomCount, setPrivateRoomCount] = useState("2");
  const [privateRoomPrice, setPrivateRoomPrice] = useState("350");

  const [colivingSuiteCount, setColivingSuiteCount] = useState("3");
  const [colivingSuitePrice, setColivingSuitePrice] = useState("450");

  const [meetingHallCount, setMeetingHallCount] = useState("1");
  const [meetingHallPrice, setMeetingHallPrice] = useState("15");

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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isGallery = false) {
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
        if (isGallery) {
          setAdditionalPhotos((prev) => [...prev, data.url]);
        } else {
          setPhotoUrl(data.url);
        }
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

  function addGalleryUrl() {
    if (!newGalleryUrl.trim()) return;
    setAdditionalPhotos((prev) => [...prev, newGalleryUrl.trim()]);
    setNewGalleryUrl("");
  }

  function removeGalleryPhoto(index: number) {
    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
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
        type: "coliving_room",
        name: "🛌 Coliving Work & Stay Suite (Room + Desk Included)",
        count: parseInt(colivingSuiteCount) || 0,
        priceMonthly: parseFloat(colivingSuitePrice) || 0,
        priceDaily: parseFloat(colivingSuitePrice) ? (parseFloat(colivingSuitePrice) / 20) : 0,
      },
      {
        type: "meeting_hall",
        name: "Meeting Halls / Conference Rooms",
        count: parseInt(meetingHallCount) || 0,
        priceDaily: parseFloat(meetingHallPrice) || 0,
      },
    ];

    // Combine main photoUrl and additional gallery photos into JSON string array if gallery photos exist
    const allPhotos = [photoUrl, ...additionalPhotos].filter(Boolean);
    const finalPhotoPayload = allPhotos.length > 1 ? JSON.stringify(allPhotos) : (photoUrl || null);

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
      <main className="min-h-screen bg-muted/20 dark:bg-background text-foreground pt-32 pb-24 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/resources/coworking"
              className="inline-flex items-center gap-2 text-primary hover:underline transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Directory
            </Link>
          </div>

          <div className="mb-8">
            <span className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Building size={14} /> Workspace Partner Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Register Your Coworking Space
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              List your workspace, hot desks, private rooms, and meeting halls across multiple locations under one owner account.
            </p>
          </div>

          {/* AUTHENTICATION REQUIRED GUARD CARD */}
          {status === "loading" ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-xl">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-foreground">Checking Account Authorization...</p>
            </div>
          ) : status === "unauthenticated" ? (
            <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 bg-primary/10 border-2 border-primary/30 text-amber-600 dark:text-primary rounded-full flex items-center justify-center mx-auto">
                <Lock size={36} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-2xl font-black text-foreground">
                  Sign In Required to Register
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To ensure data authenticity and allow workspace managers to edit listings, please sign in or create an account before listing your workspace.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                <Link
                  href="/auth/signin?callbackUrl=/resources/coworking/register"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-yellow-400 text-black font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-primary/20"
                >
                  <LogIn size={16} /> Sign In to Account
                </Link>
                <Link
                  href="/auth/register?callbackUrl=/resources/coworking/register"
                  className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
                >
                  <UserPlus size={16} /> Create Account
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
                    Workspace Submitted Successfully!
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                    Your coworking space application is logged under owner email{" "}
                    <strong className="text-foreground">{ownerEmail}</strong>. Our testing team will review your unit inventory and fiber/power generator backup capabilities before activating your listing.
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
                      Register Another Location
                    </button>
                    <Link
                      href="/resources/coworking"
                      className="bg-primary text-black font-black px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all text-xs uppercase tracking-wider shadow-md shadow-primary/20"
                    >
                      Back to Marketplace
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

                  {/* Section 1: Space Owner Profile */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border pb-3 flex items-center gap-2">
                      <User className="text-primary" size={16} /> 1. Space Owner Account (Logged In)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Owner / Manager Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Damodar Kafle"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Owner Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          placeholder="owner@workplace.com"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Space & Location Info */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border pb-3 flex items-center gap-2">
                      <Building className="text-primary" size={16} /> 2. Space & Location Details
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Workspace Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Impact Hub Pokhara / WorkAround Kathmandu"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          City Location *
                        </label>
                        <select
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
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
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Exact Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Lakeside Ward 6, Pokhara"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Space Classification Category
                        </label>
                        <select
                          value={spaceType}
                          onChange={(e) => setSpaceType(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                        >
                          {SPACE_TYPES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Operating Hours
                        </label>
                        <input
                          type="text"
                          value={openingHours}
                          onChange={(e) => setOpeningHours(e.target.value)}
                          placeholder="24/7 Access or 7:00 AM - 10:00 PM"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Workspace Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe fiber ISP details, generator backup latency, cafe services, seating comfort..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Section 3: Rooms, Desks & Unit Inventory */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border pb-3 flex items-center gap-2">
                      <Layers className="text-primary" size={16} /> 3. Units & Inventory (Rooms, Desks, Meeting Halls)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Hot Desks */}
                      <div className="p-5 bg-muted/10 border border-border rounded-2xl space-y-3">
                        <div className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center justify-between">
                          <span>Hot Desks / Flexi Seats</span>
                          <span className="text-primary font-mono text-[10px] font-bold">Per Month</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Available Count</label>
                            <input
                              type="number"
                              value={hotDeskCount}
                              onChange={(e) => setHotDeskCount(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Monthly Rate ($)</label>
                            <input
                              type="number"
                              value={hotDeskPrice}
                              onChange={(e) => setHotDeskPrice(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dedicated Desks */}
                      <div className="p-5 bg-muted/10 border border-border rounded-2xl space-y-3">
                        <div className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center justify-between">
                          <span>Dedicated Fixed Desks</span>
                          <span className="text-primary font-mono text-[10px] font-bold">Per Month</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Available Count</label>
                            <input
                              type="number"
                              value={dedicatedDeskCount}
                              onChange={(e) => setDedicatedDeskCount(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Monthly Rate ($)</label>
                            <input
                              type="number"
                              value={dedicatedDeskPrice}
                              onChange={(e) => setDedicatedDeskPrice(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Private Rooms */}
                      <div className="p-5 bg-muted/10 border border-border rounded-2xl space-y-3">
                        <div className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center justify-between">
                          <span>Private Executive Rooms</span>
                          <span className="text-primary font-mono text-[10px] font-bold">Per Month</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Available Rooms</label>
                            <input
                              type="number"
                              value={privateRoomCount}
                              onChange={(e) => setPrivateRoomCount(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Monthly Rate ($)</label>
                            <input
                              type="number"
                              value={privateRoomPrice}
                              onChange={(e) => setPrivateRoomPrice(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Coliving Work & Stay Suites */}
                      <div className="p-5 bg-primary/10 border border-primary/30 rounded-2xl space-y-3">
                        <div className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center justify-between">
                          <span className="text-primary flex items-center gap-1">🛌 Coliving Suites (Room + Desk)</span>
                          <span className="text-primary font-mono text-[10px] font-bold">Per Month</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Available Suites</label>
                            <input
                              type="number"
                              value={colivingSuiteCount}
                              onChange={(e) => setColivingSuiteCount(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Monthly Rate ($)</label>
                            <input
                              type="number"
                              value={colivingSuitePrice}
                              onChange={(e) => setColivingSuitePrice(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Meeting Halls */}
                      <div className="p-5 bg-muted/10 border border-border rounded-2xl space-y-3">
                        <div className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center justify-between">
                          <span>Meeting Halls / Conference</span>
                          <span className="text-primary font-mono text-[10px] font-bold">Per Day</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Halls Count</label>
                            <input
                              type="number"
                              value={meetingHallCount}
                              onChange={(e) => setMeetingHallCount(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-1">Daily Rate ($)</label>
                            <input
                              type="number"
                              value={meetingHallPrice}
                              onChange={(e) => setMeetingHallPrice(e.target.value)}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Contact & Cover Photo (File Upload + URL Link) */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border pb-3 flex items-center gap-2">
                      <ImageIcon className="text-primary" size={16} /> 4. Cover Photo & Contact Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Public Booking Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="bookings@workplace.com"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          Website Link
                        </label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://workplace.com"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>

                    {/* DUAL COVER PHOTO SELECTION (FILE UPLOAD OR URL LINK) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                          Workspace Cover Photo
                        </label>
                        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border text-xs">
                          <button
                            type="button"
                            onClick={() => setPhotoMode("file")}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all ${
                              photoMode === "file"
                                ? "bg-primary text-black shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Upload size={12} /> Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotoMode("url")}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all ${
                              photoMode === "url"
                                ? "bg-primary text-black shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <LinkIcon size={12} /> Image URL Link
                          </button>
                        </div>
                      </div>

                      {uploadError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
                          {uploadError}
                        </div>
                      )}

                      {photoMode === "file" ? (
                        <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center transition-all bg-muted/10 group">
                          {uploadingImage ? (
                            <div className="py-4 space-y-2">
                              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                              <p className="text-xs font-bold text-foreground">Uploading cover image...</p>
                            </div>
                          ) : photoUrl ? (
                            <div className="relative max-w-md mx-auto rounded-xl overflow-hidden border border-border shadow-md group/preview">
                              <img
                                src={photoUrl}
                                alt="Cover Preview"
                                className="w-full h-44 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setPhotoUrl("")}
                                className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                                title="Remove photo"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer block space-y-2 py-3">
                              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto transition-colors" />
                              <p className="text-xs font-bold text-foreground">
                                Click or drag image file here to upload
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                PNG, JPG, or WEBP up to 10MB
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="url"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/your-workspace-photo"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                          />
                          {photoUrl && (
                            <div className="relative max-w-md rounded-xl overflow-hidden border border-border shadow-md">
                              <img
                                src={photoUrl}
                                alt="URL Preview"
                                className="w-full h-44 object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ADDITIONAL GALLERY PHOTOS SECTION */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-primary" /> Additional Gallery Photos ({additionalPhotos.length})
                        </label>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          Upload interior, desk setup, or meeting room photos
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* File Upload Dropzone */}
                        <label className="border border-dashed border-border hover:border-primary/50 bg-muted/10 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group">
                          <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-xs font-bold text-foreground">Upload Image File</span>
                          <span className="text-[10px] text-muted-foreground">JPG, PNG, WEBP</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                          />
                        </label>

                        {/* URL Link Input */}
                        <div className="bg-muted/10 border border-border rounded-2xl p-3 space-y-2 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-foreground block">Add Photo via URL</span>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={newGalleryUrl}
                              onChange={(e) => setNewGalleryUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/photo..."
                              className="flex-1 bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                            <button
                              type="button"
                              onClick={addGalleryUrl}
                              className="bg-primary text-black font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-yellow-400 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Photo Gallery Thumbnails Preview Grid */}
                      {(photoUrl || additionalPhotos.length > 0) && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-foreground block mb-2 uppercase tracking-wider">
                            Uploaded Photos Preview Grid
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                            {photoUrl && (
                              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary group shadow-sm">
                                <img src={photoUrl} alt="Cover" className="w-full h-full object-cover" />
                                <span className="absolute bottom-1 left-1 bg-primary text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                  Cover
                                </span>
                              </div>
                            )}
                            {additionalPhotos.map((url, idx) => (
                              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border group shadow-sm">
                                <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryPhoto(idx)}
                                  className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white p-1 rounded-full opacity-90 transition-all"
                                  title="Remove image"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
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
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                                selected
                                  ? "bg-primary text-black border-primary shadow-sm"
                                  : "bg-muted/15 border-border text-foreground hover:border-primary hover:text-primary"
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
                  <div className="pt-6 border-t border-border">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-yellow-400 disabled:opacity-50 text-black font-black py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 active:scale-[0.99]"
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
