import '../styles/global.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';

import { AuthProvider } from '../components/auth';

export default function App({ Component, pageProps }: AppProps) {
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
