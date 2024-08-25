// src/server/root.ts
import { createTRPCRouter } from './trpc';
import { employeeRouter } from './routers/employee';
import { postRouter } from './routers/post';

export const appRouter = createTRPCRouter({
  employee: employeeRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
