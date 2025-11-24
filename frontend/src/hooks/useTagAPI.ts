import { tagApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { withApiFallback } from '@/utils/apiFallback';
import { mockTagsData } from '@/data/mock';

export default function useTagAPI() {

  const useTags = (params?: { page?: number; per_page?: number; search?: string }) => {
    return useQuery({
      queryKey: ['tags', params],
      queryFn: async () => {
        return await withApiFallback(
          async () => {
            const res = await tagApi.getTags(params);
            // Kiểm tra res.data có tồn tại không, nếu không thì throw error để fallback
            if (!res.data) {
              throw new Error('Tags not found');
            }
            return res.data;
          },
          mockTagsData,
          `getTags(${JSON.stringify(params)})`
        );
      },
    });
  };

  return {
    useTags,
  };
}

