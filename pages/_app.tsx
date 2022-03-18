import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';

import { AuthProvider } from '../components/auth';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useMemo } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const client = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        uri:
          typeof window === undefined
            ? 'http://localhost:3000/api/graphql'
            : '/api/graphql',
      }),
    []
  );
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}
export default MyApp;
