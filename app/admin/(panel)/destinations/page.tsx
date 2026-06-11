"use client"
import { useEffect, useState, useCallback } from "react"
import { Plus, Pencil, Trash2, RefreshCw, X, Check } from "lucide-react"

interface Destination {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  createdAt: string
}

type ModalMode = "add" | "edit"

const EMPTY = { name: "", slug: "", description: "", image: "" }

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ mode: ModalMode; item?: Destination } | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState<string | null>(null)
  const [formError, setFormError] = useState("")

  const fetchDestinations = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/destinations")
    const data = await res.json()
    setDestinations(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchDestinations() }, [fetchDestinations])

  function openAdd() {
    setForm(EMPTY)
    setFormError("")
    setModal({ mode: "add" })
  }

  function openEdit(item: Destination) {
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      image: item.image ?? "",
    })
    setFormError("")
    setModal({ mode: "edit", item })
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  async function saveDestination() {
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError("Name and slug are required.")
      return
    }
    setSaving(true)
    setFormError("")

    if (modal?.mode === "add") {
      const res = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const created = await res.json()
        setDestinations((prev) => [created, ...prev])
        setModal(null)
      } else {
        const err = await res.json()
        setFormError(err.error ?? "Something went wrong.")
      }
    } else if (modal?.item) {
      const res = await fetch("/api/admin/destinations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modal.item.id, ...form }),
      })
      if (res.ok) {
        const updated = await res.json()
        setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
        setModal(null)
      } else {
        const err = await res.json()
        setFormError(err.error ?? "Something went wrong.")
      }
    }
    setSaving(false)
  }

  async function deleteDestination(id: string) {
    const res = await fetch("/api/admin/destinations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setDestinations((prev) => prev.filter((d) => d.id !== id))
      setToDelete(null)
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Destinations</h1>
          <p className="text-gray-500 text-sm mt-1">{destinations.length} destinations listed</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDestinations} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#111] border border-[#222] px-3 py-2 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="admin-add-destination-btn"
            onClick={openAdd}
            className="flex items-center gap-2 text-sm font-semibold bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Destination
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600 text-sm">Loading destinations…</div>
        ) : destinations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-600 text-sm mb-4">No destinations yet.</div>
            <button onClick={openAdd} className="text-yellow-400 text-sm hover:underline">Add your first destination →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e1e] text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5 font-medium">Name</th>
                  <th className="text-left px-5 py-3.5 font-medium">Slug</th>
                  <th className="text-left px-5 py-3.5 font-medium">Description</th>
                  <th className="text-right px-5 py-3.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest.id} className="border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-medium text-white">{dest.name}</td>
                    <td className="px-5 py-4">
                      <code className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-1 rounded text-gray-400">
                        {dest.slug}
                      </code>
                    </td>
                    <td className="px-5 py-4 text-gray-400 max-w-[220px] truncate">
                      {dest.description ?? <span className="text-gray-600 italic">No description</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(dest)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setToDelete(dest.id)}
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

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">
                {modal.mode === "add" ? "Add Destination" : "Edit Destination"}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setForm((f) => ({ ...f, name, slug: modal.mode === "add" ? autoSlug(name) : f.slug }))
                  }}
                  placeholder="Kathmandu"
                  className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="kathmandu"
                  className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 placeholder:text-gray-600 font-mono"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Short description of the destination…"
                  className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 placeholder:text-gray-600 resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://res.cloudinary.com/…"
                  className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/30 placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-[#333] text-gray-400 text-sm hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={saveDestination}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {modal.mode === "add" ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {toDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Destination?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 py-2.5 rounded-xl border border-[#333] text-gray-400 text-sm hover:text-white transition-colors">Cancel</button>
              <button onClick={() => deleteDestination(toDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm hover:bg-red-500/20 transition-colors font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
