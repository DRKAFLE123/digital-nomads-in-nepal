"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  MapPin,
  Mail,
  BookOpen,
  LogOut,
  Menu,
  X,
  Shield,
  FileText,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/guides", label: "Guides", icon: BookOpen },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
]

interface Props {
  user: { name: string; email: string }
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const initial = user.name?.[0]?.toUpperCase() ?? "A"

  return (
    <>
      {/* Mobile hamburger */}
      <button
        id="admin-sidebar-toggle"
        aria-label="Toggle sidebar"
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#111] border border-[#222] text-gray-400 hover:text-white transition-colors shadow-lg"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#0d0d0d] border-r border-[#1e1e1e] flex flex-col",
          "transform transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0">
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-white truncate">Admin Panel</div>
              <div className="text-xs text-gray-500 truncate">Digital Nomads Nepal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/15"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent",
                ].join(" ")}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-[#1e1e1e] space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
          <button
            id="admin-signout-btn"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
