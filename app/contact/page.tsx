"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Mail, MapPin, CheckCircle, Sparkles, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate sending inquiry message
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" })
    } catch {
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct info */}
          <div className="lg:col-span-5 space-y-8 lg:pr-8">
            <div>
              <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
                Contact Our Support Team
              </h1>
              <p className="text-muted-foreground text-sm mt-3">
                Have questions about the Nepal Nomad Visa, coworking partnerships, local guide certifications, or joining the forum? Send us a message and we will respond within 24-48 hours.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Email Address</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">hello@digitalnomadsinnepal.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">Basecamp Location</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">Kathmandu & Lakeside Pokhara, Nepal</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-3">
              <Sparkles className="text-primary shrink-0 animate-pulse" size={24} />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Looking to partner?</strong> We offer vetted registrations for coworking spaces, boutique hotels, and tour guides. Reach out directly with the Partnerships subject!
              </p>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-lg">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto text-2xl">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Message Sent Successfully!</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Thank you for reaching out. A community volunteer or coordinator will email you back shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-primary hover:underline text-xs font-bold"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Visa Support">Visa & Immigration Support</option>
                    <option value="Coworking Partnership">Coworking Space Vetting</option>
                    <option value="Local Guide Certification">Become a Verified Local Guide</option>
                    <option value="Advertising">Advertising & Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Your Message *</label>
                  <textarea
                    required
                    placeholder="Tell us what you need support with..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>

                {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-yellow-400 transition-colors text-black font-extrabold rounded-xl py-3.5 text-xs flex items-center justify-center gap-2"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
