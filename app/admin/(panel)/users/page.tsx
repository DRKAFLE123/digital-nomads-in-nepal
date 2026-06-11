"use client"
import { useEffect, useState, useCallback } from "react"
import { Trash2, RefreshCw, Search } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "NOMAD" | "GUIDE" | "ADMIN"
  createdAt: string
}

const roleBadge: Record<string, string> = {
  ADMIN:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  GUIDE:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  NOMAD:  "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [toDelete, setToDelete] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/users")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function changeRole(id: string, role: string) {
    setUpdating(id)
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    })
    if (res.ok) {
      const updated = await res.json()
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    }
    setUpdating(null)
  }

  async function deleteUser(id: string) {
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setToDelete(null)
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total registered users</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#111] border border-[#222] px-3 py-2 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#222] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600 text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-600 text-sm">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5 font-medium">User</th>
                  <th className="text-left px-5 py-3.5 font-medium">Role</th>
                  <th className="text-left px-5 py-3.5 font-medium">Joined</th>
                  <th className="text-right px-5 py-3.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/15 flex items-center justify-center text-yellow-400 font-bold text-xs flex-shrink-0">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={updating === user.id}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs border font-medium bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500/30 disabled:opacity-50 ${roleBadge[user.role]}`}
                      >
                        <option value="NOMAD" className="bg-[#1a1a1a] text-gray-300">NOMAD</option>
                        <option value="GUIDE" className="bg-[#1a1a1a] text-gray-300">GUIDE</option>
                        <option value="ADMIN" className="bg-[#1a1a1a] text-gray-300">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setToDelete(user.id)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {toDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete User?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently remove this user and all associated data.</p>
            <div className="flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-[#333] text-gray-400 text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={() => deleteUser(toDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm hover:bg-red-500/20 transition-colors font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
