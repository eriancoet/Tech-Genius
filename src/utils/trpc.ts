import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../server/api/root'; // Updated path


export const trpc = createTRPCReact<AppRouter>();
