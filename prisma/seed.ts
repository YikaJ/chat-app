import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const developer = await prisma.user.upsert({
    where: {
      email: 'developer@tencent.com'
    },
    update: {},
    create: {
      name: 'developer',
      email: 'developer@tencent.com'
    }
  })
  console.log({ developer })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })