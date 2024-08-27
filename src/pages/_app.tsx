import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { SessionProvider, useSession } from 'next-auth/react';
import '@/styles/globals.css';
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
    <SessionProvider session={pageProps.session}>
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
    if (status === 'loading') return; // Skip redirect during loading

    if (status === 'authenticated') {
      if (router.pathname === '/auth/signin') {
        router.push('/employees'); // Redirect to employees if authenticated
      }
    } else if (status === 'unauthenticated') {
      if (router.pathname !== '/auth/signin') {
        router.push('/auth/signin'); // Redirect to sign-in if unauthenticated
      }
    }
  }, [status, router]);

  return <>{children}</>;
};

export default MyApp;
