"use client"

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react"
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, Filter, Camera, ShieldCheck } from "lucide-react"

interface ReviewItem {
  id: string
  rating: number
  reviewerName: string
  country?: string
  stayDuration?: string
  isVerifiedBooking?: boolean
  comment: string
  createdAt: string
  helpfulCount: number
  categoryRatings?: {
    internet: number
    power: number
    noise: number
    comfort: number
    videoCalls: number
  }
  tags?: string[]
  photos?: string[]
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    rating: 5,
    reviewerName: "Alex M.",
    country: "Germany",
    stayDuration: "2 weeks",
    isVerifiedBooking: true,
    comment: "Flawless fiber internet and automatic generator backup! I hosted 4 live video webinars during my stay without a single drop. Staff were super helpful and coffee is unlimited. Delicious local breakfast and momos right downstairs.",
    createdAt: "2026-08-20T10:00:00Z",
    helpfulCount: 14,
    categoryRatings: { internet: 5, power: 5, noise: 4, comfort: 5, videoCalls: 5 },
    tags: ["wifi", "power", "calls", "host", "food"],
    photos: ["/blog-cost-of-living.png", "/blog-lakeside-pokhara.png"],
  },
  {
    id: "r2",
    rating: 5,
    reviewerName: "Sarah T.",
    country: "United Kingdom",
    stayDuration: "1 month",
    isVerifiedBooking: true,
    comment: "The quiet call booths saved my life! Great ergonomic chairs, solid power backup during evening load cuts, and the view of the valley is unreal. The shared kitchen with fridge and tea station made long workdays so comfortable.",
    createdAt: "2026-08-12T14:30:00Z",
    helpfulCount: 9,
    categoryRatings: { internet: 5, power: 5, noise: 5, comfort: 5, videoCalls: 5 },
    tags: ["calls", "desk", "power", "location", "food"],
  },
  {
    id: "r3",
    rating: 5,
    reviewerName: "Elena B.",
    country: "Spain",
    stayDuration: "3 weeks",
    isVerifiedBooking: true,
    comment: "Stayed here while working remotely for an EU startup. The specialty coffee bar, fresh organic breakfast in the morning, and high-speed Starlink dual line made this my favorite workspace in Nepal. The host greeted me personally and gave great local tips!",
    createdAt: "2026-08-04T11:20:00Z",
    helpfulCount: 8,
    categoryRatings: { internet: 5, power: 5, noise: 4, comfort: 5, videoCalls: 5 },
    tags: ["food", "wifi", "host", "location"],
  },
  {
    id: "r4",
    rating: 5,
    reviewerName: "David K.",
    country: "United States",
    stayDuration: "3 weeks",
    isVerifiedBooking: true,
    comment: "Incredible dual-monitor setups and height-adjustable standing desks! Absolute lifesaver for long engineering sessions. Auto inverter power kicks in under 1 second, and the WiFi was consistently over 150 Mbps.",
    createdAt: "2026-07-29T16:00:00Z",
    helpfulCount: 11,
    categoryRatings: { internet: 5, power: 5, noise: 5, comfort: 5, videoCalls: 4 },
    tags: ["desk", "power", "wifi"],
  },
  {
    id: "r5",
    rating: 4,
    reviewerName: "Kenji R.",
    country: "Japan",
    stayDuration: "3 days",
    isVerifiedBooking: false,
    comment: "Fast WiFi and comfortable desks. Good specialty pour-over coffee and fresh lunch menu. A bit busy around 2 PM, but otherwise top notch. Very helpful host on WhatsApp.",
    createdAt: "2026-07-28T09:15:00Z",
    helpfulCount: 5,
    categoryRatings: { internet: 4, power: 4, noise: 4, comfort: 4, videoCalls: 4 },
    tags: ["wifi", "desk", "food", "host", "location"],
  },
]

const KEYWORD_FILTERS = [
  { id: "all", label: "All Reviews", icon: null },
  { id: "food", label: "Food & Drinks", icon: "☕", keywords: ["food", "coffee", "kitchen", "breakfast", "lunch", "cafe", "tea", "momo"] },
  { id: "wifi", label: "Internet & WiFi", icon: "⚡", keywords: ["wifi", "fiber", "internet", "starlink", "zoom", "speed", "mbps"] },
  { id: "desk", label: "Desk & Ergonomics", icon: "🪑", keywords: ["desk", "chair", "ergonomic", "monitor", "standing", "setup"] },
  { id: "calls", label: "Quiet & Calls", icon: "🤫", keywords: ["call", "quiet", "booth", "skype", "noise", "webinar"] },
  { id: "power", label: "Power Backup", icon: "🔌", keywords: ["power", "generator", "inverter", "load", "electricity", "backup"] },
  { id: "host", label: "Host & Staff", icon: "👥", keywords: ["host", "staff", "helpful", "friendly", "owner", "whatsapp"] },
  { id: "location", label: "Location & Views", icon: "📍", keywords: ["location", "view", "valley", "lake", "pokhara", "thamel", "terrace"] },
]

export default function WorkspaceReviewsSection({
  hubName = "Workspace",
  avgRating = 4.8,
  totalReviews = 42,
}: {
  hubName?: string
  avgRating?: number
  totalReviews?: number
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS)
  const [selectedKeyword, setSelectedKeyword] = useState("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  // New Review Form State
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [newReviewerName, setNewReviewerName] = useState("")

  function handleHelpful(id: string) {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    )
  }

  function handleAddReview(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || !newReviewerName.trim()) return

    const created: ReviewItem = {
      id: `r-${Date.now()}`,
      rating: newRating,
      reviewerName: newReviewerName,
      country: "Digital Nomad",
      stayDuration: "Recent Stay",
      isVerifiedBooking: true,
      comment: newComment,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      categoryRatings: { internet: 5, power: 5, noise: 4, comfort: 5, videoCalls: 5 },
      tags: ["wifi", "desk", "food", "host"],
    }

    setReviews([created, ...reviews])
    setNewComment("")
    setNewReviewerName("")
    setShowReviewModal(false)
  }

  const filteredReviews = reviews.filter(r => {
    if (verifiedOnly && !r.isVerifiedBooking) return false
    if (selectedKeyword === "all") return true

    const activeFilter = KEYWORD_FILTERS.find(k => k.id === selectedKeyword)
    if (!activeFilter || !activeFilter.keywords) return true

    const textToSearch = `${r.comment} ${r.reviewerName} ${r.country || ""} ${(r.tags || []).join(" ")}`.toLowerCase()
    return activeFilter.keywords.some(kw => textToSearch.includes(kw.toLowerCase()))
  })

  return (
    <div className="space-y-8">
      {/* Section Header & Rating Summary */}
      <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D8] dark:border-[#242424] pb-6">
          <div>
            <span className="text-xs font-bold text-[#C2410C] dark:text-[#FB923C] uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <ShieldCheck size={14} /> Verified Nomad Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Digital Nomad Reviews for {hubName}
            </h2>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#C2410C] hover:bg-[#9A3412] text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <MessageSquarePlus size={15} /> Write a Review
          </button>
        </div>

        {/* Rating Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Rating Box */}
          <div className="bg-[#FBF9F5] dark:bg-[#161616] border border-[#E8E2D8] dark:border-[#262626] rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-2">
            <span className="text-5xl font-black text-gray-900 dark:text-white font-mono">{avgRating.toFixed(1)}</span>
            <div className="flex text-[#EA580C] gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={16} className="fill-[#EA580C]" />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Based on {totalReviews} verified nomad stays</p>
          </div>

          {/* Category Sliders */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Internet Speed & Fiber", score: "4.9 / 5" },
              { name: "Power Backup Reliability", score: "4.9 / 5" },
              { name: "Noise Level & Focus", score: "4.7 / 5" },
              { name: "Workspace Ergonomics", score: "4.8 / 5" },
              { name: "Video Call Privacy", score: "4.8 / 5" },
              { name: "Value for Money", score: "4.9 / 5" },
            ].map(cat => (
              <div key={cat.name} className="bg-[#FBF9F5] dark:bg-[#161616] border border-[#E8E2D8] dark:border-[#222] rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{cat.name}</span>
                  <span className="font-bold text-[#C2410C] dark:text-[#FB923C] font-mono">{cat.score}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-[#222] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C2410C] h-full rounded-full w-[95%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nomad Community Photos (User-submitted workspace snapshots) */}
      <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#242424] rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#242424] pb-3">
          <div className="flex items-center gap-2">
            <Camera size={16} className="text-[#C2410C] dark:text-[#FB923C]" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Nomad Community Snapshots</h3>
          </div>
          <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
            Real workspace photos uploaded by remote workers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { src: "/blog-cost-of-living.png", author: "by Alex (Germany)" },
            { src: "/blog-lakeside-pokhara.png", author: "by Sarah (UK)" },
            { src: "/blog-top-10-destinations.png", author: "by Elena (Spain)" },
            { src: "/hero-bg.png", author: "by Kenji (Japan)" },
          ].map((item, idx) => (
            <div key={idx} className="h-32 bg-[#F8F6F0] dark:bg-[#181818] rounded-xl overflow-hidden border border-[#E8E2D8] dark:border-[#242424] group relative">
              <img src={item.src} alt="Nomad workspace snapshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-gray-300 font-medium backdrop-blur">
                {item.author}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Airbnb-Style Reviews Keyword Filter Bar */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#242424] rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[#C2410C] dark:text-[#FB923C]" />
              <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Filter Nomad Reviews by Topic:
              </span>
            </div>
            
            <button
              onClick={() => setVerifiedOnly(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                verifiedOnly
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white dark:bg-[#141414] border-[#E8E2D8] dark:border-[#242424] text-gray-700 dark:text-gray-300 hover:border-emerald-600"
              }`}
            >
              <CheckCircle size={13} className={verifiedOnly ? "fill-white text-emerald-600" : "text-emerald-600"} />
              <span>Verified Bookings Only</span>
            </button>
          </div>

          {/* Keyword Filter Chips (Airbnb Style) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {KEYWORD_FILTERS.map((kf) => {
              const isSelected = selectedKeyword === kf.id
              return (
                <button
                  key={kf.id}
                  onClick={() => setSelectedKeyword(kf.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? "bg-[#C2410C] text-white border-[#C2410C] shadow-sm scale-102"
                      : "bg-[#FBF9F5] dark:bg-[#1A1A1E] text-gray-700 dark:text-gray-300 border-[#E8E2D8] dark:border-[#28282C] hover:border-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {kf.icon && <span>{kf.icon}</span>}
                  <span>{kf.label}</span>
                </button>
              )
            })}
          </div>

          {/* Active Filter Summary */}
          {selectedKeyword !== "all" && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#A1A1AA] pt-1">
              <span>
                Showing {filteredReviews.length} {filteredReviews.length === 1 ? "review" : "reviews"} mentioning{" "}
                <strong className="text-gray-900 dark:text-white font-semibold">
                  "{KEYWORD_FILTERS.find(k => k.id === selectedKeyword)?.label}"
                </strong>
              </span>
              <button
                onClick={() => setSelectedKeyword("all")}
                className="text-[#C2410C] hover:underline font-bold"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#242424] rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                No reviews found matching "{KEYWORD_FILTERS.find(k => k.id === selectedKeyword)?.label}"
              </p>
              <button
                onClick={() => {
                  setSelectedKeyword("all")
                  setVerifiedOnly(false)
                }}
                className="text-xs text-[#C2410C] font-extrabold hover:underline"
              >
                Reset filters to see all reviews
              </button>
            </div>
          ) : (
            filteredReviews.map((r) => (
            <div key={r.id} className="bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#242424] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D8] dark:border-[#1e1e1e] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] font-extrabold flex items-center justify-center text-sm border border-[#C2410C]/20">
                    {r.reviewerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{r.reviewerName}</span>
                      {r.country && <span className="text-xs text-gray-500 dark:text-gray-400">({r.country})</span>}
                      {r.isVerifiedBooking && (
                        <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                          <CheckCircle size={10} /> Verified Booking
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Stayed: {r.stayDuration} • {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex text-[#EA580C] gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= r.rating ? "fill-[#EA580C]" : "text-gray-300 dark:text-gray-600"} />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{r.comment}</p>

              {r.photos && r.photos.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {r.photos.map((p, i) => (
                    <img key={i} src={p} alt="Review attachment" className="w-20 h-16 object-cover rounded-lg border border-[#E8E2D8] dark:border-[#242424]" />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D8] dark:border-[#1e1e1e] text-xs">
                <button
                  onClick={() => handleHelpful(r.id)}
                  className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#C2410C] dark:hover:text-[#FB923C] transition-colors cursor-pointer"
                >
                  <ThumbsUp size={13} />
                  <span>Helpful ({r.helpfulCount})</span>
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#121212] border border-[#E8E2D8] dark:border-[#282828] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#242424] pb-4">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Write a Nomad Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Your Name / Alias *
                </label>
                <input
                  type="text"
                  required
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="e.g. Alex (Berlin)"
                  className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#262626] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Overall Star Rating
                </label>
                <div className="flex text-[#EA580C] gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star size={24} className={star <= newRating ? "fill-[#EA580C]" : "text-gray-300 dark:text-gray-600"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Written Review (WiFi speed, power reliability, seating comfort) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details about fiber speeds, generator backup, noise level, and staff..."
                  className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-[#E8E2D8] dark:border-[#262626] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#E8E2D8] dark:border-[#333] text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Submit Verified Review ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
