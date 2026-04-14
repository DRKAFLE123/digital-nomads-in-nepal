"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? "Registration failed.")
    } else {
      router.push("/auth/signin?registered=1")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border bg-white">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-xl text-foreground">Digital Nomads <span className="text-primary">in Nepal</span></span>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create your Nomad account</h1>
          <p className="text-muted text-sm mb-8">Free to join. Leave reviews, connect with local guides.</p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Alex Smith" },
              { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", key: "password", type: "password", placeholder: "Min. 6 characters" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium text-foreground mb-2 block">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required
                  placeholder={field.placeholder}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted transition-all"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
