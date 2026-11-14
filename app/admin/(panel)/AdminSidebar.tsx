"use client"
import Link from "next/link"
import Image from "next/image"
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
  Image as ImageIcon,
  Settings,
  Building,
  Globe,
  Link as LinkIcon,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/guides", label: "Guides", icon: BookOpen },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/utm-builder", label: "UTM Builder", icon: LinkIcon },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/community", label: "Community", icon: Globe },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/work-hubs", label: "Work Hubs", icon: Building },
  { href: "/admin/settings", label: "Settings", icon: Settings },
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
        {/* Header with Official Logo */}
        <div className="p-4 border-b border-[#1e1e1e]">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer" title="Digital Nomads in Nepal">
            <div className="relative h-8 w-12 overflow-hidden flex-shrink-0">
              <Image
                src="/branding/logo-mark-white.svg"
                alt="Digital Nomads in Nepal Logo"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col items-start text-left min-w-0">
              <span className="font-black text-xs tracking-tight uppercase text-white leading-tight">
                DIGITAL NOMADS
              </span>
              <span className="font-bold text-[9px] tracking-widest uppercase text-[#CD6003] leading-none mt-0.5">
                IN NEPAL
              </span>
              <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 inline" /> ADMIN CONSOLE
              </span>
            </div>
          </Link>
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
