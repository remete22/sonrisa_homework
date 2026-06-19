import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed roles
  const adminRole = await prisma.roles.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  })

  await prisma.roles.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  })

  // Seed subscription methods
  await prisma.subscriptionMethods.upsert({
    where: { methodName: 'EMAIL' },
    update: {},
    create: { methodName: 'EMAIL' },
  })

  await prisma.subscriptionMethods.upsert({
    where: { methodName: 'SLACK' },
    update: {},
    create: { methodName: 'SLACK' },
  })

  // Seed admin user
  const hashedPassword = await bcrypt.hash('test123', 12)

  await prisma.users.upsert({
    where: { email: 'test@user.com' },
    update: {},
    create: {
      email: 'test@user.com',
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
