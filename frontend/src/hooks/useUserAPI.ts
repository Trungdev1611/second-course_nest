import { friendshipApi, userApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function useUserAPI() {
  const useGetListFriends = (userId?: number) => {
    return useQuery({
      queryKey: ['friends', userId],
      queryFn: async () => {
        if (!userId) throw new Error('User ID is required');
        const res = await friendshipApi.getFriends(userId);
        // Backend trả về { status: "success", data: [...], meta: {...} }
        // res.data là ApiResponse object, res.data.data mới là actual data array
        return res.data?.data || res.data;
      },
      enabled: !!userId && !isNaN(userId),
    });
  };

  const useUser = (id: number) => {
    return useQuery({
      queryKey: ['user', id],
      queryFn: async () => {
        const res = await userApi.getUser(id);
        return res.data;
      },
      enabled: !!id && !isNaN(id),
    });
  };

  const useUserPosts = (id: number, params?: { page?: number; per_page?: number }) => {
    return useQuery({
      queryKey: ['user-posts', id, params],
      queryFn: async () => {
        const res = await userApi.getUserPosts(id, params);
        return res.data;
      },
      enabled: !!id && !isNaN(id),
    });
  };

  const useUserStats = (id: number) => {
    return useQuery({
      queryKey: ['user-stats', id],
      queryFn: async () => {
        const res = await userApi.getStats(id);
        return res.data;
      },
      enabled: !!id && !isNaN(id),
    });
  };

  const useFollowers = (id: number, params?: { page?: number; per_page?: number }) => {
    return useQuery({
      queryKey: ['followers', id, params],
      queryFn: async () => {
        const res = await userApi.getFollowers(id, params);
        return res.data;
      },
      enabled: !!id && !isNaN(id),
    });
  };

  const useFollowings = (id: number, params?: { page?: number; per_page?: number }) => {
    return useQuery({
      queryKey: ['followings', id, params],
      queryFn: async () => {
        const res = await userApi.getFollowings(id, params);
        return res.data;
      },
      enabled: !!id && !isNaN(id),
    });
  };

  return {
    useGetListFriends,
    useUser,
    useUserPosts,
    useUserStats,
    useFollowers,
    useFollowings,
  };
}

