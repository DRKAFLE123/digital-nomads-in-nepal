"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  X,
  Mail,
  User,
  CheckCircle,
  Loader2,
  MessageSquare,
  HelpCircle,
  Send,
  MapPin,
} from "lucide-react"

export type HubForEnquiry = {
  id: string
  name: string
  slug: string
  city: string
  address: string
  contactEmail?: string
}

interface EnquiryModalCardProps {
  isOpen: boolean
  onClose: () => void
  hub: HubForEnquiry | null
}

const ENQUIRY_TOPICS = [
  "Internet ISP Speed & Dual-WAN Backup Line",
  "Group / Long-Term Residency Discount Rate",
  "Private Office Availability & Site Visit",
  "Meeting Hall & Event Equipment Booking",
  "24/7 Access & Keycard Badge Clearance",
  "Other General Workspace Question",
]

export default function EnquiryModalCard({ isOpen, onClose, hub }: EnquiryModalCardProps) {
  const { data: session } = useSession()

  const [nomadName, setNomadName] = useState("")
  const [nomadEmail, setNomadEmail] = useState("")
  const [topic, setTopic] = useState(ENQUIRY_TOPICS[0])
  const [message, setMessage] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Pre-fill user details from session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !nomadName) setNomadName(session.user.name)
      if (session.user.email && !nomadEmail) setNomadEmail(session.user.email)
    }
  }, [session, nomadName, nomadEmail])

  // ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setSuccess(false)
      setError("")
    }
  }, [isOpen])

  if (!isOpen || !hub) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    if (!message.trim()) {
      setError("Please enter your inquiry message.")
      setSubmitting(false)
      return
    }

    try {
      // Simulate sending enquiry to community manager / workspace owner
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError("Failed to send inquiry. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#121212] border border-[#242424] rounded-3xl shadow-2xl overflow-hidden my-auto text-[#F5F5F5] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Bar Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-center justify-center text-amber-400">
              <MessageSquare size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                <HelpCircle size={11} /> Workspace Manager Inquiry
              </span>
              <h2 className="text-lg font-black text-white line-clamp-1">{hub.name}</h2>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-amber-400" /> {hub.city}, Nepal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle size={36} />
              </div>
              <h3 className="text-xl font-black text-white">Inquiry Sent Successfully!</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                Thank you <strong className="text-white">{nomadName}</strong>! Your message regarding{" "}
                <strong className="text-amber-400">{topic}</strong> has been delivered to the community manager for <strong className="text-white">{hub.name}</strong>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-amber-400 hover:bg-yellow-300 text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      value={nomadName}
                      onChange={(e) => setNomadName(e.target.value)}
                      placeholder="Damodar K."
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={nomadEmail}
                      onChange={(e) => setNomadEmail(e.target.value)}
                      placeholder="nomad@example.com"
                      className="w-full bg-[#181818] border border-[#282828] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <HelpCircle size={12} className="text-amber-400" /> Inquiry Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                >
                  {ENQUIRY_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Your Inquiry Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about speed tests, quiet call booths, long-term group rates, or schedule a physical tour..."
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Send Inquiry to Workspace Manager ✓
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
