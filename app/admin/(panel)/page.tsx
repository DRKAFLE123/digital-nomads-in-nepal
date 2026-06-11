"use client"
import { useEffect, useState } from "react"
import { Users, BookOpen, Mail, Star, TrendingUp, CheckCircle, Plus, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"

interface Stats {
  users: number
  guides: number
  subscribers: number
  reviews: number
  posts: number
}

const colorConfig: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  green:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  purple: { bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-purple-500/20" },
  yellow: { bg: "bg-yellow-500/10",  text: "text-yellow-400",  border: "border-yellow-500/20" },
  pink:   { bg: "bg-pink-500/10",    text: "text-pink-400",    border: "border-pink-500/20" },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: "Total Users",   value: stats?.users,       icon: Users,    color: "blue",   href: "/admin/users" },
    { label: "Total Guides",  value: stats?.guides,      icon: BookOpen, color: "green",  href: "/admin/guides" },
    { label: "Blog Posts",    value: stats?.posts,       icon: FileText, color: "purple", href: "/admin/posts" },
    { label: "Subscribers",   value: stats?.subscribers, icon: Mail,     color: "pink",   href: "/admin/subscribers" },
    { label: "Total Reviews", value: stats?.reviews,     icon: Star,     color: "yellow", href: "/admin/guides" },
  ]

  const quickActions = [
    { href: "/admin/guides",       label: "Verify Guides",     icon: CheckCircle, desc: "Approve guide listings" },
    { href: "/admin/users",        label: "Manage Users",       icon: Users,       desc: "View & edit user roles" },
    { href: "/admin/destinations", label: "Add Destination",    icon: Plus,        desc: "Create a new destination" },
    { href: "/admin/subscribers",  label: "View Subscribers",   icon: Mail,        desc: "Export & view email list" },
  ]

  return (
    <div className="max-w-6xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your site activity and quick actions.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, href }) => {
          const c = colorConfig[color]
          return (
            <Link
              key={label}
              href={href}
              className="group bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 hover:border-yellow-500/25 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${c.bg} ${c.border}`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-white">
                {loading ? (
                  <span className="block w-14 h-8 bg-[#1e1e1e] rounded animate-pulse" />
                ) : (
                  (value ?? 0).toLocaleString()
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </Link>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 p-4 rounded-xl border border-[#1e1e1e] hover:border-yellow-500/25 hover:bg-yellow-500/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/15 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
