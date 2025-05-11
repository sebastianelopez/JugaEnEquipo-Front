import { Comment } from "../interfaces/comment";
import { Post } from "../interfaces/post";
import { api } from "../lib/api";
import { getToken } from "./auth.service";

interface Resource {
  id: string;
  type: string;
}

interface PostResponse {
  data: Post | Post[];
}

export const postService = {
  createPost: async (
    postId: string,
    postData: {
      body: string;
      resources?: string[];
      sharedPostId?: string | null;
    }
  ) => await api.put<PostResponse>(`/post/${postId}`, postData),

  addResource: async (
    postId: string,
    resourceData: {
      id?: string;
      resource: File;
      type: string;
    }
  ) => {
    const formData = new FormData();
    if (resourceData.id) {
      formData.append("id", resourceData.id);
    }
    formData.append("resource", resourceData.resource);
    formData.append("type", resourceData.type);

    return await api.post<Resource>(`/post/${postId}/resource`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  likePost: async (postId: string) =>
    await api.put<void>(`/post/${postId}/like`),

  dislikePost: async (postId: string) =>
    await api.put<void>(`/post/${postId}/dislike`),

  deletePost: async (postId: string) =>
    await api.delete<void>(`/post/${postId}/delete`),

  getPostById: async (postId: string) =>
    (await api.get<PostResponse>(`/post/${postId}`)).data,

  searchPosts: (query: string) =>
    api.get<Post[]>(`/posts`, {
      params: { q: query },
    }),

  addComment: async (postId: string, commentData: Comment) =>
    await api.put<Comment>(`/post/${postId}/comment`, commentData),

  getPostComments: async (postId: string) =>
    await api.get<Comment[]>(`/post/${postId}/comments`),

  getMyFeed: async () => {
    const token = await getToken();
    return (await api.get<PostResponse>(`/my-feed`, {}, token)).data;
  },
};
