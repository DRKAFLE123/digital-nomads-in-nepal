"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import {
  CurrencyConfig,
  CURRENCY_MAP,
  DEFAULT_CURRENCY,
  STORAGE_KEY,
  formatCurrencyPrice,
  convertFromUSD,
  detectDefaultCurrency,
} from "@/lib/currency"

interface CurrencyContextType {
  currencyCode: string
  currency: CurrencyConfig
  setCurrencyCode: (code: string) => void
  formatPrice: (amountInUSD: number | string | null | undefined) => string
  convertPrice: (amountInUSD: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<string>(DEFAULT_CURRENCY)
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage or auto-detect
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && CURRENCY_MAP[stored]) {
        setCurrencyCodeState(stored)
      } else {
        const detected = detectDefaultCurrency()
        setCurrencyCodeState(detected)
      }
    } catch {
      // localStorage disabled or SSR
    }
  }, [])

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && CURRENCY_MAP[e.newValue]) {
        setCurrencyCodeState(e.newValue)
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const setCurrencyCode = (code: string) => {
    if (!CURRENCY_MAP[code]) return
    setCurrencyCodeState(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // ignore
    }
  }

  const currency = useMemo(() => {
    return CURRENCY_MAP[currencyCode] || CURRENCY_MAP[DEFAULT_CURRENCY]
  }, [currencyCode])

  const formatPrice = (amountInUSD: number | string | null | undefined) => {
    return formatCurrencyPrice(amountInUSD, currencyCode)
  }

  const convertPrice = (amountInUSD: number) => {
    return convertFromUSD(amountInUSD, currencyCode)
  }

  const value = {
    currencyCode,
    currency,
    setCurrencyCode,
    formatPrice,
    convertPrice,
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    // Fallback if rendered outside CurrencyProvider
    return {
      currencyCode: DEFAULT_CURRENCY,
      currency: CURRENCY_MAP[DEFAULT_CURRENCY],
      setCurrencyCode: () => {},
      formatPrice: (amount: number | string | null | undefined) => formatCurrencyPrice(amount, DEFAULT_CURRENCY),
      convertPrice: (amount: number) => convertFromUSD(amount, DEFAULT_CURRENCY),
    }
  }
  return context
}
