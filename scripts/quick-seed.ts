import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = "admin@gmail.com"
  const password = "admin123"
  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", password: hashed },
    create: { name: "Admin", email, password: hashed, role: "ADMIN" },
  })
  console.log("✅ Admin seeded successfully")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
