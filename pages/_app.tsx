import "../styles/globals.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import type { AppProps } from "next/app";
import { UiProvider } from "../context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "../themes";
import { NextIntlClientProvider } from "next-intl";

import type { NextPageContext } from "next";
import { useRouter } from "next/router";
import { UserProvider } from "../context/user";
import { PostProvider } from "../context/post";

type CustomAppProps = AppProps & {
  pageProps: NextPageContext & { messages?: {} };
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  return (
    <UiProvider>
      <ThemeProvider theme={lightTheme}>
        <UserProvider>
          <PostProvider>
            <NextIntlClientProvider
              messages={pageProps.messages}
              locale={router.locale}
            >
              <CssBaseline />
              <Component {...pageProps} />
            </NextIntlClientProvider>
          </PostProvider>
        </UserProvider>
      </ThemeProvider>
    </UiProvider>
  );
}

export default MyApp;
