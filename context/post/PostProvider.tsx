import { FC, PropsWithChildren, useEffect, useReducer } from "react";
import { PostContext, postReducer } from ".";

export interface PostState {
  postId?: string;
}

const POST_INITIAL_STATE: PostState = {
  postId: undefined,
};

export const PostProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, POST_INITIAL_STATE);

  const setPostId = (postId: string) => {
    dispatch({ type: "[Post] - set post id", payload: postId });
  };

  const removePostId = () => {
    dispatch({ type: "[Post] - remove post id" });
  };

  return (
    <PostContext.Provider
      value={{
        ...state,

        //Methods
        setPostId,
        removePostId,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
