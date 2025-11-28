'use client';

import Link from 'next/link';
import { Col, Row, Space, message, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AntdButton, AntdCard, AntdTag, AntdLoading } from '@/components/common';
import { notificationApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import useUserAPI from '@/hooks/useUserAPI';

interface UserProfilePageProps {
  params: { id: string };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendRequestId =
    searchParams?.get('friend_request') &&
    !Number.isNaN(Number(searchParams.get('friend_request')))
      ? Number(searchParams.get('friend_request'))
      : undefined;

  const { user: currentUser } = useAuthStore();
  const userId = Number(params.id);

  const { useUser, useUserPosts, useUserStats } = useUserAPI();
  const { data: user, isLoading: isLoadingUser, error: userError } = useUser(userId);
  const { data: userPostsData, isLoading: isLoadingPosts } = useUserPosts(userId, { page: 1, per_page: 10 });
  const { data: userStats } = useUserStats(userId);

  // Extract data from API response - ensure userPosts is always an array
  const userPosts = Array.isArray(userPostsData?.data)
    ? userPostsData.data
    : Array.isArray(userPostsData)
    ? userPostsData
    : Array.isArray(userPostsData?.posts)
    ? userPostsData.posts
    : [];
  const stats = userStats?.data || userStats || {};

  const handleSuccess = (messageText: string) => {
    message.success(messageText);
    router.replace(`/users/${params.id}`);
  };

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!friendRequestId) {
        throw new Error('Missing friend request');
      }
      return notificationApi.respondFriendRequest(friendRequestId, 'accept');
    },
    onSuccess: () => handleSuccess('Đã chấp nhận lời mời kết bạn'),
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Không thể chấp nhận lời mời');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!friendRequestId) {
        throw new Error('Missing friend request');
      }
      return notificationApi.respondFriendRequest(friendRequestId, 'reject');
    },
    onSuccess: () => handleSuccess('Đã từ chối lời mời kết bạn'),
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Không thể từ chối lời mời');
    },
  });

  const isProcessing = acceptMutation.isPending || rejectMutation.isPending;

  if (isLoadingUser) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <AntdLoading />
        </div>
      </main>
    );
  }

  if (userError || !user) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <AntdCard>
          <div className="text-center py-8">
            <p className="text-lg text-slate-600">Không tìm thấy người dùng</p>
            <Link href="/posts">
              <AntdButton className="mt-4">Quay lại trang chủ</AntdButton>
            </Link>
          </div>
        </AntdCard>
      </main>
    );
  }

  // Extract user data from API response
  const userData = user?.data || user || {};
  const userName = userData.name || 'Người dùng';
  const userEmail = userData.email || '';
  const userImage = userData.image;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {friendRequestId && currentUser && (
        <AntdCard className="bg-blue-50/60 border border-blue-100">
          <div className="flex flex-col gap-3">
            <p className="text-base text-slate-700">
              <span className="font-semibold text-slate-900">{userName}</span> đã gửi cho bạn lời mời kết bạn.
            </p>
            <div className="flex flex-wrap gap-3">
              <AntdButton
                onClick={() => acceptMutation.mutate()}
                loading={acceptMutation.isPending}
                disabled={isProcessing}
              >
                Chấp nhận
              </AntdButton>
              <AntdButton
                variant="ghost"
                danger
                onClick={() => rejectMutation.mutate()}
                loading={rejectMutation.isPending}
                disabled={isProcessing}
              >
                Từ chối
              </AntdButton>
            </div>
          </div>
        </AntdCard>
      )}

      <AntdCard>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-slate-500">Tác giả</p>
            <h1 className="text-3xl font-semibold">{userName}</h1>
            <p className="text-slate-500">{userEmail}</p>
            <Space className="mt-4">
              <AntdButton variant="primary">Theo dõi</AntdButton>
              <AntdButton variant="ghost">Nhắn tin</AntdButton>
            </Space>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold">{stats.post_count || 0}</p>
              <p className="text-slate-500">Bài viết</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.follower_count || 0}</p>
              <p className="text-slate-500">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.following_count || 0}</p>
              <p className="text-slate-500">Đang theo dõi</p>
            </div>
          </div>
        </div>
      </AntdCard>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Bài viết gần đây</h2>
          <Link href="/posts">
            <AntdButton variant="ghost">Xem tất cả</AntdButton>
          </Link>
        </div>
        {isLoadingPosts ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : userPosts.length === 0 ? (
          <AntdCard>
            <div className="text-center py-8 text-slate-500">
              <p>Chưa có bài viết nào</p>
            </div>
          </AntdCard>
        ) : (
          <Row gutter={[24, 24]}>
            {userPosts.map((post: any) => (
              <Col key={post.id || post.blog_id} xs={24} md={12}>
                <AntdCard hoverable>
                  <Space direction="vertical" size="small">
                    <p className="text-xs text-slate-500">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString('vi-VN')
                        : post.blog_created_at
                        ? new Date(post.blog_created_at).toLocaleDateString('vi-VN')
                        : ''}
                      {post.reading_time && ` · ${post.reading_time} phút đọc`}
                    </p>
                    <Link
                      href={`/posts/${post.slug || post.id}`}
                      className="text-xl font-semibold text-slate-900"
                    >
                      {post.title || post.blog_title}
                    </Link>
                    <p className="text-slate-600">{post.excerpt || post.blog_excerpt || ''}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: any, index: number) => (
                          <AntdTag key={index}>{tag.name || tag}</AntdTag>
                        ))}
                      </div>
                    )}
                  </Space>
                </AntdCard>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </main>
  );
}

