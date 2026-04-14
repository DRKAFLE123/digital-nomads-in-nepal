import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReviewSection from "./ReviewSection"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const guide = await prisma.guide.findUnique({ where: { id: params.id } })
  if (!guide) return {}
  return {
    title: `${guide.name} — Local Guide in ${guide.location} | Digital Nomads in Nepal`,
    description: `${guide.bio.slice(0, 150)}...`,
  }
}

export default async function GuideProfilePage({ params }: { params: { id: string } }) {
  const guide = await prisma.guide.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, createdAt: true } } },
      },
    },
  })

  if (!guide) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-10">
            <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
            <span>›</span>
            <span className="text-foreground">{guide.name}</span>
          </nav>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              {guide.photoUrl ? (
                <img src={guide.photoUrl} alt={guide.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-border shadow-lg" />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-5xl font-black border-4 border-border">
                  {guide.name[0]}
                </div>
              )}
              {guide.isVerified && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                  ✓ Himalayan Verified
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 pt-2">
              <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">{guide.name}</h1>
              <div className="flex items-center gap-2 text-muted text-sm mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                {guide.location}
              </div>

              {/* Stars */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-5 h-5 ${i <= Math.round(guide.avgRating) ? "text-primary fill-primary" : "text-border fill-border"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-foreground font-bold">{guide.avgRating.toFixed(1)}</span>
                <span className="text-muted text-sm">({guide.totalReviews} review{guide.totalReviews !== 1 ? "s" : ""})</span>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {guide.specialties.map(s => (
                  <span key={s} className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">#{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-10">
            <h2 className="text-lg font-bold text-foreground mb-3">About {guide.name}</h2>
            <p className="text-muted leading-relaxed">{guide.bio}</p>
          </div>

          {/* Reviews */}
          <ReviewSection guideId={guide.id} initialReviews={guide.reviews as any} />
        </div>
      </main>
      <Footer />
    </>
  )
}
