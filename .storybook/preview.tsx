import type { Preview } from "@storybook/react";
import React from "react";
import { UserContext } from "../context/user";
import { PostContext } from "../context/post";
import { NextIntlClientProvider } from "next-intl";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const userMock = {
  username: "testUser",
  setUser: () => {},
  removeUser: () => {},
};

const postContextValue = {
  setPostId: () => {},
  removePostId: () => {},
};

const withProviders = (Story) => {
  return (
    <NextIntlClientProvider locale="en">
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
  decorators: [withProviders],
};

export default preview;
