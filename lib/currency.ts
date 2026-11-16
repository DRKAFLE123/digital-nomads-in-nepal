export interface CurrencyConfig {
  code: string
  name: string
  symbol: string
  rate: number // Rate relative to 1 USD
  isPopular?: boolean
  flag?: string
}

export const POPULAR_CURRENCIES: CurrencyConfig[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, isPopular: true },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92, isPopular: true },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, isPopular: true },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.54, isPopular: true },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 86.5, isPopular: true },
  { code: "NPR", name: "Nepalese Rupee", symbol: "Rs", rate: 138.4, isPopular: true },
]

export const ALL_CURRENCIES: CurrencyConfig[] = [
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.54, isPopular: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", rate: 1.38 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.89 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92, isPopular: true },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, isPopular: true },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 86.5, isPopular: true },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 153.0 },
  { code: "NPR", name: "Nepalese Rupee", symbol: "Rs", rate: 138.4, isPopular: true },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
  { code: "THB", name: "Thai Baht", symbol: "฿", rate: 34.5 },
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, isPopular: true },
]

export const CURRENCY_MAP: Record<string, CurrencyConfig> = ALL_CURRENCIES.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {}
)

export const DEFAULT_CURRENCY = "USD"
export const STORAGE_KEY = "dn_preferred_currency"

/**
 * Converts a price from USD into the target currency value
 */
export function convertFromUSD(amountInUSD: number, targetCurrencyCode: string): number {
  if (isNaN(amountInUSD) || amountInUSD <= 0) return 0
  const currency = CURRENCY_MAP[targetCurrencyCode] || CURRENCY_MAP[DEFAULT_CURRENCY]
  return amountInUSD * currency.rate
}

/**
 * Formats a USD amount into the target currency string
 * e.g., 6 -> "$6" (USD), "€5.50" (EUR), "Rs 830" (NPR)
 */
export function formatCurrencyPrice(
  amountInUSD: number | string | null | undefined,
  targetCurrencyCode: string = DEFAULT_CURRENCY
): string {
  const numericAmount = typeof amountInUSD === "string" ? parseFloat(amountInUSD) : (amountInUSD ?? 0)
  if (isNaN(numericAmount) || numericAmount <= 0) return "Free"

  const currency = CURRENCY_MAP[targetCurrencyCode] || CURRENCY_MAP[DEFAULT_CURRENCY]
  const converted = numericAmount * currency.rate

  // Formatting rules per currency
  if (currency.code === "NPR") {
    // Format NPR with Nepali rupee symbol / Rs and clean rounded integers
    const rounded = Math.round(converted)
    return `Rs ${rounded.toLocaleString()}`
  }

  if (currency.code === "INR") {
    const rounded = Math.round(converted)
    return `₹${rounded.toLocaleString()}`
  }

  if (currency.code === "JPY") {
    const rounded = Math.round(converted)
    return `¥${rounded.toLocaleString()}`
  }

  // Western currencies with decimals if needed
  const isWhole = Math.abs(converted - Math.round(converted)) < 0.05
  const formattedNumber = isWhole
    ? Math.round(converted).toLocaleString()
    : converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  // Symbol placement
  if (currency.code === "CHF") {
    return `CHF ${formattedNumber}`
  }

  return `${currency.symbol}${formattedNumber}`
}

/**
 * Auto-detect user's default currency based on system timezone
 * Safe for SSR and client execution
 */
export function detectDefaultCurrency(): string {
  if (typeof window === "undefined") return DEFAULT_CURRENCY

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""

    if (tz === "Asia/Kathmandu") return "NPR"
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "INR"
    if (tz === "Europe/London") return "GBP"
    if (
      tz.startsWith("Europe/Paris") ||
      tz.startsWith("Europe/Berlin") ||
      tz.startsWith("Europe/Rome") ||
      tz.startsWith("Europe/Madrid") ||
      tz.startsWith("Europe/Amsterdam") ||
      tz.startsWith("Europe/Vienna") ||
      tz.startsWith("Europe/Brussels") ||
      tz.startsWith("Europe/Lisbon") ||
      tz.startsWith("Europe/Athens") ||
      tz.startsWith("Europe/Dublin")
    ) {
      return "EUR"
    }
    if (tz.startsWith("Australia/")) return "AUD"
    if (tz === "Asia/Tokyo") return "JPY"
    if (tz === "Asia/Bangkok") return "THB"
    if (tz === "Asia/Singapore") return "SGD"
    if (
      tz.startsWith("America/Toronto") ||
      tz.startsWith("America/Vancouver") ||
      tz.startsWith("America/Montreal") ||
      tz.startsWith("America/Edmonton")
    ) {
      return "CAD"
    }
    if (tz === "Europe/Zurich") return "CHF"
  } catch {
    // ignore
  }

  return DEFAULT_CURRENCY
}
