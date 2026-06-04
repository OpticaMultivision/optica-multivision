import Head from 'next/head';
import Router from 'next/router';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import nProgress from 'nprogress';

import MuiTheme from 'theme/MuiTheme';
import { AppProvider } from 'contexts/AppContext';
import createEmotionCache from '../src/createEmotionCache';
import OpenGraphTags from 'utils/OpenGraphTags';

import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());
nProgress.configure({ showSpinner: false });

const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

const MyApp = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Óptica Multivision</title>
        <OpenGraphTags />
      </Head>
      <AppProvider>
        <MuiTheme>{getLayout(<Component {...pageProps} />)}</MuiTheme>
      </AppProvider>
    </CacheProvider>
  );
};

export default MyApp;
