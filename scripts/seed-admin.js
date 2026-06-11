const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const email = 'admin@gmail.com'
  const password = 'admin123'
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
      data: { name: 'Admin', email, password: hashed, role: 'ADMIN' },
      select: { id: true, email: true, role: true }
    })
    console.log('Admin created:', JSON.stringify(u))
  }
}

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
