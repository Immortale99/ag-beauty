import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import '../styles/globals.css'
import Head from 'next/head'
import { ToastProvider } from '../contexts/ToastContext';



export default function MyApp({ Component, pageProps }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
      <ToastProvider>
        <>
          <Head>
            <title>AG - BEAUTY</title>
            <meta name="description" content="Salon de beauté AG-BEAUTY" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="icon" href="/icons/icon-192x192.png" />
          </Head>

          <Component {...pageProps} user={user} />
          {!router.pathname.startsWith('/admin') && (
            <>
            </>
          )}
        </>
      </ToastProvider>
  );
}