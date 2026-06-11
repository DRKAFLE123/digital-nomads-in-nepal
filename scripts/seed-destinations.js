const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const destinations = [
  {
    name: "Kathmandu",
    slug: "kathmandu",
    description: "The bustling cultural, historical, and economic capital hub of Nepal. Kathmandu is a sensory-rich valley surrounded by hills. For digital nomads, it offers the fastest internet connections in the country (up to 300+ Mbps), a growing network of modern coworking spaces, vibrant networking events, and access to countless historic temples, monuments, and dynamic cafes.",
    image: "/nepal-blog-hero-banner.png",
    tags: {
      score: "4.2",
      cost: "$700 / month",
      speed: "100 - 300 Mbps (Fiber)",
      safety: "High (Very Safe)",
      power: "Excellent (Power Backups Standard)",
      sim: "Ncell & NTC 4G (Very Strong)",
      coworking: ["Impact Hub (Sanepa)", "Work Around (Lalitpur)", "Next Venture Corp"],
      pros: ["Rich historical sites & UNESCO heritage", "Large professional networking community", "Hundreds of cafes with fast fiber internet", "Excellent international dining options"],
      cons: ["Traffic congestion & dust", "Air quality during dry winter months"]
    }
  },
  {
    name: "Pokhara",
    slug: "pokhara",
    description: "The lakeside remote work paradise of Nepal. Nestled beneath the towering Annapurna mountain range, Pokhara is famous for its calm lakes, laid-back tourist vibes, paragliding, and hiking opportunities. It is the absolute favorite spot for slow-traveling digital nomads who want to combine early morning yoga or mountain views with afternoon video calls in cozy lakeside cafes.",
    image: "/hero-bg.png",
    tags: {
      score: "4.6",
      cost: "$650 / month",
      speed: "80 - 200 Mbps (Fiber)",
      safety: "Very High (Peaceful)",
      power: "Good (Most nomad spots have inverters)",
      sim: "Ncell & NTC (Good Lakeside coverage)",
      coworking: ["Nomad Hub (Lakeside)", "Workation Pokhara", "Lakeside Work Cafes"],
      pros: ["Stunning lakeside living with Annapurna range views", "Fresh clean air and paragliding hotspots", "Perfect basecamp for weekend Himalayan treks", "Laid-back tourist friendly vibe & nightlife"],
      cons: ["Heavy monsoon rains (June - August)", "Fewer formal coworking hubs than Kathmandu"]
    }
  },
  {
    name: "Bandipur",
    slug: "bandipur",
    description: "A beautifully preserved hilltop town in central Nepal. Bandipur is a quiet Newari mountain retreat that feels like an open-air museum of traditional architecture. Lacking motor vehicles on its main stone-paved streets, it offers digital nomads a tranquil environment to focus on writing, development, or creative design with clean air and majestic mountain panoramas.",
    image: "/logo.png",
    tags: {
      score: "3.9",
      cost: "$500 / month",
      speed: "40 - 100 Mbps (Vianet/Worldlink)",
      safety: "Very High (Tight-knit community)",
      power: "Fair (Homestays use backup power)",
      sim: "Ncell (Fair), NTC (Good 4G)",
      coworking: ["Local cafes (Newa Town Cafe)", "Homestays with dedicated workspaces"],
      pros: ["No vehicle noise (fully pedestrianized stone streets)", "Exquisite traditional Newari architecture", "Tranquil environment for deep focus", "Spectacular mountain panorama vistas"],
      cons: ["No formal coworking spaces", "Limited choice of cafes and restaurants"]
    }
  }
]

async function main() {
  console.log("🌱 Starting seeding of destinations...")
  for (const dest of destinations) {
    const record = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest
    })
    console.log(`✅ Upserted Destination: ${record.name}`)
  }
  console.log("🎉 Seeding completed successfully.")
}

main()
  .catch(e => {
    console.error("❌ Error seeding destinations:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
