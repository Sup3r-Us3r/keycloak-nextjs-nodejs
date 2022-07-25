import * as React from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
