import Link from "next/link"
import { 
  MapPin, Building2, Bed, Users, Wifi, 
  DollarSign, Calendar, ArrowRight
} from "lucide-react"

export interface InternalLinkingProps {
  type: "workspace" | "stay" | "article" | "destination"
  city?: string
  entityName?: string
  tags?: string[]
  title?: string
  content?: string
  className?: string
}

function resolveCitySlug(cityRaw: string): { name: string; slug: string } {
  const c = cityRaw.toLowerCase().trim()
  if (c.includes("pokhara") || c.includes("lakeside") || c.includes("phewa")) {
    return { name: "Pokhara", slug: "pokhara" }
  }
  if (c.includes("lalitpur") || c.includes("patan") || c.includes("jhamsikhel") || c.includes("sanepa") || c.includes("pulchowk")) {
    return { name: "Lalitpur", slug: "lalitpur" }
  }
  if (c.includes("bandipur")) {
    return { name: "Bandipur", slug: "bandipur" }
  }
  if (c.includes("mustang") || c.includes("marpha") || c.includes("jomsom")) {
    return { name: "Mustang", slug: "mustang" }
  }
  if (c.includes("nagarkot")) {
    return { name: "Nagarkot", slug: "nagarkot" }
  }
  if (c.includes("chitwan")) {
    return { name: "Chitwan", slug: "chitwan" }
  }
  if (c.includes("bhaktapur")) {
    return { name: "Bhaktapur", slug: "bhaktapur" }
  }
  // Default to Kathmandu
  return { name: "Kathmandu", slug: "kathmandu" }
}

function detectCityFromArticle(
  cityProp?: string, 
  title?: string, 
  tags?: string[], 
  content?: string
): { name: string; slug: string } {
  if (cityProp && cityProp.trim()) {
    return resolveCitySlug(cityProp)
  }

  const combined = [
    title || "",
    ...(tags || []),
    (content || "").slice(0, 1000)
  ].join(" ").toLowerCase()

  if (combined.includes("pokhara") || combined.includes("lakeside") || combined.includes("annapurna")) {
    return { name: "Pokhara", slug: "pokhara" }
  }
  if (combined.includes("lalitpur") || combined.includes("patan") || combined.includes("jhamsikhel")) {
    return { name: "Lalitpur", slug: "lalitpur" }
  }
  if (combined.includes("bandipur")) {
    return { name: "Bandipur", slug: "bandipur" }
  }
  if (combined.includes("mustang") || combined.includes("marpha")) {
    return { name: "Mustang", slug: "mustang" }
  }
  return { name: "Kathmandu", slug: "kathmandu" }
}

export default function InternalLinkingEngine({
  type,
  city,
  entityName,
  tags,
  title,
  content,
  className = ""
}: InternalLinkingProps) {
  const cityInfo = type === "article" 
    ? detectCityFromArticle(city, title, tags, content)
    : resolveCitySlug(city || "Kathmandu")

  const cityName = cityInfo.name
  const citySlug = cityInfo.slug

  // Workspace Context Links
  if (type === "workspace") {
    const links = [
      {
        title: `${cityName} Destination Guide`,
        desc: `Discover neighborhood vibes, nomad hotspots, and lifestyle in ${cityName}.`,
        href: `/destinations/${citySlug}`,
        icon: MapPin,
        badge: "Destination",
      },
      {
        title: `All ${cityName} Workspaces`,
        desc: `Compare verified hot desks, meeting rooms, and 24/7 hubs in ${cityName}.`,
        href: `/resources/coworking?city=${encodeURIComponent(cityName)}`,
        icon: Building2,
        badge: "Directory",
      },
      {
        title: `Stay & Work in ${cityName}`,
        desc: `Work-friendly hotels, nomad coliving spaces, and monthly rentals in ${cityName}.`,
        href: `/stay?city=${encodeURIComponent(cityName)}`,
        icon: Bed,
        badge: "Accommodation",
      },
      {
        title: `${cityName} Local Experts & Guides`,
        desc: `Connect with licensed Himalayan trekking guides, fixers, and local advisors.`,
        href: `/guides?city=${encodeURIComponent(cityName)}`,
        icon: Users,
        badge: "Human Experts",
      },
      {
        title: `Internet & Fiber Speeds Guide`,
        desc: `Tested Wi-Fi speeds, fiber optic backup systems, and Ncell vs NTC 4G/5G.`,
        href: `/resources/sim-cards`,
        icon: Wifi,
        badge: "Connectivity",
      },
      {
        title: `${cityName} Cost of Living Breakdown`,
        desc: `Detailed monthly budget estimates for rent, food, cafes, and transport.`,
        href: `/resources/cost-of-living`,
        icon: DollarSign,
        badge: "Budget",
      },
      {
        title: `Community Events & Meetups`,
        desc: `Meet remote workers, join co-working days, and attend social mixers.`,
        href: `/events`,
        icon: Calendar,
        badge: "Community",
      },
    ]

    return (
      <section 
        aria-label={`Explore ${cityName} Remote Work Ecosystem`} 
        className={`bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424] pb-5">
          <div>
            <span className="text-[#FFD400] text-xs font-black uppercase tracking-wider block mb-1">
              Connected Nomad Ecosystem
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Explore More in {cityName}
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Seamlessly navigate stays, city guides, internet info, and local experts around {entityName || "this workspace"}.
            </p>
          </div>
          <Link
            href={`/destinations/${citySlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD400] hover:text-[#FFE033] hover:underline flex-shrink-0"
          >
            Visit {cityName} Hub <ArrowRight size={14} />
          </Link>
        </div>

        <nav aria-label="City resources navigation" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                href={item.href}
                className="group p-4 bg-[#171717] border border-[#242424] hover:border-[#FFD400]/60 rounded-2xl transition-all flex flex-col justify-between hover:bg-[#1a1a1a]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD400]/10 text-[#FFD400] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider bg-[#222] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFD400] mt-3 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight size={12} />
                </span>
              </Link>
            )
          })}
        </nav>
      </section>
    )
  }

  // Stay & Work Context Links
  if (type === "stay") {
    const stayLinks = [
      {
        title: `${cityName} Destination Guide`,
        desc: `Comprehensive remote work and lifestyle overview for ${cityName}.`,
        href: `/destinations/${citySlug}`,
        icon: MapPin,
        badge: "Guide",
      },
      {
        title: `${cityName} Coworking Hubs`,
        desc: `Find high-speed fiber workspaces and hot desks near your accommodation.`,
        href: `/resources/coworking?city=${encodeURIComponent(cityName)}`,
        icon: Building2,
        badge: "Workspaces",
      },
      {
        title: `${cityName} Monthly Living Budget`,
        desc: `Expected costs for accommodation, dining out, and daily essentials.`,
        href: `/resources/cost-of-living`,
        icon: DollarSign,
        badge: "Cost of Living",
      },
      {
        title: `Local Guides & Fixers in ${cityName}`,
        desc: `Licensed guides for weekend treks, cultural tours, and local logistics.`,
        href: `/guides?city=${encodeURIComponent(cityName)}`,
        icon: Users,
        badge: "Local Experts",
      },
      {
        title: `SIM Cards & Internet Reliability`,
        desc: `Mobile data packages, Ncell/NTC kiosks, and eSIM instructions.`,
        href: `/resources/sim-cards`,
        icon: Wifi,
        badge: "Tech Setup",
      },
      {
        title: `Nomad Community & Events`,
        desc: `Upcoming meetups, summit workshops, and nomad dinners across Nepal.`,
        href: `/events`,
        icon: Calendar,
        badge: "Networking",
      },
    ]

    return (
      <section 
        aria-label={`Explore ${cityName} Workation Connections`} 
        className={`bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424] pb-5">
          <div>
            <span className="text-[#FFD400] text-xs font-black uppercase tracking-wider block mb-1">
              Connected Stay & Work Network
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Connect Your Stay in {cityName}
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Direct links to vetted workspaces, budget guides, internet setup, and local community.
            </p>
          </div>
          <Link
            href={`/resources/coworking?city=${encodeURIComponent(cityName)}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD400] hover:text-[#FFE033] hover:underline flex-shrink-0"
          >
            Find Nearby Desks <ArrowRight size={14} />
          </Link>
        </div>

        <nav aria-label="Stay resources navigation" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stayLinks.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                href={item.href}
                className="group p-4 bg-[#171717] border border-[#242424] hover:border-[#FFD400]/60 rounded-2xl transition-all flex flex-col justify-between hover:bg-[#1a1a1a]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD400]/10 text-[#FFD400] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider bg-[#222] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFD400] mt-3 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight size={12} />
                </span>
              </Link>
            )
          })}
        </nav>
      </section>
    )
  }

  // Blog Article Context Links
  const articleLinks = [
    {
      title: `${cityName} Destination Hub`,
      desc: `Detailed overview of remote work life, neighborhoods, and amenities in ${cityName}.`,
      href: `/destinations/${citySlug}`,
      icon: MapPin,
      badge: "Destination",
    },
    {
      title: `Vetted Workspaces in ${cityName}`,
      desc: `Find high-speed coworking hubs, private call booths, and verified generator backups.`,
      href: `/resources/coworking?city=${encodeURIComponent(cityName)}`,
      icon: Building2,
      badge: "Workspaces",
    },
    {
      title: `Stay & Work Coliving in ${cityName}`,
      desc: `Curated monthly apartments, nomad-friendly hostels, and workation lodges.`,
      href: `/stay?city=${encodeURIComponent(cityName)}`,
      icon: Bed,
      badge: "Stay & Work",
    },
    {
      title: `${cityName} Local Guides & Fixers`,
      desc: `Hire certified Himalayan trekking guides, cultural insiders, and city advisors.`,
      href: `/guides?city=${encodeURIComponent(cityName)}`,
      icon: Users,
      badge: "Local Experts",
    },
    {
      title: `Nepal SIM Cards & 4G/5G Guide`,
      desc: `Step-by-step SIM registration, mobile data plans, and airport purchase tips.`,
      href: `/resources/sim-cards`,
      icon: Wifi,
      badge: "Connectivity",
    },
    {
      title: `Cost of Living & Budget Calculator`,
      desc: `Compare monthly living costs across Kathmandu, Pokhara, and Himalayan hill stations.`,
      href: `/resources/cost-of-living`,
      icon: DollarSign,
      badge: "Budget",
    },
  ]

  return (
    <section 
      aria-label="Connected Nepal Digital Nomad Resources" 
      className={`bg-[#141414] border border-[#222222] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl my-10 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
        <div>
          <span className="text-[#FFD400] text-xs font-black uppercase tracking-wider block mb-1">
            Topic Ecosystem & Next Steps
          </span>
          <h3 className="text-xl font-black text-white">
            Plan Your Nepal Remote Work Journey
          </h3>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Explore verified destinations, workspaces, stays, and local experts related to this guide.
          </p>
        </div>
      </div>

      <nav aria-label="Topic navigation links" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articleLinks.map((item, idx) => {
          const Icon = item.icon
          return (
            <Link
              key={idx}
              href={item.href}
              className="group p-4 bg-[#181818] border border-[#262626] hover:border-[#FFD400]/60 rounded-xl transition-all flex flex-col justify-between hover:bg-[#1d1d1d]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#FFD400]/10 text-[#FFD400] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider bg-[#222] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-[#A0A0A0] leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFD400] mt-3 group-hover:translate-x-1 transition-transform">
                Explore <ArrowRight size={12} />
              </span>
            </Link>
          )
        })}
      </nav>
    </section>
  )
}
