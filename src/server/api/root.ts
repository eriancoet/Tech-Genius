// src/server/root.ts
import { createTRPCRouter } from './trpc';
import { employeeRouter } from './routers/employee';
import { postRouter } from './routers/post';
import { departmentRouter } from './routers/department'; // Import the department router

export const appRouter = createTRPCRouter({
  employee: employeeRouter,
  post: postRouter,
  department: departmentRouter, // Add the department router here

});

export type AppRouter = typeof appRouter;
