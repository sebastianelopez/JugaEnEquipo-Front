import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initalProps = await Document.getInitialProps(ctx);

    return initalProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          {/* Theme Color - Esto ayuda a evitar fondos blancos en favicons */}
          <meta name="theme-color" content="#6C5CE7" />
          
          {/* Favicons */}
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="shortcut icon" type="image/png" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/favicon.png" />
          
          {/* Microsoft Tiles */}
          <meta name="msapplication-TileColor" content="#6C5CE7" />
          <meta name="msapplication-TileImage" content="/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />          
        </body>
      </Html>
    );
  }
}

export default MyDocument;
