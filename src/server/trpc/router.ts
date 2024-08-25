// src/server/trpc/router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db } from '../db'; // Correct import based on your setup

const t = initTRPC.create();

export const appRouter = t.router({
  getEmployees: t.procedure.query(async () => {
    try {
      const employees = await db.employee.findMany(); // Adjust model name as necessary
      return employees;
    } catch (error) {
      if (error instanceof Error) {
        // Handle the known Error type
        throw new Error(`Failed to fetch employees: ${error.message}`);
      } else {
        // Handle unknown errors
        throw new Error('Failed to fetch employees: An unknown error occurred');
      }
    }
  }),
});

export type AppRouter = typeof appRouter;
