const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const defaultFooter = {
  bio: "The definitive guide for digital nomads in Nepal. Get up-to-date info on the Nepal Nomad Visa, Pokhara remote work hubs, and the cost of living for 2026.\n\nBuilt for remote workers, freelancers, and location-independent entrepreneurs exploring Nepal.",
  basecamp: "Basecamp: Kathmandu, Nepal",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  tiktok: "https://tiktok.com",
  youtube: "https://youtube.com",
  newsletterTitle: "Get the Nepal Digital Nomad Starter Kit",
  newsletterDesc: "Weekly tips, cost breakdowns, and remote work guides for Nepal's growing ecosystem."
}

async function main() {
  console.log("🌱 Seeding footer settings...")
  const record = await prisma.setting.upsert({
    where: { key: "footer" },
    update: { value: JSON.stringify(defaultFooter) },
    create: { key: "footer", value: JSON.stringify(defaultFooter) }
  })
  console.log("✅ Footer settings upserted successfully.")
}

main()
  .catch(e => {
    console.error("❌ Error seeding footer:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
