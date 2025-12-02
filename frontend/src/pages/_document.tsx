import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Warehouse Inventory Management System" />
        <link rel="icon" href="/favicon.ico" />
        <title>Warehouse</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}