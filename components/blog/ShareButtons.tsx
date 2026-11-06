"use client"

import { useState } from "react"
import { Share2, Check, Copy, MessageCircle } from "lucide-react"

interface ShareButtonsProps {
  title: string
  url?: string
  className?: string
  layout?: "horizontal" | "vertical" | "compact"
}

export default function ShareButtons({
  title,
  url,
  className = "",
  layout = "horizontal"
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? (url || window.location.href) : ""
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined" && navigator?.clipboard) {
        await navigator.clipboard.writeText(shareUrl || window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      }
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const shareLinks = [
    {
      name: "X",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      hoverColor: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
      label: "Share on X"
    },
    {
      name: "LinkedIn",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6H9.2v-7.6H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2" />
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      hoverColor: "hover:bg-[#0A66C2] hover:text-white",
      label: "Share on LinkedIn"
    },
    {
      name: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      hoverColor: "hover:bg-[#1877F2] hover:text-white",
      label: "Share on Facebook"
    },
    {
      name: "WhatsApp",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3" />
        </svg>
      ),
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      hoverColor: "hover:bg-[#25D366] hover:text-white",
      label: "Share on WhatsApp"
    }
  ]

  if (layout === "compact") {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {shareLinks.map(link => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-[#1E1E22] text-gray-600 dark:text-gray-300 transition-all active:scale-95 ${link.hoverColor}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          title={copied ? "Link Copied!" : "Copy Link"}
          className={`h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95 ${
            copied
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-gray-100 dark:bg-[#1E1E22] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#28282D]"
          }`}
        >
          {copied ? <Check size={13} className="text-white" /> : <Copy size={13} />}
          <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-gray-900 dark:text-gray-300">
          <Share2 size={12} className="text-[#C2410C] dark:text-[#FB923C]" />
          Share This Guide
        </span>
        {copied && (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            ✓ Copied link
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {shareLinks.map(link => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100/80 dark:bg-[#1F1F24] border border-gray-200/60 dark:border-[#2C2C32] text-gray-600 dark:text-gray-300 transition-all hover:scale-105 active:scale-95 shadow-2xs ${link.hoverColor}`}
          >
            {link.icon}
          </a>
        ))}

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy article link"
          title={copied ? "Link Copied!" : "Copy Link"}
          className={`h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold border transition-all hover:scale-105 active:scale-95 shadow-2xs ${
            copied
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-gray-100/80 dark:bg-[#1F1F24] border-gray-200/60 dark:border-[#2C2C32] text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-[#28282E]"
          }`}
        >
          {copied ? <Check size={13} className="text-white" /> : <Copy size={13} />}
          <span className="text-[11px] font-medium">{copied ? "Copied" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  )
}
