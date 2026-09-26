"use client"
import { useState } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
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
        trackLeadGeneration("newsletter_signup")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="bg-card border border-border p-8 md:p-12 text-center rounded-2xl relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 -m-8 text-primary opacity-5">
        <Send size={120} />
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-foreground mb-3">Get the Free Nepal Nomad Starter Kit</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Weekly tips + free PDF guide describing cost of living, visa hacks, and the best coworking spots.
        </p>
        
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-primary bg-background border border-primary p-6 rounded-xl max-w-md mx-auto shadow-sm">
            <CheckCircle size={40} className="mb-3 text-primary" />
            <h3 className="text-xl font-bold mb-1 text-foreground">Awesome! You&apos;re in.</h3>
            <p className="text-muted-foreground text-sm">Check your inbox for the starter kit.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="flex-grow bg-background border border-border text-foreground px-5 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-colors placeholder:text-muted shadow-sm"
            />
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="bg-primary hover:bg-yellow-400 text-black font-bold px-8 py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded-xl shadow-sm hover:scale-[1.02] active:scale-95"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
        
        {status === "error" && (
          <div className="text-red-500 mt-4 text-sm flex items-center justify-center gap-2">
            <AlertCircle size={16} /> Something went wrong. Please try again later.
          </div>
        )}
      </div>
    </div>
  )
}
