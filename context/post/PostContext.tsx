import { createContext } from "react";

interface ContextProps {
  postId?: string;
  setPostId: (postId: string) => void;
  removePostId: () => void;
}

export const PostContext = createContext({} as ContextProps);
