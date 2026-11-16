const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@digitalnomadsinnepal.com').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD

  if (!password || password.length < 12) {
    console.error('Error: A secure ADMIN_PASSWORD environment variable of at least 12 characters is required.')
    console.error('Usage: ADMIN_PASSWORD="your-secure-password" node scripts/seed-admin.js')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 12)
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const u = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', password: hashed },
      select: { id: true, email: true, role: true }
    })
    console.log('Promoted to ADMIN:', JSON.stringify(u))
  } else {
    const u = await prisma.user.create({
      data: { name: 'System Admin', email, password: hashed, role: 'ADMIN' },
      select: { id: true, email: true, role: true }
    })
    console.log('Admin created:', JSON.stringify(u))
  }
}

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
