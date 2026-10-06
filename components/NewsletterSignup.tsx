"use client"

import { useState } from "react"
import { Send, CheckCircle2, AlertCircle, FileText, Wifi, DollarSign, Mountain } from "lucide-react"
import { trackLeadGeneration } from "@/lib/gtm"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
        trackLeadGeneration("newsletter_starter_kit")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-12 md:p-16 shadow-2xl transition-all">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
          🎁 Free 2026 Starter Kit
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
          Get the Nepal Nomad Starter Kit
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          The definitive survival toolkit for remote workers, freelancers, and adventurers touching down in Nepal.
        </p>

        {/* Value Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left max-w-2xl mx-auto">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">150-Day Visa Roadmap</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Step-by-step PDF on tourist visa renewals.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Wifi size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">Speed-Tested Workspace Map</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground">50+ verified coworking spots with fiber Wi-Fi.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <DollarSign size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">Monthly Budget Template</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Actual rent, dining, and SIM data breakdowns.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mountain size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">Trek &amp; Meetup Invites</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Direct alerts for weekend hikes &amp; nomad dinners.</p>
            </div>
          </div>
        </div>

        {/* Subscription Form */}
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center p-8 bg-primary/10 border border-primary/40 rounded-2xl max-w-lg mx-auto shadow-inner">
            <CheckCircle2 size={42} className="mb-3 text-primary" />
            <h3 className="text-xl font-black text-foreground mb-1">Check Your Inbox!</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              We&apos;ve sent the 2026 Nepal Digital Nomad Starter Kit PDF and resources directly to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your best email address"
              className="flex-grow bg-background border border-border text-foreground px-5 py-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all placeholder:text-muted text-sm shadow-sm"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-primary hover:bg-yellow-400 text-black font-black px-8 py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Send size={15} />
              <span>{status === "loading" ? "Sending Kit..." : "Get Free Kit"}</span>
            </button>
          </form>
        )}

        {status === "error" && (
          <div className="text-red-400 mt-4 text-xs sm:text-sm flex items-center justify-center gap-2">
            <AlertCircle size={15} /> An error occurred. Please try again with a valid email.
          </div>
        )}

        <p className="text-[11px] text-muted-foreground mt-4">
          🔒 Zero spam. Unsubscribe at any time with a single click.
        </p>
      </div>
    </div>
  )
}
