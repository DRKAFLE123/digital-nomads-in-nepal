"use client"

import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"
import { useTheme } from "next-themes"
import {
  X,
  User,
  Settings,
  CalendarCheck,
  MessageSquare,
  Building,
  Award,
  ShieldCheck,
  Compass,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  ExternalLink,
  Repeat,
  MapPin,
  CheckCircle2,
  Sparkles,
  Home,
  HelpCircle,
  Users,
  LogIn
} from "lucide-react"

interface ProfileSliderProps {
  isOpen: boolean
  onClose: () => void
  session: Session | null
  avatarUrl?: string | null
  roleInfo?: {
    isOwner: boolean
    isGuide: boolean
    pendingOwnerBookings: number
    pendingGuideInquiries: number
  }
  userMode?: "DASHBOARD" | "NOMAD"
  setUserMode?: React.Dispatch<React.SetStateAction<"DASHBOARD" | "NOMAD">>
}

export default function ProfileSlider({
  isOpen,
  onClose,
  session,
  avatarUrl,
  roleInfo = { isOwner: false, isGuide: false, pendingOwnerBookings: 0, pendingGuideInquiries: 0 },
  userMode = "DASHBOARD",
  setUserMode
}: ProfileSliderProps) {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const [extraProfile, setExtraProfile] = useState<{
    city?: string
    country?: string
    workType?: string
  } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll when slider is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Fetch optional profile metadata (city, profession)
  useEffect(() => {
    if (isOpen && session?.user?.email && !extraProfile) {
      fetch(`/api/community/profile?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setExtraProfile({
              city: data.profile.currentCity || "Nepal",
              country: data.profile.country || "Nepal",
              workType: data.profile.workType || "Remote Professional"
            })
          }
        })
        .catch(() => {})
    }
  }, [isOpen, session, extraProfile])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"
  const userRole = (session?.user as { role?: string })?.role

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Facebook-Style Right Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[9999] w-full sm:w-[410px] max-w-full h-[100dvh] bg-white dark:bg-[#0D0D0E] border-l border-gray-200 dark:border-[#222225] shadow-[-16px_0_40px_rgba(0,0,0,0.3)] flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Profile and Account Drawer"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1E1E22] shrink-0 bg-white/80 dark:bg-[#0D0D0E]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-black tracking-tight text-gray-900 dark:text-white uppercase">
              {session ? "My Account" : "Welcome"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1C1C20] transition-colors cursor-pointer"
            aria-label="Close Profile Panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 space-y-4 overscroll-contain">
          {session ? (
            <>
              {/* Facebook-Style Main Profile Card */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-gray-200/80 dark:border-[#222226] shadow-xs space-y-3.5 overflow-hidden">
                <div className="flex items-center gap-3.5">
                  {/* Avatar with Gold Glow Ring (strictly sized to 56px) */}
                  <div className="relative shrink-0 w-14 h-14">
                    <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-full bg-[#FFD400] text-black font-black text-lg flex items-center justify-center overflow-hidden ring-2 ring-[#FFD400] shadow-sm">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={session.user?.name || "User"} className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-full object-cover" />
                      ) : (
                        session.user?.name?.[0]?.toUpperCase() || <User size={22} />
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#141416]" title="Online" />
                  </div>

                  {/* User Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {session.user?.name || "Digital Nomad"}
                      </h3>
                      {userRole === "ADMIN" && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-500/10 text-red-500 border border-red-500/20">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.user?.email}
                    </p>

                    {/* Role & Location Badge */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD400]/15 text-[#B45309] dark:text-[#FFD400] border border-[#FFD400]/25">
                        {roleInfo.isOwner ? (
                          <>
                            <Building size={10} /> Coworking Owner
                          </>
                        ) : roleInfo.isGuide ? (
                          <>
                            <Compass size={10} /> Trekking Expert
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={10} /> Verified Member
                          </>
                        )}
                      </span>

                      {extraProfile?.city && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                          <MapPin size={9} className="text-emerald-500" /> {extraProfile.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Profile Quick Action Button */}
                <Link
                  href="/community/settings"
                  onClick={onClose}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1E22] hover:bg-gray-100 dark:hover:bg-[#26262B] text-gray-900 dark:text-white font-bold text-xs border border-gray-200 dark:border-[#2C2C32] transition-all group/btn shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <User size={14} className="text-[#FFD400]" />
                    <span>View & Edit Profile</span>
                  </span>
                  <ChevronRight size={14} className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>

                {/* Role Switcher Pill (For Owners & Guides) */}
                {(roleInfo.isOwner || roleInfo.isGuide) && setUserMode && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-[#222226]">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Dashboard Mode</span>
                    <button
                      type="button"
                      onClick={() => setUserMode(prev => (prev === "DASHBOARD" ? "NOMAD" : "DASHBOARD"))}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FFD400]/10 text-[#B45309] dark:text-[#FFD400] border border-[#FFD400]/30 hover:bg-[#FFD400]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Repeat size={11} />
                      <span>{userMode === "DASHBOARD" ? "Switch to Nomad View" : "Switch to Portal"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Role-Specific Notifications Banner (if pending items) */}
              {(roleInfo.pendingOwnerBookings > 0 || roleInfo.pendingGuideInquiries > 0) && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} />
                    <span className="text-xs font-bold">
                      {roleInfo.isOwner
                        ? `${roleInfo.pendingOwnerBookings} Guest Booking Requests`
                        : `${roleInfo.pendingGuideInquiries} Pending Guide Inquiries`}
                    </span>
                  </div>
                  <Link
                    href={roleInfo.isOwner ? "/owner/dashboard?tab=BOOKINGS" : "/guides/dashboard"}
                    onClick={onClose}
                    className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-[#FFD400] text-black hover:bg-[#FFE033] transition-all"
                  >
                    Review
                  </Link>
                </div>
              )}

              {/* Facebook-Style Shortcuts Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
                  Quick Shortcuts
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/nomad/bookings"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#141416] hover:bg-gray-100 dark:hover:bg-[#1C1C20] border border-gray-200/70 dark:border-[#222226] transition-all group/sc flex flex-col justify-between"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-[#FFD400] flex items-center justify-center mb-2 group-hover/sc:scale-105 transition-transform">
                      <CalendarCheck size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">My Bookings</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Desk passes & stays</p>
                    </div>
                  </Link>

                  <Link
                    href="/community#community-discussions"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#141416] hover:bg-gray-100 dark:hover:bg-[#1C1C20] border border-gray-200/70 dark:border-[#222226] transition-all group/sc flex flex-col justify-between"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-2 group-hover/sc:scale-105 transition-transform">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Discussions</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Community replies</p>
                    </div>
                  </Link>

                  <Link
                    href="/community#coworking-checkin"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#141416] hover:bg-gray-100 dark:hover:bg-[#1C1C20] border border-gray-200/70 dark:border-[#222226] transition-all group/sc flex flex-col justify-between"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover/sc:scale-105 transition-transform">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Daily Check-In</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Pin today&apos;s workspace</p>
                    </div>
                  </Link>

                  {roleInfo.isOwner ? (
                    <Link
                      href="/owner/dashboard"
                      onClick={onClose}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-[#141416] hover:bg-gray-100 dark:hover:bg-[#1C1C20] border border-gray-200/70 dark:border-[#222226] transition-all group/sc flex flex-col justify-between"
                    >
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-[#FFD400] flex items-center justify-center mb-2 group-hover/sc:scale-105 transition-transform">
                        <Building size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Owner Portal</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Manage spaces</p>
                      </div>
                    </Link>
                  ) : roleInfo.isGuide ? (
                    <Link
                      href="/guides/dashboard"
                      onClick={onClose}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-[#141416] hover:bg-gray-100 dark:hover:bg-[#1C1C20] border border-gray-200/70 dark:border-[#222226] transition-all group/sc flex flex-col justify-between"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover/sc:scale-105 transition-transform">
                        <Award size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Expert Hub</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Trek bookings</p>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/resources/coworking"
                      onClick={onClose}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-[#141416] hover:bg-gray-100 dark:hover:bg-[#1C1C20] border border-gray-200/70 dark:border-[#222226] transition-all group/sc flex flex-col justify-between"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover/sc:scale-105 transition-transform">
                        <Building size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Find Hubs</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">24/7 backup power</p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* Facebook-Style Menu Options List */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
                  Settings & Preferences
                </span>

                <Link
                  href="/community/settings"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#202024] flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <Settings size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Settings & Privacy</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Password, alerts & details</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400 group-hover/item:translate-x-0.5 transition-transform" />
                </Link>

                {/* Instant Theme Toggle Row */}
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#202024] flex items-center justify-center text-gray-600 dark:text-gray-300">
                      {isDark ? <Moon size={15} className="text-indigo-400" /> : <Sun size={15} className="text-amber-500" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Display Theme</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Currently in {isDark ? "Dark" : "Light"} mode</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-200 dark:bg-[#242428] rounded-full p-0.5 border border-gray-300 dark:border-[#323238]">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                        !isDark ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Sun size={11} /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                        isDark ? "bg-[#141416] text-[#FFD400] shadow-xs" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Moon size={11} /> Dark
                    </button>
                  </div>
                </div>

                <Link
                  href="/resources"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#202024] flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <HelpCircle size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Nepal Nomad Resources</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">SIM cards, visa rules, banking</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400 group-hover/item:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/insurance"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#202024] flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <ShieldCheck size={15} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Nomad Health & Safety</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Heli evacuation & travel insurance</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400 group-hover/item:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            /* Guest / Unauthenticated Slide-out Experience */
            <div className="space-y-4 py-2">
              <div className="text-center p-5 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-gray-200/80 dark:border-[#222226] space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FFD400]/20 text-[#B45309] dark:text-[#FFD400] flex items-center justify-center ring-4 ring-[#FFD400]/10">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    Join Digital Nomads in Nepal
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    Sign in to access verified workspace booking, connect with location-independent remote workers, and check in today.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/auth/signin"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xs"
                  >
                    <LogIn size={13} />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FFD400] hover:bg-[#FFE033] text-black font-extrabold text-xs transition-all shadow-xs shadow-[#FFD400]/20"
                  >
                    <Users size={13} />
                    <span>Join Free</span>
                  </Link>
                </div>
              </div>

              {/* Guest Quick Explore Shortcuts */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
                  Explore Ecosystem
                </span>

                <Link
                  href="/resources/coworking"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#FFD400] flex items-center justify-center">
                      <Building size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Coworking Spaces</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Kathmandu, Pokhara, Lalitpur</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>

                <Link
                  href="/stay"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Home size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Nomad Stays & Coliving</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Monthly furnished apartments</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>

                <Link
                  href="/guides"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <Compass size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Licensed Trekking Guides</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Himalayan adventure experts</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
              </div>

              {/* Guest Theme Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#18181B] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#202024] flex items-center justify-center text-gray-600 dark:text-gray-300">
                    {isDark ? <Moon size={15} /> : <Sun size={15} />}
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Theme</span>
                </div>
                <div className="flex items-center bg-gray-200 dark:bg-[#242428] rounded-full p-0.5 border border-gray-300 dark:border-[#323238]">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                      !isDark ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                      isDark ? "bg-[#141416] text-[#FFD400] shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-5 border-t border-gray-100 dark:border-[#1E1E22] shrink-0 bg-white/90 dark:bg-[#0D0D0E]/90 backdrop-blur-md space-y-3">
          {session && (
            <button
              onClick={() => {
                onClose()
                signOut({ callbackUrl: "/" })
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-1">
            <span>Digital Nomads in Nepal</span>
            <span>Live • Work • Explore</span>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
