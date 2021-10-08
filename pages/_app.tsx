import 'tailwindcss/tailwind.css';

import type { AppProps } from 'next/app';
import App from 'next/app';

import { createClient, Provider } from 'urql';

import { AuthProvider } from '../components/auth';




export const client = createClient({
  url:
    typeof window === undefined
      ? 'http://localhost:3000/api/graphql'
      : '/api/graphql',
});

class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props;

    return (

      <Provider value={client}>      
      <AuthProvider>  

      <Component {...pageProps} key={router.route} />

      </AuthProvider>
      </Provider>

    );
  }
}



export default MyApp;
