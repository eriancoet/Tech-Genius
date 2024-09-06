import { createTRPCRouter, protectedProcedure } from '../trpc'; // Import protectedProcedure
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';

export const employeeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.employee.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          telephoneNumber: true,
          emailAddress: true,
          managerId: true,
          status: true,
        },
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch employees',
        cause: error,
      });
    }
  }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        telephoneNumber: z.string(),
        emailAddress: z.string().email(),
        managerId: z.string().optional(),
        status: z.boolean(),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        let userId = input.userId;
  
        if (!userId) {
          const hashedPassword = await bcrypt.hash('Password123#', 10);
          const role = input.managerId ? 'MANAGER' : 'EMPLOYEE';
          const user = await ctx.prisma.user.create({
            data: {
              email: input.emailAddress,
              password: hashedPassword,
              role,
            },
          });
          userId = user.id;
        }
  
        return await ctx.prisma.employee.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            telephoneNumber: input.telephoneNumber,
            emailAddress: input.emailAddress,
            managerId: input.managerId || '',
            status: input.status,
            user: {
              connect: { id: userId },
            },
          },
        });
      } catch (error) {
        console.error('Error creating employee:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create employee',
          cause: error,
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        telephoneNumber: z.string(),
        emailAddress: z.string().email(),
        managerId: z.string().optional(),
        status: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.employee.update({
          where: { id: input.id },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            telephoneNumber: input.telephoneNumber,
            emailAddress: input.emailAddress,
            managerId: input.managerId || '',
            status: input.status,
          },
        });
      } catch (error) {
        console.error('Error updating employee:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update employee',
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.employee.delete({
          where: { id: input },
        });
      } catch (error) {
        console.error('Error deleting employee:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete employee',
          cause: error,
        });
      }
    }),
});
