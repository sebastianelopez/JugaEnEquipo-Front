import "../styles/globals.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import type { AppProps } from "next/app";
import { UiProvider } from "../context";
import { UiContext } from "../context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "../themes";
import { NextIntlClientProvider } from "next-intl";

import type { NextPageContext } from "next";
import { useRouter } from "next/router";
import { UserProvider } from "../context/user";
import { PostProvider } from "../context/post";
import { FeedbackProvider } from "../context/feedback";

type CustomAppProps = AppProps & {
  pageProps: NextPageContext & { messages?: {} };
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  return (
    <UiProvider>
      <ThemeProviderSelector>
        <FeedbackProvider>
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
        </FeedbackProvider>
      </ThemeProviderSelector>
    </UiProvider>
  );
}

export default MyApp;

// Local helper to choose theme based on context
import { PropsWithChildren, useContext, useEffect } from "react";

function ThemeProviderSelector({ children }: PropsWithChildren) {
  const { themeMode } = useContext(UiContext);
  const theme = themeMode === "dark" ? darkTheme : lightTheme;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
