import "../styles/globals.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import type { AppProps } from "next/app";
import { UiProvider } from "../context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "../themes";
import { NextIntlProvider } from "next-intl";

import type { NextPageContext  } from 'next' 

type CustomAppProps = AppProps & {
  pageProps: NextPageContext & {messages?: {} } 
}

function MyApp({ Component, pageProps}: CustomAppProps) {
  return (
    <UiProvider>
      <ThemeProvider theme={lightTheme}>
        <NextIntlProvider messages={pageProps.messages}>
          <CssBaseline />
          <Component {...pageProps} />
        </NextIntlProvider>
      </ThemeProvider>
    </UiProvider>
  );
}

export default MyApp;
