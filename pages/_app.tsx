import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { createClient, Provider } from 'urql';
import React from 'react'
import { AuthProvider } from '../components/auth';

export const client = createClient({
  url:
    typeof window === undefined
      ? 'http://localhost:3000/api/graphql'
      : '/api/graphql',
});

export default function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}

