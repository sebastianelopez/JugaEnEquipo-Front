import "../styles/globals.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import type { AppProps } from "next/app";
import { UiProvider } from "../context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "../themes";
import { NextIntlProvider } from "next-intl";

import type { NextPageContext  } from 'next' 
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";

type CustomAppProps = AppProps & {
  pageProps: NextPageContext & {messages?: {} } 
}

function MyApp({ Component, pageProps}: CustomAppProps) {
  return (
    <SessionProvider>
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
    <UiProvider>
      <ThemeProvider theme={lightTheme}>
        <NextIntlProvider messages={pageProps.messages}>
          <CssBaseline />
          <Component {...pageProps} />
        </NextIntlProvider>
      </ThemeProvider>
    </UiProvider>
    </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
