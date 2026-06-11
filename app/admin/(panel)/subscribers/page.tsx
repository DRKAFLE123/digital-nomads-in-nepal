"use client"
import { useEffect, useState, useCallback } from "react"
import { Copy, Check, RefreshCw, Download } from "lucide-react"

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/subscribers")
    const data = await res.json()
    setSubscribers(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers])

  async function copyAll() {
    const emails = subscribers.map((s) => s.email).join(", ")
    await navigator.clipboard.writeText(emails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function exportCsv() {
    const header = "Email,Joined\n"
    const rows = subscribers
      .map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`)
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "subscribers.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="text-gray-500 text-sm mt-1">{subscribers.length} newsletter subscribers</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSubscribers} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#111] border border-[#222] px-3 py-2 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportCsv}
            disabled={loading || subscribers.length === 0}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-[#111] border border-[#222] px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={copyAll}
            disabled={loading || subscribers.length === 0}
            className="flex items-center gap-2 text-sm font-medium bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-400/20 transition-all disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy All"}
          </button>
        </div>
      </div>

      {/* Subscribers count banner */}
      {!loading && subscribers.length > 0 && (
        <div className="mb-6 px-5 py-4 bg-purple-500/5 border border-purple-500/15 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 font-bold text-sm flex-shrink-0">
            {subscribers.length}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Total subscribers</div>
            <div className="text-xs text-gray-500">Latest: {new Date(subscribers[0].createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600 text-sm">Loading subscribers…</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-600 text-sm">No subscribers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5 font-medium">#</th>
                  <th className="text-left px-5 py-3.5 font-medium">Email</th>
                  <th className="text-left px-5 py-3.5 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => (
                  <tr key={sub.id} className="border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-gray-600 text-xs">{i + 1}</td>
                    <td className="px-5 py-4 text-white font-medium">{sub.email}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
