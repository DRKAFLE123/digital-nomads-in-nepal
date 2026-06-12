import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "@/components/ImageWithFallback"
import { MapPin, Wifi, Wallet, Shield, Star, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Digital Nomad Destinations in Nepal | Kathmandu, Pokhara, Bandipur",
  description: "Explore the best hubs for remote work in Nepal. Vetted details on internet speed, cost of living, safety, and coworking spaces.",
}

interface DestinationTags {
  score?: string
  cost?: string
  speed?: string
  safety?: string
  power?: string
  sim?: string
}

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" }
  })

  // Fallback destinations in case seed hasn't run
  const defaultDestinations = [
    {
      id: "kathmandu",
      name: "Kathmandu",
      slug: "kathmandu",
      description: "The bustling cultural, historical, and economic capital hub of Nepal. Offering the fastest fiber internet, coworking spaces, and rich heritage sites.",
      image: "/images/destinations/kathmandu.png",
      tags: {
        score: "4.2",
        cost: "$700 / month",
        speed: "100 - 300 Mbps (Fiber)",
        safety: "High"
      }
    },
    {
      id: "pokhara",
      name: "Pokhara",
      slug: "pokhara",
      description: "The lakeside remote work paradise of Nepal. Safe, quiet, and surrounded by the magnificent Annapurna mountain range. Perfect for outdoor-loving remote workers.",
      image: "/images/destinations/pokhara.png",
      tags: {
        score: "4.6",
        cost: "$650 / month",
        speed: "80 - 200 Mbps (Fiber)",
        safety: "Very High"
      }
    },
    {
      id: "lalitpur",
      name: "Lalitpur",
      slug: "lalitpur",
      description: "Artisan heritage meets modern expatriate cafes. Famed for historic Patan Durbar Square, walkable neighborhoods like Jhamsikhel, and design-forward coworking spaces.",
      image: "/images/destinations/lalitpur.png",
      tags: {
        score: "4.4",
        cost: "$680 / month",
        speed: "100 - 250 Mbps (Fiber)",
        safety: "Very High"
      }
    },
    {
      id: "chitwan",
      name: "Chitwan",
      slug: "chitwan",
      description: "Jungle safaris, warm sub-tropical living, and wildlife wonders. The ideal retreat for digital nomads seeking warm weather and outdoor safaris.",
      image: "/images/destinations/chitwan.png",
      tags: {
        score: "3.8",
        cost: "$550 / month",
        speed: "30 - 80 Mbps (Fiber)",
        safety: "High"
      }
    },
    {
      id: "bandipur",
      name: "Bandipur",
      slug: "bandipur",
      description: "A beautifully preserved hilltop town in central Nepal. A vehicle-free Newari mountain retreat offering tranquility, historic architecture, and mountain views.",
      image: "/images/destinations/bandipur.png",
      tags: {
        score: "3.9",
        cost: "$500 / month",
        speed: "40 - 100 Mbps",
        safety: "Very High"
      }
    },
    {
      id: "manang",
      name: "Manang",
      slug: "manang",
      description: "Extreme high-altitude adventure and Buddhist culture. Surrounded by spectacular peaks and alpine glacial lakes, perfect for trekking remote workers.",
      image: "/images/destinations/manang.png",
      tags: {
        score: "3.7",
        cost: "$450 / month",
        speed: "15 - 50 Mbps",
        safety: "Very High"
      }
    },
    {
      id: "mustang",
      name: "Mustang",
      slug: "mustang",
      description: "Barren landscapes, wind-swept gorges, and ancient caves. Experience remote work at the edge of Tibet in Jomsom, Marpha, or Kagbeni.",
      image: "/images/destinations/mustang.png",
      tags: {
        score: "4.0",
        cost: "$520 / month",
        speed: "30 - 80 Mbps",
        safety: "Very High"
      }
    },
    {
      id: "khaptad",
      name: "Khaptad",
      slug: "khaptad",
      description: "Solitude, rolling meadows, and spiritual forest trails. An off-grid remote workspace in Far-Western Nepal for deep writing and digital detox work.",
      image: "/images/destinations/khaptad.png",
      tags: {
        score: "3.5",
        cost: "$380 / month",
        speed: "10 - 30 Mbps",
        safety: "Very High"
      }
    }
  ]

  const list = destinations.length > 0 ? destinations : defaultDestinations

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-6">
              Nomad Hubs in <span className="bg-gradient-to-r from-primary via-yellow-400 to-amber-500 bg-clip-text text-transparent">Nepal</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Find your perfect basecamp in the Himalayas. We vet locations for internet reliability, power stability, cost of living, and community access.
            </p>
          </div>

          {/* Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((dest) => {
              const tags = (dest.tags || {}) as DestinationTags
              const score = tags.score || "4.0"
              const cost = tags.cost || "$600"
              const speed = tags.speed || "50 Mbps"
              const safety = tags.safety || "High"

              return (
                <div 
                  key={dest.id} 
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:border-primary/30 hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover image */}
                    <div className="relative h-56 w-full overflow-hidden bg-zinc-900 shrink-0">
                      <Image 
                        src={dest.image || "/nepal-blog-hero-banner.png"} 
                        alt={`${dest.name} hub`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-primary">
                        <Star size={13} fill="currentColor" />
                        <span>{score}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-2xl font-black mb-3 text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        <MapPin size={20} className="text-primary" />
                        {dest.name}
                      </h2>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-6">
                        {dest.description}
                      </p>

                      {/* Vetted Stats */}
                      <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Wallet size={14} className="text-primary" />
                          <span>Est. {cost}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Wifi size={14} className="text-green-400" />
                          <span>{speed}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Shield size={14} className="text-purple-400" />
                          <span>Safety: {safety}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={14} className="text-amber-500" />
                          <span>Nepal 🇳🇵</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Read Guide link */}
                  <div className="p-6 pt-0 mt-auto">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="w-full bg-accent hover:bg-primary hover:text-black transition-colors text-foreground font-bold rounded-xl py-3 px-4 text-xs flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      Explore Complete Guide
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
