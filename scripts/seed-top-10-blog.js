const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const destinationsToSeed = [
  {
    name: "Bhaktapur",
    slug: "bhaktapur",
    description: "The ancient city of culture and pottery, Bhaktapur is a living heritage sanctuary within the Kathmandu Valley. Renowned for its brick-paved lanes, beautiful Newari wood carvings, and majestic pagodas like Nyatapola. For remote workers looking to escape modern chaos, Bhaktapur offers a slow, pedestrianized lifestyle with excellent fiber broadband options, quiet courtyards, and delicious local delicacies like Juju Dhau (King Curd).",
    image: "/images/destinations/bhaktapur.png",
    tags: {
      score: "4.1",
      cost: "$580 / month",
      speed: "60 - 150 Mbps (Fiber)",
      safety: "Very High (Peaceful historical streets)",
      power: "Good (Local shops and cafes have backups)",
      sim: "Ncell & NTC (Strong 4G coverage)",
      coworking: ["Local heritage cafes", "Traditional guest houses"],
      pros: ["Zero vehicle noise in the old town center", "Spectacular UNESCO medieval architecture", "Quiet environment with plenty of creative inspiration", "Cheap rent and authentic local street food"],
      cons: ["Entry fee for foreigners to enter the old city", "Fewer late-night dining options than Kathmandu"]
    }
  },
  {
    name: "Dhulikhel",
    slug: "dhulikhel",
    description: "A scenic ridge-top town located 30km east of Kathmandu. Dhulikhel is famous for its breathtaking, panoramic views of the high Himalayas, fresh mountain air, and hiking trails. It has evolved into a quiet education and IT hub, meaning it boasts outstanding fiber optic internet infrastructure. It is the perfect weekend getaway or long-term base for nomads who want clean air and epic mountain sunrises without leaving the Kathmandu Valley's utility grid.",
    image: "/images/destinations/dhulikhel.png",
    tags: {
      score: "4.2",
      cost: "$600 / month",
      speed: "80 - 200 Mbps (Fiber)",
      safety: "Very High (Friendly college town)",
      power: "Excellent (Modern IT grid setups)",
      sim: "Ncell & NTC 4G (Very Strong)",
      coworking: ["Dhulikhel Boutique Lodges", "Kathmandu University IT spaces"],
      pros: ["Magnificent sunrise views of over 20 Himalayan peaks", "Very clean air and peaceful pine forests", "High-speed internet standard in most resorts and hotels", "Excellent hiking and organic farming area"],
      cons: ["Cooler winter temperatures", "Limited night life and quiet after 8 PM"]
    }
  }
]

const top10Content = `Nepal is rapidly emerging as a dream hotspot for digital nomads and remote workers. If you are looking for a place where you can write code or hop on Zoom calls under the shadow of the world’s tallest peaks—without draining your bank account—Nepal is the ultimate choice.

With fiber internet now spreading across high-altitude trails, remote workers can choose from a range of setups. Here is our official countdown of the **Top 10 Destinations in Nepal for Remote Workers & Digital Nomads in 2026**, completely interlinked with our local coworking and destination directories.

---

## 1. [Pokhara](/destinations/pokhara) – The Lakeside Nomad Haven
**Lakeside lifestyle and outdoor paragliding.**
Nestled beneath the majestic Annapurna range, [Pokhara](/destinations/pokhara) is the undisputed remote work capital of Nepal. Slow-traveling nomads flock to the Lakeside area for its healthy work-life balance. Imagine working from a cafe overlooking Phewa Lake, then hiking up to the World Peace Pagoda before sunset.
* **Best for:** Cafe work, yoga, paragliding, and weekend mountain trekking.
* **Connectivity:** 80 - 200 Mbps fiber internet is standard in most lakeside spots.

## 2. [Kathmandu](/destinations/kathmandu) – The Energetic Cultural Capital
**Fast internet, networking hubs, and ancient heritage.**
As the economic center, [Kathmandu](/destinations/kathmandu) is perfect for nomads who thrive on high-energy networking, tech meetups, and quick connections. The city offers the fastest internet in Nepal, standard power backups, and a massive community of local developers and global travelers.
* **Best for:** Fast-paced startup founders, networking, and dining variety.
* **Connectivity:** Up to 300+ Mbps fiber connections.

## 3. [Lalitpur](/destinations/lalitpur) – The Artistic & Leafy Expat District
**Trendy cafes, organic markets, and Patan Durbar Square.**
Just south of Kathmandu across the Bagmati River, [Lalitpur](/destinations/lalitpur) (Patan) is the creative heart of the valley. Expatriates and creative nomads prefer Lalitpur's walkable, green neighborhoods of Jhamsikhel and Sanepa, filled with third-wave coffee shops and organic farmers' markets.
* **Best for:** Designers, writers, and long-term expatriates.
* **Connectivity:** 100 - 250 Mbps fiber internet.

## 4. [Dhulikhel](/destinations/dhulikhel) – The Mountain Ridge Sunrise Retreat
**Epic Himalayan views and high-speed fiber infrastructure.**
Located only 30km from the capital, [Dhulikhel](/destinations/dhulikhel) is a ridge-top sanctuary. Known for its clear sunrises and mountain pine hikes, it is also home to major educational institutions, resulting in top-tier IT connectivity. It’s an ideal hub for programmers needing deep, uninterrupted focus.
* **Best for:** Deep focus, fresh mountain air, and panoramic views.
* **Connectivity:** Stable 80 - 200 Mbps fiber.

## 5. [Mustang](/destinations/mustang) – Remote Work in the Rain-Shadow Desert
**Apple orchards, spiritual winds, and wind-carved canyons.**
For a landscape that feels like another planet, [Mustang](/destinations/mustang) is unbeatable. With towns like Jomsom and Marpha connected to fiber internet, nomads can now work from ancient stone houses while eating local apples and sipping local brandy.
* **Best for:** Spiritual seekers, mountain bikers, and unique desert climates.
* **Connectivity:** 30 - 80 Mbps fiber.

## 6. [Bandipur](/destinations/bandipur) – The Pedestrianized Open-Air Museum
**Pedestrian-only stone streets and Newari architecture.**
[Bandipur](/destinations/bandipur) is a beautifully preserved hilltop settlement. With zero motor vehicles allowed on its main street, it offers absolute peace. You can set up your laptop on a balcony overlooking the central plaza and enjoy the slow, traditional Newari lifestyle.
* **Best for:** Solitude, heritage architecture, and writers.
* **Connectivity:** 40 - 100 Mbps broadband.

## 7. [Bhaktapur](/destinations/bhaktapur) – Ancient Pottery & Medieval Lanes
**King Curd, brick palaces, and silent courtyards.**
[Bhaktapur](/destinations/bhaktapur) is the most intact of the Kathmandu Valley's medieval cities. If you want to work surrounded by clay pottery squares and golden gates, this is the spot. The old town's pedestrian lanes offer a quiet refuge from the capital's hustle.
* **Best for:** Artists, photographers, and history buffs.
* **Connectivity:** 60 - 150 Mbps fiber.

## 8. [Chitwan](/destinations/chitwan) – The Subtropical Jungle Jungle Office
**Rhinos, tropical warmth, and riverside workspaces.**
If you prefer heat and wildlife over high peaks, head to [Chitwan](/destinations/chitwan). Sauraha is the gateway town, where digital nomads can work from riverside resort decks, taking breaks for jungle safaris to see wild elephants and one-horned rhinos.
* **Best for:** Wildlife enthusiasts, birdwatchers, and warm winter weather.
* **Connectivity:** 30 - 80 Mbps fiber in main resort areas.

## 9. [Manang](/destinations/manang) – Extreme High-Altitude Remote Work (3,519m)
**Tibet-style culture, alpine lakes, and satellite connectivity.**
If you want to push the boundaries of remote work, [Manang](/destinations/manang) is a legendary mountaineering base. Select teahouses now offer satellite and local fiber connections, allowing you to answer emails while acclimating for your trek across Thorong La Pass.
* **Best for:** High-altitude acclimatization, serious mountaineers, and rugged environments.
* **Connectivity:** 15 - 50 Mbps local fiber / satellite.

## 10. [Khaptad](/destinations/khaptad) – The Meadow Sanctuary for Digital Detox
**Dense pine forests, absolute silence, and mobile hotspot setup.**
[Khaptad](/destinations/khaptad) National Park is for the true minimalist. With zero fiber internet, remote workers here rely on local NTC 4G towers to stay online. It is a remote forest plateau designed for writers looking for complete, uninterrupted natural solitude.
* **Best for:** Deep creative writing, wilderness meditation, and digital detox.
* **Connectivity:** 10 - 30 Mbps mobile 4G.

---

## Conclusion: Tips for Remote Working in Nepal
1. **Power Backups:** Ensure your accommodation has an inverter (standard in [Kathmandu](/destinations/kathmandu) and [Pokhara](/destinations/pokhara)) to stay online during occasional power cuts.
2. **SIM Cards:** Always get a backup 4G SIM card (Ncell/NTC) to use as a mobile hotspot.
3. **Check In:** Use our community dashboard to let other digital nomads know which coworking space you are working from today!`;

async function main() {
  console.log("🌱 Starting seeding of new destinations and Top 10 blog...")
  
  // 1. Seed the destinations
  for (const dest of destinationsToSeed) {
    const record = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest
    })
    console.log(`✅ Upserted Destination: ${record.name}`)
  }

  // 2. Seed the blog post
  const blogData = {
    title: "Top 10 Destinations in Nepal for Remote Workers & Digital Nomads (2026)",
    slug: "top-10-destinations-nepal-remote-workers",
    excerpt: "From lakeside cafes in Pokhara to ancient temples in Patan and high-altitude alpine teahouses, discover the best places in Nepal to live and work remotely in 2026.",
    content: top10Content,
    coverImage: "/blog-top-10-destinations.png",
    category: "Destinations",
    tags: ["destinations", "living-in-nepal", "remote-work", "travel"],
    readTime: "10 min read",
    affiliates: false,
    featured: true,
    author: "DR kafle",
    published: true,
  }

  const post = await prisma.post.upsert({
    where: { slug: blogData.slug },
    update: blogData,
    create: blogData,
  })

  console.log(`✅ Upserted Blog Post: "${post.title}"`)
  console.log("🎉 Seeding completed successfully.")
}

main()
  .catch(e => {
    console.error("❌ Error running seed script:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
