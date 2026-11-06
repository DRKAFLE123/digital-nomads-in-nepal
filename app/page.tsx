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
  ExternalLink,
  DollarSign,
  Wind,
  BookOpen,
  Users,
  Heart
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
      where: { published: true },
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
    facebook: "https://www.facebook.com/share/1C1VKK5CTk/",
    showFacebook: true,
    tiktok: "https://www.tiktok.com/@digitalnomadsinnepal",
    showTiktok: true,
    youtube: "https://youtube.com/@digitalnomadsinnepal?si=fPjO8sPkEvfJ73zu",
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
      hoverCardClass: "hover:border-[#1877F2]/60 hover:bg-[#1877F2]/5 hover:shadow-lg",
      hoverIconClass: "group-hover:text-[#1877F2] group-hover:scale-110",
      hoverTitleClass: "group-hover:text-[#1877F2]",
      hoverBadgeClass: "group-hover:text-gray-700 dark:group-hover:text-gray-300",
      badgeText: "Nomad Group & Meetups",
    },
    {
      name: "TikTok",
      url: socialConfig.tiktok,
      enabled: socialConfig.showTiktok && Boolean(socialConfig.tiktok),
      icon: TikTokIcon,
      hoverCardClass: "hover:border-[#FE2C55]/60 hover:bg-[#FE2C55]/5 hover:shadow-lg",
      hoverIconClass: "group-hover:text-[#FE2C55] group-hover:scale-110",
      hoverTitleClass: "group-hover:text-[#FE2C55]",
      hoverBadgeClass: "group-hover:text-gray-700 dark:group-hover:text-gray-300",
      badgeText: "Short Travel Videos",
    },
    {
      name: "YouTube",
      url: socialConfig.youtube,
      enabled: socialConfig.showYoutube && Boolean(socialConfig.youtube),
      icon: YouTubeIcon,
      hoverCardClass: "hover:border-[#DC2626]/60 hover:bg-[#DC2626]/5 hover:shadow-lg",
      hoverIconClass: "group-hover:text-[#DC2626] group-hover:scale-110",
      hoverTitleClass: "group-hover:text-[#DC2626]",
      hoverBadgeClass: "group-hover:text-gray-700 dark:group-hover:text-gray-300",
      badgeText: "Vlogs & Space Tours",
    },
    {
      name: "Instagram",
      url: socialConfig.instagram,
      enabled: socialConfig.showInstagram && Boolean(socialConfig.instagram),
      icon: InstagramIcon,
      hoverCardClass: "hover:border-[#E1306C]/60 hover:bg-[#E1306C]/5 hover:shadow-lg",
      hoverIconClass: "group-hover:text-[#E1306C] group-hover:scale-110",
      hoverTitleClass: "group-hover:text-[#E1306C]",
      hoverBadgeClass: "group-hover:text-gray-700 dark:group-hover:text-gray-300",
      badgeText: "Daily Stories & Tips",
    },
    {
      name: "X (Twitter)",
      url: socialConfig.twitter,
      enabled: Boolean(socialConfig.showTwitter) && Boolean(socialConfig.twitter),
      icon: TwitterIcon,
      hoverCardClass: "hover:border-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:shadow-lg",
      hoverIconClass: "group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110",
      hoverTitleClass: "group-hover:text-gray-900 dark:group-hover:text-white",
      hoverBadgeClass: "group-hover:text-gray-700 dark:group-hover:text-zinc-300",
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
        <section className="w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] dark:bg-[#0B0B0C] border-t border-[#E8E2D8] dark:border-[#26262A]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C2410C] dark:text-[#FB923C] mb-2">
                  Work infrastructure
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-[#F5F5F4] tracking-tight">
                  Featured workspaces
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-[#A8A8B0] font-normal mt-2 max-w-xl">
                  Fast fiber, backup power and quiet call areas, checked by our team.
                </p>
              </div>
              <Link
                href="/workspaces"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline group"
              >
                <span>View all workspaces</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {workspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map(hub => (
                  <WorkspaceCard key={hub.id} hub={hub} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-[#141416] rounded-2xl border border-[#E8E2D8] dark:border-[#26262A]">
                <p className="text-muted-foreground text-sm font-normal">Discover verified workspaces across Kathmandu and Pokhara.</p>
                <Link href="/workspaces" className="inline-block mt-4 px-6 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-full text-xs uppercase tracking-wider transition-colors shadow-sm">
                  Open Coworking Marketplace
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 3. Popular Destinations */}
        <section className="w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#141416] border-y border-[#E8E2D8] dark:border-[#26262A]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C2410C] dark:text-[#FB923C] mb-2">
                  Nomad bases
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-[#F5F5F4] tracking-tight">
                  Popular destinations
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-[#A8A8B0] font-normal mt-2 max-w-xl">
                  From urban heritage cafe culture in Kathmandu to tranquil lakeside coworking in Pokhara.
                </p>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline group"
              >
                <span>Explore all destinations</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DestinationCard name="Kathmandu" description="The bustling cultural heart with fast fiber internet." image="/images/destinations/kathmandu.png" slug="kathmandu" counts="22 workspaces · 15 stays" />
              <DestinationCard name="Pokhara" description="Lakeside tranquility and gateway to Annapurna trails." image="/images/destinations/pokhara.png" slug="pokhara" counts="14 workspaces · 12 stays" />
              <DestinationCard name="Lalitpur" description="Heritage courtyards, quiet expat cafes & innovation labs." image="/images/destinations/lalitpur.png" slug="lalitpur" counts="11 workspaces · 8 stays" />
              <DestinationCard name="Bandipur" description="A preserved hilltop Newari town with panoramic views." image="/images/destinations/bandipur.png" slug="bandipur" counts="3 workspaces · 6 stays" />
            </div>
          </div>
        </section>

        {/* 4. Local Experts & Mountain Guides (Rendered only if at least 3 guides exist) */}
        {guides.length >= 3 && (
          <section className="w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] dark:bg-[#0B0B0C] border-b border-[#E8E2D8] dark:border-[#26262A]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C2410C] dark:text-[#FB923C] mb-2">
                    Verified experts
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-[#F5F5F4] tracking-tight">
                    Local guides &amp; mountain leaders
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-[#A8A8B0] font-normal mt-2 max-w-xl">
                    Government-licensed trekking guides and cultural insiders for weekend treks and custom expeditions.
                  </p>
                </div>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline group"
                >
                  <span>Meet all guides</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.slice(0, 3).map(guide => (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.id}`}
                    className="group block bg-white dark:bg-[#141416] border border-[#E8E2D8] dark:border-[#26262A] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 select-none"
                  >
                    <div className="relative aspect-[4/3] w-full bg-[#1A1A1C] overflow-hidden">
                      {guide.photoUrl ? (
                        <Image src={guide.photoUrl} alt={guide.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/10">
                          {guide.name.charAt(0)}
                        </div>
                      )}
                      {guide.isVerified && (
                        <span className="absolute top-3 left-3 bg-[#C2410C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm z-10">
                          Licensed Guide
                        </span>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h3 className="text-base sm:text-[17px] font-semibold text-gray-900 dark:text-[#F5F5F4] group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors line-clamp-1 leading-snug">
                          {guide.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-gray-500 dark:text-[#A8A8B0] mt-1 font-normal">
                          <MapPin size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{guide.location}</span>
                          <span className="text-gray-300 dark:text-gray-600 select-none">·</span>
                          <span className="flex items-center gap-0.5 text-gray-700 dark:text-gray-300 font-medium">
                            <Star size={11} className="fill-[#EA580C] text-[#EA580C]" />
                            <span>{guide.avgRating ? guide.avgRating.toFixed(1) : "5.0"}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {guide.specialties.slice(0, 2).map((spec, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F3EEE5] dark:bg-[#1C1C1F] text-gray-800 dark:text-[#E4E4E7] border border-[#E8E2D8] dark:border-[#26262A]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#26262A] flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#F5F5F4]">
                        <span>From $35/day</span>
                        <span className="text-xs text-[#C2410C] dark:text-[#FB923C] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          View profile →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Recommended Stays & Coliving */}
        <section className="w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#141416] border-b border-[#E8E2D8] dark:border-[#26262A]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C2410C] dark:text-[#FB923C] mb-2">
                  Sleep &amp; work
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-[#F5F5F4] tracking-tight">
                  Recommended stays &amp; coliving
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-[#A8A8B0] font-normal mt-2 max-w-xl">
                  Work-friendly hotels and coliving houses vetted for dedicated desks and high-speed Wi-Fi.
                </p>
              </div>
              <Link
                href="/stay"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline group"
              >
                <span>Browse all nomad stays</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stays.map(stay => (
                <Link
                  key={stay.id}
                  href={`/stay?type=${encodeURIComponent(stay.type.toLowerCase())}`}
                  className="group block bg-[#FAF7F2] dark:bg-[#0B0B0C] border border-[#E8E2D8] dark:border-[#26262A] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 select-none"
                >
                  <div className="relative aspect-[4/3] w-full bg-[#1A1A1C] overflow-hidden">
                    <Image
                      src={stay.photoUrl}
                      alt={stay.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#C2410C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm z-10">
                      {stay.type}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <h3 className="text-base sm:text-[17px] font-semibold text-gray-900 dark:text-[#F5F5F4] group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors line-clamp-1 leading-snug">
                        {stay.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-gray-500 dark:text-[#A8A8B0] mt-1 font-normal">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">{stay.area}</span>
                        <span className="text-gray-300 dark:text-gray-600 select-none">·</span>
                        <span className="flex items-center gap-0.5 text-gray-700 dark:text-gray-300 font-medium">
                          <Star size={11} className="fill-[#EA580C] text-[#EA580C]" />
                          <span>{stay.rating}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#1C1C1F] text-gray-800 dark:text-[#E4E4E7] border border-[#E8E2D8] dark:border-[#26262A]">
                        <Wifi size={11} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />
                        <span>{stay.speed}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#1C1C1F] text-gray-800 dark:text-[#E4E4E7] border border-[#E8E2D8] dark:border-[#26262A]">
                        <Zap size={11} className="text-[#C2410C] dark:text-[#FB923C] shrink-0" />
                        <span>{stay.power}</span>
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#26262A] flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#F5F5F4]">
                      <span>From {stay.price} · {stay.monthlyPrice}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Things to Do in Nepal */}
        <section className="relative w-full py-24 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background border-t border-border">
          {/* Ambient Panoramic Background: Desktop 16:9 4K & Mobile 9:16 Portrait */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            {/* Desktop Panoramic HD */}
            <div className="hidden md:block absolute inset-0">
              <Image 
                src="/images/home/things-to-do-desktop.jpg" 
                alt="Things to do in Nepal outdoor adventures" 
                fill 
                sizes="100vw"
                className="object-cover object-center opacity-45 dark:opacity-40" 
                quality={95}
              />
            </div>
            {/* Mobile Portrait HD */}
            <div className="block md:hidden absolute inset-0">
              <Image 
                src="/images/home/things-to-do-mobile.jpg" 
                alt="Things to do in Nepal alpine trails and paragliding" 
                fill 
                sizes="100vw"
                className="object-cover object-center opacity-45 dark:opacity-40" 
                quality={95}
              />
            </div>
            {/* Top feathered dissolve for smooth transition from previous section */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/80 to-transparent" />
            {/* Ambient tint overlay to maintain sharp text contrast in both light and dark mode */}
            <div className="absolute inset-0 bg-background/50 dark:bg-background/65" />
            {/* Bottom feathered dissolve into next section */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C2410C] dark:text-[#FB923C] mb-2">
                Nomad life &amp; adventure
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground drop-shadow-sm tracking-tight">
                Things to do in Nepal
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-2xl mx-auto font-normal">
                Balance deep remote work sprints with Himalayan outdoors, heritage cafe culture, and restorative escapes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Activity 1 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-[#C2410C]/40 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FB923C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mountain size={24} />
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors mb-2">
                  Weekend Annapurna Treks
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Do quick 3 to 4 day treks like Poon Hill, Australian Camp, or Mardi Himal directly from your desk in Pokhara.
                </p>
                <Link href="/guides" className="text-xs font-bold text-[#C2410C] dark:text-[#FB923C] hover:text-[#9A3412] dark:hover:text-[#FDBA74] inline-flex items-center gap-1 hover:underline">
                  Find trekking guides <ArrowRight size={12} />
                </Link>
              </div>

              {/* Activity 2 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-[#C2410C]/40 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FB923C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Coffee size={24} />
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors mb-2">
                  Heritage Cafe Working
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Sample single-origin Himalayan Arabica in centuries-old Newari brick courtyards in Patan, Jhamsikhel, and Sanepa.
                </p>
                <Link href="/destinations/lalitpur" className="text-xs font-bold text-[#C2410C] dark:text-[#FB923C] hover:text-[#9A3412] dark:hover:text-[#FDBA74] inline-flex items-center gap-1 hover:underline">
                  Explore Lalitpur cafes <ArrowRight size={12} />
                </Link>
              </div>

              {/* Activity 3 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-[#C2410C]/40 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FB923C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wind size={24} />
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors mb-2">
                  Paragliding Fewa Lake
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Take off from Sarangkot and thermal above emerald waters with panoramic views of Machapuchare (Fishtail peak).
                </p>
                <Link href="/destinations/pokhara" className="text-xs font-bold text-[#C2410C] dark:text-[#FB923C] hover:text-[#9A3412] dark:hover:text-[#FDBA74] inline-flex items-center gap-1 hover:underline">
                  Explore Pokhara guide <ArrowRight size={12} />
                </Link>
              </div>

              {/* Activity 4 */}
              <div className="p-6 bg-card/85 dark:bg-card/75 backdrop-blur-md border border-border/80 rounded-2xl hover:border-[#C2410C]/40 transition-all hover:-translate-y-1 shadow-md hover:shadow-2xl group">
                <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FB923C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors mb-2">
                  Sound Healing &amp; Yoga
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Recharge your focus with traditional Tibetan singing bowl sound meditation and weekend mountain retreats.
                </p>
                <Link href="/blog" className="text-xs font-bold text-[#C2410C] dark:text-[#FB923C] hover:text-[#9A3412] dark:hover:text-[#FDBA74] inline-flex items-center gap-1 hover:underline">
                  Read wellness tips <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Latest Guides & Articles (Blog) */}
        <section className="w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] dark:bg-[#0B0B0C] border-y border-[#E8E2D8] dark:border-[#26262A]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C2410C] dark:text-[#FB923C] mb-2">
                  Knowledge base
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-[#F5F5F4] tracking-tight">
                  Field guides &amp; articles
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-[#A8A8B0] font-normal mt-2 max-w-xl">
                  Cost breakdowns, visa rules, and remote work logistics across Nepal.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C2410C] dark:text-[#FB923C] hover:underline group"
              >
                <span>View all articles</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <BlogGrid posts={posts} />
          </div>
        </section>

        {/* 8. Why Digital Nomads Choose Nepal (Side-by-Side: Image Left, Content Right) */}
        <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#141416] text-white border-t border-[#26262A]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              
              {/* LEFT COLUMN: Visual Image Frame */}
              <div className="lg:col-span-5 relative group">
                <div className="relative w-full h-[450px] sm:h-[520px] lg:h-full min-h-[520px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1C1C1F]">
                  <Image 
                    src="/images/home/why-choose-nepal-hd.jpg" 
                    alt="Digital nomad meditating with laptop overlooking Annapurna mountain sanctuary in Nepal" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    quality={95}
                  />
                  {/* Subtle lighting gradient overlay tailored for crisp mountain clarity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
                      <MapPin size={12} className="text-[#FB923C]" /> Annapurna Sanctuary • Nepal
                    </span>
                  </div>

                  {/* Bottom Floating Stats Pill */}
                  <div className="absolute bottom-5 inset-x-5 z-10 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-white shadow-xl">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
                      <span className="flex items-center gap-1.5 text-[#FB923C]">
                        <Sparkles size={14} /> Work-Life Harmony
                      </span>
                      <span>8 of 14 Highest Peaks</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-1 leading-snug font-normal">
                      Step away from your screen directly into serene Himalayan landscapes.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Header & Value Cards */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                {/* Header */}
                <div className="mb-8">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#FB923C] mb-2">
                    The Himalayan advantage
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                    Why digital nomads choose Nepal
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base mt-3 leading-relaxed font-normal">
                    More than just breathtaking mountains: Nepal offers an inspiring lifestyle where world-class nature meets unprecedented affordability, expanding fiber connectivity, and warm hospitality.
                  </p>
                </div>

                {/* 3 Vertically Stacked Value Cards */}
                <div className="space-y-4">
                  {/* Card 1 */}
                  <Link
                    href="/blog/cost-of-living-nepal-2026-nomad-budget"
                    className="p-5 sm:p-6 border border-white/10 border-l-4 border-l-[#C2410C] bg-[#1C1C1F] rounded-2xl hover:border-[#FB923C]/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#C2410C]/20 flex items-center justify-center text-[#FB923C] shrink-0">
                          <DollarSign size={16} />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#FB923C] transition-colors">
                          Unbeatable Cost of Living
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-[#FB923C] group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        From $500/mo <ArrowRight size={13} />
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed pl-10 font-normal">
                      Live comfortably in private furnished apartments, dine out daily at healthy cafes, and access coworking spaces for $500–$1,200/month total.
                    </p>
                  </Link>

                  {/* Card 2 */}
                  <Link
                    href="/guides"
                    className="p-5 sm:p-6 border border-white/10 border-l-4 border-l-[#C2410C] bg-[#1C1C1F] rounded-2xl hover:border-[#FB923C]/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#C2410C]/20 flex items-center justify-center text-[#FB923C] shrink-0">
                          <Mountain size={16} />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#FB923C] transition-colors">
                          Nature &amp; Mountains at Your Desk
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-[#FB923C] group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        Explore Guides <ArrowRight size={13} />
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed pl-10 font-normal">
                      Close your laptop on Friday and be trekking surrounded by eight of the world&apos;s highest peaks on Saturday. Himalayan trails are right outside your window.
                    </p>
                  </Link>

                  {/* Card 3 */}
                  <Link
                    href="/workspaces"
                    className="p-5 sm:p-6 border border-white/10 border-l-4 border-l-[#C2410C] bg-[#1C1C1F] rounded-2xl hover:border-[#FB923C]/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm block group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#C2410C]/20 flex items-center justify-center text-[#FB923C] shrink-0">
                          <Zap size={16} />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#FB923C] transition-colors">
                          Growing Remote Culture &amp; Fiber
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-[#FB923C] group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        50+ Hubs <ArrowRight size={13} />
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed pl-10 font-normal">
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
          <section className="w-full py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#141416] border-t border-[#E8E2D8] dark:border-[#26262A]">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C2410C] dark:text-[#FB923C] mb-2">
                Connected community
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-[#F5F5F4] mb-4 tracking-tight">
                Join the nomad community
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-10 max-w-xl mx-auto font-normal">
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
                      className={`flex flex-col items-center justify-center p-6 bg-background border border-border rounded-2xl transition-all duration-300 group shadow-sm hover:-translate-y-1.5 ${social.hoverCardClass}`}
                    >
                      <Icon size={34} className={`text-muted-foreground mb-3 transition-all duration-300 ${social.hoverIconClass}`} />
                      <span className={`text-foreground font-bold text-sm transition-colors duration-300 ${social.hoverTitleClass}`}>{social.name}</span>
                      <span className={`text-[11px] text-muted-foreground mt-1 text-center line-clamp-1 transition-colors duration-300 ${social.hoverBadgeClass}`}>
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
