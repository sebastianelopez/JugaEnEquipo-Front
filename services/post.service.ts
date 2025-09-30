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

type Result<T> = {
  data: T | null;
  error: { message: string; status?: number } | null;
};

interface CommentResponse {
  data: Comment | Comment[];
}

export const postService = {
  createPost: async (
    postId: string,
    postData: {
      body: string;
      resources?: string[];
      sharedPostId?: string | null;
    }
  ) => {
    try {
      const result = await api.put<PostResponse>(`/post/${postId}`, postData);
      return result;
    } catch (error) {
      console.error("❌ createPost - Error:", error);
      throw error;
    }
  },

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

    // Log FormData contents (using Array.from for compatibility)
    const formDataEntries = Array.from(formData.entries());
    formDataEntries.forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(
          `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    try {
      const result = await api.post<Resource>(
        `/post/${postId}/resource`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result;
    } catch (error) {
      console.error("❌ addResource - Error:", error);
      throw error;
    }
  },

  likePost: async (postId: string) =>
    await api.put<void>(`/post/${postId}/like`),

  dislikePost: async (postId: string) =>
    await api.put<void>(`/post/${postId}/dislike`),

  deletePost: async (postId: string) =>
    await api.delete<void>(`/post/${postId}/delete`),

  getPostById: async (postId: string, serverToken?: string) => {
    try {
      const token =
        typeof window === "undefined" ? serverToken : await getToken();
      const response = await api.get<PostResponse>(
        `/post/${postId}`,
        {},
        token
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching post:", (error as Error).message);
      return null;
    }
  },

  checkForNewPosts: async (
    lastTimestamp: number
  ): Promise<{ hasNewPosts: boolean; count: number; posts: Post[] }> => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: generar nuevos posts aleatorios
    const shouldHaveNewPosts = Math.random() > 0.7; // 30% de probabilidad

    if (shouldHaveNewPosts) {
      const newPostsCount = Math.floor(Math.random() * 3) + 1; // 1-3 nuevos posts
      const mockNewPosts: Post[] = Array.from(
        { length: newPostsCount },
        (_, index) => ({
          id: `new-${Date.now()}-${index}`,
          body: `Nuevo post ${index + 1} - ${new Date().toLocaleString()}`,
          username: `user${Math.floor(Math.random() * 100)}`,
          createdAt: new Date().toISOString(),
          likesQuantity: Math.floor(Math.random() * 50),
          sharesQuantity: Math.floor(Math.random() * 10),
          commentsQuantity: Math.floor(Math.random() * 20),
          urlProfileImage: `https://picsum.photos/40/40?random=${index}`,
          resources: [],
          sharedPost: null,
        })
      );

      return {
        hasNewPosts: true,
        count: newPostsCount,
        posts: mockNewPosts,
      };
    }

    return {
      hasNewPosts: false,
      count: 0,
      posts: [],
    };
  },

  searchPosts: (query: string) =>
    api.get<Post[]>(`/posts`, {
      params: { q: query },
    }),

  getPostsByUsername: async (username: string): Promise<Result<Post[]>> => {
    try {
      const res = await api.get<PostResponse>(`/posts`, {
        q: `username:${username}`,
      });
      const posts = Array.isArray(res.data) ? res.data : [res.data];
      return { data: posts, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      const status = error?.response?.status;
      console.error("getPostsByUsername - API error:", { message, status });
      return { data: null, error: { message, status } };
    }
  },

  addComment: async (
    postId: string,
    commentData: { commentId: string; commentBody: string }
  ) => await api.put<Comment>(`/post/${postId}/comment`, commentData),

  getPostComments: async (postId: string) =>
    (await api.get<CommentResponse>(`/post/${postId}/comments`)).data,

  getMyFeed: async (): Promise<Result<Post[]>> => {
    try {
      const token = await getToken();
      const res = await api.get<PostResponse>(`/my-feed`, {}, token);
      const posts = Array.isArray(res.data) ? res.data : [res.data];
      return { data: posts, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      const status = error?.response?.status;
      console.error("getMyFeed - API error:", { message, status });
      return { data: null, error: { message, status } };
    }
  },
};
