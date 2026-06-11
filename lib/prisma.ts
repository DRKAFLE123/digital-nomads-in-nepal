import { PrismaClient } from "@prisma/client"

/**
 * Standard Prisma Client initialization for Prisma 6.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
