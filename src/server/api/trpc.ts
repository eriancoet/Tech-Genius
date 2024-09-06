import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react'; // Assuming you are using next-auth
import { TRPCError } from '@trpc/server';
import { NextApiRequest } from 'next'; // Import the Next.js request type for context
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// Extend the Context to include Prisma and session
export type Context = {
  prisma: PrismaClient;
  session: Session | null;
};

// Create context with Prisma and session handling
export const createContext = async ({ req }: { req: NextApiRequest }): Promise<Context> => {
  const session = await getSession({ req }); // Fetch the session from the request
  return {
    prisma,
    session, // Attach the session to the context
  };
};

export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Define protectedProcedure with session check
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

 

  return next();
});
