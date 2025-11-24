import { commentApi, blogApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { withApiFallback } from '@/utils/apiFallback';
import { mockCommentsData } from '@/data/mock';

export default function useCommentAPI() {
  const queryClient = useQueryClient();

  const useComments = (postId: number, params?: { page?: number; per_page?: number; sort?: string }) => {
    return useQuery({
      queryKey: ['comments', postId, params],
      queryFn: async () => {
        return await withApiFallback(
          async () => {
            const res = await blogApi.getComments(postId, params);
            // Kiểm tra res.data có tồn tại không, nếu không thì throw error để fallback
            if (!res.data) {
              throw new Error('Comments not found');
            }
            return res.data;
          },
          mockCommentsData,
          `getComments(postId: ${postId})`
        );
      },
      enabled: !!postId && !isNaN(postId),
    });
  };

  const useCommentReplies = (postId: number, commentId: number, options?: { enabled?: boolean }) => {
    return useQuery({
      queryKey: ['comment-replies', postId, commentId],
      queryFn: async () => {
        const res = await blogApi.getCommentReplies(postId, commentId);
        return res.data;
      },
      enabled: options?.enabled !== false && !!postId && !!commentId,
    });
  };

  const useCreateComment = () => {
    return useMutation({
      mutationFn: async ({ postId, data }: { postId: number; data: { content: string } }) => {
        const res = await commentApi.createComment(postId, data);
        return res.data;
      },
      onSuccess: (_, variables) => {
        // Invalidate comments query to refetch
        queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      },
    });
  };

  const useCreateReply = () => {
    return useMutation({
      mutationFn: async ({
        postId,
        commentId,
        data,
      }: {
        postId: number;
        commentId: number;
        data: { content: string };
      }) => {
        const res = await commentApi.createReply(postId, commentId, data);
        return res.data;
      },
      onSuccess: (_, variables) => {
        // Invalidate comments and replies queries
        queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
        queryClient.invalidateQueries({ queryKey: ['comment-replies', variables.postId, variables.commentId] });
      },
    });
  };

  const useEditComment = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: { content: string } }) => {
        const res = await commentApi.editComment(id, data);
        return res.data;
      },
      onSuccess: () => {
        // Invalidate all comment queries
        queryClient.invalidateQueries({ queryKey: ['comments'] });
        queryClient.invalidateQueries({ queryKey: ['comment-replies'] });
      },
    });
  };

  const useDeleteComment = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const res = await commentApi.deleteComment(id);
        return res.data;
      },
      onSuccess: () => {
        // Invalidate all comment queries
        queryClient.invalidateQueries({ queryKey: ['comments'] });
        queryClient.invalidateQueries({ queryKey: ['comment-replies'] });
      },
    });
  };

  return {
    useComments,
    useCommentReplies,
    useCreateComment,
    useCreateReply,
    useEditComment,
    useDeleteComment,
  };
}

