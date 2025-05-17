import React from "react";
import { mockPostData } from "./mocks/dataMocks";
import { PublicationCard } from "./PublicationCard";
import { Meta, StoryObj, StoryFn } from "@storybook/react";

export default {
  title: "Components/Organisms/Cards/PublicationCard",
  component: PublicationCard,
} as Meta;

const Template: StoryFn = (args) => (
  <PublicationCard id={""} body={""} username={""} createdAt={""} {...args} />
);

export const Default = Template.bind({});
Default.args = {
  id: mockPostData.id,
  body: mockPostData.body,
  createdAt: mockPostData.createdAt,
  username: mockPostData.username,
  resources: mockPostData.resources,
  sharedPost: mockPostData.sharedPost,
  urlProfileImage: mockPostData.urlProfileImage,
};

export const WithMultipleResources = Template.bind({});
WithMultipleResources.args = {
  ...Default.args,
  resources: [
    { url: "/images/image-placeholder.png" },
    { url: "/images/image-placeholder.png" },
    { url: "/images/image-placeholder.png" },
  ],
};

export const WithSingleResource = Template.bind({});
WithSingleResource.args = {
  ...Default.args,
  resources: [{ url: "/images/image-placeholder.png" }],
};

export const WithoutResources = Template.bind({});
WithoutResources.args = {
  ...Default.args,
  resources: [],
};

export const WithSharedPost = Template.bind({});
WithSharedPost.args = {
  ...Default.args,
  resources: [],
  sharedPost: {
    id: "1",
    body: "This is a shared post.",
    createdAt: "2023-10-01T12:00:00Z",
    username: "shareduser",
    resources: [
      { url: "/images/image-placeholder.png" },
      { url: "/images/image-placeholder.png" },
    ],
    urlProfileImage: "/images/user-placeholder.png",
  },
};
