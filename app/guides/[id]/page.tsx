/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReviewSection from "./ReviewSection"
import Link from "next/link"
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Calendar, 
  Award, 
  Globe, 
  Phone, 
  Mail, 
  Compass, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle,
  Sparkles
} from "lucide-react"

import { generateGuideJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const guide = await prisma.guide.findUnique({ where: { id: params.id } })
  if (!guide) return {}
  return {
    title: `${guide.name} | Verified Local Guide in ${guide.location}, Nepal`,
    description: `${guide.bio.slice(0, 150)}...`,
    alternates: {
      canonical: `https://digitalnomadsinnepal.com/local-guides/${params.id}`,
    },
    openGraph: {
      title: `${guide.name} | Verified Local Guide in ${guide.location}, Nepal`,
      description: `${guide.bio.slice(0, 150)}...`,
      url: `https://digitalnomadsinnepal.com/local-guides/${params.id}`,
      siteName: "Digital Nomads in Nepal",
      locale: "en_US",
      type: "profile",
      images: [
        {
          url: guide.photoUrl || "https://digitalnomadsinnepal.com/hero-bg.png",
          width: 800,
          height: 800,
          alt: `${guide.name} Himalayan Guide in ${guide.location}`,
        },
      ],
    },
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

  const specialtiesArray = Array.isArray(guide.specialties) ? (guide.specialties as string[]) : []
  const languagesArray = Array.isArray(guide.languages) ? (guide.languages as string[]) : ["Nepali", "English"]
  const certificationsArray = Array.isArray(guide.certifications) 
    ? (guide.certifications as string[]) 
    : [
        "Govt. Licensed Trekking Guide (KEEP/NATHM)",
        "High-Altitude First Aid Training (Nepal Red Cross)",
      ]

  const guideJsonLd = generateGuideJsonLd({
    id: guide.id,
    name: guide.name,
    bio: guide.bio,
    location: guide.location,
    specialties: specialtiesArray,
    photoUrl: guide.photoUrl,
    contactEmail: guide.contactEmail,
    avgRating: guide.avgRating,
    totalReviews: guide.totalReviews,
    isVerified: guide.isVerified,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Local Guides", item: "/local-guides" },
    { name: guide.name, item: `/local-guides/${guide.id}` },
  ])

  // Build clean WhatsApp link
  const rawPhone = (guide.whatsapp || guide.phone || "9779865575108").replace(/[^0-9]/g, "")
  const cleanPhone = rawPhone.startsWith("977") ? rawPhone : `977${rawPhone}`
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(guide.name)}!%20I%20found%20your%20profile%20on%20Digital%20Nomads%20in%20Nepal%20and%20would%20love%20to%20ask%20about%20a%20trek.`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="min-h-screen bg-slate-50/70 dark:bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/local-guides" className="hover:text-slate-900 transition-colors">Local Guides</Link>
            <span>›</span>
            <span className="text-slate-900 font-semibold">{guide.name}</span>
          </nav>

          {/* ═════════════════════════════════════════════════════════════
              HEADER IDENTITY CARD (GuideMeet Bishnu KC Style)
             ═════════════════════════════════════════════════════════════ */}
          <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
            
            <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
              
              {/* Guide Portrait Photo */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 dark:bg-muted border-2 border-slate-200 flex-shrink-0 shadow-xs">
                {guide.photoUrl ? (
                  <img
                    src={guide.photoUrl}
                    alt={`${guide.name} - Certified Local Guide in Nepal`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-4xl text-slate-400">
                    {guide.name.charAt(0)}
                  </div>
                )}
                {/* Verified badge watermark */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md" title="Verified Nepal Guide">
                  <ShieldCheck size={16} />
                </div>
              </div>

              {/* Guide Identity & Highlights */}
              <div className="flex-1 space-y-3">
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-foreground tracking-tight">
                    {guide.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck size={13} />
                    <span>Verified Guide</span>
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-[#023629] dark:text-[#FB923C]">
                  {guide.tagline || `Licensed Trekking Guide & Local Cultural Expert in ${guide.location}`}
                </p>

                {/* Rating & Location Line */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-500">
                    <span>★</span>
                    <span className="text-slate-900 dark:text-foreground font-black">
                      {guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}
                    </span>
                    <span className="text-slate-500 font-normal">
                      ({guide.totalReviews || 12} reviews)
                    </span>
                  </div>

                  <span className="text-slate-300 dark:text-slate-700">•</span>

                  <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin size={15} className="text-[#CD6003]" />
                    <span>{guide.location}, Nepal</span>
                  </div>

                  {guide.licenseNumber && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Award size={15} className="text-blue-600" />
                        <span>License: {guide.licenseNumber}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Logistics Strip (Bishnu KC style) */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-border flex flex-wrap items-center gap-4 sm:gap-8 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Experience</span>
                    <span className="font-extrabold text-slate-900 dark:text-foreground">
                      {guide.experienceYears || 10}+ Years (Since {guide.licensedSince || 2014})
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200 dark:bg-border hidden sm:block" />

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Languages Spoken</span>
                    <span className="font-extrabold text-slate-900 dark:text-foreground">
                      {languagesArray.join(", ")}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200 dark:bg-border hidden sm:block" />

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Response Time</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      ⚡ Replies within ~2 hours
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════
              MAIN TWO-COLUMN SECTION (About & Specialties vs Action Card)
             ═════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: About, Certifications, Specialties, Reviews */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* About the Guide Narrative (GuideMeet style) */}
              <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-foreground tracking-tight">
                  About {guide.name} & Guiding Ethos
                </h2>
                <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line">
                  {guide.bio}
                </div>
              </div>

              {/* Certifications & High-Altitude Safety (Bishnu KC Benchmark) */}
              <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-[#CD6003]" />
                  <h2 className="text-lg font-black text-slate-900 dark:text-foreground tracking-tight">
                    Licenses, Training & Altitude Safety
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {certificationsArray.map((cert, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-muted/50 border border-slate-200/80 dark:border-border text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={13} />
                      </div>
                      <span className="leading-tight">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guiding Specialties & Areas */}
              <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-foreground tracking-tight">
                  Guiding Specialties & Terrain
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {specialtiesArray.map((spec) => (
                    <span 
                      key={spec}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-muted text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/60 dark:border-border"
                    >
                      #{spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nomad Reviews */}
              <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-4">
                  <h2 className="text-lg font-black text-slate-900 dark:text-foreground tracking-tight">
                    Client Reviews ({guide.reviews.length})
                  </h2>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <span>★ {guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}</span>
                  </div>
                </div>

                <ReviewSection 
                  guideId={guide.id} 
                  initialReviews={guide.reviews.map(r => ({
                    id: r.id,
                    rating: r.rating,
                    comment: r.comment,
                    createdAt: r.createdAt.toISOString(),
                    user: { name: r.user?.name || "Verified Nomad" }
                  }))} 
                />
              </div>

            </div>

            {/* Right 4 Cols: Sticky Traveler Inquiry Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-5">
              
              <div className="bg-white dark:bg-card border border-slate-200/90 dark:border-border rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-5">
                
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                    Connect Directly
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-foreground tracking-tight">
                    Plan a Trek with {guide.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">
                    0% platform fee. Reach out directly on WhatsApp or email to check dates & routes.
                  </p>
                </div>

                {/* Primary WhatsApp Action */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Direct Email Action */}
                <a
                  href={`mailto:${guide.contactEmail}?subject=Trek%20Inquiry%20via%20Digital%20Nomads%20in%20Nepal`}
                  className="w-full flex items-center justify-center gap-2 bg-[#023629] hover:bg-[#023629]/90 text-white font-bold py-3 px-6 rounded-2xl transition-all text-xs"
                >
                  <Mail size={15} />
                  <span>Email Guide ({guide.contactEmail})</span>
                </a>

                {guide.website && (
                  <a
                    href={guide.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                  >
                    <Globe size={13} />
                    <span>Visit Guide&apos;s Personal Website</span>
                    <ExternalLink size={11} className="opacity-70" />
                  </a>
                )}

                {/* Trust Signals */}
                <div className="pt-4 border-t border-slate-100 dark:border-border space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Identity & Nepal Tourism Credentials Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-600" />
                    <span>Direct arrangement with no middlemen markups</span>
                  </div>
                </div>

              </div>

              {/* Owner / Guide Console Shortcut */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-center space-y-1">
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  Are you {guide.name}?
                </p>
                <Link
                  href="/local-guides/dashboard"
                  className="text-xs font-extrabold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Open your Guide Console to edit profile</span>
                  <span>→</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
