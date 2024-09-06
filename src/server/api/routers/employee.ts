import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';

// employee router
export const employeeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.employee.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          telephoneNumber: true,
          emailAddress: true,
          managerId: true,
          status: true, // Boolean status
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

  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        telephoneNumber: z.string(),
        emailAddress: z.string().email(),
        managerId: z.string().optional(), 
        status: z.boolean(), // Boolean status
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        let userId = input.userId;
  
        // If userId is not provided, create a new user
        if (!userId) {
          const hashedPassword = await bcrypt.hash('Password123#', 10);
          
          // Determine the role based on managerId
          const role = input.managerId ? 'MANAGER' : 'EMPLOYEE';
          console.log(`Role assigned on create: ${role}`);
          const user = await ctx.prisma.user.create({
            data: {
              email: input.emailAddress,
              password: hashedPassword,
              role, 
            },
          });
          userId = user.id;
        }
  

        // Create the employee and link to the user
        return await ctx.prisma.employee.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            telephoneNumber: input.telephoneNumber,
            emailAddress: input.emailAddress,
            managerId: input.managerId || '', 
            status: input.status, // Boolean status
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

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        telephoneNumber: z.string(),
        emailAddress: z.string().email(),
        managerId: z.string().optional(), 
        status: z.boolean(), // Boolean status
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
            managerId: input.managerId || "", 
            status: input.status, // Boolean status
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

  delete: publicProcedure
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
