"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Building, X, UserPlus, Compass, LayoutDashboard, PlusCircle, User } from "lucide-react"
import { useSession } from "next-auth/react"

export default function StickyCommunityCTA() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [roleInfo, setRoleInfo] = useState<{ isOwner: boolean; isGuide: boolean; guideId?: string | null }>({
    isOwner: false,
    isGuide: false,
    guideId: null,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (session?.user?.email) {
      const sessionRole = (session.user as any)?.role
      if (sessionRole === "GUIDE" || sessionRole === "OWNER") {
        setRoleInfo((prev) => ({
          ...prev,
          isGuide: prev.isGuide || sessionRole === "GUIDE",
          isOwner: prev.isOwner || sessionRole === "OWNER",
        }))
      }

      fetch(`/api/auth/me?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setRoleInfo({
              isOwner: Boolean(data.isOwner || sessionRole === "OWNER"),
              isGuide: Boolean(data.isGuide || sessionRole === "GUIDE"),
              guideId: data.guideId || null,
            })
          }
        })
        .catch(() => {})
    } else {
      setRoleInfo({ isOwner: false, isGuide: false, guideId: null })
    }
  }, [session])

  useEffect(() => {
    if (isDismissed) return

    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (!isVisible || isDismissed || !mounted) return null

  // Dynamic buttons based on user role and auth state
  // 1. Logged out: “Find a space” + “Join free”
  // 2. Logged-in nomad: “Find a space” + “Find a guide”
  // 3. Logged-in host: “Dashboard” + “Add listing”
  // 4. Logged-in guide: “Dashboard” + “My profile”
  let btn1 = {
    label: "Find a space",
    href: "/workspaces",
    icon: Building,
  }

  let btn2 = {
    label: "Join free",
    href: "/auth/signin",
    icon: UserPlus,
  }

  if (session) {
    if (roleInfo.isOwner) {
      btn1 = {
        label: "Dashboard",
        href: "/owner/dashboard",
        icon: LayoutDashboard,
      }
      btn2 = {
        label: "Add listing",
        href: "/register/space",
        icon: PlusCircle,
      }
    } else if (roleInfo.isGuide) {
      btn1 = {
        label: "Dashboard",
        href: "/guides/dashboard",
        icon: LayoutDashboard,
      }
      btn2 = {
        label: "My profile",
        href: roleInfo.guideId ? `/guides/${roleInfo.guideId}` : "/guides/dashboard",
        icon: User,
      }
    } else {
      // Logged-in nomad
      btn1 = {
        label: "Find a space",
        href: "/workspaces",
        icon: Building,
      }
      btn2 = {
        label: "Find a guide",
        href: "/guides",
        icon: Compass,
      }
    }
  }

  const Btn1Icon = btn1.icon
  const Btn2Icon = btn2.icon

  return createPortal(
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] inset-x-3.5 max-w-[340px] mx-auto z-[90] md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between gap-1 p-1 bg-white/95 dark:bg-[#101012]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 rounded-full shadow-[0_12px_36px_-6px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.65)] ring-1 ring-black/5 dark:ring-white/10">
        {/* Primary Action Button */}
        <Link
          href={btn1.href}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-extrabold py-2 px-3 rounded-full text-[12.5px] shadow-sm shadow-[#C2410C]/25 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <Btn1Icon size={13.5} className="shrink-0" />
          <span>{btn1.label}</span>
        </Link>

        {/* Secondary Action Button */}
        <Link
          href={btn2.href}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold py-2 px-3 rounded-full text-[12.5px] border border-slate-200/80 dark:border-white/15 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <Btn2Icon size={13.5} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />
          <span>{btn2.label}</span>
        </Link>

        {/* Discreet Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:text-white/50 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0 ml-0.5 cursor-pointer"
          aria-label="Dismiss action bar"
          title="Dismiss"
        >
          <X size={13.5} />
        </button>
      </div>
    </div>,
    document.body
  )
}
