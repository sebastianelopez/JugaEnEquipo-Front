import type { Preview } from "@storybook/react";
import React from "react";
import { UserContext } from "../context/user";
import { PostContext } from "../context/post";
import { NextIntlClientProvider } from "next-intl";

// Mock values for your contexts
const userMock = {
  username: "testUser",
  setUser: () => {},
  removeUser: () => {},
  // Add other user properties as needed
};

const postContextValue = {
  setPostId: () => {},
  removePostId: () => {},
};

// Global decorator that wraps all stories with your providers
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
