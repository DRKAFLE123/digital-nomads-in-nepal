/**
 * Seed script: creates or promotes a user to ADMIN role.
 * Usage:  npx tsx scripts/seed-admin.ts
 */
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  log: ["error"]
})

async function main() {
  const email = "admin@gmail.com"
  const password = "admin123"
  const name = "Admin"

  const hashed = await bcrypt.hash(password, 12)
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", password: hashed },
      select: { id: true, email: true, role: true },
    })
    console.log(`✅ Existing user promoted to ADMIN:`, updated)
  } else {
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "ADMIN" },
      select: { id: true, email: true, role: true },
    })
    console.log(`✅ Admin user created:`, user)
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
