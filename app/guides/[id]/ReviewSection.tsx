"use client"
import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"

type Review = {
  id: string; rating: number; comment: string; createdAt: string
  user: { name: string }
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110">
          <svg className={`w-8 h-8 transition-colors ${i <= (hovered || value) ? "text-primary fill-primary" : "text-border fill-border"}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ guideId, initialReviews }: { guideId: string; initialReviews: Review[] }) {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role

  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError("Please select a star rating."); return }
    if (comment.trim().length < 10) { setError("Comment must be at least 10 characters."); return }

    setLoading(true)
    setError("")

    const res = await fetch(`/api/guides/${guideId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccess("Your review has been submitted! Thank you.")
      setReviews(prev => [{ ...data, user: { name: session?.user?.name ?? "You" } }, ...prev])
      setRating(0)
      setComment("")
    }
  }

  return (
    <div>
      {/* Review Form */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-5">Leave a Review</h2>

        {!session ? (
          <div className="text-center py-6">
            <p className="text-muted mb-4">You need to sign in as a Nomad to leave a review.</p>
            <button onClick={() => signIn()} className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white hover:text-black transition-all">
              Sign In to Review
            </button>
            <p className="text-xs text-muted mt-3">
              No account? <Link href="/auth/register" className="text-primary hover:underline">Create one free</Link>
            </p>
          </div>
        ) : userRole !== "NOMAD" ? (
          <p className="text-muted text-sm py-4 text-center">Only Nomad accounts can leave reviews.</p>
        ) : success ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">⭐</div>
            <p className="text-foreground font-semibold">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Your Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Your Review</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
                placeholder="Share your experience with this guide..."
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <h2 className="text-lg font-bold text-foreground mb-5">
        Reviews <span className="text-muted font-normal text-sm">({reviews.length})</span>
      </h2>

      {reviews.length === 0 ? (
        <p className="text-muted text-sm py-6 text-center border border-dashed border-border rounded-2xl">
          No reviews yet. Be the first to review this guide!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-foreground text-sm">{r.user.name}</p>
                  <p className="text-muted text-xs">{new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-4 h-4 ${i <= r.rating ? "text-primary fill-primary" : "text-border fill-border"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
