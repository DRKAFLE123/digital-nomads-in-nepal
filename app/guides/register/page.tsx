"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"

const LOCATIONS = ["Kathmandu", "Pokhara", "Bandipur", "Chitwan", "Lumbini", "Nagarkot", "Mustang"]
const ALL_SPECIALTIES = ["Trekking", "Foodie", "History", "Photography", "Cultural", "Wildlife", "Adventure", "Language", "Yoga & Wellness", "Day Trips"]

type FormData = {
  name: string; email: string; location: string
  specialties: string[]; bio: string; photoUrl: string
}

export default function GuideRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState<FormData>({
    name: "", email: "", location: "",
    specialties: [], bio: "", photoUrl: "",
  })

  function toggleSpecialty(s: string) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter(x => x !== s)
        : [...f.specialties, s]
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/guides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, contactEmail: form.email }),
    })
    setLoading(false)
    if (res.ok) {
      setStep(5)
    } else {
      const d = await res.json()
      setError(d.error ?? "Submission failed. Please try again.")
    }
  }

  const progress = Math.round(((step - 1) / 4) * 100)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">

          {step < 5 && (
            <>
              <div className="mb-8">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Guide Registration</span>
                <h1 className="text-3xl font-black text-foreground mt-2 mb-1">Become a Local Guide</h1>
                <p className="text-muted text-sm">Share your expertise with digital nomads exploring Nepal.</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-muted mb-2">
                  {["Personal Info", "Specialties & Bio", "Photo", "Review"].map((s, i) => (
                    <span key={s} className={step === i + 1 ? "text-primary font-bold" : ""}>{s}</span>
                  ))}
                </div>
                <div className="w-full h-1.5 bg-border rounded-full">
                  <div className="h-1.5 bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </>
          )}

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            {error && <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-foreground mb-4">Personal Information</h2>
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Sita Rai" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "sita@example.com" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-sm font-medium text-foreground mb-2 block">{f.label}</label>
                    <input type={f.type} value={form[f.key as keyof FormData] as string}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                  <select value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select your city...</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <button disabled={!form.name || !form.email || !form.location}
                  onClick={() => setStep(2)}
                  className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Specialties & Bio</h2>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Select your specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SPECIALTIES.map(s => (
                      <button key={s} onClick={() => toggleSpecialty(s)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.specialties.includes(s) ? "bg-primary text-black border-primary" : "bg-background border-border text-muted hover:border-primary hover:text-primary"}`}>
                        #{s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Bio <span className="text-muted">(min. 50 characters)</span></label>
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={5}
                    placeholder="Tell nomads about yourself, your experience, and what makes you a great guide..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted resize-none" />
                  <p className="text-xs text-muted mt-1">{form.bio.length} / 50 min characters</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-border text-foreground font-semibold py-3 rounded-lg hover:border-primary transition-all">← Back</button>
                  <button disabled={form.specialties.length === 0 || form.bio.length < 50}
                    onClick={() => setStep(3)}
                    className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Profile Photo</h2>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Photo URL <span className="text-muted">(paste a link to your photo)</span></label>
                  <input type="url" value={form.photoUrl} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted" />
                </div>
                {form.photoUrl && (
                  <div className="flex justify-center">
                    <img src={form.photoUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg" />
                  </div>
                )}
                <p className="text-xs text-muted text-center">Don&apos;t have a photo URL? You can skip this and add it later.</p>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-border text-foreground font-semibold py-3 rounded-lg hover:border-primary transition-all">← Back</button>
                  <button onClick={() => setStep(4)} className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Review */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Review & Submit</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Name", value: form.name },
                    { label: "Email", value: form.email },
                    { label: "Location", value: form.location },
                    { label: "Specialties", value: form.specialties.map(s => `#${s}`).join("  ") || "None selected" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 border-b border-border/50 pb-3">
                      <span className="text-muted w-24 flex-shrink-0">{label}</span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="border-b border-border/50 pb-3">
                    <span className="text-muted block mb-1">Bio</span>
                    <p className="text-foreground text-xs leading-relaxed">{form.bio}</p>
                  </div>
                </div>
                <p className="text-xs text-muted bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
                  ✓ Your profile will be reviewed by our team before appearing publicly. You&apos;ll receive a confirmation email.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="flex-1 border border-border text-foreground font-semibold py-3 rounded-lg hover:border-primary transition-all">← Back</button>
                  <button onClick={handleSubmit} disabled={loading}
                    className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-50">
                    {loading ? "Submitting..." : "Submit for Verification ✓"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5 — Success */}
            {step === 5 && (
              <div className="text-center py-6">
                <div className="text-5xl mb-6">🏔️</div>
                <h2 className="text-2xl font-black text-foreground mb-3">Application Submitted!</h2>
                <p className="text-muted mb-8 max-w-sm mx-auto">
                  Thank you, <strong>{form.name}</strong>! Your guide profile has been submitted for verification. Our team will review it within 2–3 days.
                </p>
                <Link href="/guides" className="inline-block bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">
                  Browse Guides →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
