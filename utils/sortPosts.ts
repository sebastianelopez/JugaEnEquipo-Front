import { Post } from "../interfaces/post";

/**
 * Sorts an array of posts by creation date in descending order (newest first)
 * @param posts - Array of posts to sort
 * @returns Sorted array of posts
 */
export const sortPostsByDate = (posts: Post[]): Post[] => {
  return posts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};