"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, ExternalLink, Building, UserCheck } from "lucide-react"
import Link from "next/link"

interface NotificationItem {
  id: string
  type: string
  title: string
  subtitle: string
  date: string
  href: string
  entityId: string
}

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/admin/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setTotalCount(data.totalCount || 0)
      }
    } catch (err) {
      console.error("Failed to load notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center focus:outline-none"
        title="Admin Notifications"
      >
        <Bell size={18} />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-black font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111] border border-[#222] rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
            <div className="bg-[#161616] px-4 py-3 border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-primary" />
                <span className="font-bold text-white text-xs">Admin System Alerts</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {totalCount} Pending
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#1e1e1e]">
              {loading ? (
                <div className="p-6 text-center text-xs text-gray-500">Loading alerts...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle size={24} className="mx-auto text-emerald-400" />
                  <p className="text-xs text-gray-400 font-medium">All caught up!</p>
                  <p className="text-[11px] text-gray-600">No pending workspace or guide verification requests.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                        {item.type === "HUB_REGISTRATION" ? <Building size={14} /> : <UserCheck size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-primary transition-colors leading-tight truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.subtitle}</p>
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <ExternalLink size={12} className="text-gray-600 group-hover:text-primary transition-colors mt-1" />
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="bg-[#161616] px-4 py-2.5 border-t border-[#222] text-center">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-[11px] font-bold text-primary hover:underline block"
              >
                Go to Super Admin Dashboard →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
