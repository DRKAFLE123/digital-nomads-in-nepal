/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Calendar,
  CheckCircle,
  Award,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Save,
  X,
  User,
  Layers,
} from "lucide-react";

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
  ownerEmail?: string | null;
  ownerName?: string | null;
  spaceType?: string | null;
  units?: Unit[] | null;
  openingHours?: string | null;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isPartner: boolean;
  photoUrl: string | null;
  facilities: string[];
  priceDaily: number | null;
  priceMonthly: number | null;
  contactEmail: string;
  website: string | null;
};

type Booking = {
  id: string;
  nomadName: string;
  nomadEmail: string;
  startDate: string;
  endDate: string;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  hub: {
    name: string;
    city: string;
  };
};

const CITIES = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bandipur",
  "Chitwan",
  "Lumbini",
  "Mustang",
];

const FACILITIES_LIST = [
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

export default function AdminWorkHubsPage() {
  const [activeTab, setActiveTab] = useState<"hubs" | "bookings">("hubs");
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loadingHubs, setLoadingHubs] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Editor Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);

  // Form fields
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
  const [facilities, setFacilities] = useState<string[]>([]);
  const [priceDaily, setPriceDaily] = useState("");
  const [priceMonthly, setPriceMonthly] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [rating, setRating] = useState("4.5");
  const [totalReviews, setTotalReviews] = useState("0");

  // Unit Inventory Counts
  const [hotDeskCount, setHotDeskCount] = useState("10");
  const [dedicatedDeskCount, setDedicatedDeskCount] = useState("5");
  const [privateRoomCount, setPrivateRoomCount] = useState("2");
  const [meetingHallCount, setMeetingHallCount] = useState("1");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadHubs() {
    setLoadingHubs(true);
    try {
      const res = await fetch("/api/admin/work-hubs");
      if (res.ok) {
        const data = await res.json();
        setHubs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHubs(false);
    }
  }

  async function loadBookings() {
    setLoadingBookings(true);
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  }

  useEffect(() => {
    loadHubs();
    loadBookings();
  }, []);

  function openEditModal(hub: Hub | null) {
    setSelectedHub(hub);
    if (hub) {
      setName(hub.name);
      setCity(hub.city);
      setAddress(hub.address);
      setOwnerName(hub.ownerName || "");
      setOwnerEmail(hub.ownerEmail || hub.contactEmail || "");
      setSpaceType(hub.spaceType || "Coworking Hub");
      setOpeningHours(hub.openingHours || "24/7 Access");
      setDescription(hub.description);
      setContactEmail(hub.contactEmail);
      setWebsite(hub.website || "");
      setPhotoUrl(hub.photoUrl || "");
      setFacilities(Array.isArray(hub.facilities) ? (hub.facilities as string[]) : []);
      setPriceDaily(hub.priceDaily?.toString() || "");
      setPriceMonthly(hub.priceMonthly?.toString() || "");
      setIsVerified(hub.isVerified);
      setIsPartner(hub.isPartner);
      setRating(hub.rating.toString());
      setTotalReviews(hub.totalReviews.toString());

      // Parse units if existing
      const u = Array.isArray(hub.units) ? (hub.units as Unit[]) : [];
      const hd = u.find((x) => x.type === "hot_desk");
      const dd = u.find((x) => x.type === "dedicated_desk");
      const pr = u.find((x) => x.type === "private_room");
      const mh = u.find((x) => x.type === "meeting_hall");

      setHotDeskCount(hd?.count.toString() || "10");
      setDedicatedDeskCount(dd?.count.toString() || "5");
      setPrivateRoomCount(pr?.count.toString() || "2");
      setMeetingHallCount(mh?.count.toString() || "1");
    } else {
      setName("");
      setCity("Kathmandu");
      setAddress("");
      setOwnerName("SuperAdmin");
      setOwnerEmail("admin@digitalnomadsinnepal.com");
      setSpaceType("Coworking & Hot Desk Hub");
      setOpeningHours("24/7 Access");
      setDescription("");
      setContactEmail("");
      setWebsite("");
      setPhotoUrl("");
      setFacilities([]);
      setPriceDaily("");
      setPriceMonthly("");
      setIsVerified(true);
      setIsPartner(true);
      setRating("4.8");
      setTotalReviews("12");

      setHotDeskCount("10");
      setDedicatedDeskCount("5");
      setPrivateRoomCount("2");
      setMeetingHallCount("1");
    }
    setError("");
    setIsModalOpen(true);
  }

  async function handleSaveHub(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const unitsPayload = [
      {
        type: "hot_desk",
        name: "Hot Desks",
        count: parseInt(hotDeskCount) || 0,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : 80,
      },
      {
        type: "dedicated_desk",
        name: "Dedicated Desks",
        count: parseInt(dedicatedDeskCount) || 0,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) * 1.3 : 120,
      },
      {
        type: "private_room",
        name: "Private Rooms",
        count: parseInt(privateRoomCount) || 0,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) * 3 : 350,
      },
      {
        type: "meeting_hall",
        name: "Meeting Halls",
        count: parseInt(meetingHallCount) || 0,
        priceDaily: priceDaily ? parseFloat(priceDaily) : 20,
      },
    ];

    const payload = {
      name,
      city,
      address,
      description,
      contactEmail,
      website: website || null,
      photoUrl: photoUrl || null,
      ownerName,
      ownerEmail,
      spaceType,
      openingHours,
      units: unitsPayload,
      facilities,
      priceDaily: priceDaily ? parseFloat(priceDaily) : null,
      priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
      isVerified,
      isPartner,
      rating: parseFloat(rating),
      totalReviews: parseInt(totalReviews),
    };

    try {
      const url = selectedHub
        ? `/api/admin/work-hubs/${selectedHub.id}`
        : "/api/admin/work-hubs";
      const method = selectedHub ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadHubs();
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to save workspace.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred saving workspace details.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteHub(id: string) {
    if (!confirm("Are you sure you want to delete this workspace?")) return;
    try {
      const res = await fetch(`/api/admin/work-hubs/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadHubs();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateBookingStatus(bookingId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });

      if (res.ok) {
        loadBookings();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function toggleFacility(f: string) {
    setFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e1e1e] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Building className="text-primary" />
            Coworking & WorkHub CMS
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Superadmin Management: Register, verify, feature, and manage coworking spaces across all owners and locations.
          </p>
        </div>
        <button
          onClick={() => openEditModal(null)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-yellow-500 text-black font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          <Plus size={16} className="stroke-[3]" /> Add New Workspace
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-[#1e1e1e]">
        <button
          onClick={() => setActiveTab("hubs")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "hubs"
              ? "border-primary text-primary"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Building size={16} /> Workspaces Marketplace ({hubs.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-primary text-primary"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Calendar size={16} /> Reserved Bookings ({bookings.length})
        </button>
      </div>

      {/* TAB CONTENT: HUBS */}
      {activeTab === "hubs" && (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl">
          {loadingHubs ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : hubs.length === 0 ? (
            <div className="text-center py-16 text-muted text-sm space-y-3">
              <p>No workspaces in database yet.</p>
              <button
                onClick={() => openEditModal(null)}
                className="px-5 py-2 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Seed Workspace
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1e1e1e] bg-black/40 text-gray-400">
                    <th className="p-4 font-bold uppercase tracking-wider">Workspace Profile</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Owner Account</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Location / Hours</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Unit Inventory</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Pricing</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e1e] text-gray-300">
                  {hubs.map((hub) => {
                    const units = Array.isArray(hub.units) ? (hub.units as Unit[]) : [];
                    return (
                      <tr key={hub.id} className="hover:bg-white/5 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-black border border-[#222] overflow-hidden flex items-center justify-center flex-shrink-0">
                              {hub.photoUrl ? (
                                <img
                                  src={hub.photoUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{hub.name}</div>
                              <div className="text-gray-500 text-[10px] truncate max-w-xs">
                                📍 {hub.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">
                            {hub.ownerName || "SuperAdmin"}
                          </div>
                          <div className="text-gray-500 text-[10px]">
                            {hub.ownerEmail || hub.contactEmail}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-primary">{hub.city}</div>
                          <div className="text-gray-400 text-[10px]">
                            ⏰ {hub.openingHours || "24/7 Access"}
                          </div>
                        </td>
                        <td className="p-4">
                          {units.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {units.map((u, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-gray-300 font-mono"
                                >
                                  {u.count} {u.name || u.type}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-600 italic">Standard Seating</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            {hub.priceDaily && (
                              <div>
                                Daily: <span className="text-primary font-bold">${hub.priceDaily}</span>
                              </div>
                            )}
                            {hub.priceMonthly && (
                              <div>
                                Monthly: <span className="text-primary font-bold">${hub.priceMonthly}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {hub.isPartner && (
                              <span className="flex items-center gap-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded text-[9px] font-bold">
                                <Award size={8} /> Partner
                              </span>
                            )}
                            {hub.isVerified && (
                              <span className="flex items-center gap-0.5 bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                                <CheckCircle size={8} /> Vetted
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(hub)}
                              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                              title="Edit Workspace"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteHub(hub.id)}
                              className="p-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                              title="Delete Workspace"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
          {loadingBookings ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-muted text-sm">
              No booking applications received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1e1e1e] bg-black/40 text-gray-400">
                    <th className="p-4 font-bold uppercase tracking-wider">Nomad Info</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Target Workspace</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Reserved Dates</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e1e] text-gray-300">
                  {bookings.map((b) => {
                    const start = new Date(b.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    });
                    const end = new Date(b.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
                    });
                    return (
                      <tr key={b.id} className="hover:bg-white/5 transition-all">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{b.nomadName}</div>
                          <div className="text-gray-500 text-[10px]">{b.nomadEmail}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{b.hub.name}</div>
                          <div className="text-gray-500 text-[10px]">📍 {b.hub.city}</div>
                        </td>
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-1 text-primary">
                            <span>{start}</span>
                            <span className="text-gray-500 font-normal">→</span>
                            <span>{end}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              b.status === "CONFIRMED"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : b.status === "CANCELLED"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={b.status === "CONFIRMED"}
                              onClick={() => handleUpdateBookingStatus(b.id, "CONFIRMED")}
                              className="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-30 text-black font-extrabold rounded-md text-[10px]"
                            >
                              Confirm
                            </button>
                            <button
                              disabled={b.status === "CANCELLED"}
                              onClick={() => handleUpdateBookingStatus(b.id, "CANCELLED")}
                              className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/25 disabled:opacity-30 text-red-400 font-semibold rounded-md text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUPERADMIN WORKSPACE EDITOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl w-full max-w-3xl overflow-hidden relative shadow-2xl my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1e1e1e] flex justify-between items-center bg-black/40">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building className="text-primary w-5 h-5" />
                {selectedHub ? "Modify Workspace Listing" : "Add New Workspace Listing"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveHub} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {/* Owner Info */}
              <div className="space-y-3 bg-black/50 p-4 border border-[#1e1e1e] rounded-xl">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} /> Owner Account Credentials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Space Manager Name"
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Owner Email</label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="owner@workplace.com"
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Workspace Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Workspace Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="WorkSpace Kathmandu"
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    City Location *
                  </label>
                  <select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                  >
                    <option value="">Select City...</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Space Classification
                  </label>
                  <input
                    type="text"
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    placeholder="Coworking & Hot Desk Hub"
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="24/7 Access"
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Full Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jhamsikhel Rd, Lalitpur"
                  className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Workspace Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe workspace vibe, ISP speeds, generator backup systems..."
                  className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none leading-relaxed"
                />
              </div>

              {/* Units & Inventory Management */}
              <div className="space-y-3 bg-black/50 p-4 border border-[#1e1e1e] rounded-xl">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} /> Room & Unit Counts
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Hot Desks</label>
                    <input
                      type="number"
                      value={hotDeskCount}
                      onChange={(e) => setHotDeskCount(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Dedicated Desks</label>
                    <input
                      type="number"
                      value={dedicatedDeskCount}
                      onChange={(e) => setDedicatedDeskCount(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Private Rooms</label>
                    <input
                      type="number"
                      value={privateRoomCount}
                      onChange={(e) => setPrivateRoomCount(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Meeting Halls</label>
                    <input
                      type="number"
                      value={meetingHallCount}
                      onChange={(e) => setMeetingHallCount(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Rates & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Contact Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="manager@workspace.com"
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Website Link
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://workspace.com"
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Cover Photo URL
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/your-work-photo"
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Daily Rate ($)
                    </label>
                    <input
                      type="number"
                      value={priceDaily}
                      onChange={(e) => setPriceDaily(e.target.value)}
                      placeholder="10"
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Monthly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={priceMonthly}
                      onChange={(e) => setPriceMonthly(e.target.value)}
                      placeholder="120"
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="accent-primary"
                  />
                  <span>Vetted / Verified Status</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPartner}
                    onChange={(e) => setIsPartner(e.target.checked)}
                    className="accent-primary"
                  />
                  <span>System Partner Badge</span>
                </label>
              </div>

              {/* Amenities */}
              <div className="space-y-2 pt-2 border-t border-[#1e1e1e]">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Workspace Amenities
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {FACILITIES_LIST.map((f) => {
                    const selected = facilities.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFacility(f)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
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

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-[#1e1e1e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary hover:bg-yellow-500 disabled:opacity-50 text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
