import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import type { Metadata } from "next"
import PartnersClient, { Partner } from "./PartnersClient"

export const metadata: Metadata = {
  title: "Partners | Digital Nomads in Nepal",
  description: "Trusted partners for digital nomads in Nepal — from remote job boards to adventure specialists and destination hubs.",
}

const partnerData: Partner[] = [
  // --- REMOTE JOBS ---
  {
    name: "Remote OK",
    category: "Remote Jobs",
    location: "Online",
    description: "The #1 remote job board for nomads. Find verified roles in tech, creative, and support.",
    tags: ["Listing", "Remote", "Jobs"],
    priority: true
  },
  {
    name: "We Work Remotely",
    category: "Remote Jobs",
    location: "Online",
    description: "The largest remote work community in the world. High-quality listings for experienced professionals.",
    tags: ["Platform", "Remote"],
  },

  // --- INSURANCE ---
  {
    name: "SafetyWing",
    category: "Insurance",
    location: "Global",
    description: "Nomad health insurance built by nomads, for nomads. Affordable monthly plans with worldwide coverage.",
    tags: ["Nomad-Insurance", "Health"],
    discount: "Free first month for community members",
    priority: true
  },
  {
    name: "World Nomads",
    category: "Insurance",
    location: "Global",
    description: "Adventure-focused travel insurance covering 200+ activities including high-altitude trekking.",
    tags: ["Adventure-Travel", "Trekking"],
  },

  // --- COWORKING ---
  {
    name: "Spaces Kathmandu",
    category: "Coworking",
    location: "Jhamsikhel, Lalitpur",
    description: "Premium flexible coworking with ergonomic seating, fiber internet, and a thriving local community.",
    tags: ["Kathmandu", "Community", "High-Fiber"],
    discount: "15% Off Day Passes",
    priority: true
  },
  {
    name: "Pokhara Remote Hub",
    category: "Coworking",
    location: "Lakeside, Pokhara",
    description: "Work with a lake view. Fast Wi-Fi and common areas perfect for collaborations.",
    tags: ["Pokhara", "Lakeview", "Hub"],
    discount: "10% Discount on Monthly Membership"
  },

  // --- DESTINATION ---
  {
    name: "Alpine Nomad Suites",
    category: "Destination",
    location: "Nagarkot, Nepal",
    description: "Coliving space with sunrise views of the entire Himalayan range. Dedicated workspace in every room.",
    tags: ["Coliving", "Nagarkot", "Mountains"],
    discount: "20% Discount for 2+ week stays"
  },
  {
    name: "The Dwarika's Hotel",
    category: "Destination",
    location: "Battisputali, Kathmandu",
    description: "Our luxury heritage partner. Experience traditional Newari architecture while staying connected.",
    tags: ["Heritage", "Luxury", "Kathmandu"],
  },

  // --- ADVENTURE ---
  {
    name: "Himalayan High Trails",
    category: "Adventure",
    location: "Pokhara / Manang",
    description: "Specialized trekking partner for digital nomads. They offer 'Light Trekking' with mobile hotspots.",
    tags: ["Trekking", "Adventure", "Guide"],
    discount: "10% Off Group Treks",
    priority: true
  },
  {
    name: "Nepal Air Sports",
    category: "Adventure",
    location: "Sarangkot, Pokhara",
    description: "Paragliding and ultralight flight specialists. The best way to see the Annapurna range from above.",
    tags: ["Paragliding", "Pokhara", "Adrenaline"],
  },
  {
    name: "Mountain Bike Nepal",
    category: "Adventure",
    location: "Kathmandu Valley",
    description: "Bespoke mountain biking tours around the valley rim and beyond.",
    tags: ["Biking", "Outdoors"],
    discount: "Exclusive Half-Day Tour Rate for Nomads"
  },

  // --- BANKING ---
  {
    name: "Wise",
    category: "Banking",
    location: "Online",
    description: "Send, receive and spend money at the real exchange rate. Essential for nomads in Nepal.",
    tags: ["Payments", "Global", "Finance"],
  }
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 mb-6 text-primary">
            <span className="w-8 h-px bg-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Our Ecosystem</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            Trusted Partners for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">Nepal Journey.</span>
          </h1>
          <p className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl">
            We partner with the best adventure specialists, coworking spaces, and 
            nomad tools to ensure your stay in Nepal is safe, productive, and unforgettable.
          </p>
        </div>

        {/* Interactive List */}
        <PartnersClient partners={partnerData} />
      </main>

      <Footer />
    </div>
  )
}
