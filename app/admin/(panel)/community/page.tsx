"use client"

import { useEffect, useState, useCallback } from "react"
import { Users, Trash2, Send, Mail, Search, RefreshCw, AlertCircle, CheckCircle2, MapPin, Globe } from "lucide-react"

interface ActiveCheckIn {
  id: string
  checkInAt: string
  checkOutAt?: string | null
  hub: {
    name: string
  }
}

interface NomadProfile {
  id: string
  name: string
  email: string
  country: string
  currentCity: string | null
  workType: string
  emailAlerts: boolean
  createdAt: string
  checkIns: ActiveCheckIn[]
}

export default function AdminCommunityPage() {
  const [profiles, setProfiles] = useState<NomadProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Email blast form
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [emailType, setEmailType] = useState("event")
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState({ text: "", type: "" }) // type: success | error

  // Fetch registered community members
  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/community")
      const data = await res.json()
      if (data.success && data.profiles) {
        setProfiles(data.profiles)
      }
    } catch (err) {
      console.error("Failed to fetch community profiles:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  // Delete profile
  const handleDeleteProfile = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the community?`)) return

    try {
      const res = await fetch(`/api/admin/community?id=${id}`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete profile")
      }

      setProfiles(profiles.filter(p => p.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert(msg)
    }
  }

  // Send email blast
  const handleSendEmailBlast = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setEmailStatus({ text: "", type: "" })

    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          body: emailBody,
          type: emailType
        })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email blast")
      }

      setEmailStatus({
        text: data.message || "Email alert sent successfully!",
        type: "success"
      })
      setEmailSubject("")
      setEmailBody("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setEmailStatus({ text: msg, type: "error" })
    } finally {
      setEmailLoading(false)
    }
  }

  // Filter profiles based on search
  const filteredProfiles = profiles.filter(profile => {
    const query = searchQuery.toLowerCase()
    return (
      profile.name.toLowerCase().includes(query) ||
      profile.email.toLowerCase().includes(query) ||
      profile.country.toLowerCase().includes(query) ||
      (profile.currentCity && profile.currentCity.toLowerCase().includes(query)) ||
      profile.workType.toLowerCase().includes(query)
    )
  })

  // Count subscribed members
  const subscribedCount = profiles.filter(p => p.emailAlerts).length

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-primary" size={26} />
            Community Member Directory
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {profiles.length} registered digital nomads · {subscribedCount} subscribed to email alerts
          </p>
        </div>
        <button
          onClick={fetchProfiles}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#111] border border-[#222] px-3.5 py-2 rounded-xl transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Member Directory Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search nomads by name, email, country, skill..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary text-white transition-colors"
              />
            </div>
          </div>

          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-gray-500 text-sm flex flex-col items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary border-r-2"></div>
                Loading registered members...
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                No community members found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-[#1e1e1e] text-gray-500 text-xs uppercase tracking-wider bg-white/[0.01]">
                      <th className="px-5 py-3.5 font-semibold">Nomad</th>
                      <th className="px-5 py-3.5 font-semibold">Work Type</th>
                      <th className="px-5 py-3.5 font-semibold">City/Check-In</th>
                      <th className="px-5 py-3.5 font-semibold text-center">Alerts</th>
                      <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map(profile => {
                      return (
                        <tr key={profile.id} className="border-b border-[#1a1a1a] hover:bg-white/[0.01] transition-colors">
                          
                          {/* Nomad Name + Email + Country */}
                          <td className="px-5 py-4">
                            <div>
                              <div className="font-bold text-white leading-snug">{profile.name}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{profile.email}</div>
                              <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                <Globe size={10} className="text-gray-500" />
                                {profile.country}
                              </div>
                            </div>
                          </td>

                          {/* Work Type Badge */}
                          <td className="px-5 py-4">
                            <span className="bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              {profile.workType}
                            </span>
                          </td>

                          {/* Current City or Active Check-in */}
                          <td className="px-5 py-4">
                            {profile.checkIns && profile.checkIns.length > 0 && !profile.checkIns[0].checkOutAt ? (
                              <div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                                  ● {profile.checkIns[0].hub.name}
                                </span>
                                <div className="text-[9px] text-gray-500 mt-0.5">
                                  Checked in at {new Date(profile.checkIns[0].checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            ) : profile.currentCity ? (
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <MapPin size={12} className="text-gray-500" />
                                {profile.currentCity}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xs italic">Not specified</span>
                            )}
                          </td>

                          {/* Email Alerts Opt-in */}
                          <td className="px-5 py-4 text-center">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              profile.emailAlerts
                                ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                                : "bg-zinc-800 text-zinc-500"
                            }`}>
                              {profile.emailAlerts ? "Subscribed" : "Off"}
                            </span>
                          </td>

                          {/* Deletion Button */}
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleDeleteProfile(profile.id, profile.name)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-colors ml-auto"
                              title="Delete Profile"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>

                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Send Email Alert / Blast Form */}
        <div className="lg:col-span-4 bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 shadow-xl h-fit">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Mail className="text-purple-400" size={20} />
            Send Email Blast
          </h2>
          <p className="text-gray-400 text-xs mb-5">
            Compose and broadcast an email notification to all <strong>{subscribedCount}</strong> community members who opted into alerts.
          </p>

          <form onSubmit={handleSendEmailBlast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Alert Type</label>
              <select
                value={emailType}
                onChange={e => setEmailType(e.target.value)}
                className="w-full bg-[#171717] border border-[#222] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="event">🎉 Event Alert (Kathmandu/Pokhara meetups)</option>
                <option value="trek">🏔️ Trek Alert (Group trek invites & socials)</option>
                <option value="hub">🏢 New Coworking Hub (verified workspace news)</option>
                <option value="digest">📰 General Digest (Weekly summaries)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Join us for Friday Nomad Meetup in Pokhara!"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="w-full bg-[#171717] border border-[#222] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email Body Content</label>
              <textarea
                required
                rows={6}
                placeholder="Write the message content here. Supports multiple lines..."
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                className="w-full bg-[#171717] border border-[#222] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {emailStatus.text && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 ${
                emailStatus.type === "success" 
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                {emailStatus.type === "success" ? <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />}
                <span>{emailStatus.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={emailLoading || subscribedCount === 0}
              className="w-full bg-primary hover:bg-yellow-400 disabled:opacity-40 transition-colors text-black font-extrabold rounded-xl py-3 text-xs flex items-center justify-center gap-1.5"
            >
              {emailLoading ? "Sending Alert..." : "Broadcast Email Blast"}
              <Send size={13} />
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
