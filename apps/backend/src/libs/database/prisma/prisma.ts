import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.warn('Initializing Prisma Client');

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'local') globalForPrisma.prisma = prisma;
