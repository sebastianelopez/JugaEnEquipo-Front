import { Resource } from "./resource";

export interface Post {
  id: string;
  body: string;
  username: string;
  resources?: Resource[];
  createdAt: string;
  urlProfileImage?: string | null;
  sharedPost?: string | null;
}
