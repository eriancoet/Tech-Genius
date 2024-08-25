// src/pages/_app.tsx

import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { SessionProvider, useSession } from 'next-auth/react'; // Import useSession
import '@/styles/globals.css'; // Ensure this path is correct
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}> {/* Add SessionProvider */}
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <AuthRedirect>
            <Component {...pageProps} />
          </AuthRedirect>
        </trpc.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // If the session status is 'loading', we should not perform any redirect
    if (status === 'loading') return;

    // Redirect authenticated users only if they are not on the sign-in page
    if (status === 'authenticated' && router.pathname === '/auth/signin') {
      router.push('/employees');
    } else if (status === 'unauthenticated' && router.pathname !== '/auth/signin') {
      // Redirect unauthenticated users to the sign-in page
      router.push('/auth/signin');
    }
  }, [status, router]);

  return <>{children}</>;
};


export default MyApp;
