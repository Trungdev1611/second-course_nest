import { notificationApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatSocket } from '@/app/chat/ChatSocketProvider';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface Notification {
  id: number;
  content: string;
  type: 'normal' | 'request_friend' | 'accept_friend';
  userId: number;
  isRead: boolean;
  requesterId?: number;
  status?: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export function useNotifications(onFriendRequest?: (payload: {
  id: number;
  requesterId: number;
  requesterName: string;
  requesterAvatar?: string;
  targetUserId: number;
  content: string;
  type: string;
  timestamp: string;
}) => void) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useChatSocket();
  const user = useAuthStore((state) => state.user);
  const isVerified = user?.is_verify_email === true;

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getNotifications();
      return (res.data?.data || res.data || []) as Notification[];
    },
    refetchOnWindowFocus: true,
    enabled: isVerified, 
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => 
      notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Listen for new friend requests via socket
  useEffect(() => {
    if (!socket || !isConnected || !isVerified) return;

    const handleFriendRequest = (payload: {
      id: number;
      requesterId: number;
      requesterName: string;
      requesterAvatar?: string;
      targetUserId: number;
      content: string;
      type: string;
      timestamp: string;
    }) => {
      console.log('📨 Friend request received:', payload);
      
      // Invalidate queries to refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      // Call callback if provided (for showing toast, etc.)
      if (onFriendRequest) {
        onFriendRequest(payload);
      }
      
      // Optional: Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Yêu cầu kết bạn mới', {
          body: payload.content,
          icon: payload.requesterAvatar,
        });
      }
    };

    socket.on('friendRequest', handleFriendRequest);

    return () => {
      socket.off('friendRequest', handleFriendRequest);
    };
  }, [socket, isConnected, queryClient, onFriendRequest]);

  const notifications = notificationsData || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}

