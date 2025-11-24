import { blogApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { withApiFallback } from '@/utils/apiFallback';
import { mockPostsData, mockPostDetail, mockRelatedPosts } from '@/data/mock';

export default function usePostAPI() {
  const queryClient = useQueryClient();

  const usePosts = (params?: { page?: number; per_page?: number; search?: string; type?: string }) => {
    return useQuery({
      queryKey: ['posts', params],
      queryFn: async () => {
        return await withApiFallback(
          async () => {
            const res = await blogApi.getPosts(params);
            // Kiểm tra res.data có tồn tại không, nếu không thì throw error để fallback
            if (!res.data) {
              throw new Error('Posts not found');
            }
            console.log(`resssss`, res.data)
            return res.data;
          },
          mockPostsData,
          `getPosts(${JSON.stringify(params)})`
        );
      },
    });
  };

  const usePostDetail = (id: number) => {
    return useQuery({
      queryKey: ['postdetail', id],
      queryFn: async () => {
        return await withApiFallback(
          async () => {
            const res = await blogApi.getPostById(id);
            // Kiểm tra res.data có tồn tại không, nếu không thì throw error để fallback
            if (!res.data) {
              throw new Error('Post not found');
            }
            console.log(`resssss`, res.data)

            return res.data;
          },
          mockPostDetail,
          `getPostById(${id})`
        );
      },
      enabled: !!id && !isNaN(id),
    });
  };

  const useCreatePost = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        const res = await blogApi.createPost(data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  const useLikePost = () => {
    return useMutation({
      mutationFn: async ({ id, type }: { id: number; type?: 'post' | 'comment' }) => {
        const res = await blogApi.likePost(id, type || 'post');
        return res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['postdetail', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  const useRelatedPosts = (id: number) => {
    return useQuery({
      queryKey: ['related-posts', id],
      queryFn: async () => {
        return await withApiFallback(
          async () => {
            const res = await blogApi.getRelatedPosts(id);
            // Kiểm tra res.data có tồn tại không, nếu không thì throw error để fallback
            if (!res.data) {
              throw new Error('Related posts not found');
            }
            return res.data;
          },
          mockRelatedPosts,
          `getRelatedPosts(${id})`
        );
      },
      enabled: !!id && !isNaN(id),
    });
  };

  const useIncrementView = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await blogApi.incrementView(id);
        return res.data;
      },
    });
  };

  // ===== Hàm force refetch từ component =====
  const forceRefetchPosts = (params?: { page?: number; per_page?: number; search?: string; type?: string }) => {
    queryClient.invalidateQueries({ queryKey: ['posts', params] });
  };

  const forceRefetchPostDetail = (id: number) => {
    queryClient.invalidateQueries({ queryKey: ['postdetail', id] });
  };

  return {
    usePosts,
    usePostDetail,
    useCreatePost,
    useLikePost,
    useRelatedPosts,
    useIncrementView,
    forceRefetchPosts,
    forceRefetchPostDetail,
  };
}
