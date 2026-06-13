"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Camera, ShieldCheck, User, Mail, Link2, Key, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

// Work types matching schema
const WORK_TYPES = [
  { key: "DEVELOPER", label: "Developer 💻" },
  { key: "DESIGNER", label: "Designer 🎨" },
  { key: "WRITER", label: "Writer ✍️" },
  { key: "MARKETER", label: "Marketer 📈" },
  { key: "ENTREPRENEUR", label: "Entrepreneur 🚀" },
  { key: "EDUCATOR", label: "Educator 🎓" },
  { key: "OTHER", label: "Other 🌟" }
]

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [form, setForm] = useState({
    name: "",
    avatarUrl: "",
    country: "",
    currentCity: "",
    workType: "OTHER",
    bio: "",
    linkedinUrl: "",
    twitterUrl: "",
    emailAlerts: true,
    password: "",
    confirmPassword: ""
  })

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" }) // type: success | error

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/community/settings")
    }
  }, [status, router])

  // Fetch initial profile data
  useEffect(() => {
    if (session?.user?.email) {
      setLoading(true)
      fetch(`/api/community/profile?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            const p = data.profile
            setForm(prev => ({
              ...prev,
              name: p.name || "",
              avatarUrl: p.avatarUrl || "",
              country: p.country || "",
              currentCity: p.currentCity || "",
              workType: p.workType || "OTHER",
              bio: p.bio || "",
              linkedinUrl: p.linkedinUrl || "",
              twitterUrl: p.twitterUrl || "",
              emailAlerts: p.emailAlerts ?? true
            }))
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile:", err)
          setMessage({ text: "Failed to load profile settings.", type: "error" })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [session])

  // Handle image upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simple client-side validation
    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Please select an image file.", type: "error" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "Image size must be less than 5MB.", type: "error" })
      return
    }

    setUploading(true)
    setMessage({ text: "", type: "" })

    try {
      const uploadData = new FormData()
      uploadData.append("file", file)

      const res = await fetch("/api/guides/upload", {
        method: "POST",
        body: uploadData
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setForm(prev => ({ ...prev, avatarUrl: data.url }))
      setMessage({ text: "Profile photo uploaded successfully!", type: "success" })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setMessage({ text: `Upload failed: ${msg}`, type: "error" })
    } finally {
      setUploading(false)
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email) return

    setMessage({ text: "", type: "" })

    // Password validation
    if (form.password) {
      if (form.password.length < 6) {
        setMessage({ text: "New password must be at least 6 characters.", type: "error" })
        return
      }
      if (form.password !== form.confirmPassword) {
        setMessage({ text: "Passwords do not match.", type: "error" })
        return
      }
    }

    setSaving(true)

    try {
      const payload = {
        email: session.user.email,
        name: form.name,
        avatarUrl: form.avatarUrl,
        country: form.country,
        currentCity: form.currentCity,
        workType: form.workType,
        bio: form.bio,
        linkedinUrl: form.linkedinUrl,
        twitterUrl: form.twitterUrl,
        emailAlerts: form.emailAlerts,
        ...(form.password ? { password: form.password } : {})
      }

      const res = await fetch("/api/community/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings.")
      }

      setMessage({ text: "Profile updated successfully!", type: "success" })
      // Clear password fields
      setForm(prev => ({ ...prev, password: "", confirmPassword: "" }))

      // Refresh window session or trigger dynamic navbar updates
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setMessage({ text: msg, type: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center pt-24 pb-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading profile settings...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-28 pb-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 via-primary/5 to-transparent pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Back Button */}
          <Link href="/community" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to Community
          </Link>

          {/* Heading */}
          <div className="mb-10 space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-2">
              Profile Settings
            </h1>
            <p className="text-muted text-sm">
              Customize your public nomad profile, set your work hub check-in information, and configure your security settings.
            </p>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`p-4 rounded-2xl border mb-8 flex items-start gap-3 text-sm font-medium ${
              message.type === "success" 
                ? "bg-green-500/10 border-green-500/35 text-green-400" 
                : "bg-red-500/10 border-red-500/35 text-red-400"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <div>{message.text}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Profile Photo Upload */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Camera size={18} className="text-primary" />
                Profile Photo
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar circle with camera hover */}
                <div 
                  onClick={handleAvatarClick}
                  className="relative w-28 h-28 rounded-full border border-border bg-muted/30 dark:bg-[#171717] flex items-center justify-center overflow-hidden cursor-pointer group/upload"
                >
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : form.avatarUrl ? (
                    <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-foreground text-3xl font-black">{form.name?.[0]?.toUpperCase() || <User size={36} />}</span>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 text-[10px] font-black uppercase tracking-wider">
                    <Camera size={18} />
                    <span>Upload</span>
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold rounded-xl transition-all active:scale-[0.98]"
                  >
                    Select Photo
                  </button>
                  <p className="text-muted text-xs mt-2">
                    JPEG or PNG. Max size 5MB. Your photo is visible to other nomads in the directory.
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* 2. Personal Information */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <User size={18} className="text-primary" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5 flex items-center gap-1.5">
                    Email Address 
                    <span className="text-[10px] text-muted/80">(Read Only)</span>
                  </label>
                  <div className="w-full bg-muted/10 border border-border rounded-xl px-4 py-3 text-sm text-muted/80 flex items-center gap-2 select-none">
                    <Mail size={14} />
                    {session?.user?.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Country of Origin *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Germany 🇩🇪"
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Current City (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kathmandu"
                    value={form.currentCity}
                    onChange={e => setForm({ ...form, currentCity: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Work Type</label>
                  <select
                    value={form.workType}
                    onChange={e => setForm({ ...form, workType: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  >
                    {WORK_TYPES.map(type => (
                      <option key={type.key} value={type.key} className="bg-card text-foreground">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Bio (Brief Description)</label>
                <textarea
                  placeholder="Tell other community members what you are working on or planning in Nepal..."
                  rows={4}
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground resize-y"
                />
              </div>
            </div>

            {/* 3. Social Profiles */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Link2 size={18} className="text-primary" />
                Social Profiles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={form.linkedinUrl}
                    onChange={e => setForm({ ...form, linkedinUrl: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Twitter/X URL</label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/username"
                    value={form.twitterUrl}
                    onChange={e => setForm({ ...form, twitterUrl: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* 4. Security Settings (Change Password) */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Key size={18} className="text-primary" />
                Change Password
              </h2>
              <p className="text-muted text-xs leading-relaxed">
                Leave these fields blank if you do not wish to change your password.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full bg-muted/30 dark:bg-[#171717] border border-border dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* 5. Notification Preferences */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-md space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                Notification Preferences
              </h2>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  checked={form.emailAlerts}
                  onChange={e => setForm({ ...form, emailAlerts: e.target.checked })}
                  className="w-4.5 h-4.5 rounded border-border bg-muted/30 dark:bg-[#171717] text-primary focus:ring-primary mt-0.5"
                />
                <label htmlFor="emailAlerts" className="text-xs text-muted leading-normal">
                  Send me email alerts for community treks, local nomad meetups, workspace reviews, and upcoming events in Nepal.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 bg-primary hover:bg-yellow-400 disabled:opacity-40 transition-colors text-black font-extrabold rounded-xl px-8 py-3.5 text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
