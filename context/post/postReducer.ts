import { PostState } from ".";

type PostType =
  | {
      type: "[Post] - set post id";
      payload: string;
    }
  | {
      type: "[Post] - remove post id";
    };

export const postReducer = (state: PostState, action: PostType): PostState => {
  switch (action.type) {
    case "[Post] - set post id":
      return {
        ...state,
        postId: action.payload,
      };

    case "[Post] - remove post id":
      return {
        ...state,
        postId: undefined,
      };

    default:
      return state;
  }
};
