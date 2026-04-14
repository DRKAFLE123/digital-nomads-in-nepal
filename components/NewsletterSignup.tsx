"use client"
import { useState } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

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
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="bg-[#141414] border border-[#222222] p-8 md:p-12 text-center rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -m-8 text-[#FFD700] opacity-5">
        <Send size={120} />
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-3">Get the Free Nepal Nomad Starter Kit</h2>
        <p className="text-[#A0A0A0] text-lg mb-8 max-w-xl mx-auto">
          Weekly tips + free PDF guide describing cost of living, visa hacks, and the best coworking spots.
        </p>
        
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-[#FFD700] bg-[#0B0B0B] border border-[#FFD700] p-6 rounded-lg max-w-md mx-auto">
            <CheckCircle size={40} className="mb-3" />
            <h3 className="text-xl font-bold mb-1">Awesome! You're in.</h3>
            <p className="text-[#A0A0A0] text-sm">Check your inbox for the starter kit.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="flex-grow bg-[#0B0B0B] border border-[#222222] text-white px-5 py-4 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] rounded-none transition-colors"
            />
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="bg-[#FFD700] text-black font-bold px-8 py-4 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded-none"
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
