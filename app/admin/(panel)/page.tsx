"use client"
import { useEffect, useState } from "react"
import { Users, BookOpen, Mail, Star, TrendingUp, CheckCircle, Plus, ArrowRight, FileText, Building, ShieldCheck, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Stats {
  users: number
  guides: number
  subscribers: number
  reviews: number
  posts: number
}

interface PendingHub {
  id: string
  name: string
  slug: string
  city: string
  ownerName: string | null
  ownerEmail: string | null
  spaceType: string
  createdAt: string
  isVerified: boolean
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
  const [pendingHubs, setPendingHubs] = useState<PendingHub[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  async function loadDashboardData() {
    try {
      const [statsRes, hubsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/work-hubs")
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (hubsRes.ok) {
        const hubsData = await hubsRes.json()
        const unverified = (hubsData || []).filter((h: PendingHub) => !h.isVerified)
        setPendingHubs(unverified)
      }
    } catch (err) {
      console.error("Dashboard data load error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function handleApproveHub(id: string) {
    setActionId(id)
    try {
      const res = await fetch(`/api/admin/work-hubs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true, isPartner: true })
      })

      if (res.ok) {
        setPendingHubs(prev => prev.filter(h => h.id !== id))
      }
    } catch (err) {
      console.error("Approve failed:", err)
    } finally {
      setActionId(null)
    }
  }

  async function handleRejectHub(id: string) {
    if (!confirm("Are you sure you want to reject and delete this workspace application?")) return
    setActionId(id)
    try {
      const res = await fetch(`/api/admin/work-hubs/${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setPendingHubs(prev => prev.filter(h => h.id !== id))
      }
    } catch (err) {
      console.error("Reject failed:", err)
    } finally {
      setActionId(null)
    }
  }

  const statCards = [
    { label: "Total Users",   value: stats?.users,       icon: Users,    color: "blue",   href: "/admin/users" },
    { label: "Total Guides",  value: stats?.guides,      icon: BookOpen, color: "green",  href: "/admin/guides" },
    { label: "Blog Posts",    value: stats?.posts,       icon: FileText, color: "purple", href: "/admin/posts" },
    { label: "Subscribers",   value: stats?.subscribers, icon: Mail,     color: "pink",   href: "/admin/subscribers" },
    { label: "Total Reviews", value: stats?.reviews,     icon: Star,     color: "yellow", href: "/admin/guides" },
  ]

  const quickActions = [
    { href: "/admin/work-hubs",    label: "Manage Workspaces", icon: Building,    desc: "Approve & edit work hubs" },
    { href: "/admin/guides",       label: "Verify Guides",     icon: CheckCircle, desc: "Approve guide listings" },
    { href: "/admin/users",        label: "Manage Users",       icon: Users,       desc: "View & edit user roles" },
    { href: "/admin/destinations", label: "Add Destination",    icon: Plus,        desc: "Create a new destination" },
  ]

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of site activity, pending workspace approvals, and quick actions.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
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

      {/* SUPER ADMIN WORKSPACE REGISTRATION APPROVAL CARD */}
      <div className="bg-[#111] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Pending Workspace Registrations
                {pendingHubs.length > 0 && (
                  <span className="bg-amber-500 text-black font-black text-xs px-2 py-0.5 rounded-full">
                    {pendingHubs.length} Pending
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Review owner submissions and award the <strong className="text-amber-400">✓ Himalayan Verified</strong> badge.
              </p>
            </div>
          </div>
          <Link
            href="/admin/work-hubs"
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            All Workspaces →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-gray-500">Loading pending applications...</div>
        ) : pendingHubs.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-[#161616] rounded-xl border border-[#222]">
            <CheckCircle size={28} className="mx-auto text-emerald-400" />
            <p className="text-sm font-bold text-white">No Pending Workspace Applications</p>
            <p className="text-xs text-gray-400">All submitted workspaces have been reviewed and verified.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingHubs.map((hub) => (
              <div
                key={hub.id}
                className="p-4 bg-[#161616] border border-[#222] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/20 transition-all"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-white text-sm">{hub.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20">
                      {hub.spaceType}
                    </span>
                    <span className="text-xs text-gray-400">• {hub.city}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Owner: <span className="text-gray-200">{hub.ownerName || "N/A"}</span> ({hub.ownerEmail || "No Email"})
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Submitted on: {new Date(hub.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <button
                    disabled={actionId === hub.id}
                    onClick={() => handleApproveHub(hub.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {actionId === hub.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        Approve & Verify ✓
                      </>
                    )}
                  </button>
                  <button
                    disabled={actionId === hub.id}
                    onClick={() => handleRejectHub(hub.id)}
                    className="flex items-center gap-1 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Reject Application"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Quick Management</h2>
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
