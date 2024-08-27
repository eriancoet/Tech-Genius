import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';

const prisma = new PrismaClient();

// Define the TRPC instance with context
export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export type Context = {
  prisma: PrismaClient;
};

// Create context for TRPC
export const createContext = (): Context => ({
  prisma,
});
