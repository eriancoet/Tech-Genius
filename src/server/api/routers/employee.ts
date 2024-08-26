import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';

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
      throw new Error('Failed to fetch employees');
    }
  }),

  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        telephoneNumber: z.string(),
        emailAddress: z.string().email(),
        managerId: z.string(),
        status: z.boolean(), // Boolean status
        userId: z.string().optional(), // Remove if not used
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        let userId = input.userId;

        if (!userId) {
          // Hash the default password
          const hashedPassword = await bcrypt.hash('Password123#', 10);

          // Create a new user if userId is not provided
          const user = await ctx.prisma.user.create({
            data: {
              email: input.emailAddress,
              password: hashedPassword,
              role: 'EMPLOYEE',
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
            managerId: input.managerId,
            status: input.status, // Boolean status
            user: {
              connect: { id: userId }, // Connect the employee with the existing or new user
            },
          },
        });
      } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error('Failed to create employee');
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
        managerId: z.string(),
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
            managerId: input.managerId,
            status: input.status, // Boolean status
          },
        });
      } catch (error) {
        console.error('Error updating employee:', error);
        throw new Error('Failed to update employee');
      }
    }),

  delete: publicProcedure
    .input(z.string()) // Expecting the employee id as a string
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.employee.delete({
          where: { id: input },
        });
      } catch (error) {
        console.error('Error deleting employee:', error);
        throw new Error('Failed to delete employee');
      }
    }),
});
