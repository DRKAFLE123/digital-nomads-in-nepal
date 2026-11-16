"use client"

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react"
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Building,
  CheckCircle,
} from "lucide-react"
import WorkabilityScoreBadge from "./WorkabilityScoreBadge"

interface WorkspaceGalleryProps {
  photos: string[]
  hubName: string
  city: string
  isPartner?: boolean
  isVerified?: boolean
  rating?: number
  reviewsCount?: number
  facilities?: string[]
}

export default function WorkspaceGallery({
  photos,
  hubName,
  city,
  isPartner = false,
  isVerified = false,
  rating = 0,
  reviewsCount = 0,
  facilities = [],
}: WorkspaceGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev - 1 + photos.length) % photos.length)
      }
      if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev + 1) % photos.length)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, photos.length])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  function openLightbox(index: number) {
    setActiveIdx(index)
    setLightboxOpen(true)
  }

  const validPhotos = photos.filter(Boolean)
  const hasPhotos = validPhotos.length > 0

  return (
    <div className="w-full">
      {/* ============================================================== */}
      {/* 1. DESKTOP AIRBNB-STYLE GALLERY (hidden on mobile, flex on md+) */}
      {/* ============================================================== */}
      <div className="hidden md:block">
        {!hasPhotos ? (
          <div className="w-full h-[400px] bg-slate-100 dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <Building size={48} className="mb-2" />
            <p className="text-sm font-semibold">No photos uploaded yet</p>
          </div>
        ) : validPhotos.length === 1 ? (
          /* Single Photo Banner */
          <div className="relative w-full h-[420px] lg:h-[460px] rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-[#26262A] group shadow-sm bg-slate-900">
            <img
              src={validPhotos[0]}
              alt={`${hubName} in ${city}, Nepal`}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer"
              onClick={() => openLightbox(0)}
            />
            {/* Top Left Badges */}
            <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
              {isPartner && (
                <span className="flex items-center gap-1.5 bg-[#C2410C] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                  <Building size={13} className="fill-white" /> System Partner
                </span>
              )}
              {isVerified && (
                <span className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                  <CheckCircle size={13} className="fill-white" /> Verified WorkHub
                </span>
              )}
            </div>
            {/* Bottom Right Workability Score */}
            <div className="absolute bottom-5 right-5 z-10">
              <WorkabilityScoreBadge
                compact
                score={96}
                rating={rating}
                reviewsCount={reviewsCount}
                facilities={facilities}
              />
            </div>
            {/* Expand Button */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute top-5 right-5 bg-black/60 hover:bg-[#C2410C] text-white p-2.5 rounded-full transition-all backdrop-blur z-20 shadow-lg cursor-pointer"
              title="View full screen photo"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        ) : validPhotos.length < 5 ? (
          /* 2, 3 or 4 Photos Grid */
          <div className="relative w-full h-[400px] lg:h-[450px] rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-[#26262A] grid grid-cols-12 gap-2 shadow-sm bg-slate-900">
            {/* Main Cover (Left 7 Cols) */}
            <div
              onClick={() => openLightbox(0)}
              className="col-span-7 relative h-full overflow-hidden cursor-pointer group"
            >
              <img
                src={validPhotos[0]}
                alt={`${hubName} main cover`}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
                {isPartner && (
                  <span className="flex items-center gap-1.5 bg-[#C2410C] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    <Building size={13} className="fill-white" /> System Partner
                  </span>
                )}
                {isVerified && (
                  <span className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    <CheckCircle size={13} className="fill-white" /> Verified WorkHub
                  </span>
                )}
              </div>
            </div>

            {/* Right Side Stack (Remaining Photos) */}
            <div className="col-span-5 grid grid-rows-2 gap-2 h-full">
              {validPhotos.slice(1, 3).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx + 1)}
                  className="relative h-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={imgUrl}
                    alt={`${hubName} gallery photo ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>

            {/* Floating Show All Photos Button */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-5 right-5 bg-white/90 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-slate-900 dark:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur border border-slate-200 dark:border-white/20 transition-all cursor-pointer z-20 hover:scale-102 active:scale-98"
            >
              <ImageIcon size={14} className="text-[#C2410C] dark:text-[#FB923C]" />
              <span>Show all {validPhotos.length} photos</span>
            </button>
          </div>
        ) : (
          /* Full Airbnb 5-Photo Hero Grid */
          <div className="relative w-full h-[420px] lg:h-[470px] rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-[#26262A] grid grid-cols-12 gap-2 shadow-sm bg-slate-900">
            {/* 1 Big Featured Cover Photo on Left (7 cols) */}
            <div
              onClick={() => openLightbox(0)}
              className="col-span-7 relative h-full overflow-hidden cursor-pointer group"
            >
              <img
                src={validPhotos[0]}
                alt={`${hubName} main featured photo`}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Verified Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
                {isPartner && (
                  <span className="flex items-center gap-1.5 bg-[#C2410C] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    <Building size={13} className="fill-white" /> System Partner
                  </span>
                )}
                {isVerified && (
                  <span className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    <CheckCircle size={13} className="fill-white" /> Verified WorkHub
                  </span>
                )}
              </div>

              {/* Workability Score Badge */}
              <div className="absolute bottom-5 left-5 z-10">
                <WorkabilityScoreBadge
                  compact
                  score={96}
                  rating={rating}
                  reviewsCount={reviewsCount}
                  facilities={facilities}
                />
              </div>
            </div>

            {/* 4 Secondary Photos on Right (5 cols, 2x2 grid) */}
            <div className="col-span-5 grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {validPhotos.slice(1, 5).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx + 1)}
                  className="relative h-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={imgUrl}
                    alt={`${hubName} gallery photo ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>

            {/* Floating Show All Photos Button (Airbnb Style) */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-5 right-5 bg-white/90 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-slate-900 dark:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur border border-slate-200 dark:border-white/20 transition-all cursor-pointer z-20 hover:scale-102 active:scale-98"
            >
              <ImageIcon size={14} className="text-[#C2410C] dark:text-[#FB923C]" />
              <span>Show all {validPhotos.length} photos</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE RESPONSIVE CAROUSEL / SLIDER (visible on < md) */}
      {/* ============================================================== */}
      <div className="block md:hidden relative w-full h-[280px] rounded-2xl overflow-hidden border border-[#E8E2D8] dark:border-[#26262A] bg-slate-900">
        {hasPhotos ? (
          <>
            <img
              src={validPhotos[activeIdx % validPhotos.length]}
              alt={`${hubName} mobile photo`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openLightbox(activeIdx % validPhotos.length)}
            />
            {/* Prev / Next mobile arrows */}
            {validPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIdx(
                      (prev) => (prev - 1 + validPhotos.length) % validPhotos.length
                    )
                  }
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIdx((prev) => (prev + 1) % validPhotos.length)
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur z-20"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
                {/* Photo counter pill */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur z-20">
                  {(activeIdx % validPhotos.length) + 1} / {validPhotos.length}
                </div>
              </>
            )}
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              {isVerified && (
                <span className="flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  <CheckCircle size={11} className="fill-white" /> Verified
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Building size={36} className="mb-1" />
            <p className="text-xs font-semibold">No photos available</p>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. FULL-SCREEN LIGHTBOX MODAL (Airbnb Standard) */}
      {/* ============================================================== */}
      {lightboxOpen && hasPhotos && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold truncate max-w-md sm:max-w-xl">
                {hubName}
              </h2>
              <p className="text-xs text-slate-400">
                Photo {activeIdx + 1} of {validPhotos.length} • {city}, Nepal
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close gallery (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Full-Size Image Container */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden select-none">
            <img
              src={validPhotos[activeIdx]}
              alt={`Full size view ${activeIdx + 1}`}
              className="max-h-[75vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />

            {/* Previous Arrow Button */}
            {validPhotos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveIdx(
                    (prev) => (prev - 1 + validPhotos.length) % validPhotos.length
                  )
                }
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white transition-all backdrop-blur shadow-xl cursor-pointer"
                title="Previous photo (←)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next Arrow Button */}
            {validPhotos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveIdx((prev) => (prev + 1) % validPhotos.length)
                }
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white transition-all backdrop-blur shadow-xl cursor-pointer"
                title="Next photo (→)"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {validPhotos.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 [scrollbar-width:none]">
              {validPhotos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeIdx === i
                      ? "border-[#C2410C] scale-105 opacity-100 ring-2 ring-[#C2410C]/40"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
