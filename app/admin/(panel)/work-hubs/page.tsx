/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from "react"
import { Building, Calendar, Star, CheckCircle, Sparkles, Plus, Edit2, Trash2, Loader2, Save, X } from "lucide-react"

type Hub = {
  id: string
  name: string
  slug: string
  city: string
  description: string
  address: string
  rating: number
  totalReviews: number
  isVerified: boolean
  isPartner: boolean
  photoUrl: string | null
  facilities: string[]
  priceDaily: number | null
  priceMonthly: number | null
  contactEmail: string
  website: string | null
}

type Booking = {
  id: string
  nomadName: string
  nomadEmail: string
  startDate: string
  endDate: string
  notes: string | null
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  createdAt: string
  hub: {
    name: string
    city: string
  }
}

const CITIES = ["Kathmandu", "Pokhara", "Bandipur", "Chitwan", "Lumbini", "Mustang"]
const FACILITIES_LIST = ["High-Speed Fiber", "Backup Generator", "Ergonomic Chairs", "Coffee & Tea", "Skype Booths", "Meeting Rooms", "Standing Desks", "Phewa Lake View", "Outdoor Terrace", "Community Kitchen"]

export default function AdminWorkHubsPage() {
  const [activeTab, setActiveTab] = useState<"hubs" | "bookings">("hubs")
  const [hubs, setHubs] = useState<Hub[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  
  const [loadingHubs, setLoadingHubs] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)

  // Editor Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null)
  
  // Form fields
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [facilities, setFacilities] = useState<string[]>([])
  const [priceDaily, setPriceDaily] = useState("")
  const [priceMonthly, setPriceMonthly] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isPartner, setIsPartner] = useState(false)
  const [rating, setRating] = useState("4.0")
  const [totalReviews, setTotalReviews] = useState("0")

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function loadHubs() {
    setLoadingHubs(true)
    try {
      const res = await fetch("/api/admin/work-hubs")
      if (res.ok) {
        const data = await res.json()
        setHubs(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingHubs(false)
    }
  }

  async function loadBookings() {
    setLoadingBookings(true)
    try {
      const res = await fetch("/api/admin/bookings")
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => {
    loadHubs()
    loadBookings()
  }, [])

  function openEditModal(hub: Hub | null) {
    setSelectedHub(hub)
    if (hub) {
      setName(hub.name)
      setCity(hub.city)
      setAddress(hub.address)
      setDescription(hub.description)
      setContactEmail(hub.contactEmail)
      setWebsite(hub.website || "")
      setPhotoUrl(hub.photoUrl || "")
      setFacilities(Array.isArray(hub.facilities) ? (hub.facilities as string[]) : [])
      setPriceDaily(hub.priceDaily?.toString() || "")
      setPriceMonthly(hub.priceMonthly?.toString() || "")
      setIsVerified(hub.isVerified)
      setIsPartner(hub.isPartner)
      setRating(hub.rating.toString())
      setTotalReviews(hub.totalReviews.toString())
    } else {
      setName("")
      setCity("")
      setAddress("")
      setDescription("")
      setContactEmail("")
      setWebsite("")
      setPhotoUrl("")
      setFacilities([])
      setPriceDaily("")
      setPriceMonthly("")
      setIsVerified(false)
      setIsPartner(false)
      setRating("4.5")
      setTotalReviews("0")
    }
    setError("")
    setIsModalOpen(true)
  }

  async function handleSaveHub(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      name,
      city,
      address,
      description,
      contactEmail,
      website: website || null,
      photoUrl: photoUrl || null,
      facilities,
      priceDaily: priceDaily ? parseFloat(priceDaily) : null,
      priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
      isVerified,
      isPartner,
      rating: parseFloat(rating),
      totalReviews: parseInt(totalReviews)
    }

    try {
      const url = selectedHub ? `/api/admin/work-hubs/${selectedHub.id}` : "/api/admin/work-hubs"
      const method = selectedHub ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setIsModalOpen(false)
        loadHubs()
      } else {
        const errData = await res.json()
        setError(errData.error || "Failed to save workspace.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred saving workspace details.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteHub(id: string) {
    if (!confirm("Are you sure you want to delete this workspace?")) return
    try {
      const res = await fetch(`/api/admin/work-hubs/${id}`, { method: "DELETE" })
      if (res.ok) {
        loadHubs()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleUpdateBookingStatus(bookingId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus })
      })

      if (res.ok) {
        loadBookings()
      }
    } catch (err) {
      console.error(err)
    }
  }

  function toggleFacility(f: string) {
    setFacilities(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Building className="text-primary" />
            Coworking & Work Hubs CMS
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage workspace partnerships, verify testing reports, and update booking applications.
          </p>
        </div>
        <button
          onClick={() => openEditModal(null)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-yellow-500 text-black font-black rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          <Plus size={16} className="stroke-[3]" /> Add New Workspace
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-[#1e1e1e] mb-6">
        <button
          onClick={() => setActiveTab("hubs")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "hubs"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          <Building size={16} /> Workspaces ({hubs.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          <Calendar size={16} /> Bookings ({bookings.length})
        </button>
      </div>

      {/* TAB CONTENT: HUBS */}
      {activeTab === "hubs" && (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
          {loadingHubs ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : hubs.length === 0 ? (
            <div className="text-center py-16 text-muted text-sm">
              No workspaces in database. Click &quot;Add New Workspace&quot; to seed one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1e1e1e] bg-black/40 text-gray-400">
                    <th className="p-4 font-bold uppercase tracking-wider">Workspace</th>
                    <th className="p-4 font-bold uppercase tracking-wider">City / Location</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Rating</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Pricing</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e1e] text-gray-300">
                  {hubs.map(hub => (
                    <tr key={hub.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black border border-[#222] overflow-hidden flex items-center justify-center flex-shrink-0">
                            {hub.photoUrl ? (
                              <img src={hub.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{hub.name}</div>
                            <div className="text-gray-500 text-[10px] truncate max-w-xs">{hub.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">{hub.city}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                          <span className="font-bold">{hub.rating.toFixed(1)}</span>
                          <span className="text-gray-500">({hub.totalReviews})</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          {hub.priceDaily && <div>Daily: <span className="text-primary font-bold">${hub.priceDaily}</span></div>}
                          {hub.priceMonthly && <div>Monthly: <span className="text-primary font-bold">${hub.priceMonthly}</span></div>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {hub.isPartner && (
                            <span className="flex items-center gap-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded text-[9px] font-bold">
                              <Sparkles size={8} /> Partner
                            </span>
                          )}
                          {hub.isVerified && (
                            <span className="flex items-center gap-0.5 bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                              <CheckCircle size={8} /> Vetted
                            </span>
                          )}
                          {!hub.isPartner && !hub.isVerified && (
                            <span className="bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded text-[9px]">
                              Pending Review
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(hub)}
                            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteHub(hub.id)}
                            className="p-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                    <th className="p-4 font-bold uppercase tracking-wider">Special Requests</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e1e] text-gray-300">
                  {bookings.map(b => {
                    const start = new Date(b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                    const end = new Date(b.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
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
                        <td className="p-4 max-w-xs truncate" title={b.notes || ""}>
                          {b.notes || <span className="text-gray-600 italic">None</span>}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            b.status === "CONFIRMED"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : b.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={b.status === "CONFIRMED"}
                              onClick={() => handleUpdateBookingStatus(b.id, "CONFIRMED")}
                              className="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-30 disabled:hover:bg-green-500 text-black font-extrabold rounded-md text-[10px]"
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* HUB EDITOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl w-full max-w-3xl overflow-hidden relative shadow-2xl my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1e1e1e] flex justify-between items-center bg-black/40">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building className="text-primary w-5 h-5" />
                {selectedHub ? "Modify Workspace" : "Add Workspace Partner"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveHub} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {/* Grid 1: Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="WorkSpace Kathmandu"
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    City Location
                  </label>
                  <select
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                  >
                    <option value="">Select City...</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Full Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Jhamsikhel Rd, Lalitpur, Kathmandu"
                  className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Workspace Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide details about speed tests, backing systems, workspace vibe..."
                  className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none leading-relaxed"
                />
              </div>

              {/* Grid 2: Contacts & Rates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
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
                    onChange={e => setWebsite(e.target.value)}
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
                    onChange={e => setPhotoUrl(e.target.value)}
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
                      onChange={e => setPriceDaily(e.target.value)}
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
                      onChange={e => setPriceMonthly(e.target.value)}
                      placeholder="120"
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 3: Vetting metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Vetted Score
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={rating}
                      onChange={e => setRating(e.target.value)}
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Reviews Count
                    </label>
                    <input
                      type="number"
                      value={totalReviews}
                      onChange={e => setTotalReviews(e.target.value)}
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex gap-4 items-end pb-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isVerified}
                      onChange={e => setIsVerified(e.target.checked)}
                      className="accent-primary"
                    />
                    <span>Verified Workspace</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPartner}
                      onChange={e => setIsPartner(e.target.checked)}
                      className="accent-primary"
                    />
                    <span>Partner Workspace</span>
                  </label>
                </div>
              </div>

              {/* Facilities selection */}
              <div className="space-y-2 pt-2 border-t border-[#1e1e1e]">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Workspace Amenities
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {FACILITIES_LIST.map(f => {
                    const selected = facilities.includes(f)
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
                    )
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
                  {saving ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Save size={12} />
                  )}
                  Save Workspace
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
