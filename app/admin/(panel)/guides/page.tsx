"use client"
import { useEffect, useState, useCallback } from "react"
import { CheckCircle, XCircle, Trash2, Star, RefreshCw, Search } from "lucide-react"

interface Guide {
  id: string
  name: string
  location: string
  isVerified: boolean
  avgRating: number
  contactEmail: string
  specialties: string[]
  _count: { reviews: number }
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [toDelete, setToDelete] = useState<string | null>(null)

  const fetchGuides = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/guides")
    const data = await res.json()
    setGuides(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchGuides() }, [fetchGuides])

  async function toggleVerify(guide: Guide) {
    const res = await fetch("/api/admin/guides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: guide.id, isVerified: !guide.isVerified }),
    })
    if (res.ok) {
      const updated = await res.json()
      setGuides((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
    }
  }

  async function deleteGuide(id: string) {
    const res = await fetch("/api/admin/guides", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setGuides((prev) => prev.filter((g) => g.id !== id))
      setToDelete(null)
    }
  }

  const filtered = guides.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Guides</h1>
          <p className="text-gray-500 text-sm mt-1">{guides.length} total guides registered</p>
        </div>
        <button onClick={fetchGuides} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#111] border border-[#222] px-3 py-2 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#222] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600 text-sm">Loading guides…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-600 text-sm">No guides found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5 font-medium">Guide</th>
                  <th className="text-left px-5 py-3.5 font-medium">Location</th>
                  <th className="text-left px-5 py-3.5 font-medium">Status</th>
                  <th className="text-left px-5 py-3.5 font-medium">Rating</th>
                  <th className="text-left px-5 py-3.5 font-medium">Reviews</th>
                  <th className="text-right px-5 py-3.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((guide) => (
                  <tr key={guide.id} className="border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{guide.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">{guide.contactEmail}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{guide.location}</td>
                    <td className="px-5 py-4">
                      {guide.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 text-xs border border-gray-500/20 font-medium">
                          <XCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        {guide.avgRating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{guide._count.reviews}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVerify(guide)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            guide.isVerified
                              ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/20"
                              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                          }`}
                        >
                          {guide.isVerified ? "Unverify" : "Verify"}
                        </button>
                        <button
                          onClick={() => setToDelete(guide.id)}
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

      {/* Delete confirm modal */}
      {toDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Guide?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently remove the guide and all their reviews. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-[#333] text-gray-400 text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={() => deleteGuide(toDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm hover:bg-red-500/20 transition-colors font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
