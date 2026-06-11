import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "./AdminSidebar"

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Middleware handles this, but double-check server-side
  if (!session) redirect("/admin/login")
  const role = (session.user as { role?: string }).role
  if (role !== "ADMIN") redirect("/")

  const user = session.user as { name?: string | null; email?: string | null }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar user={{ name: user.name ?? "Admin", email: user.email ?? "" }} />

      {/* Main content — offset by sidebar width on large screens */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-[#1e1e1e] bg-[#080808]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium ml-10 lg:ml-0">
            Admin Dashboard
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Live
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
