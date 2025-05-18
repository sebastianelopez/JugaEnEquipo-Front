import type { Preview } from "@storybook/react";
import React from "react";
import { UserContext } from "../context/user";
import { PostContext } from "../context/post";
import { NextIntlClientProvider } from "next-intl";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import enMessages from "../lang/en.json";
import esMessages from "../lang/es.json";
import ptMessages from "../lang/pt.json";

const messages = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages,
};

const userMock = {
  username: "testUser",
  setUser: () => {},
  removeUser: () => {},
};

const postContextValue = {
  setPostId: () => {},
  removePostId: () => {},
};

const withProviders = (Story, context) => {
  const locale = context.globals.locale || "en";
  return (
    <NextIntlClientProvider locale="en" messages={messages[locale]}>
      <UserContext.Provider value={userMock}>
        <PostContext.Provider value={postContextValue}>
          <Story />
        </PostContext.Provider>
      </UserContext.Provider>
    </NextIntlClientProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    locale: {
      name: 'Language',
      description: 'App language',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English', right: '🇺🇸' },
          { value: 'es', title: 'Español', right: '🇦🇷' },
          { value: 'pt', title: 'Português', right: '🇧🇷' },
        ],
      },
    },
  },
  decorators: [withProviders],
};

export default preview;
