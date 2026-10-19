"use client"

import React, { useState, useEffect } from "react"
import { WhatsAppIcon } from "@/components/SocialIcons"

interface WhatsAppButtonProps {
  phoneNumber?: string
  defaultMessage?: string
  className?: string
}

export default function WhatsAppButton({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9779800000000",
  defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "Hi! I'm planning to work remotely in Nepal and have a quick question.",
  className = "",
}: WhatsAppButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Show gentle teaser tooltip after 3 seconds on initial load
    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, 3000)

    // Automatically hide teaser after 8 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false)
    }, 9000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!mounted) return null

  // Format clean phone digits (strip spaces, dashes, plus)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "")
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`

  const handleClick = () => {
    // Send event to Google Analytics / Google Tag Manager if available
    try {
      if (typeof window !== "undefined") {
        if ((window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer) {
          (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer.push({
            event: "whatsapp_chat_click",
            channel: "floating_widget",
          })
        }
        if (typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === "function") {
          (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "whatsapp_chat_click", {
            event_category: "Engagement",
            event_label: "Floating WhatsApp Button",
          })
        }
      }
    } catch {
      // Non-blocking analytics
    }
  }

  return (
    <aside
      aria-label="WhatsApp Quick Chat"
      className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[80] flex items-center gap-2 select-none print:hidden ${className}`}
    >
      {/* Interactive Chat Bubble / Tooltip */}
      <div
        className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-100 text-xs font-semibold shadow-xl border border-black/10 dark:border-white/10 transition-all duration-300 origin-right ${
          showTooltip
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-3 scale-95 pointer-events-none group-hover:opacity-100"
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Quick questions? Chat with us</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_14px_32px_rgba(37,211,102,0.6)] active:scale-95 transition-all duration-300"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {/* Radar ping ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:hidden" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon size={30} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />

        {/* Online Status Dot */}
        <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white dark:border-[#121212]" />
        </span>
      </a>
    </aside>
  )
}
