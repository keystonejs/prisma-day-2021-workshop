import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { createClient, Provider } from 'urql';

export const client = createClient({
  url:
    typeof window === undefined
      ? 'http://localhost:3000/api/graphql'
      : '/api/graphql',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;
