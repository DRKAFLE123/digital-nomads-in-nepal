"use client"

import React, { useState, useMemo } from "react"
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  X,
  Mail,
  Phone,
  CheckCheck,
  ChevronRight,
  Filter,
  ExternalLink,
  MessageCircle,
  Search,
  ArrowLeft,
  Check,
  Building,
  RotateCcw
} from "lucide-react"
import { StoredEnquiry } from "@/app/api/work-hubs/[slug]/enquiry/route"

interface HostEnquiriesSectionProps {
  enquiries: StoredEnquiry[]
  isFullPage?: boolean
  onUpdateStatus: (enquiryId: string, hubId: string, newStatus: string, replyText?: string) => Promise<void>
  onViewAll?: () => void
}

export const ENQUIRY_STATUSES = [
  { id: "ALL", label: "All" },
  { id: "New", label: "New", color: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800" },
  { id: "Replied", label: "Replied", color: "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300 dark:border-sky-800" },
  { id: "In discussion", label: "In discussion", color: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800" },
  { id: "Booking requested", label: "Booking requested", color: "bg-orange-100 text-[#C2410C] dark:bg-orange-950/70 dark:text-[#FB923C] border-orange-300 dark:border-orange-800" },
  { id: "Converted", label: "Converted", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800" },
  { id: "Closed", label: "Closed", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700" }
]

const QUICK_TEMPLATES = [
  {
    label: "⚡ Wi-Fi & Power Ready",
    text: "Hi! Yes, our dual-fiber Wi-Fi and 100% generator power backup are ready. We also have private call booths available."
  },
  {
    label: "☕ Free Coffee Tour",
    text: "Hello! You are welcome to drop by for a free coffee and workspace tour anytime between 9 AM and 6 PM to test the setup."
  },
  {
    label: "📅 Dates Available",
    text: "Hi! Yes, we have availability for your requested dates. Feel free to submit your direct seat request here."
  },
  {
    label: "💬 Chat on WhatsApp",
    text: "Hi! I'd be happy to answer any questions or send current photos directly. Let's connect on WhatsApp!"
  }
]

export default function HostEnquiriesSection({
  enquiries,
  isFullPage = false,
  onUpdateStatus,
  onViewAll
}: HostEnquiriesSectionProps) {
  const [filter, setFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null)
  const [replyInput, setReplyInput] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [mobileView, setMobileView] = useState<"list" | "detail">("list")
  const [statusActionPending, setStatusActionPending] = useState<string | null>(null)

  // Filtered list based on status and search term
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesStatus =
        filter === "ALL" || e.status.toLowerCase() === filter.toLowerCase()
      if (!matchesStatus) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        e.nomadName.toLowerCase().includes(q) ||
        e.unitType.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        (e.tags && e.tags.some((t) => t.toLowerCase().includes(q)))
      )
    })
  }, [enquiries, filter, searchQuery])

  // Count active enquiries
  const newCount = useMemo(() => enquiries.filter((e) => e.status === "New").length, [enquiries])

  // Current active enquiry for detail pane
  const activeEnquiry = useMemo(() => {
    if (!selectedEnquiryId && filteredEnquiries.length > 0) {
      return filteredEnquiries[0]
    }
    return enquiries.find((e) => e.id === selectedEnquiryId) || filteredEnquiries[0] || null
  }, [selectedEnquiryId, filteredEnquiries, enquiries])

  // Sync reply text when active enquiry changes
  const handleSelectEnquiry = (enq: StoredEnquiry) => {
    setSelectedEnquiryId(enq.id)
    setReplyInput(enq.replyText || "")
    setMobileView("detail")
  }

  // Handle direct reply submit
  const handleSendReply = async () => {
    if (!activeEnquiry || !replyInput.trim()) return
    setIsSubmittingReply(true)
    try {
      await onUpdateStatus(activeEnquiry.id, activeEnquiry.hubId, "Replied", replyInput.trim())
    } finally {
      setIsSubmittingReply(false)
    }
  }

  // Handle direct status change
  const handleChangeStatus = async (newStatus: string) => {
    if (!activeEnquiry) return
    setStatusActionPending(newStatus)
    try {
      await onUpdateStatus(
        activeEnquiry.id,
        activeEnquiry.hubId,
        newStatus,
        replyInput.trim() ? replyInput.trim() : undefined
      )
    } finally {
      setStatusActionPending(null)
    }
  }

  // Helper for status badge colors
  const getStatusBadgeStyle = (status: string) => {
    const found = ENQUIRY_STATUSES.find((s) => s.id.toLowerCase() === status.toLowerCase())
    return found?.color || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }

  // Format initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  // Helper for WhatsApp click-to-chat
  const getWhatsAppLink = (enq: StoredEnquiry) => {
    if (!enq.nomadPhone) return null
    const cleanPhone = enq.nomadPhone.replace(/[^0-9]/g, "")
    if (!cleanPhone) return null
    const text = encodeURIComponent(
      `Hi ${enq.nomadName}! Thank you for your inquiry about ${enq.hubName} (${enq.unitType}) on Digital Nomads in Nepal. How can I help you?`
    )
    return `https://wa.me/${cleanPhone}?text=${text}`
  }

  return (
    <div className="space-y-3.5">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER WITH NOTIFICATION CHIP & QUICK VIEW ALL
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-gray-200 dark:border-[#222225]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <MessageSquare size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-gray-900 dark:text-white tracking-tight">
                {isFullPage ? "Enquiries & Lead Management" : "Recent enquiries"}
              </h2>
              {newCount > 0 && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  New {newCount}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prospective nomad leads, workspace inquiries, and guest questions needing your response.
            </p>
          </div>
        </div>

        {!isFullPage && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#C2410C] dark:text-[#FB923C] hover:underline self-start sm:self-center cursor-pointer"
          >
            <span>View all ({enquiries.length})</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. PRESERVED TOP STATUS FILTER PILLS (Clean & Filter at Top)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {ENQUIRY_STATUSES.map((tab) => {
          const count =
            tab.id === "ALL"
              ? enquiries.length
              : enquiries.filter((e) => e.status.toLowerCase() === tab.id.toLowerCase()).length

          const isSelected = filter === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setFilter(tab.id)
                setMobileView("list")
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#023629] text-white shadow-xs"
                  : "bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#25252A]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/5 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. META / WHATSAPP STYLE 2-PANE INBOX CONTAINER
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px] max-h-[680px]">
          {/* ═══════════════════════════════════════════════════════════════
              LEFT COLUMN: NARROW THREAD LIST (Desktop or Mobile List Mode)
             ═══════════════════════════════════════════════════════════════ */}
          <div
            className={`md:col-span-5 lg:col-span-4 border-r border-gray-200 dark:border-[#222225] flex flex-col h-[560px] sm:h-[620px] md:h-auto ${
              mobileView === "detail" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search Input in Left Column Header */}
            <div className="p-3 border-b border-gray-100 dark:border-[#202024] bg-gray-50/50 dark:bg-[#17171A]">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lead, unit, or note..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#121214] border border-gray-200 dark:border-[#28282C] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C2410C]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-[#1F1F24]">
              {filteredEnquiries.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare size={24} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">No leads found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Try clearing your search or filter.</p>
                </div>
              ) : (
                filteredEnquiries.map((enq) => {
                  const isSelected = activeEnquiry?.id === enq.id
                  const isNew = enq.status === "New"
                  const initials = getInitials(enq.nomadName)

                  return (
                    <div
                      key={enq.id}
                      onClick={() => handleSelectEnquiry(enq)}
                      className={`p-3.5 transition-all cursor-pointer relative flex items-start gap-3 ${
                        isSelected
                          ? "bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-[#C2410C]"
                          : "hover:bg-gray-50 dark:hover:bg-[#18181C]"
                      }`}
                    >
                      {/* Avatar with Initials & New Indicator */}
                      <div className="relative shrink-0 mt-0.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isNew
                              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40"
                              : "bg-gray-100 dark:bg-[#202025] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#2C2C32]"
                          }`}
                        >
                          {initials}
                        </div>
                        {isNew && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-[#141416]" />
                        )}
                      </div>

                      {/* Content Preview */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {enq.nomadName}
                          </h4>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-0.5 shrink-0">
                            <Clock size={10} />
                            {new Date(enq.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>

                        <div className="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate">
                          {enq.unitType} · <span className="text-gray-400">{enq.city}</span>
                        </div>

                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate line-clamp-1">
                          {enq.message}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(
                              enq.status
                            )}`}
                          >
                            {enq.status}
                          </span>

                          {enq.replyText && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCheck size={12} />
                              Replied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT COLUMN: ACTIVE MESSAGE THREAD & ACTIONS (WhatsApp Style)
             ═══════════════════════════════════════════════════════════════ */}
          <div
            className={`md:col-span-7 lg:col-span-8 flex flex-col h-[560px] sm:h-[620px] md:h-auto bg-[#FAF9F6]/40 dark:bg-[#111113] ${
              mobileView === "list" ? "hidden md:flex" : "flex"
            }`}
          >
            {activeEnquiry ? (
              <>
                {/* ── THREAD HEADER: Nomad Info & Contact Quick Actions ── */}
                <div className="p-3.5 sm:p-4 bg-white dark:bg-[#161618] border-b border-gray-200 dark:border-[#222225] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  {/* Left: Mobile Back Button + Nomad Details */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileView("list")}
                      className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg bg-gray-100 dark:bg-[#202024] cursor-pointer"
                      title="Back to leads list"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[#C2410C] flex items-center justify-center font-bold text-xs shrink-0">
                      {getInitials(activeEnquiry.nomadName)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                          {activeEnquiry.nomadName}
                        </h3>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(
                            activeEnquiry.status
                          )}`}
                        >
                          {activeEnquiry.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        Interested in <strong className="text-gray-700 dark:text-gray-300">{activeEnquiry.unitType}</strong> at {activeEnquiry.hubName} · {activeEnquiry.city}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons (WhatsApp, Email, Convert) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Direct WhatsApp Action */}
                    {activeEnquiry.nomadPhone ? (
                      <a
                        href={getWhatsAppLink(activeEnquiry) || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 transition-all cursor-pointer shadow-2xs"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={14} className="fill-[#25D366] text-[#25D366]" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    ) : null}

                    {/* Direct Email Action */}
                    <a
                      href={`mailto:${activeEnquiry.nomadEmail}?subject=${encodeURIComponent(
                        `Regarding your ${activeEnquiry.unitType} inquiry at ${activeEnquiry.hubName}`
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#202024] border border-gray-200 dark:border-[#2C2C30] transition-colors"
                      title="Send direct email"
                    >
                      <Mail size={13} />
                      <span className="hidden sm:inline">Email</span>
                    </a>

                    {/* Convert Button */}
                    {activeEnquiry.status !== "Converted" && (
                      <button
                        type="button"
                        disabled={statusActionPending === "Converted"}
                        onClick={() => handleChangeStatus("Converted")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer"
                        title="Mark inquiry as Converted to Booking"
                      >
                        <Check size={13} />
                        <span>Convert</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ── THREAD BODY: Chat Bubbles & Inquiry Context ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Inquiry Context Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-100/70 dark:bg-[#18181B] border border-gray-200/60 dark:border-[#26262B] text-[11px] text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[9px] bg-white dark:bg-[#202024] px-2 py-0.5 rounded-md border border-gray-200 dark:border-[#2C2C32]">
                        {activeEnquiry.listingType || "Workspace"}
                      </span>
                      <span>Topic: <strong>{activeEnquiry.topic || "Seat & Stay Availability"}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>Email: <strong className="text-gray-800 dark:text-gray-200">{activeEnquiry.nomadEmail}</strong></span>
                      {activeEnquiry.nomadPhone && (
                        <span>Phone: <strong className="text-gray-800 dark:text-gray-200">{activeEnquiry.nomadPhone}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Bubble 1: Nomad's Question / Lead Message (Left-Aligned) */}
                  <div className="flex items-start gap-2.5 max-w-xl">
                    <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-[#25252A] text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      {getInitials(activeEnquiry.nomadName)}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {activeEnquiry.nomadName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(activeEnquiry.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl rounded-tl-xs bg-white dark:bg-[#18181C] border border-gray-200 dark:border-[#2A2A30] text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed shadow-2xs">
                        &ldquo;{activeEnquiry.message}&rdquo;

                        {/* Intent Tags */}
                        {activeEnquiry.tags && activeEnquiry.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-100 dark:border-[#24242A]">
                            {activeEnquiry.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#222227] px-2 py-0.5 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bubble 2: Host Response Bubble (Right-Aligned, if replied) */}
                  {activeEnquiry.replyText ? (
                    <div className="flex items-start justify-end gap-2.5 max-w-xl ml-auto">
                      <div className="space-y-1.5 flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] text-gray-400">
                            {new Date(activeEnquiry.repliedAt || activeEnquiry.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                          <span className="text-xs font-bold text-[#023629] dark:text-[#A7F3D0]">
                            You (Host)
                          </span>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-xs bg-[#023629] text-white text-xs sm:text-sm leading-relaxed shadow-xs text-left">
                          <p>{activeEnquiry.replyText}</p>
                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/15 text-[10px] text-white/70">
                            <span className="flex items-center gap-1">
                              <CheckCheck size={12} className="text-emerald-400" />
                              Delivered to Nomad
                            </span>
                            <span>{new Date(activeEnquiry.repliedAt || activeEnquiry.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-[#023629] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                        H
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-gray-400 italic">
                      No response sent yet. Use the composer below or chat on WhatsApp.
                    </div>
                  )}
                </div>

                {/* ── THREAD FOOTER: Quick Canned Templates & Interactive Composer ── */}
                <div className="p-3 sm:p-4 bg-white dark:bg-[#161618] border-t border-gray-200 dark:border-[#222225] space-y-2.5 shadow-xs">
                  {/* Quick Reply Template Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Sparkles size={11} className="text-[#C2410C]" /> Quick:
                    </span>
                    {QUICK_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyInput(tmpl.text)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 dark:bg-[#202025] hover:bg-amber-100 dark:hover:bg-amber-950/40 text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-300 transition-colors whitespace-nowrap border border-gray-200 dark:border-[#2E2E34] cursor-pointer"
                      >
                        {tmpl.label}
                      </button>
                    ))}
                  </div>

                  {/* Reply Input Box */}
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={`Reply to ${activeEnquiry.nomadName}... (Sent via email & visible in nomad portal)`}
                      className="w-full bg-[#FAF9F6] dark:bg-[#121214] border border-gray-200 dark:border-[#28282E] rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C2410C] resize-none"
                    />
                  </div>

                  {/* Actions Bar: Status Changer + Send Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    {/* Status Select Buttons */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                        Move to:
                      </span>
                      {["In discussion", "Booking requested", "Closed"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={statusActionPending === st}
                          onClick={() => handleChangeStatus(st)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            activeEnquiry.status === st
                              ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 border-transparent"
                              : "border-gray-200 dark:border-[#2E2E34] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202025]"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Send Reply Button */}
                    <button
                      type="button"
                      disabled={isSubmittingReply || !replyInput.trim()}
                      onClick={handleSendReply}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#023629] hover:bg-[#034d3a] disabled:opacity-50 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <Send size={13} />
                      <span>{isSubmittingReply ? "Sending..." : "Send Response"}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare size={36} className="text-gray-300 dark:text-gray-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">No enquiry selected</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  Choose a nomad enquiry from the list on the left to review message history and reply.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
