"use client"
import { useState, useEffect } from "react"
import { Save, Loader2, Check, AlertCircle, Settings } from "lucide-react"

const DEFAULTS = {
  bio: "",
  basecamp: "",
  facebook: "",
  instagram: "",
  twitter: "",
  tiktok: "",
  youtube: "",
  newsletterTitle: "",
  newsletterDesc: ""
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function loadSettings() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/footer")
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      } else {
        setError("Failed to load settings. Please make sure database is seeded.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred loading settings.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const errData = await res.json()
        setError(errData.error || "Failed to save settings.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred saving settings.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Settings className="text-yellow-400 animate-spin-slow" />
          System Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure site-wide editable parameters, footer content, social links, and integrations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-2">
          <Check size={16} className="stroke-[3]" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding & Bio Card */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222] pb-3">
            Branding & Bio
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Footer Bio Description
            </label>
            <textarea
              required
              rows={4}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Describe the website summary..."
              className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Basecamp Location / HQ info
            </label>
            <input
              type="text"
              required
              value={form.basecamp}
              onChange={e => setForm(f => ({ ...f, basecamp: e.target.value }))}
              placeholder="Basecamp: Kathmandu, Nepal"
              className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
            />
          </div>
        </div>

        {/* Social Media Connections Card */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222] pb-3">
            Social Media Handles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Facebook URL</label>
              <input
                type="url"
                value={form.facebook}
                onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))}
                className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Instagram URL</label>
              <input
                type="url"
                value={form.instagram}
                onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Twitter URL</label>
              <input
                type="url"
                value={form.twitter}
                onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))}
                className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">TikTok URL</label>
              <input
                type="url"
                value={form.tiktok}
                onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))}
                className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">YouTube Channel URL</label>
              <input
                type="url"
                value={form.youtube}
                onChange={e => setForm(f => ({ ...f, youtube: e.target.value }))}
                className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Newsletter Box Content Card */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222] pb-3">
            Newsletter Box Text
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Newsletter Header Title
            </label>
            <input
              type="text"
              required
              value={form.newsletterTitle}
              onChange={e => setForm(f => ({ ...f, newsletterTitle: e.target.value }))}
              placeholder="Get the Nomad Starter Kit"
              className="w-full bg-black border border-[#222] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Newsletter Sub-Description
            </label>
            <textarea
              required
              rows={2}
              value={form.newsletterDesc}
              onChange={e => setForm(f => ({ ...f, newsletterDesc: e.target.value }))}
              placeholder="Description underneath the title..."
              className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-black text-sm rounded-xl flex items-center gap-2 shadow"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  )
}
