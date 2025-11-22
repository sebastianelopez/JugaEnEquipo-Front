import { Comment } from "../interfaces/comment";
import { Post } from "../interfaces/post";
import { api } from "../lib/api";
import { getToken } from "./auth.service";
import { buildQ } from "../utils/buildQ";

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
    lastVisiblePost: Post | null,
    limit: number = 10
  ): Promise<{ hasNewPosts: boolean; count: number; posts: Post[] }> => {
    try {
      const result = await postService.getMyFeed({ limit, offset: 0 });
      
      if (result.error || !result.data) {
        return {
          hasNewPosts: false,
          count: 0,
          posts: [],
        };
      }

      const posts = result.data;
      
      if (!lastVisiblePost) {
        return {
          hasNewPosts: posts.length > 0,
          count: posts.length,
          posts: posts,
        };
      }

      const lastVisibleTimestamp = new Date(lastVisiblePost.createdAt).getTime();
      
      const newPosts = posts.filter(post => {
        const postTimestamp = new Date(post.createdAt).getTime();
        return postTimestamp > lastVisibleTimestamp;
      });

      return {
        hasNewPosts: newPosts.length > 0,
        count: newPosts.length,
        posts: newPosts,
      };
    } catch (error) {
      console.error("Error checking for new posts:", error);
    return {
      hasNewPosts: false,
      count: 0,
      posts: [],
    };
    }
  },

  searchPosts: (query: string) =>
    api.get<Post[]>(`/posts`, {
      params: { q: query },
    }),

  getPostsByUsername: async (username: string): Promise<Result<Post[]>> => {
    try {
      const res = await api.get<PostResponse>(`/posts`, {
        username: `${username}`,
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

  getMyFeed: async (
    params: { limit?: number; offset?: number } = {}
  ): Promise<Result<Post[]>> => {
    try {
      const token = await getToken();
      const q = buildQ(params);
      const res = await api.get<PostResponse>(
        `/my-feed`,
        q ? { q } : undefined,
        token
      );
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

  /**
   * Search popular hashtags
   * GET /api/post/hashtag/popular
   */
  getPopularHashtags: async (): Promise<Result<string[]>> => {
    try {
      const token = await getToken();
      const res = await api.get<{ data: string[] } | string[]>(
        `/post/hashtag/popular`,
        {},
        token
      );
      const hashtags = Array.isArray(res) ? res : res.data || [];
      return { data: hashtags, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      const status = error?.response?.status;
      console.error("getPopularHashtags - API error:", { message, status });
      return { data: null, error: { message, status } };
    }
  },

  /**
   * Search posts by popular hashtag
   * GET /api/posts/popular/hashtag/:hashtag
   */
  getPostsByHashtag: async (hashtag: string): Promise<Result<Post[]>> => {
    try {
      const token = await getToken();
      const res = await api.get<PostResponse>(
        `/posts/popular/hashtag/${encodeURIComponent(hashtag)}`,
        {},
        token
      );
      const posts = Array.isArray(res.data) ? res.data : [res.data];
      return { data: posts, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      const status = error?.response?.status;
      console.error("getPostsByHashtag - API error:", { message, status });
      return { data: null, error: { message, status } };
    }
  },
};
