import React from "react";
import { SelectCountry } from "./SelectCountry";
import { StoryFn } from "@storybook/react/*";

export default {
  title: "Components/Molecules/SelectCountry",
  component: SelectCountry,
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
