import { authApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

export default function useAuthAPI() {
  const queryClient = useQueryClient();
  const { setUser, setToken, logout } = useAuthStore();

  const useLogin = () => {
    return useMutation({
      mutationFn: async (data: { email: string; password: string }) => {
        const res = await authApi.login(data);
        return res.data.data || res.data;
      },
      onSuccess: (data: any) => {
        setUser(data);
        if (data?.token) {
          setToken(data.token);
        } else if (data?.access_token) {
          setToken(data.access_token);
        }
        // Invalidate user queries
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      },
    });
  };

  const useRegister = () => {
    return useMutation({
      mutationFn: async (data: { name: string; email: string; password: string }) => {
        const res = await authApi.register(data);
        return res.data.data || res.data;
      },
    });
  };

  const useGetMe = () => {
    return useQuery({
      queryKey: ['auth', 'me'],
      queryFn: async () => {
        const res = await authApi.getMe();
        return res.data.data || res.data;
      },
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const useForgotPassword = () => {
    return useMutation({
      mutationFn: async (data: { email: string }) => {
        const res = await authApi.forgotPassword(data);
        return res.data;
      },
    });
  };

  const useResetPassword = () => {
    return useMutation({
      mutationFn: async ({ data, token }: { data: { email: string; password: string }; token: string }) => {
        const res = await authApi.resetPassword(data, token);
        return res.data;
      },
    });
  };

  const useVerifyEmail = () => {
    return useMutation({
      mutationFn: async (token: string) => {
        const res = await authApi.verifyEmail(token);
        return res.data;
      },
    });
  };

  const useSendVerificationEmail = () => {
    return useMutation({
      mutationFn: async (data: { email: string }) => {
        const res = await authApi.sendVerificationEmail(data);
        return res.data;
      },
    });
  };

  const useChangePassword = () => {
    return useMutation({
      mutationFn: async (data: { email: string; password: string; new_password: string }) => {
        const res = await authApi.changePassword(data);
        return res.data;
      },
    });
  };

  const useLogout = () => {
    return useMutation({
      mutationFn: async () => {
        logout();
        queryClient.clear();
        // Không redirect, để user tự quyết định đi đâu
        // ProtectedRoute sẽ tự động show login khi user vào route cần token
      },
    });
  };

  return {
    useLogin,
    useRegister,
    useGetMe,
    useForgotPassword,
    useResetPassword,
    useVerifyEmail,
    useSendVerificationEmail,
    useChangePassword,
    useLogout,
  };
}

