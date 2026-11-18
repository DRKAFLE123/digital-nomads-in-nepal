"use client"

import React from "react"
import { Building2, MessageSquare, Clock, CheckCircle2, ArrowRight } from "lucide-react"

interface HostTopKpiSummaryProps {
  activeListingsCount: number
  newEnquiriesCount: number
  pendingBookingsCount: number
  confirmedBookingsCount: number
  onNavigate: (tab: any) => void
}

export default function HostTopKpiSummary({
  activeListingsCount,
  newEnquiriesCount,
  pendingBookingsCount,
  confirmedBookingsCount,
  onNavigate
}: HostTopKpiSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Greeting and Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/10 dark:bg-[#C2410C]/20 px-2.5 py-0.5 rounded-full">
              Host account
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Your business at a glance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-black text-gray-900 dark:text-white tracking-tight">
            Welcome back! Here&apos;s your hosting overview.
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-[#161618] border border-gray-200 dark:border-[#26262A] px-3 py-1.5 rounded-xl shadow-2xs">
            📅 Last 30 days
          </span>
        </div>
      </div>

      {/* 4 Core Summary Cards (5-Second Test) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Active Listings */}
        <div
          onClick={() => onNavigate("LISTINGS")}
          className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#C2410C]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Active listings
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono">
                {activeListingsCount}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Live
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors font-medium">
              <span>Manage listings</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* Card 2: New Enquiries (Needs Response) */}
        <div
          onClick={() => onNavigate("ENQUIRIES")}
          className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-amber-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-3 relative overflow-hidden"
        >
          {newEnquiriesCount > 0 && (
            <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-full pointer-events-none" />
          )}
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              New enquiries
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono">
                {newEnquiriesCount}
              </span>
              {newEnquiriesCount > 0 ? (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Needs response
                </span>
              ) : (
                <span className="text-xs text-gray-400 font-medium">All caught up</span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-medium">
              <span>{newEnquiriesCount > 0 ? "Reply to leads" : "View enquiry history"}</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* Card 3: Pending Bookings */}
        <div
          onClick={() => onNavigate("RESERVATIONS")}
          className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#C2410C]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Pending bookings
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono">
                {pendingBookingsCount}
              </span>
              {pendingBookingsCount > 0 ? (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#C2410C]/15 text-[#C2410C] dark:text-[#FB923C]">
                  Awaiting review
                </span>
              ) : (
                <span className="text-xs text-gray-400 font-medium">None pending</span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors font-medium">
              <span>Awaiting confirmation</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* Card 4: Confirmed Bookings */}
        <div
          onClick={() => onNavigate("RESERVATIONS")}
          className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Confirmed bookings
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono">
                {confirmedBookingsCount}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                Upcoming
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium">
              <span>Upcoming reservations</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
