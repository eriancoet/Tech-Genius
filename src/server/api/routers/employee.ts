import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';

export const employeeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.employee.findMany({
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
  }),

  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        telephoneNumber: z.string(),
        emailAddress: z.string().email(),
        managerId: z.string(),
        status: z.string(),
        userId: z.string().optional(), // Make userId optional if creating a new user
      })
    )
    .mutation(async ({ input, ctx }) => {
      let userId = input.userId;

      if (!userId) {
        // Hash the default password
        const hashedPassword = await bcrypt.hash('Password123#', 10);

        // Create a new user if userId is not provided
        const user = await ctx.prisma.user.create({
          data: {
            email: input.emailAddress,
            password: hashedPassword, // Save the hashed password
            role: 'EMPLOYEE', // Assign the role for the new user
          },
        });
        userId = user.id;
      }

      // Create the employee and link to the user
      return ctx.prisma.employee.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          telephoneNumber: input.telephoneNumber,
          emailAddress: input.emailAddress,
          managerId: input.managerId,
          status: input.status,
          user: {
            connect: { id: userId }, // Connect the employee with the existing or new user
          },
        },
      });
    }),
});
