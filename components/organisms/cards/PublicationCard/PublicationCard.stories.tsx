import React from "react";
import { mockPostData } from "./mocks/dataMocks";
import { PublicationCard } from "./PublicationCard";
import { Meta, StoryObj, StoryFn } from "@storybook/react";

export default {
  title: "Components/Organisms/Cards/PublicationCard",
  component: PublicationCard,
} as Meta;

const Template: StoryFn = (args) => (
  <PublicationCard
    id={""}
    body={""}
    username={""}
    createdAt={""}
    resources={[]}
    sharedPost={null}
    urlProfileImage={null}
    commentsQuantity={0}
    likesQuantity={0}
    sharesQuantity={0}
    hasLiked={false}
    hasShared={false}
    {...args}
  />
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
  likesQuantity: mockPostData.likesQuantity,
  sharesQuantity: mockPostData.sharesQuantity,
  commentsQuantity: mockPostData.commentsQuantity,
  hasLiked: mockPostData.hasLiked,
  hasShared: mockPostData.hasShared,
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
    sharedPost: null,
    urlProfileImage: "/images/user-placeholder.png",
    likesQuantity: 0,
    sharesQuantity: 0,
    commentsQuantity: 0,
    hasLiked: false,
    hasShared: false,
  },
};
