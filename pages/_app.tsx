import "../styles/globals.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import type { AppProps, AppContext } from "next/app";
import App from "next/app";
import { UiProvider } from "../context";
import { UiContext } from "../context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "../themes";
import { NextIntlClientProvider } from "next-intl";
import { parseCookies } from "../utils/cookies";

import type { NextPageContext } from "next";
import { useRouter } from "next/router";
import { UserProvider } from "../context/user";
import { PostProvider } from "../context/post";
import { FeedbackProvider } from "../context/feedback";
import { NotificationProvider } from "../context/notification";
import { NotificationPopup } from "../components/atoms/NotificationPopup";

type CustomAppProps = AppProps & {
  pageProps: NextPageContext & { messages?: {} };
  initialTheme: "light" | "dark";
};

function MyApp({ Component, pageProps, initialTheme }: CustomAppProps) {
  const router = useRouter();
  return (
    <UiProvider initialTheme={initialTheme}>
      <ThemeProviderSelector>
        <FeedbackProvider>
          <UserProvider>
            <PostProvider>
              <NotificationProvider>
                <NextIntlClientProvider
                  messages={pageProps.messages}
                  locale={router.locale}
                >
                  <CssBaseline />
                  <Component {...pageProps} />
                  <NotificationPopup />
                </NextIntlClientProvider>
              </NotificationProvider>
            </PostProvider>
          </UserProvider>
        </FeedbackProvider>
      </ThemeProviderSelector>
    </UiProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  // Get theme from cookies on the server side
  const cookies = parseCookies(appContext.ctx.req?.headers.cookie);
  const initialTheme = cookies.themeMode === "dark" ? "dark" : "light";

  return {
    ...appProps,
    initialTheme,
  };
};

export default MyApp;

// Local helper to choose theme based on context
import { PropsWithChildren, useContext } from "react";

function ThemeProviderSelector({ children }: PropsWithChildren) {
  const { themeMode } = useContext(UiContext);
  const theme = themeMode === "dark" ? darkTheme : lightTheme;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
