"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeToggleProps {
  className?: string
  variant?: "ghost" | "bordered"
}

export function ThemeToggle({ className = "", variant = "bordered" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`h-9 w-9 rounded-full ${className}`} />
  }

  const isDark = resolvedTheme === "dark"

  const baseStyles = variant === "bordered"
    ? "border border-gray-200 dark:border-[#2a2a2a] bg-white/80 dark:bg-[#141414]/90 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] text-gray-700 dark:text-gray-200 shadow-sm"
    : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${baseStyles} ${className}`}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 rotate-0 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 rotate-0 transition-transform duration-300 hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export default ThemeToggle;
