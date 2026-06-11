const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const guides = await prisma.guide.findMany()
  console.log('GUIDES IN DB:', guides.map(g => ({ id: g.id, name: g.name, contactEmail: g.contactEmail })))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
