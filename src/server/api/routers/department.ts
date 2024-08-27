import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

export const departmentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.department.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          managerId: true, // Adjusted for the new schema
        },
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw new Error('Failed to fetch departments');
    }
  }),

  getOne: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    try {
      return await ctx.prisma.department.findUnique({
        where: { id: input.id },
      });
    } catch (error) {
      console.error('Error fetching department:', error);
      throw new Error('Failed to fetch department');
    }
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.boolean(),
        managerId: z.string(), // Adjusted for the new schema
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.department.create({
          data: {
            name: input.name,
            status: input.status,
            managerId: input.managerId, // Adjusted for the new schema
          },
        });
      } catch (error) {
        console.error('Error creating department:', error);
        throw new Error('Failed to create department');
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        status: z.boolean(),
        managerId: z.string(), // Adjusted for the new schema
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.department.update({
          where: { id: input.id },
          data: {
            name: input.name,
            status: input.status,
            managerId: input.managerId, // Adjusted for the new schema
          },
        });
      } catch (error) {
        console.error('Error updating department:', error);
        throw new Error('Failed to update department');
      }
    }),

  delete: publicProcedure
    .input(z.string()) // Expecting the department id as a number
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.department.delete({
          where: { id: input },
        });
      } catch (error) {
        console.error('Error deleting department:', error);
        throw new Error('Failed to delete department');
      }
    }),
});
