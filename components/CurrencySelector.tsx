"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { useCurrency } from "@/context/CurrencyContext"
import { POPULAR_CURRENCIES, ALL_CURRENCIES, CurrencyConfig } from "@/lib/currency"
import { ChevronDown, Check, Globe } from "lucide-react"

interface CurrencySelectorProps {
  isSolid?: boolean
  variant?: "desktop" | "mobile"
  onSelectCallback?: () => void
}

export default function CurrencySelector({
  isSolid = true,
  variant = "desktop",
  onSelectCallback,
}: CurrencySelectorProps) {
  const { currency, currencyCode, setCurrencyCode } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Flattened list for keyboard arrow navigation
  // popular currencies + all currencies
  const allNavItems: CurrencyConfig[] = [
    ...POPULAR_CURRENCIES,
    ...ALL_CURRENCIES,
  ]

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setHighlightedIndex(-1)
    if (variant === "desktop") {
      triggerRef.current?.focus()
    }
  }, [variant])

  const selectCurrency = (code: string) => {
    setCurrencyCode(code)
    closeMenu()
    if (onSelectCallback) onSelectCallback()
  }

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closeMenu()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, closeMenu])

  // Handle ESC and Arrow key navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        closeMenu()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev < allNavItems.length - 1 ? prev + 1 : 0
          itemRefs.current[next]?.focus()
          return next
        })
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : allNavItems.length - 1
          itemRefs.current[next]?.focus()
          return next
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeMenu, allNavItems.length])

  // Mobile Drawer Trigger & Modal
  if (variant === "mobile") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-3 min-h-[48px] bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#242424] rounded-xl hover:border-[#C2410C]/50 transition-colors text-left cursor-pointer active:scale-[0.99]"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={`Select currency, currently ${currency.name} (${currency.code})`}
        >
          <div className="flex items-center gap-2.5">
            <Globe size={16} className="text-[#C2410C] dark:text-[#FB923C]" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Currency
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
            <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-[#202020] text-[11px] font-mono text-[#C2410C] dark:text-[#FB923C]">
              {currency.code}
            </span>
            <span className="text-gray-500 dark:text-gray-400">({currency.symbol})</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </button>

        {/* Mobile Fullscreen / Bottom Sheet Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-[#282828] rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-[#242424] flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Globe size={18} className="text-[#C2410C] dark:text-[#FB923C]" />
                    Select Display Currency
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Prices across stays & workspaces convert automatically
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-[#222] dark:hover:bg-[#333] text-gray-700 dark:text-gray-300"
                >
                  Done
                </button>
              </div>

              {/* Scrollable Currency List with ≥44px rows */}
              <div className="overflow-y-auto p-4 space-y-4">
                {/* Popular Currencies */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
                    Popular Currencies
                  </h4>
                  <div className="space-y-1">
                    {POPULAR_CURRENCIES.map((c) => {
                      const isSelected = c.code === currencyCode
                      return (
                        <button
                          key={`mob-pop-${c.code}`}
                          type="button"
                          onClick={() => selectCurrency(c.code)}
                          className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                            isSelected
                              ? "bg-[#C2410C]/10 border border-[#C2410C]/40 text-[#C2410C] dark:text-[#FB923C]"
                              : "bg-gray-50 dark:bg-[#181818] border border-transparent hover:border-gray-200 dark:hover:border-[#2A2A2A] text-gray-900 dark:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold font-mono text-sm tracking-wide">
                              {c.code}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                              {c.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#202020] text-gray-800 dark:text-gray-200">
                              {c.symbol}
                            </span>
                            {isSelected && (
                              <Check size={16} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* All Currencies Alphabetical */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
                    All Currencies (A–Z)
                  </h4>
                  <div className="space-y-1">
                    {ALL_CURRENCIES.map((c) => {
                      const isSelected = c.code === currencyCode
                      return (
                        <button
                          key={`mob-all-${c.code}`}
                          type="button"
                          onClick={() => selectCurrency(c.code)}
                          className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                            isSelected
                              ? "bg-[#C2410C]/10 border border-[#C2410C]/40 text-[#C2410C] dark:text-[#FB923C]"
                              : "bg-gray-50 dark:bg-[#181818] border border-transparent hover:border-gray-200 dark:hover:border-[#2A2A2A] text-gray-900 dark:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold font-mono text-sm tracking-wide">
                              {c.code}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                              {c.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#202020] text-gray-800 dark:text-gray-200">
                              {c.symbol}
                            </span>
                            {isSelected && (
                              <Check size={16} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop Main Nav Variant
  let itemCounter = 0

  return (
    <div className="relative">
      {/* Desktop Trigger Button: Just Currency Name (Code) e.g. "USD ▾" */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select display currency. Currently ${currency.name} (${currency.code})`}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
          isOpen
            ? "border-[#C2410C] dark:border-[#FB923C] ring-2 ring-[#C2410C]/20 bg-gray-100 dark:bg-[#1C1C1E]"
            : isSolid
            ? "border-[#E8E2D8] dark:border-[#26262A] bg-white/70 dark:bg-[#141416]/70 text-gray-800 dark:text-[#F5F5F4] hover:border-[#C2410C] dark:hover:border-[#FB923C] hover:text-[#C2410C] dark:hover:text-[#FB923C] shadow-xs"
            : "border-white/25 bg-white/10 hover:bg-white/20 text-white hover:text-[#FB923C] backdrop-blur-sm"
        }`}
      >
        <span className="font-mono tracking-tight font-black">{currency.code}</span>
        <ChevronDown
          size={13}
          className={`opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Booking.com Style Popover Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          aria-label="Available currencies"
          className="absolute top-full right-0 mt-2 w-80 max-h-[480px] overflow-y-auto bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262628] rounded-2xl shadow-2xl p-2.5 z-50 text-left space-y-3 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Popular Currencies Header & Grid */}
          <div>
            <div className="px-2 py-1 flex items-center justify-between border-b border-gray-100 dark:border-[#202020] pb-1.5 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Popular Currencies
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                Booking.com rates
              </span>
            </div>

            <div className="space-y-0.5">
              {POPULAR_CURRENCIES.map((c) => {
                const currentIndex = itemCounter++
                const isSelected = c.code === currencyCode
                const isHighlighted = highlightedIndex === currentIndex

                return (
                  <button
                    key={`desk-pop-${c.code}`}
                    ref={(el) => { itemRefs.current[currentIndex] = el }}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => selectCurrency(c.code)}
                    onMouseEnter={() => setHighlightedIndex(currentIndex)}
                    className={`w-full min-h-[40px] px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] font-semibold"
                        : isHighlighted
                        ? "bg-gray-100 dark:bg-[#1E1E22] text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#18181A]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-xs w-9 shrink-0">{c.code}</span>
                      <span className="text-xs truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-[#202022] text-gray-700 dark:text-gray-200">
                        {c.symbol}
                      </span>
                      {isSelected ? (
                        <Check size={14} className="text-[#C2410C] dark:text-[#FB923C]" />
                      ) : (
                        <span className="w-3.5" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* All Currencies Alphabetical */}
          <div>
            <div className="px-2 py-1 border-b border-gray-100 dark:border-[#202020] pb-1.5 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                All Currencies (A–Z)
              </span>
            </div>

            <div className="space-y-0.5">
              {ALL_CURRENCIES.map((c) => {
                const currentIndex = itemCounter++
                const isSelected = c.code === currencyCode
                const isHighlighted = highlightedIndex === currentIndex

                return (
                  <button
                    key={`desk-all-${c.code}`}
                    ref={(el) => { itemRefs.current[currentIndex] = el }}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => selectCurrency(c.code)}
                    onMouseEnter={() => setHighlightedIndex(currentIndex)}
                    className={`w-full min-h-[40px] px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] font-semibold"
                        : isHighlighted
                        ? "bg-gray-100 dark:bg-[#1E1E22] text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#18181A]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-xs w-9 shrink-0">{c.code}</span>
                      <span className="text-xs truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-[#202022] text-gray-700 dark:text-gray-200">
                        {c.symbol}
                      </span>
                      {isSelected ? (
                        <Check size={14} className="text-[#C2410C] dark:text-[#FB923C]" />
                      ) : (
                        <span className="w-3.5" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
