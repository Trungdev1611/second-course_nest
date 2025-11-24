'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute - Component để bảo vệ routes cần authentication
 * 
 * Sử dụng:
 * <ProtectedRoute>
 *   <YourProtectedPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Nếu route cần auth nhưng chưa đăng nhập
    if (requireAuth && !isAuthenticated && !token) {
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [isAuthenticated, token, requireAuth, redirectTo, pathname, router]);

  // Hiển thị loading trong khi check auth
  if (requireAuth && !isAuthenticated && !token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}

