const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@api.com' } })
  if (existing) return

  await prisma.user.create({
    data: {
      email: 'admin@api.com',
      password: await bcrypt.hash('admin123', 10)
    }
  })

  console.log('Admin seeded: admin@api.com / admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())