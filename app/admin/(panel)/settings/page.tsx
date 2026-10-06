"use client"
import { useState, useEffect } from "react"
import { Save, Loader2, Check, AlertCircle, Settings, ExternalLink } from "lucide-react"
import { FacebookIcon, TikTokIcon, YouTubeIcon, InstagramIcon, TwitterIcon } from "@/components/SocialIcons"

const DEFAULTS = {
  bio: "",
  basecamp: "",
  facebook: "",
  showFacebook: true,
  instagram: "",
  showInstagram: true,
  twitter: "",
  showTwitter: false,
  tiktok: "",
  showTiktok: true,
  youtube: "",
  showYoutube: true,
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
        setForm({
          ...DEFAULTS,
          ...data,
          showFacebook: data.showFacebook !== undefined ? Boolean(data.showFacebook) : Boolean(data.facebook),
          showInstagram: data.showInstagram !== undefined ? Boolean(data.showInstagram) : Boolean(data.instagram),
          showTiktok: data.showTiktok !== undefined ? Boolean(data.showTiktok) : Boolean(data.tiktok),
          showYoutube: data.showYoutube !== undefined ? Boolean(data.showYoutube) : Boolean(data.youtube),
          showTwitter: data.showTwitter !== undefined ? Boolean(data.showTwitter) : Boolean(data.twitter),
        })
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
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Social Media Channels &amp; Links
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Add your social media URLs and tick which platforms to display on the frontend footer and community sections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook */}
            <div className={`p-4 rounded-xl border transition-all ${form.showFacebook ? 'bg-[#1877F2]/5 border-[#1877F2]/30' : 'bg-black/40 border-[#222]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center">
                    <FacebookIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-white">Facebook</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${form.showFacebook ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {form.showFacebook ? 'Visible' : 'Hidden'}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.showFacebook}
                    onChange={e => setForm(f => ({ ...f, showFacebook: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 bg-black cursor-pointer"
                  />
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={form.facebook}
                  onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))}
                  className="w-full bg-black border border-[#222] rounded-xl px-3 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-[#1877F2]/50 text-xs"
                />
                {form.facebook && (
                  <a
                    href={form.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 text-gray-500 hover:text-white"
                    title="Test Facebook Link"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* TikTok */}
            <div className={`p-4 rounded-xl border transition-all ${form.showTiktok ? 'bg-pink-500/5 border-pink-500/30' : 'bg-black/40 border-[#222]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <TikTokIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-white">TikTok</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${form.showTiktok ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {form.showTiktok ? 'Visible' : 'Hidden'}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.showTiktok}
                    onChange={e => setForm(f => ({ ...f, showTiktok: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 bg-black cursor-pointer"
                  />
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="url"
                  placeholder="https://tiktok.com/@yourhandle"
                  value={form.tiktok}
                  onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))}
                  className="w-full bg-black border border-[#222] rounded-xl px-3 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-xs"
                />
                {form.tiktok && (
                  <a
                    href={form.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 text-gray-500 hover:text-white"
                    title="Test TikTok Link"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* YouTube */}
            <div className={`p-4 rounded-xl border transition-all ${form.showYoutube ? 'bg-red-500/5 border-red-500/30' : 'bg-black/40 border-[#222]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
                    <YouTubeIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-white">YouTube</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${form.showYoutube ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {form.showYoutube ? 'Visible' : 'Hidden'}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.showYoutube}
                    onChange={e => setForm(f => ({ ...f, showYoutube: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 bg-black cursor-pointer"
                  />
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="url"
                  placeholder="https://youtube.com/@yourchannel"
                  value={form.youtube}
                  onChange={e => setForm(f => ({ ...f, youtube: e.target.value }))}
                  className="w-full bg-black border border-[#222] rounded-xl px-3 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-xs"
                />
                {form.youtube && (
                  <a
                    href={form.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 text-gray-500 hover:text-white"
                    title="Test YouTube Link"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* Instagram */}
            <div className={`p-4 rounded-xl border transition-all ${form.showInstagram ? 'bg-purple-500/5 border-purple-500/30' : 'bg-black/40 border-[#222]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 text-pink-400 flex items-center justify-center">
                    <InstagramIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-white">Instagram</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${form.showInstagram ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {form.showInstagram ? 'Visible' : 'Hidden'}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.showInstagram}
                    onChange={e => setForm(f => ({ ...f, showInstagram: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 bg-black cursor-pointer"
                  />
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={form.instagram}
                  onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                  className="w-full bg-black border border-[#222] rounded-xl px-3 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs"
                />
                {form.instagram && (
                  <a
                    href={form.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 text-gray-500 hover:text-white"
                    title="Test Instagram Link"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* Twitter / X (Optional) */}
            <div className={`p-4 rounded-xl border md:col-span-2 transition-all ${form.showTwitter ? 'bg-white/5 border-white/20' : 'bg-black/40 border-[#222]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center">
                    <TwitterIcon size={14} />
                  </div>
                  <span className="text-xs font-bold text-white">X / Twitter (Optional)</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${form.showTwitter ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {form.showTwitter ? 'Visible' : 'Hidden'}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.showTwitter}
                    onChange={e => setForm(f => ({ ...f, showTwitter: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 bg-black cursor-pointer"
                  />
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="url"
                  placeholder="https://x.com/yourhandle"
                  value={form.twitter}
                  onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))}
                  className="w-full bg-black border border-[#222] rounded-xl px-3 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-xs"
                />
                {form.twitter && (
                  <a
                    href={form.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 text-gray-500 hover:text-white"
                    title="Test Twitter Link"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
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
