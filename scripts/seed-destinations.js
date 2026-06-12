const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const destinations = [
  {
    name: "Kathmandu",
    slug: "kathmandu",
    description: "The bustling cultural, historical, and economic capital hub of Nepal. Kathmandu is a sensory-rich valley surrounded by hills. For digital nomads, it offers the fastest internet connections in the country (up to 300+ Mbps), a growing network of modern coworking spaces, vibrant networking events, and access to countless historic temples, monuments, and dynamic cafes.",
    image: "/images/destinations/kathmandu.png",
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
    image: "/images/destinations/pokhara.png",
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
    name: "Lalitpur",
    slug: "lalitpur",
    description: "Lalitpur (historically Patan) is the artisan capital of the Kathmandu Valley, famed for its ancient Newari architecture, metal statues, and stone carvings. For digital nomads, it offers a quieter, more green and artistic alternative to Kathmandu. It is home to Sanepa and Jhamsikhel, the premier expat and nomad hotspots, featuring trendy workspaces, third-wave specialty cafes, organic markets, and excellent restaurants.",
    image: "/images/destinations/lalitpur.png",
    tags: {
      score: "4.4",
      cost: "$680 / month",
      speed: "100 - 250 Mbps (Fiber)",
      safety: "Very High (Friendly communities)",
      power: "Excellent (Power backups standard)",
      sim: "Ncell & NTC 4G (Very Strong)",
      coworking: ["Work Around (Lalitpur)", "Impact Hub (Sanepa)", "The Hub Jhamsikhel"],
      pros: ["Exquisite artisan heritage and Patan Durbar Square", "Walkable, leafy expat neighborhoods (Jhamsikhel & Sanepa)", "Abundant design-forward cafes with stable internet", "Active international community & events"],
      cons: ["Slightly higher rental cost in hot areas", "Traffic congestion during rush hours"]
    }
  },
  {
    name: "Chitwan",
    slug: "chitwan",
    description: "Nepal's premier jungle and wildlife wilderness destination, located in the subtropical inner Terai lowlands. Famed for Chitwan National Park (a UNESCO World Heritage site) housing one-horned rhinos, Bengal tigers, and wild elephants. For remote workers looking for a completely different pace of life, Sauraha and surrounding resorts offer warm tropical climates, relaxing wildlife safaris, and a growing availability of stable fiber broadband internet.",
    image: "/images/destinations/chitwan.png",
    tags: {
      score: "3.8",
      cost: "$550 / month",
      speed: "30 - 80 Mbps (Fiber)",
      safety: "High (Peaceful tourist areas)",
      power: "Good (Resorts have backup generators)",
      sim: "Ncell & NTC (Decent 4G in Sauraha)",
      coworking: ["Riverside resorts", "Local cafes in Sauraha"],
      pros: ["Stunning subtropical jungle environment and river views", "Incredible wildlife safaris (rhinos, elephants, crocodiles)", "Warm and sunny winter climate", "Lower cost of living"],
      cons: ["Hot and humid summer/monsoon months", "Few dedicated coworking spaces", "Mosquitoes and insects"]
    }
  },
  {
    name: "Bandipur",
    slug: "bandipur",
    description: "A beautifully preserved hilltop town in central Nepal. Bandipur is a quiet Newari mountain retreat that feels like an open-air museum of traditional architecture. Lacking motor vehicles on its main stone-paved streets, it offers digital nomads a tranquil environment to focus on writing, development, or creative design with clean air and majestic mountain panoramas.",
    image: "/images/destinations/bandipur.png",
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
  },
  {
    name: "Manang",
    slug: "manang",
    description: "Manang is a stunning high-altitude valley situated in the Annapurna Conservation Area, lying at 3,519 meters. It is a legendary stop on the Annapurna Circuit. For digital nomads seeking an extreme alpine remote work experience, Manang offers dramatic mountain scenery, unique Tibetan-influenced culture, clean dry mountain air, and surprisingly usable satellite/LTE/fiber broadband options in select teahouses.",
    image: "/images/destinations/manang.png",
    tags: {
      score: "3.7",
      cost: "$450 / month",
      speed: "15 - 50 Mbps (Local Fiber / Satellite / LTE)",
      safety: "Very High (Kind mountain community)",
      power: "Fair (Solar power & backup batteries standard)",
      sim: "NTC (Strong 4G in town), Ncell (Limited)",
      coworking: ["Local Teahouse workspaces", "ACAP Information Center"],
      pros: ["Jaw-dropping vistas of Annapurna and Gangapurna peaks", "Perfect acclimatization base for high-altitude hikers", "Tranquil Buddhist monasteries and heritage", "Pure, unpolluted Himalayan alpine air"],
      cons: ["Risk of altitude sickness (AMS) if ascending too fast", "Cold winter temperatures and occasional snow blockages", "No formal coworking spaces"]
    }
  },
  {
    name: "Mustang",
    slug: "mustang",
    description: "Mustang is a rain-shadow region in northern Nepal, famous for its wind-swept landscapes, ancient caves, and deep canyons. Historically a forbidden kingdom (Lo Manthang), it offers digital nomads a barren, otherworldly environment. Cities like Jomsom, Marpha, and Kagbeni provide access to stable fiber internet, legendary apple orchards, and a chance to work from the gates of Upper Mustang.",
    image: "/images/destinations/mustang.png",
    tags: {
      score: "4.0",
      cost: "$520 / month",
      speed: "30 - 80 Mbps (Fiber)",
      safety: "Very High (Peaceful, spiritual atmosphere)",
      power: "Good (Hydropower grid, very reliable)",
      sim: "Ncell & NTC (Decent 4G in Jomsom and Marpha)",
      coworking: ["Marpha local workspace cafes", "Jomsom Mountain Lodges"],
      pros: ["Spectacular desert-like Himalayan landscapes and wind-carved cliffs", "Rich ancient Tibetan culture and walled city of Lo Manthang", "Famed apples, local apple brandy, and traditional stone houses", "Unique mountain biking and hiking trails"],
      cons: ["High wind speeds in the afternoon", "Strict travel permits required for Upper Mustang area"]
    }
  },
  {
    name: "Khaptad",
    slug: "khaptad",
    description: "Khaptad National Park, located in the Far-Western region of Nepal, is a serene plateau of rolling green meadows, dense pine forests, and spiritual tranquility. Known as the playground of the revered Khaptad Baba, it is the ultimate destination for off-grid remote workers, writers, and thinkers seeking complete solitude. Digital connectivity is primarily mobile-based (4G/3G via local towers), requiring nomads to embrace slow-tech focus.",
    image: "/images/destinations/khaptad.png",
    tags: {
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
