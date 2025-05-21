import { Resource } from "./resource";

export interface Post {
  id: string;
  body: string;
  username: string;
  resources?: Resource[];
  createdAt: string;
  urlProfileImage?: string | null;
  sharedPost?: Post | null;
  likesQuantity: number;
  sharesQuantity: number;
  commentsQuantity: number;
}
