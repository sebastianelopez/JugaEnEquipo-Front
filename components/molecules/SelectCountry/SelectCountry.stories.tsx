import React from "react";
import { SelectCountry } from "./SelectCountry";
import { StoryFn } from "@storybook/react/*";
import { NextIntlClientProvider } from "next-intl";

const mockMessages = {
  Global: {
    selectLanguage: "Select language",
    spanish: "Spanish",
    english: "English",
    portuguese: "Portuguese",
  },
};

const withNextIntl = (Story: StoryFn) => (
  <NextIntlClientProvider locale="en" messages={mockMessages}>
    <Story />
  </NextIntlClientProvider>
);

export default {
  title: "Components/Molecules/SelectCountry",
  component: SelectCountry,
  decorators: [withNextIntl],
};

const Template: StoryFn = (args) => <SelectCountry {...args} />;

export const Default = Template.bind({});
Default.args = {
  fullWidth: false,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
};
