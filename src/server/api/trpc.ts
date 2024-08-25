import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export type Context = {
  prisma: PrismaClient;
};

export const createContext = (): Context => ({
  prisma,
});
