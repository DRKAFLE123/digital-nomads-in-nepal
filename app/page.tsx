/* eslint-disable @next/next/no-img-element */
import HeroSection from "@/components/HeroSection"
import DestinationCard from "@/components/DestinationCard"
import BlogGrid from "@/components/BlogGrid"
import StickyCommunityCTA from "@/components/StickyCommunityCTA"
import NewsletterSignup from "@/components/NewsletterSignup"
import HomeFaq from "@/components/HomeFaq"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WorkspaceCard, { Hub } from "@/components/coworking/WorkspaceCard"
import { ACCOMMODATIONS } from "@/lib/accommodations"
import { FacebookIcon, TikTokIcon, YouTubeIcon, InstagramIcon, TwitterIcon } from "@/components/SocialIcons"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Star,
  ShieldCheck,
  MapPin,
  Wifi,
  Zap,
  Building,
  Sparkles,
  Mountain,
  Coffee,
  CheckCircle2,
  ExternalLink
} from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Digital Nomads in Nepal | Live, Work & Explore",
  description: "The definitive platform for remote workers in Nepal. Find verified coworking spaces, work-friendly stays, licensed trekking guides, cost of living breakdowns, and an active nomad community.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com",
  },
}

export default async function Home() {
  const [
    dbPosts,
    rawWorkspaces,
    rawGuides,
    footerSetting
  ] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.workHub.findMany({
      take: 3,
      orderBy: [
        { isPartner: "desc" },
        { isVerified: "desc" },
        { rating: "desc" }
      ]
    }),
    prisma.guide.findMany({
      take: 3,
      orderBy: [
        { isVerified: "desc" },
        { avgRating: "desc" }
      ]
    }),
    prisma.setting.findUnique({
      where: { key: "footer" }
    })
  ])

  // Format blog posts
  const posts = dbPosts.map(p => ({
    ...p,
    date: p.createdAt.toISOString()
  }))

  // Format workspaces for WorkspaceCard
  const workspaces: Hub[] = rawWorkspaces.map(w => ({
    id: w.id,
    name: w.name,
    slug: w.slug,
    city: w.city,
    description: w.description,
    address: w.address,
    spaceType: w.spaceType,
    openingHours: w.openingHours,
    units: Array.isArray(w.units) ? (w.units as any) : null,
    ownerEmail: w.ownerEmail,
    ownerName: w.ownerName,
    rating: w.rating,
    totalReviews: w.totalReviews,
    isVerified: w.isVerified,
    isPartner: w.isPartner,
    photoUrl: w.photoUrl,
    facilities: Array.isArray(w.facilities) ? (w.facilities as string[]) : [],
    priceDaily: w.priceDaily,
    priceMonthly: w.priceMonthly
  }))

  // Format guides
  const guides = rawGuides.map(g => ({
    ...g,
    specialties: Array.isArray(g.specialties) ? (g.specialties as string[]) : []
  }))

  // Format recommended stays (Top 3)
  const stays = ACCOMMODATIONS.slice(0, 3)

  // Parse social settings for community section
  let socialConfig = {
    facebook: "https://facebook.com",
    showFacebook: true,
    tiktok: "https://tiktok.com",
    showTiktok: true,
    youtube: "https://youtube.com",
    showYoutube: true,
    instagram: "https://instagram.com",
    showInstagram: true,
    twitter: "https://twitter.com",
    showTwitter: false,
  }

  if (footerSetting) {
    try {
      const parsed = JSON.parse(footerSetting.value)
      socialConfig = {
        ...socialConfig,
        ...parsed,
        showFacebook: parsed.showFacebook !== undefined ? Boolean(parsed.showFacebook) : Boolean(parsed.facebook),
        showTiktok: parsed.showTiktok !== undefined ? Boolean(parsed.showTiktok) : Boolean(parsed.tiktok),
        showYoutube: parsed.showYoutube !== undefined ? Boolean(parsed.showYoutube) : Boolean(parsed.youtube),
        showInstagram: parsed.showInstagram !== undefined ? Boolean(parsed.showInstagram) : Boolean(parsed.instagram),
        showTwitter: parsed.showTwitter !== undefined ? Boolean(parsed.showTwitter) : Boolean(parsed.twitter),
      }
    } catch (e) {
      console.error("Failed to parse footer setting", e)
    }
  }

  // Active social cards
  const activeSocials = [
    {
      name: "Facebook",
      url: socialConfig.facebook,
      enabled: socialConfig.showFacebook && Boolean(socialConfig.facebook),
      icon: FacebookIcon,
      hoverClass: "hover:bg-[#1877F2]/10 hover:border-[#1877F2] group-hover:text-[#1877F2]",
      badgeText: "Nomad Group & Meetups",
    },
    {
      name: "TikTok",
      url: socialConfig.tiktok,
      enabled: socialConfig.showTiktok && Boolean(socialConfig.tiktok),
      icon: TikTokIcon,
      hoverClass: "hover:bg-pink-500/10 hover:border-pink-500 group-hover:text-pink-500",
      badgeText: "Short Travel Videos",
    },
    {
      name: "YouTube",
      url: socialConfig.youtube,
      enabled: socialConfig.showYoutube && Boolean(socialConfig.youtube),
      icon: YouTubeIcon,
      hoverClass: "hover:bg-red-500/10 hover:border-red-500 group-hover:text-red-500",
      badgeText: "Vlogs & Space Tours",
    },
    {
      name: "Instagram",
      url: socialConfig.instagram,
      enabled: socialConfig.showInstagram && Boolean(socialConfig.instagram),
      icon: InstagramIcon,
      hoverClass: "hover:bg-purple-500/10 hover:border-purple-500 group-hover:text-pink-500",
      badgeText: "Daily Stories & Tips",
    },
    {
      name: "X (Twitter)",
      url: socialConfig.twitter,
      enabled: Boolean(socialConfig.showTwitter) && Boolean(socialConfig.twitter),
      icon: TwitterIcon,
      hoverClass: "hover:bg-white/10 hover:border-white group-hover:text-white",
      badgeText: "Fast News & Alerts",
    },
  ].filter(s => s.enabled)

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between bg-background overflow-x-hidden">
        {/* 1. Hero Section (Hero Header -> Search -> 2 Quick Access Cards -> Blog Guides CTA) */}
        <HeroSection />

        {/* 2. Featured Workspaces */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <Building size={13} /> Work Infrastructure
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground">
                  Featured Workspaces
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl">
                  Handpicked coworking spaces with verified high-speed fiber Wi-Fi, 24/7 power backup, and quiet call areas across Kathmandu and Pokhara.
                </p>
              </div>
              <Link
                href="/workspaces"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
              >
                Browse All 50+ Workspaces <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {workspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map(hub => (
                  <WorkspaceCard key={hub.id} hub={hub} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <p className="text-muted-foreground text-sm">Discover verified workspaces across Kathmandu and Pokhara.</p>
                <Link href="/workspaces" className="inline-block mt-4 px-6 py-2.5 bg-primary text-black font-bold rounded-xl text-xs uppercase tracking-wider">
                  Open Coworking Marketplace
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 3. Popular Destinations */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <Mountain size={13} /> Nomad Bases
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground">
                  Popular Destinations
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl">
                  From bustling urban cafe culture in Kathmandu to tranquil lakeside coworking in Pokhara, explore where digital nomads thrive in Nepal.
                </p>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
              >
                Explore All Destinations <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DestinationCard name="Kathmandu" description="The bustling cultural heart with fast fiber internet and historic heritage cafes." image="/images/destinations/kathmandu.png" slug="kathmandu" />
              <DestinationCard name="Pokhara" description="Lakeside tranquility, mountain views, and the ultimate gateway to the Annapurnas." image="/images/destinations/pokhara.png" slug="pokhara" />
              <DestinationCard name="Lalitpur" description="Artisan heritage courtyards, quiet expat cafes, and modern innovation spaces." image="/images/destinations/lalitpur.png" slug="lalitpur" />
              <DestinationCard name="Bandipur" description="A preserved hilltop Newari town offering peace, panoramic views, and clean mountain air." image="/images/destinations/bandipur.png" slug="bandipur" />
            </div>
          </div>
        </section>

        {/* 4. Local Experts & Mountain Guides */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <ShieldCheck size={13} /> Verified Local Humans
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground">
                  Local Experts &amp; Trekking Guides
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl">
                  Connect with government-licensed mountain guides, Sherpa leaders, and cultural insiders for weekend treks and custom expeditions.
                </p>
              </div>
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
              >
                Meet All Local Guides <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guides.length > 0 ? (
                guides.map(guide => (
                  <div
                    key={guide.id}
                    className="group bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border border-border relative flex-shrink-0">
                            {guide.photoUrl ? (
                              <Image src={guide.photoUrl} alt={guide.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10">
                                {guide.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                                {guide.name}
                              </h3>
                              {guide.isVerified && (
                                <span title="Verified Guide" className="inline-flex items-center">
                                  <CheckCircle2 size={15} className="text-primary fill-primary/20 flex-shrink-0" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin size={12} className="text-primary" /> {guide.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                          <Star size={12} className="fill-primary text-primary" />
                          <span>{guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                        {guide.bio}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {guide.specialties.slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/guides/${guide.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-background border border-border group-hover:border-primary group-hover:bg-primary group-hover:text-black font-bold text-xs text-center transition-all flex items-center justify-center gap-2"
                    >
                      View Guide Profile <ArrowRight size={13} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 bg-card rounded-2xl border border-border">
                  <p className="text-muted-foreground text-sm">Meet certified trekking guides and mountain leaders in Nepal.</p>
                  <Link href="/guides" className="inline-block mt-3 px-6 py-2 bg-primary text-black font-bold rounded-xl text-xs">
                    View Guide Directory
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Recommended Stays */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <Building size={13} /> Sleep &amp; Work
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground">
                  Recommended Stays &amp; Coliving
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl">
                  Work-friendly hotels, coliving houses, and serviced apartments vetted for dedicated desks, high-speed fiber Wi-Fi, and power backup.
                </p>
              </div>
              <Link
                href="/stay"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
              >
                Browse All Nomad Stays <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stays.map(stay => (
                <div
                  key={stay.id}
                  className="group bg-background border border-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  <div>
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                      <Image
                        src={stay.photoUrl}
                        alt={stay.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white border border-white/20">
                        {stay.type}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-primary border border-primary/30 flex items-center gap-1">
                        <Star size={11} className="fill-primary" /> {stay.rating}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <MapPin size={12} className="text-primary" /> {stay.area}
                      </div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                        {stay.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {stay.description}
                      </p>

                      {/* Work Features Badges */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80 bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border">
                          <Wifi size={13} className="text-primary flex-shrink-0" />
                          <span className="truncate">{stay.speed}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80 bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border">
                          <Zap size={13} className="text-primary flex-shrink-0" />
                          <span className="truncate">{stay.power}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between border-t border-border pt-3">
                        <div>
                          <span className="text-xs text-muted-foreground">From </span>
                          <span className="text-base font-black text-foreground">{stay.price}</span>
                        </div>
                        <span className="text-xs font-bold text-primary">{stay.monthlyPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href="/stay"
                      className="w-full py-2.5 px-4 rounded-xl bg-card border border-border group-hover:border-primary group-hover:bg-primary group-hover:text-black font-bold text-xs text-center transition-all flex items-center justify-center gap-2"
                    >
                      View Stay Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Things to Do in Nepal */}
        <section className="relative w-full py-24 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background border-t border-border">
          {/* Ambient Panoramic Background from public/things to do in nepal.png */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image 
              src="/things to do in nepal.png" 
              alt="Things to do in Nepal scenic landscape" 
              fill 
              sizes="100vw"
              className="object-cover object-center opacity-35 dark:opacity-30" 
            />
            {/* Top feathered dissolve for smooth transition from previous section */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/80 to-transparent" />
            {/* Ambient tint overlay to maintain sharp text contrast in both light and dark mode */}
            <div className="absolute inset-0 bg-background/55 dark:bg-background/70 backdrop-blur-[1px]" />
            {/* Bottom feathered dissolve into next section */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 backdrop-blur-md border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <Sparkles size={13} /> Nomad Life &amp; Adventure
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground drop-shadow-sm">
                Things to Do in Nepal
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl mx-auto font-medium">
                Balance deep remote work sprints with legendary Himalayan outdoors, historic cafe culture, and restorative escapes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Activity 1 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-primary/60 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🏔️
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  Weekend Annapurna Treks
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Do quick 3 to 4 day treks like Poon Hill, Australian Camp, or Mardi Himal directly from your desk in Pokhara.
                </p>
                <Link href="/guides" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline">
                  Find trekking guides <ArrowRight size={12} />
                </Link>
              </div>

              {/* Activity 2 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-primary/60 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  ☕
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  Heritage Cafe Working
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Sample single-origin Himalayan Arabica in centuries-old Newari brick courtyards in Patan, Jhamsikhel, and Sanepa.
                </p>
                <Link href="/destinations/lalitpur" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline">
                  Explore Lalitpur cafes <ArrowRight size={12} />
                </Link>
              </div>

              {/* Activity 3 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-primary/60 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🪂
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  Paragliding Fewa Lake
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Take off from Sarangkot and thermal above emerald waters with panoramic views of Machapuchare (Fishtail peak).
                </p>
                <Link href="/destinations/pokhara" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline">
                  Explore Pokhara guide <ArrowRight size={12} />
                </Link>
              </div>

              {/* Activity 4 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-primary/60 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🧘
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  Sound Healing &amp; Yoga
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Recharge your focus with traditional Tibetan singing bowl sound meditation and weekend mountain retreats.
                </p>
                <Link href="/blog" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline">
                  Read wellness tips <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Latest Guides & Articles (Blog) */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end gap-4 mb-12 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  📖 Knowledge Base
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground">
                  Latest from the Blog
                </h2>
              </div>
              <Link href="/blog" className="text-sm font-bold text-primary hover:underline group flex items-center gap-1">
                View All Posts <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <BlogGrid posts={posts} />
          </div>
        </section>

        {/* 8. Why Digital Nomads Choose Nepal (Side-by-Side: Image Left, Content Right) */}
        <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              
              {/* LEFT COLUMN: Visual Image Frame */}
              <div className="lg:col-span-5 relative group">
                <div className="relative w-full h-[400px] sm:h-[480px] lg:h-full min-h-[500px] rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
                  <Image 
                    src="/whychooseus.png" 
                    alt="Himalayan Mountain Panorama with Yoga and Nature in Nepal" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Subtle lighting gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
                      📍 Annapurna Sanctuary • Nepal
                    </span>
                  </div>

                  {/* Bottom Floating Stats Pill */}
                  <div className="absolute bottom-5 inset-x-5 z-10 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-white shadow-xl">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Sparkles size={14} /> Work-Life Harmony
                      </span>
                      <span>8 of 14 Highest Peaks</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                      Step away from your screen directly into serene Himalayan landscapes.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Header & Value Cards */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                {/* Header */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                    <Sparkles size={13} /> The Himalayan Advantage
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                    Why Digital Nomads Choose Nepal
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
                    More than just breathtaking mountains: Nepal offers an inspiring lifestyle where world-class nature meets unprecedented affordability, expanding fiber connectivity, and warm hospitality.
                  </p>
                </div>

                {/* 3 Vertically Stacked Value Cards */}
                <div className="space-y-4">
                  {/* Card 1 */}
                  <Link
                    href="/blog/cost-of-living-nepal-2026-nomad-budget"
                    className="p-5 sm:p-6 border border-border border-l-4 border-l-primary bg-card rounded-2xl hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">💵</span>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          Unbeatable Cost of Living
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        From $500/mo <ArrowRight size={13} />
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pl-7">
                      Live comfortably in private furnished apartments, dine out daily at healthy cafes, and access coworking spaces for $500–$1,200/month total.
                    </p>
                  </Link>

                  {/* Card 2 */}
                  <Link
                    href="/guides"
                    className="p-5 sm:p-6 border border-border border-l-4 border-l-primary bg-card rounded-2xl hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🏔️</span>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          Nature &amp; Mountains at Your Desk
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        Explore Guides <ArrowRight size={13} />
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pl-7">
                      Close your laptop on Friday and be trekking surrounded by eight of the world&apos;s highest peaks on Saturday. Himalayan trails are right outside your window.
                    </p>
                  </Link>

                  {/* Card 3 */}
                  <Link
                    href="/workspaces"
                    className="p-5 sm:p-6 border border-border border-l-4 border-l-primary bg-card rounded-2xl hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">⚡</span>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          Growing Remote Culture &amp; Fiber
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        50+ Hubs <ArrowRight size={13} />
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pl-7">
                      With 100+ Mbps fiber internet expansion, automatic battery/solar backups, and modern coworking spaces, working remotely in Nepal is seamless.
                    </p>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 9. Join the Community (Dynamic Admin Social Media Links) */}
        {activeSocials.length > 0 && (
          <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                🌐 Connected Community
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
                Join the Nomad Community
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mb-10 max-w-xl mx-auto">
                Connect with our active digital nomad community across our verified social channels for meetup announcements, trek invites, and insider advice.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeSocials.map(social => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center p-6 bg-background border border-border rounded-2xl transition-all duration-300 group shadow-sm hover:-translate-y-1 ${social.hoverClass}`}
                    >
                      <Icon size={32} className="text-muted-foreground mb-3 transition-colors" />
                      <span className="text-foreground font-bold text-sm">{social.name}</span>
                      <span className="text-[11px] text-muted-foreground mt-1 text-center line-clamp-1">
                        {social.badgeText}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* 10. Frequently Asked Questions (FAQ) */}
        <HomeFaq />

        {/* 11. Nepal Nomad Starter Kit (Email Subscriber Section) */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-background relative z-10">
          <div className="max-w-4xl mx-auto">
            <NewsletterSignup />
          </div>
        </section>
      </main>

      <Footer />
      <StickyCommunityCTA />
    </>
  )
}
