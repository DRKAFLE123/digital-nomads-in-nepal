import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "@/components/ImageWithFallback"
import type { Metadata } from "next"
import TrekkingGuideIcon from "@/components/TrekkingGuideIcon"
import { Shield, Wifi, Wallet, Star, CheckCircle, AlertCircle, ArrowLeft, Building, Sparkles } from "lucide-react"
interface DestinationTags {
  score?: string
  cost?: string
  speed?: string
  safety?: string
  power?: string
  sim?: string
  coworking?: string[]
  pros?: string[]
  cons?: string[]
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dest = await prisma.destination.findUnique({ where: { slug: params.slug } })
  if (!dest) return {}
  return {
    title: `${dest.name} Travel & Work Guide for Digital Nomads | Digital Nomads in Nepal`,
    description: dest.description ? dest.description.slice(0, 155) + "..." : "",
  }
}

const FACTS: Record<string, {
  score: string
  cost: string
  speed: string
  safety: string
  power: string
  sim: string
  coworking: string[]
  pros: string[]
  cons: string[]
}> = {
  kathmandu: {
    score: "4.2",
    cost: "$700 / month",
    speed: "100 - 300 Mbps (Fiber)",
    safety: "High (Very Safe)",
    power: "Excellent (Power Backups Standard)",
    sim: "Ncell & NTC 4G (Very Strong)",
    coworking: ["Impact Hub (Sanepa)", "Work Around (Lalitpur)", "Next Venture Corp"],
    pros: ["Rich historical sites & UNESCO heritage", "Large professional networking community", "Hundreds of cafes with fast fiber internet", "Excellent international dining options"],
    cons: ["Traffic congestion & dust", "Air quality during dry winter months"]
  },
  pokhara: {
    score: "4.6",
    cost: "$650 / month",
    speed: "80 - 200 Mbps (Fiber)",
    safety: "Very High (Peaceful)",
    power: "Good (Most nomad spots have inverters)",
    sim: "Ncell & NTC (Good Lakeside coverage)",
    coworking: ["Nomad Hub (Lakeside)", "Workation Pokhara", "Lakeside Work Cafes"],
    pros: ["Stunning lakeside living with Annapurna range views", "Fresh clean air and paragliding hotspots", "Perfect basecamp for weekend Himalayan treks", "Laid-back tourist friendly vibe & nightlife"],
    cons: ["Heavy monsoon rains (June - August)", "Fewer formal coworking hubs than Kathmandu"]
  },
  lalitpur: {
    score: "4.4",
    cost: "$680 / month",
    speed: "100 - 250 Mbps (Fiber)",
    safety: "Very High (Friendly communities)",
    power: "Excellent (Power backups standard)",
    sim: "Ncell & NTC 4G (Very Strong)",
    coworking: ["Work Around (Lalitpur)", "Impact Hub (Sanepa)", "The Hub Jhamsikhel"],
    pros: ["Exquisite artisan heritage and Patan Durbar Square", "Walkable, leafy expat neighborhoods (Jhamsikhel & Sanepa)", "Abundant design-forward cafes with stable internet", "Active international community & events"],
    cons: ["Slightly higher rental cost in hot areas", "Traffic congestion during rush hours"]
  },
  chitwan: {
    score: "3.8",
    cost: "$550 / month",
    speed: "30 - 80 Mbps (Fiber)",
    safety: "High (Peaceful tourist areas)",
    power: "Good (Resorts have backup generators)",
    sim: "Ncell & NTC (Decent 4G in Sauraha)",
    coworking: ["Riverside resorts", "Local cafes in Sauraha"],
    pros: ["Stunning subtropical jungle environment and river views", "Incredible wildlife safaris (rhinos, elephants, crocodiles)", "Warm and sunny winter climate", "Lower cost of living"],
    cons: ["Hot and humid summer/monsoon months", "Few dedicated coworking spaces", "Mosquitoes and insects"]
  },
  bandipur: {
    score: "3.9",
    cost: "$500 / month",
    speed: "40 - 100 Mbps (Vianet/Worldlink)",
    safety: "Very High (Tight-knit community)",
    power: "Fair (Homestays use backup power)",
    sim: "Ncell (Fair), NTC (Good 4G)",
    coworking: ["Local cafes (Newa Town Cafe)", "Homestays with dedicated workspaces"],
    pros: ["No vehicle noise (fully pedestrianized stone streets)", "Exquisite traditional Newari architecture", "Tranquil environment for deep focus", "Spectacular mountain panorama vistas"],
    cons: ["No formal coworking spaces", "Limited choice of cafes and restaurants"]
  },
  manang: {
    score: "3.7",
    cost: "$450 / month",
    speed: "15 - 50 Mbps (Local Fiber / Satellite / LTE)",
    safety: "Very High (Kind mountain community)",
    power: "Fair (Solar power & backup batteries standard)",
    sim: "NTC (Strong 4G in town), Ncell (Limited)",
    coworking: ["Local Teahouse workspaces", "ACAP Information Center"],
    pros: ["Jaw-dropping vistas of Annapurna and Gangapurna peaks", "Perfect acclimatization base for high-altitude hikers", "Tranquil Buddhist monasteries and heritage", "Pure, unpolluted Himalayan alpine air"],
    cons: ["Risk of altitude sickness (AMS) if ascending too fast", "Cold winter temperatures and occasional snow blockages", "No formal coworking spaces"]
  },
  mustang: {
    score: "4.0",
    cost: "$520 / month",
    speed: "30 - 80 Mbps (Fiber)",
    safety: "Very High (Peaceful, spiritual atmosphere)",
    power: "Good (Hydropower grid, very reliable)",
    sim: "Ncell & NTC (Decent 4G in Jomsom and Marpha)",
    coworking: ["Marpha local workspace cafes", "Jomsom Mountain Lodges"],
    pros: ["Spectacular desert-like Himalayan landscapes and wind-carved cliffs", "Rich ancient Tibetan culture and walled city of Lo Manthang", "Famed apples, local apple brandy, and traditional stone houses", "Unique mountain biking and hiking trails"],
    cons: ["High wind speeds in the afternoon", "Strict travel permits required for Upper Mustang area"]
  },
  khaptad: {
    score: "3.5",
    cost: "$380 / month",
    speed: "10 - 30 Mbps (Mobile 4G/3G)",
    safety: "Very High (Extremely peaceful forest sanctuary)",
    power: "Basic (Solar and portable power banks required)",
    sim: "NTC (Decent 4G/3G signal in meadows), Ncell (Spotty)",
    coworking: ["Khaptad Headquarters lodging", "Nature tents with mobile hotspots"],
    pros: ["Absolute peace, untouched natural beauty, and forest bathing", "Pristine rolling meadows, wildflower blooms, and bird watching", "Rich spiritual heritage and historical temple shrines", "Completely uncrowded and off the beaten track"],
    cons: ["No fiber internet or formal cafes", "Requires self-sufficiency and camping gear", "Long road travel from major airports"]
  }
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase()
  const dest = await prisma.destination.findUnique({
    where: { slug }
  })

  if (!dest) {
    notFound()
  }

  let factData = FACTS[slug] || {
    score: "4.0",
    cost: "$600 / month",
    speed: "50 - 100 Mbps",
    safety: "High",
    power: "Good",
    sim: "Ncell / NTC 4G",
    coworking: ["Local Cafes"],
    pros: ["Beautiful nature", "Kind locals"],
    cons: ["Fewer infrastructures"]
  }

  if (dest.tags && typeof dest.tags === "object" && !Array.isArray(dest.tags)) {
    const t = dest.tags as DestinationTags
    if (t.score || t.cost || t.speed) {
      factData = {
        score: t.score || "4.0",
        cost: t.cost || "$600 / month",
        speed: t.speed || "50 - 100 Mbps",
        safety: t.safety || "High",
        power: t.power || "Good",
        sim: t.sim || "Ncell / NTC 4G",
        coworking: Array.isArray(t.coworking) ? t.coworking : ["Local Cafes"],
        pros: Array.isArray(t.pros) ? t.pros : [],
        cons: Array.isArray(t.cons) ? t.cons : []
      }
    }
  }

  // Fetch dynamic vetted work hubs for this city
  const dbHubs = await prisma.workHub.findMany({
    where: { city: dest.name },
    orderBy: { rating: "desc" }
  })

  // Get related posts dynamically
  const dbPosts = await prisma.post.findMany({
    where: { published: true }
  })
  
  const relatedPosts = dbPosts.filter(post => {
    const tagsArray = Array.isArray(post.tags) ? (post.tags as string[]) : []
    const hasTag = tagsArray.some(t => t.toLowerCase() === slug)
    const hasText = post.title.toLowerCase().includes(slug) || post.excerpt.toLowerCase().includes(slug)
    return hasTag || hasText
  }).slice(0, 3).map(p => ({
    ...p,
    date: p.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-24">
        {/* Banner with 45% overlay and glassmorphic blurred text background */}
        <div className="relative h-[65vh] w-full min-h-[400px] flex items-end overflow-hidden border-b border-border">
          <Image
            src={dest.image || "/hero-bg.png"}
            alt={`${dest.name} Digital Nomad Destination`}
            fill
            className="object-cover object-center transform scale-100 transition-transform duration-700 hover:scale-105"
            priority
          />
          {/* Light overlay (45%) to make mountains/details brighter & premium */}
          <div className="absolute inset-0 bg-black/45" />
          
          <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 z-10">
            <Link href="/destinations" className="inline-flex items-center gap-2 text-white/95 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider mb-6 bg-black/40 px-3.5 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <ArrowLeft size={14} /> Back to Destinations
            </Link>
            
            {/* Styled glassmorphic container for heading text */}
            <div className="max-w-2xl bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <span className="text-primary text-xs font-extrabold uppercase tracking-widest mb-2 block">
                Destination Guide
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {dest.name}
              </h1>
              <p className="text-gray-200 mt-3 text-sm sm:text-base font-medium leading-relaxed">
                A complete remote-work checklist, speed test results, and lifestyle guide.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Detailed Guide Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-black text-foreground mb-4">Overview</h2>
                <p className="text-muted leading-relaxed text-base whitespace-pre-line">
                  {dest.description || "No overview available for this destination yet."}
                </p>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm border-t-4 border-t-green-500">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} /> Why Nomads Love It
                  </h3>
                  <ul className="space-y-3">
                    {factData.pros.map((pro, i) => (
                      <li key={i} className="text-muted text-sm flex items-start gap-2.5 leading-relaxed">
                        <span className="text-green-500 font-bold mt-0.5">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm border-t-4 border-t-red-500/80">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <AlertCircle className="text-red-500" size={20} /> Challenges / Cons
                  </h3>
                  <ul className="space-y-3">
                    {factData.cons.map((con, i) => (
                      <li key={i} className="text-muted text-sm flex items-start gap-2.5 leading-relaxed">
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Coworking Directory */}
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Building className="text-primary" size={22} /> Tested Coworking & Work Hubs
                    </h3>
                    <p className="text-muted text-xs mt-1">
                      These locations are partner spaces tested for high-speed fiber internet and power backup generator status.
                    </p>
                  </div>
                  <Link href="/resources/coworking" className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3.5 py-2 rounded-full whitespace-nowrap">
                    View All Hubs →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dbHubs.length > 0 ? (
                    dbHubs.map(hub => {
                      return (
                        <Link key={hub.id} href={`/resources/coworking/${hub.slug}`} className="p-5 bg-background border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group block flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md">
                                {hub.city}
                              </span>
                              <div className="flex gap-1">
                                {hub.isPartner && <Sparkles size={14} className="text-[#FFD700]" />}
                                {hub.isVerified && <CheckCircle size={14} className="text-green-500" />}
                              </div>
                            </div>
                            <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {hub.name}
                            </h4>
                            <p className="text-muted text-[11px] leading-relaxed line-clamp-2 mt-2 mb-4">
                              {hub.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted">
                            <span className="flex items-center gap-1 font-semibold text-foreground">
                              <Star size={12} className="text-primary fill-primary" />
                              {hub.rating.toFixed(1)} ({hub.totalReviews})
                            </span>
                            <span className="text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                              Reserve Seat →
                            </span>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    factData.coworking.map((space, i) => (
                      <div key={i} className="p-4 bg-background border border-border rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                          {space[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">{space}</div>
                          <div className="text-xs text-muted">Verified Workspace</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Nomad Fast Facts Sidebar Card */}
            <div className="space-y-6">
              <div className="bg-[#111111] border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
                {/* Visual decoration overlay */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl translate-x-1/3 -translate-y-1/3" />
                
                <h3 className="text-lg font-black tracking-widest text-primary uppercase mb-6 flex items-center justify-between">
                  <span>Nomad Fast Facts</span>
                  <TrekkingGuideIcon size={20} />
                </h3>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-[#222]">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Star size={16} className="text-primary fill-primary" />
                      <span>Nomad Score</span>
                    </div>
                    <span className="font-extrabold text-foreground bg-primary text-black px-2 py-0.5 rounded text-xs">
                      {factData.score} / 5.0
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-[#222]">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Wallet size={16} className="text-primary" />
                      <span>Est. Monthly Cost</span>
                    </div>
                    <span className="font-bold text-sm text-white">{factData.cost}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-[#222]">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Wifi size={16} className="text-primary" />
                      <span>Internet Speed</span>
                    </div>
                    <span className="font-bold text-sm text-white">{factData.speed}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-[#222]">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Shield size={16} className="text-primary" />
                      <span>Safety Rating</span>
                    </div>
                    <span className="font-bold text-sm text-white">{factData.safety}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs text-gray-500 uppercase font-semibold">Power Grid Status:</div>
                    <div className="text-sm font-semibold text-white">{factData.power}</div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs text-gray-500 uppercase font-semibold">Sim Card Connectivity:</div>
                    <div className="text-sm font-semibold text-white">{factData.sim}</div>
                  </div>
                </div>

                <Link href="/guides" className="mt-8 block text-center py-3 bg-[#222] hover:bg-[#333] border border-border text-white text-xs uppercase font-extrabold tracking-widest rounded-xl transition-all">
                  Connect with a Local Guide
                </Link>
              </div>

              {/* Quick Links Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-foreground mb-4">Required Resource Guides</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/resources/visa" className="text-primary hover:underline font-medium">→ Nepal Nomad Visa Guide (2026)</Link></li>
                  <li><Link href="/resources/cost-of-living" className="text-primary hover:underline font-medium">→ Detailed Cost of Living Table</Link></li>
                  <li><Link href="/resources/connectivity" className="text-primary hover:underline font-medium">→ SIM Cards & Internet Setup</Link></li>
                  <li><Link href="/resources/transportation" className="text-primary hover:underline font-medium">→ Transport, pathao & domestic flights</Link></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Related Blog Posts Section at the bottom */}
          {relatedPosts.length > 0 && (
            <section className="mt-20 border-t border-border pt-16">
              <h2 className="text-3xl font-black text-foreground mb-10 px-2 border-l-4 border-primary">
                Related Posts for {dest.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(post => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all flex flex-col h-full">
                    <div className="relative aspect-video w-full bg-[#1c1c1c]">
                      <Image
                        src={post.coverImage || "/hero-bg.png"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary mb-2 block">{post.category}</span>
                      <h3 className="font-black text-foreground text-lg group-hover:text-primary transition-colors line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-muted text-sm line-clamp-2 leading-relaxed mb-6 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="text-xs text-gray-500 font-semibold border-t border-border/50 pt-4 flex items-center justify-between">
                        <span>By {post.author}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
