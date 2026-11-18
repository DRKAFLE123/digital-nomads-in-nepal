"use client"

import React, { useState } from "react"
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
  Filter
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
  { id: "New", label: "New", countKey: "New", color: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800" },
  { id: "Replied", label: "Replied", countKey: "Replied", color: "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300 dark:border-sky-800" },
  { id: "In discussion", label: "In discussion", countKey: "In discussion", color: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800" },
  { id: "Booking requested", label: "Booking requested", countKey: "Booking requested", color: "bg-orange-100 text-[#C2410C] dark:bg-orange-950/70 dark:text-[#FB923C] border-orange-300 dark:border-orange-800" },
  { id: "Converted", label: "Converted", countKey: "Converted", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800" },
  { id: "Closed", label: "Closed", countKey: "Closed", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700" }
]

export default function HostEnquiriesSection({
  enquiries,
  isFullPage = false,
  onUpdateStatus,
  onViewAll
}: HostEnquiriesSectionProps) {
  const [filter, setFilter] = useState("ALL")
  const [activeEnquiry, setActiveEnquiry] = useState<StoredEnquiry | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const newCount = enquiries.filter((e) => e.status === "New").length
  const repliedCount = enquiries.filter((e) => e.status === "Replied").length
  const convertedCount = enquiries.filter((e) => e.status === "Converted").length

  const filtered = enquiries.filter((e) => {
    if (filter === "ALL") return true
    return e.status.toLowerCase() === filter.toLowerCase()
  })

  // Display top 4 on dashboard, or full list on dedicated page
  const displayEnquiries = isFullPage ? filtered : filtered.slice(0, 4)

  const handleOpenReply = (enq: StoredEnquiry) => {
    setActiveEnquiry(enq)
    setReplyText(enq.replyText || "")
  }

  const handleSendReply = async () => {
    if (!activeEnquiry || !replyText.trim()) return
    setIsReplying(true)
    try {
      await onUpdateStatus(activeEnquiry.id, activeEnquiry.hubId, "Replied", replyText.trim())
      setActiveEnquiry(null)
      setReplyText("")
    } finally {
      setIsReplying(false)
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    const found = ENQUIRY_STATUSES.find((s) => s.id.toLowerCase() === status.toLowerCase())
    return found?.color || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-[#222225] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
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

      {/* Status Explanations Banner (Shown on Full Page) */}
      {isFullPage && (
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161618] border border-gray-200 dark:border-[#26262A] text-xs space-y-2">
          <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px] block">
            Enquiry Statuses &amp; Lead Lifecycle
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
            <div><strong className="text-amber-600">New:</strong> Host hasn&apos;t responded</div>
            <div><strong className="text-sky-600">Replied:</strong> Host has responded</div>
            <div><strong className="text-purple-600">In discussion:</strong> Ongoing chat</div>
            <div><strong className="text-[#C2410C]">Booking requested:</strong> Seat request submitted</div>
            <div><strong className="text-emerald-600">Converted:</strong> Became a booking</div>
            <div><strong className="text-gray-500">Closed:</strong> Completed or declined</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
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
              onClick={() => setFilter(tab.id)}
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

      {/* Enquiries Feed */}
      {displayEnquiries.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl">
          <MessageSquare size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">No enquiries in this filter</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            When nomads contact you about your spaces, their messages and questions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayEnquiries.map((enq) => {
            const isNew = enq.status === "New"

            return (
              <div
                key={enq.id}
                className={`bg-white dark:bg-[#141416] border rounded-2xl p-4 sm:p-5 transition-all shadow-xs space-y-3 ${
                  isNew
                    ? "border-amber-400/60 dark:border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10"
                    : "border-gray-200 dark:border-[#26262A] hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                {/* Card Top Row: Type, Status, Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 dark:bg-[#202024] px-2.5 py-0.5 rounded-full">
                      {enq.listingType === "Work + Stay" ? "Stay + Work enquiry" : "Workspace enquiry"}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(enq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(
                        enq.status
                      )}`}
                    >
                      {enq.status}
                    </span>
                  </div>
                </div>

                {/* Nomad Identity & Interest */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <User size={14} className="text-[#C2410C]" />
                    <span>{enq.nomadName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      · Interested in {enq.unitType} · {enq.city}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed bg-[#FBF9F5] dark:bg-[#1A1A1E] p-3 rounded-xl border border-gray-100 dark:border-[#26262A] italic">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                </div>

                {/* Host Reply Preview (if replied) */}
                {enq.replyText && (
                  <div className="pl-3 border-l-2 border-emerald-500 text-xs text-gray-600 dark:text-gray-300 bg-emerald-50/30 dark:bg-emerald-950/20 p-2.5 rounded-r-xl">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 text-[10px] uppercase tracking-wider block">
                      Your Response ({new Date(enq.repliedAt || enq.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}):
                    </span>
                    <p className="mt-0.5">{enq.replyText}</p>
                  </div>
                )}

                {/* Intent Tag Pills & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100 dark:border-[#222225]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {enq.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#202024] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReply(enq)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#023629] hover:bg-[#034a38] text-white shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Send size={12} />
                      <span>{enq.replyText ? "Edit Response" : "View and respond"}</span>
                    </button>

                    {enq.status === "New" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(enq.id, enq.hubId, "Replied")}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] border border-gray-200 dark:border-[#333] transition-colors cursor-pointer"
                      >
                        Mark Replied
                      </button>
                    )}

                    {enq.status !== "Converted" && enq.status !== "Closed" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(enq.id, enq.hubId, "Converted")}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer"
                        title="Mark as Converted to Booking"
                      >
                        ✓ Converted
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reply Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#222225] pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Reply to Nomad Lead
                </span>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {activeEnquiry.nomadName} ({activeEnquiry.nomadEmail})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveEnquiry(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#FAF8F5] dark:bg-[#18181A] p-3 rounded-xl border border-gray-200/80 dark:border-[#282828] text-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Nomad&apos;s Message:</span>
              <p className="text-gray-800 dark:text-gray-200 italic">&ldquo;{activeEnquiry.message}&rdquo;</p>
              {activeEnquiry.nomadPhone && (
                <p className="text-[11px] text-gray-500 pt-1 flex items-center gap-1">
                  <Phone size={11} /> WhatsApp / Phone: <strong>{activeEnquiry.nomadPhone}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Your Response to Nomad:
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Hi! Yes, our verified fiber Wi-Fi and generator backup are 100% ready. You can submit a booking request or visit us for a free coffee tour..."
                className="w-full bg-[#FBF9F5] dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#C2410C] resize-none"
              />
            </div>

            {/* Quick Status Updater inside Modal */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-500">Update Lead Status:</span>
              <div className="flex items-center gap-1.5">
                {["In discussion", "Booking requested", "Converted", "Closed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() =>
                      onUpdateStatus(activeEnquiry.id, activeEnquiry.hubId, st, replyText || undefined)
                    }
                    className="px-2 py-1 rounded-lg text-[10px] font-bold border border-gray-200 dark:border-[#333] hover:border-[#C2410C] text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-[#222225]">
              <button
                type="button"
                onClick={() => setActiveEnquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202024] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isReplying || !replyText.trim()}
                onClick={handleSendReply}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={13} />
                <span>{isReplying ? "Sending..." : "Send Response & Save"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
