import "../styles/build.css";
import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>newtab</title>
        <meta name="description" content="a new minimal tab" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
