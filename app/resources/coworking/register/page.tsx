/* eslint-disable @next/next/no-img-element */
"use client"
import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowLeft, Building, Mail, MapPin, Loader2, CheckCircle } from "lucide-react"

const LOCATIONS = ["Kathmandu", "Pokhara", "Bandipur", "Chitwan", "Lumbini", "Mustang"]
const FACILITIES_OPTIONS = ["High-Speed Fiber", "Backup Generator", "Ergonomic Chairs", "Coffee & Tea", "Skype Booths", "Meeting Rooms", "Standing Desks", "Phewa Lake View", "Outdoor Terrace", "Community Kitchen"]

export default function SpaceRegisterPage() {
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [facilities, setFacilities] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function toggleFacility(f: string) {
    setFacilities(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/work-hubs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          address,
          description,
          contactEmail,
          website: website || null,
          photoUrl: photoUrl || null,
          facilities
        })
      })

      if (res.ok) {
        setSuccess(true)
        setName("")
        setCity("")
        setAddress("")
        setDescription("")
        setContactEmail("")
        setWebsite("")
        setPhotoUrl("")
        setFacilities([])
      } else {
        const data = await res.json()
        setError(data.error || "Submission failed. Please check required fields.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred during submission.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <div className="mb-8">
            <Link href="/resources/coworking" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
              <ArrowLeft size={14} /> Back to Directory
            </Link>
          </div>

          <div className="mb-8">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Workspace Partners</span>
            <h1 className="text-3xl font-black text-white mt-2 mb-1">List Your Coworking Space</h1>
            <p className="text-muted text-sm">Apply for our &quot;Vetted WorkHub&quot; verification badge and partner program.</p>
          </div>

          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-8 shadow-sm">
            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-black text-white">Application Submitted Successfully!</h2>
                <p className="text-muted text-sm leading-relaxed max-w-md mx-auto">
                  Thank you for applying. Our testing team will visit your workspace or request speed test logs to confirm grid-resiliency (power and fiber backups) before verifying your listing.
                </p>
                <div className="pt-6">
                  <Link href="/resources/coworking" className="inline-block bg-[#FFD700] text-black font-black px-8 py-3 rounded-xl hover:bg-white transition-all text-sm shadow">
                    Back to Directory
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                    {error}
                  </div>
                )}

                {/* Section 1: Core Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1e1e1e] pb-2">Workspace Profile</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Workspace Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="WorkAround Pokhara"
                        className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        City
                      </label>
                      <select
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                      >
                        <option value="">Select city...</option>
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Exact Street Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="Lakeside Ward 6, Pokhara"
                          className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Workspace Description
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe the workspace ambiance, speed statistics, power generators, backup systems, hot desks count..."
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 2: Contact & Links */}
                <div className="space-y-4 pt-4 border-t border-[#1e1e1e]">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2">Contact & Assets</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Public Contact Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)}
                          placeholder="hello@workplace.com"
                          className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Website Link
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        placeholder="https://workplace.com"
                        className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Cover Photo URL
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/your-workspace-photo"
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Section 3: Facilities checkbox */}
                <div className="space-y-4 pt-4 border-t border-[#1e1e1e]">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select All Provided Facilities
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {FACILITIES_OPTIONS.map(f => {
                      const selected = facilities.includes(f)
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFacility(f)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                            selected
                              ? "bg-primary text-black border-primary"
                              : "bg-black border-[#222] text-muted hover:border-gray-600 hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6 border-t border-[#1e1e1e]">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FFD700] hover:bg-white disabled:opacity-50 text-black font-black py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Submit Workspace Application ✓"
                    )}
                  </button>
                  <p className="text-[10px] text-muted leading-relaxed text-center mt-3">
                    ✓ By submitting, you agree that our verification team may perform validation checks.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
