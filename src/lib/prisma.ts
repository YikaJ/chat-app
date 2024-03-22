import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSigleton = () => {
  return new PrismaClient()
}

const prisma = globalForPrisma.prisma ?? prismaClientSigleton()

export { prisma }
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma