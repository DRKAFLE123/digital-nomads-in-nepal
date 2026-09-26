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
    comment: "Flawless fiber internet and automatic generator backup! I hosted 4 live video webinars during my stay without a single drop. Staff were super helpful and coffee is unlimited.",
    createdAt: "2026-08-20T10:00:00Z",
    helpfulCount: 14,
    categoryRatings: { internet: 5, power: 5, noise: 4, comfort: 5, videoCalls: 5 },
    photos: ["/blog-cost-of-living.png", "/blog-lakeside-pokhara.png"],
  },
  {
    id: "r2",
    rating: 5,
    reviewerName: "Sarah T.",
    country: "United Kingdom",
    stayDuration: "1 month",
    isVerifiedBooking: true,
    comment: "The quiet call booths saved my life! Great ergonomic chairs, solid power backup during evening load cuts, and the view of the valley is unreal.",
    createdAt: "2026-08-12T14:30:00Z",
    helpfulCount: 9,
    categoryRatings: { internet: 5, power: 5, noise: 5, comfort: 5, videoCalls: 5 },
  },
  {
    id: "r3",
    rating: 4,
    reviewerName: "Kenji R.",
    country: "Japan",
    stayDuration: "3 days",
    isVerifiedBooking: false,
    comment: "Fast WiFi and comfortable desks. Good coffee near Thamel. A bit crowded around 2 PM, but otherwise top notch.",
    createdAt: "2026-07-28T09:15:00Z",
    helpfulCount: 5,
    categoryRatings: { internet: 4, power: 4, noise: 4, comfort: 4, videoCalls: 4 },
  },
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
  const [filterTab, setFilterTab] = useState("all")
  const [activePhotoTab, setActivePhotoTab] = useState<"nomad" | "owner">("nomad")
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
    }

    setReviews([created, ...reviews])
    setNewComment("")
    setNewReviewerName("")
    setShowReviewModal(false)
  }

  const filteredReviews = reviews.filter(r => {
    if (filterTab === "verified") return r.isVerifiedBooking
    return true
  })

  return (
    <div className="space-y-8">
      {/* Section Header & Rating Summary */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <ShieldCheck size={14} /> Verified Nomad Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Digital Nomad Reviews for {hubName}
            </h2>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-amber-400 text-black font-extrabold text-xs rounded-xl hover:bg-yellow-300 transition-all shadow-md shadow-amber-400/20 active:scale-95"
          >
            <MessageSquarePlus size={15} /> Write a Review
          </button>
        </div>

        {/* Rating Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Rating Box */}
          <div className="bg-[#161616] border border-[#262626] rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-2">
            <span className="text-5xl font-black text-white font-mono">{avgRating.toFixed(1)}</span>
            <div className="flex text-amber-400 gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={16} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-400">Based on {totalReviews} verified nomad stays</p>
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
              <div key={cat.name} className="bg-[#161616] border border-[#222] rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{cat.name}</span>
                  <span className="font-bold text-amber-400">{cat.score}</span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full w-[95%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nomad Photos vs Owner Photos Tabs */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#242424] pb-3">
          <div className="flex items-center gap-2">
            <Camera size={16} className="text-amber-400" />
            <h3 className="text-base font-bold text-white">Community Photo Gallery</h3>
          </div>
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-[#2a2a2a] text-xs">
            <button
              onClick={() => setActivePhotoTab("nomad")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activePhotoTab === "nomad" ? "bg-amber-400 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Nomad Photos (12)
            </button>
            <button
              onClick={() => setActivePhotoTab("owner")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activePhotoTab === "owner" ? "bg-amber-400 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Owner Photos (8)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(activePhotoTab === "nomad"
            ? ["/blog-cost-of-living.png", "/blog-lakeside-pokhara.png", "/blog-top-10-destinations.png", "/hero-bg.png"]
            : ["/nepal-blog-hero-banner.png", "/blog-safety-health.png", "/blog-list-workspace.png", "/webistepnglogo.png"]
          ).map((src, idx) => (
            <div key={idx} className="h-32 bg-[#181818] rounded-xl overflow-hidden border border-[#242424] group relative">
              <img src={src} alt="Workspace gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-gray-300 font-medium backdrop-blur">
                {activePhotoTab === "nomad" ? "by Alex (Nomad)" : "Official Space Photo"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Filter Bar & Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter Reviews:</span>
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                filterTab === "all" ? "bg-amber-400 text-black border-amber-400" : "bg-[#141414] border-[#242424] text-gray-300"
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilterTab("verified")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                filterTab === "verified" ? "bg-amber-400 text-black border-amber-400" : "bg-[#141414] border-[#242424] text-gray-300"
              }`}
            >
              Verified Nomad Bookings Only
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((r) => (
            <div key={r.id} className="bg-[#121212] border border-[#242424] rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e1e1e] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 font-extrabold flex items-center justify-center text-sm border border-amber-400/30">
                    {r.reviewerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{r.reviewerName}</span>
                      {r.country && <span className="text-xs text-gray-400">({r.country})</span>}
                      {r.isVerifiedBooking && (
                        <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle size={10} /> Verified Booking
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500">Stayed: {r.stayDuration} • {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= r.rating ? "fill-amber-400" : "text-gray-600"} />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed">{r.comment}</p>

              {r.photos && r.photos.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {r.photos.map((p, i) => (
                    <img key={i} src={p} alt="Review attachment" className="w-20 h-16 object-cover rounded-lg border border-[#242424]" />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#1e1e1e] text-xs">
                <button
                  onClick={() => handleHelpful(r.id)}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <ThumbsUp size={13} />
                  <span>Helpful ({r.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#121212] border border-[#282828] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <h3 className="text-xl font-black text-white">Write a Nomad Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Your Name / Alias *
                </label>
                <input
                  type="text"
                  required
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="e.g. Alex (Berlin)"
                  className="w-full bg-[#181818] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Overall Star Rating
                </label>
                <div className="flex text-amber-400 gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star size={24} className={star <= newRating ? "fill-amber-400" : "text-gray-600"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Written Review (WiFi speed, power reliability, seating comfort) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details about fiber speeds, generator backup, noise level, and staff..."
                  className="w-full bg-[#181818] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#333] text-gray-300 font-bold text-xs hover:bg-[#1a1a1a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 text-black font-black text-xs hover:bg-yellow-300 shadow-md shadow-amber-400/20"
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
