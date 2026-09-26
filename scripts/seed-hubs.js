const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const hubs = [
  {
    name: "WorkAround Kathmandu",
    slug: "workaround-kathmandu",
    city: "Kathmandu",
    description: "Located in the quiet green hub of Jhamsikhel, WorkAround Kathmandu is a premier coworking hub offering 100+ Mbps fiber internet, full solar power backup, ergonomic chairs, and regular community events.",
    address: "Jhamsikhel, Lalitpur, Kathmandu",
    rating: 4.8,
    totalReviews: 12,
    isVerified: true,
    isPartner: true,
    photoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    facilities: JSON.stringify(["High-Speed Fiber", "Backup Generator", "Ergonomic Chairs", "Coffee & Tea", "Skype Booths", "Meeting Rooms"]),
    priceDaily: 6,
    priceMonthly: 85,
    contactEmail: "kathmandu@workaround.com",
    website: "https://workaround.com/kathmandu"
  },
  {
    name: "The Hub Thamel",
    slug: "the-hub-thamel",
    city: "Kathmandu",
    description: "A focused space in the heart of Thamel for writers, developers, and designers. Equipped with private call rooms, excellent coffee, and reliable UPS backup systems.",
    address: "Thamel, Kathmandu",
    rating: 4.5,
    totalReviews: 8,
    isVerified: true,
    isPartner: false,
    photoUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
    facilities: JSON.stringify(["High-Speed Fiber", "Backup Power", "Free Coffee", "Outdoor Terrace", "Private Skype Booths"]),
    priceDaily: 5,
    priceMonthly: 75,
    contactEmail: "hello@hubthamel.com",
    website: "https://hubthamel.com"
  },
  {
    name: "Lakeside Nomads Pokhara",
    slug: "lakeside-nomads-pokhara",
    city: "Pokhara",
    description: "Overlooking the gorgeous Phewa Lake, Lakeside Nomads is the perfect balance of work and play. Enjoy mountain views from our open-air desk area, high-speed fiber internet, and premium coffee.",
    address: "Lakeside Road, Ward 6, Pokhara",
    rating: 4.9,
    totalReviews: 22,
    isVerified: true,
    isPartner: true,
    photoUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    facilities: JSON.stringify(["High-Speed Fiber", "Backup Generator", "Phewa Lake View", "Ergonomic Desks", "Free Tea", "Community Garden"]),
    priceDaily: 6,
    priceMonthly: 80,
    contactEmail: "pokhara@lakesidenomads.com",
    website: "https://lakesidenomads.com"
  },
  {
    name: "Nomad Haven Pokhara",
    slug: "nomad-haven-pokhara",
    city: "Pokhara",
    description: "A cozy community-centered workspace offering standard hot desks, standing desks, high reliability backups, and weekly community networking events.",
    address: "Street No. 12, Lakeside, Pokhara",
    rating: 4.4,
    totalReviews: 6,
    isVerified: false,
    isPartner: false,
    photoUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    facilities: JSON.stringify(["Reliable Wifi", "Power Backup", "Community Kitchen", "Bike Parking", "Free Water"]),
    priceDaily: 4,
    priceMonthly: 55,
    contactEmail: "contact@nomadhaven.com",
    website: "https://nomadhaven.com"
  },
  {
    name: "Mustang Starlink Coliving & Work Hub",
    slug: "mustang-starlink-coliving",
    city: "Mustang",
    description: "High-altitude remote work haven in Upper Mustang equipped with Starlink Satellite Wi-Fi (220 Mbps), 24/7 solar battery backup, heated ergonomic workstation lounges, and private coliving suites with Himalayan mountain views.",
    address: "Jomsom Airport Road, Mustang, Gandaki Province",
    rating: 4.9,
    totalReviews: 18,
    isVerified: true,
    isPartner: true,
    photoUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    facilities: JSON.stringify(["Starlink Satellite Wi-Fi (220 Mbps)", "Solar + Battery Backup", "Coliving Suites", "Private Rooms", "Heated Workstation Lounge", "Organic Himalayan Dining", "24/7 Access"]),
    priceDaily: 14,
    priceMonthly: 280,
    contactEmail: "mustang@nomadnepal.org",
    website: "https://digitalnomadsinnepal.com/mustang"
  },
  {
    name: "Marpha Apple Orchard Nomad Lodge",
    slug: "marpha-nomad-coliving",
    city: "Mustang",
    description: "Peaceful coliving & work lodge nestled in the iconic apple orchards of Marpha village. Offers ultra-fast Starlink Wi-Fi, private heated work rooms, local organic meals, and mountain trekking access.",
    address: "Marpha Heritage Village, Mustang",
    rating: 4.8,
    totalReviews: 14,
    isVerified: true,
    isPartner: false,
    photoUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    facilities: JSON.stringify(["Starlink Wi-Fi (180 Mbps)", "Solar Battery Backup", "Coliving Suites", "Private Heated Desks", "Apple Orchard View", "Organic Meals"]),
    priceDaily: 12,
    priceMonthly: 240,
    contactEmail: "marpha@nomadnepal.org",
    website: "https://digitalnomadsinnepal.com/marpha"
  }
]

async function main() {
  console.log("🌱 Seeding coworking hubs...")
  for (const hub of hubs) {
    const record = await prisma.workHub.upsert({
      where: { slug: hub.slug },
      update: {
        ...hub,
        facilities: JSON.parse(hub.facilities) // Parse it back to JSON object for Prisma
      },
      create: {
        ...hub,
        facilities: JSON.parse(hub.facilities) // Parse it back to JSON object for Prisma
      }
    })
    console.log(`✅ Upserted hub: ${record.name}`)
  }
  console.log("🎉 Seeding complete!")
}

main()
  .catch(e => {
    console.error("❌ Error seeding hubs:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
