import Head from 'next/head';

import { Header } from '../Header';
import type { NextPage } from 'next';

interface ILayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: NextPage<ILayoutProps> = ({
  children,
  title = 'Next.js + Keycloak Example',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      />
    </Head>

    <Header />

    <div className="container my-5">{children}</div>
  </div>
);

export { Layout };
