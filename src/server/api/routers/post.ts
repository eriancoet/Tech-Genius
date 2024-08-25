import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  create: publicProcedure
    .input(z.object({
      title: z.string(),
      body: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.post.create({
        data: input,
      });
    }),
});
