import { PrismaClient } from '../../generated/prisma';


const globalForPrisma = globalThis as unknown as {
  prismaPostgres: PrismaClient | undefined;
};

export const prismaclient =
  globalForPrisma.prismaPostgres ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prismaPostgres = prismaclient;