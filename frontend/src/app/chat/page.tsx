'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Badge, List, Spin } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  SearchOutlined,
  PictureOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { AntdAvatar } from '@/components/common';
import { useAuthStore } from '@/store/authStore';
import useUserAPI from '@/hooks/useUserAPI';
import { useChatSocket } from './ChatSocketProvider';
import { chatApi } from '@/lib/api';

const HISTORY_PAGE_SIZE = 5;

const generateMessageKey = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

interface ChatMessage {
  id: string;
  remoteId?: number;
  messageKey?: string;
  content: string;
  timestamp: string;
  createdAt?: string;
  senderId: string;
  senderName: string;
  fromMe: boolean;
  imageUrl?: string;
  avatar?: string;
  pending?: boolean;
}

interface Participant {
  id: string;
  name: string;
  online?: boolean;
  avatar?: string;
  conversationId?: number;
}

interface ChatWindowData {
  id: string;
  conversationKey: string;
  conversationNumericId?: number;
  title: string;
  participants: Participant[];
  messages: ChatMessage[];
  minimized: boolean;
  unreadCount: number;
  historyPage: number;
  hasMoreHistory: boolean;
  isHistoryLoading: boolean;
  totalPages?: number;
  maxPageLoaded: number;
}

interface ChatWindowProps {
  window: ChatWindowData;
  currentUserId: string;
  onSendMessage: (windowId: string, content: string, imageUrl?: string) => void;
  onMinimize: (windowId: string) => void;
  onClose: (windowId: string) => void;
  onLoadMoreHistory?: () => Promise<void>;
}

function ChatWindow({
  window,
  currentUserId,
  onSendMessage,
  onMinimize,
  onClose,
  onLoadMoreHistory,
}: ChatWindowProps) {
  const [draft, setDraft] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAutoLoadingHistory, setIsAutoLoadingHistory] = useState(false);
  const lastScrollTopRef = useRef(0);

  const handleSend = () => {
    if (!draft.trim() && !selectedImage) return;
    onSendMessage(window.id, draft.trim(), selectedImage || undefined);
    setDraft('');
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(url);
    event.target.value = '';
  };

  const removeSelectedImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  const handleHistoryScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (
      !onLoadMoreHistory ||
      !window.hasMoreHistory ||
      window.historyPage === 0 ||
      window.isHistoryLoading ||
      isAutoLoadingHistory
    ) {
      return;
    }

    const container = event.currentTarget;
    const previousScrollTop = lastScrollTopRef.current;
    const currentScrollTop = container.scrollTop;
    
    lastScrollTopRef.current = currentScrollTop;

    const isScrollingUp = currentScrollTop < previousScrollTop;
    if (!isScrollingUp || currentScrollTop > 40) {
      return;
    }

    // Chỉ load nếu chưa vượt quá totalPages
    const nextPage = window.historyPage + 1;
    if (
      window.totalPages !== undefined &&
      nextPage > window.totalPages
    ) {
      return;
    }

    // Chỉ load nếu chưa load page này
    if (nextPage <= window.maxPageLoaded) {
      return;
    }

    const previousScrollHeight = container.scrollHeight;
    setIsAutoLoadingHistory(true);
    try {
      await onLoadMoreHistory();
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          messagesContainerRef.current.scrollTop =
            newScrollHeight - previousScrollHeight + currentScrollTop;
        }
      });
    } finally {
      setIsAutoLoadingHistory(false);
    }
  };

  return (
    <div className="w-[320px] h-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{window.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {window.participants
              .filter((p) => p.id !== currentUserId)
              .map((p) => p.name)
              .join(', ') || 'Không có người tham gia'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="small"
            type="text"
            icon={<MinusOutlined />}
            onClick={() => onMinimize(window.id)}
          />
          <Button
            size="small"
            type="text"
            icon={<CloseOutlined />}
            onClick={() => onClose(window.id)}
          />
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50 dark:bg-slate-950/40"
        onScroll={handleHistoryScroll}
      >
        {(window.isHistoryLoading || isAutoLoadingHistory) && window.hasMoreHistory && (
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-1">
            Đang tải tin nhắn cũ...
          </div>
        )}
        {window.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
            <UserOutlined className="text-3xl mb-2" />
            <p className="text-sm">Bắt đầu cuộc trò chuyện với {window.title}</p>
          </div>
        ) : (
          window.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                message.fromMe
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
              } ${message.pending ? 'opacity-70' : ''}`}
              >
                {!message.fromMe && (
                  <p className="text-xs font-semibold mb-1">{message.senderName}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={message.imageUrl}
                      alt="Attachment"
                      className="max-w-full rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}
                <p
                  className={`text-[11px] mt-1 ${
                    message.fromMe ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 px-3 py-2 space-y-2 bg-white dark:bg-slate-900 rounded-b-2xl">
        {selectedImage && (
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Ảnh đính kèm</span>
            </div>
            <Button type="text" icon={<DeleteOutlined />} onClick={removeSelectedImage} />
          </div>
        )}
        <div className="flex items-start gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            icon={<PictureOutlined />}
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
          >
            Ảnh
          </Button>
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="Nhập tin nhắn..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <Button
          type="primary"
          block
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!draft.trim() && !selectedImage}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuthStore();
  const { useGetListFriends } = useUserAPI();
  const { socket, isConnected } = useChatSocket();
  
  // Fetch danh sách bạn bè từ API
  const { data: friendsData, isLoading: isLoadingFriends } = useGetListFriends(user?.id);
  
  // Map data từ API sang format Participant
  // Data structure: [{ id, name, friends: [{ id, name, image, ... }, ...] }]
  const friends: Participant[] = useMemo(() => {
    if (!friendsData) {
      return [];
    }
    
    // Backend trả về array với 1 phần tử là User object có property friends
    // Ví dụ: [{ id: 3, name: "user-test", friends: [{ id: 7, name: "user-test3", ... }, ...] }]
    let friendsArray: any[] = [];
    
    if (Array.isArray(friendsData) && friendsData.length > 0) {
      // Lấy phần tử đầu tiên (User object) và lấy friends array từ đó
      const userWithFriends = friendsData[0];
      friendsArray = userWithFriends?.friends || [];
    } else if (friendsData && typeof friendsData === 'object' && !Array.isArray(friendsData)) {
      // Fallback: nếu là object trực tiếp, lấy property friends
      friendsArray = (friendsData as any).friends || [];
    }
    
    return friendsArray.map((friend: any) => ({
      id: friend.id?.toString() || '',
      name: friend.name || 'Unknown',
      online: false, // TODO: Implement online status nếu có
      avatar: friend.image || undefined,
      conversationId:
        typeof friend.conversation_id === 'number'
          ? friend.conversation_id
          : typeof friend.conversationId === 'number'
          ? friend.conversationId
          : undefined,
    }));
  }, [friendsData]);

  const currentUser = useMemo(() => ({ 
    id: user?.id?.toString() || 'me', 
    name: user?.name || 'Bạn' 
  }), [user]);
  
  const [chatWindows, setChatWindows] = useState<ChatWindowData[]>([]);
  const chatWindowsRef = useRef<ChatWindowData[]>([]);
  useEffect(() => {
    chatWindowsRef.current = chatWindows;
  }, [chatWindows]);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedRooms, setJoinedRooms] = useState<Set<string>>(new Set()); // Track các rooms đã join

  // Utility function: Tạo conversation key từ 2 user IDs (sort tăng dần)
  const generateConversationKey = (userId1: string, userId2: string): string => {
    const ids = [userId1, userId2].sort((a, b) => {
      // Sort theo số nếu là số, nếu không thì sort theo string
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
    return `conv_${ids[0]}_${ids[1]}`;
  };

  const mapServerMessage = (item: any): ChatMessage => {
    const senderId = item?.user_id ? item.user_id.toString() : '';
    return {
      id: `server-${item?.id ?? generateMessageKey()}`,
      remoteId: typeof item?.id === 'number' ? item.id : undefined,
      messageKey: item?.message_key || (item?.id ? `server-${item.id}` : undefined),
      content: item?.content ?? '',
      timestamp: item?.created_at ? dayjs(item.created_at).format('HH:mm') : '',
      createdAt: item?.created_at,
      senderId,
      senderName: item?.username || 'Unknown',
      fromMe: senderId === currentUser.id,
      avatar: item?.avatar,
      pending: false,
    };
  };

  // Join room với conversation ID
  const joinConversationRoom = (conversationKey: string, friendName: string) => {
    if (joinedRooms.has(conversationKey)) {
      return;
    }

    if (socket && isConnected) {
      console.log('[Socket Event] 📡 Emit: joinRoom', { conversationId: conversationKey, friendName });
      socket.emit('joinRoom', conversationKey);
      setJoinedRooms((prev) => {
        const next = new Set(prev);
        next.add(conversationKey);
        return next;
      });
    }
  };

  // Khi socket reconnect, join lại các rooms
  useEffect(() => {
    if (!socket || !isConnected || joinedRooms.size === 0) {
      return;
    }

    console.log('[Socket Event] 🔄 Rejoining rooms after reconnect', { rooms: Array.from(joinedRooms) });
    joinedRooms.forEach((roomId) => {
      socket.emit('joinRoom', roomId);
    });
  }, [socket, isConnected, joinedRooms]);

  const loadConversationHistory = useCallback(
    async (
      windowId: string,
      options?: { initial?: boolean; conversationIdOverride?: number },
    ) => {
      const targetWindow = chatWindowsRef.current.find((w) => w.id === windowId);
      const initialConversationNumericId =
        options?.conversationIdOverride ?? targetWindow?.conversationNumericId;
      const conversationKey = targetWindow?.conversationKey;

      if (!initialConversationNumericId && !conversationKey) {
        return;
      }

      if (targetWindow?.isHistoryLoading) {
        return;
      }

      const nextPage = options?.initial
        ? 1
        : (targetWindow?.historyPage ?? 0) + 1;

      setChatWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                conversationNumericId: initialConversationNumericId ?? w.conversationNumericId,
                isHistoryLoading: true,
                hasMoreHistory: true,
              }
            : w,
        ),
      );

      try {
        const response = await chatApi.getMessages({
          conversationId: initialConversationNumericId,
          conversationKey: initialConversationNumericId ? undefined : conversationKey,
          page: nextPage,
        });
        const rawData = response.data?.data ?? response.data ?? [];
        const itemsReceived = Array.isArray(rawData) ? rawData.length : 0;
        const meta = (response.data?.meta ?? {}) as {
          conversationId?: number;
          pageSize?: number;
          totalPages?: number;
        };
        const resolvedConversationId =
          typeof meta.conversationId === 'number' ? meta.conversationId : undefined;
        const resolvedPageSize =
          typeof meta.pageSize === 'number' ? meta.pageSize : HISTORY_PAGE_SIZE;
        const totalPages = typeof meta.totalPages === 'number' ? meta.totalPages : undefined;
        const normalizedMessages: ChatMessage[] = (Array.isArray(rawData) ? rawData : [])
          .slice()
          .reverse()
          .map((item: any) => mapServerMessage(item));

        setChatWindows((prev) =>
          prev.map((w) => {
            if (w.id !== windowId) {
              return w;
            }

            const existingKeys = new Set(
              w.messages
                .map((msg) => msg.messageKey)
                .filter((key): key is string => Boolean(key)),
            );
            const existingRemoteIds = new Set(
              w.messages
                .map((msg) => msg.remoteId)
                .filter((id): id is number => typeof id === 'number'),
            );

            const deduped = normalizedMessages.filter((msg) => {
              if (msg.messageKey && existingKeys.has(msg.messageKey)) {
                return false;
              }
              if (
                typeof msg.remoteId === 'number' &&
                existingRemoteIds.has(msg.remoteId)
              ) {
                return false;
              }
              return true;
            });

            const shouldAdvancePage = itemsReceived > 0;
            const updatedMaxPageLoaded = shouldAdvancePage
              ? Math.max(w.maxPageLoaded, nextPage)
              : w.maxPageLoaded;
            const nextHasMoreHistory =
              totalPages !== undefined
                ? updatedMaxPageLoaded < totalPages
                : itemsReceived > 0 && itemsReceived === resolvedPageSize;

            return {
              ...w,
              conversationNumericId:
                initialConversationNumericId ??
                resolvedConversationId ??
                w.conversationNumericId,
              messages:
                deduped.length > 0 ? [...deduped, ...w.messages] : w.messages,
              historyPage: shouldAdvancePage ? nextPage : w.historyPage,
              maxPageLoaded: updatedMaxPageLoaded,
              totalPages: totalPages ?? w.totalPages,
              hasMoreHistory: nextHasMoreHistory,
              isHistoryLoading: false,
            };
          }),
        );
      } catch (error) {
        console.error('Failed to load conversation history', error);
        setChatWindows((prev) =>
          prev.map((w) =>
            w.id === windowId ? { ...w, isHistoryLoading: false } : w,
          ),
        );
        throw error;
      }
    },
    [currentUser.id],
  );

  useEffect(() => {
    chatWindows.forEach((window) => {
      const hasConversationHandle =
        Boolean(window.conversationNumericId) || Boolean(window.conversationKey);

      if (
        window.historyPage === 0 &&
        !window.isHistoryLoading &&
        window.hasMoreHistory &&
        hasConversationHandle
      ) {
        loadConversationHistory(window.id, { initial: true }).catch(() => undefined);
      }
    });
  }, [chatWindows, loadConversationHistory]);

  // Lắng nghe message realtime
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleIncomingMessage = (payload: {
      roomId: string;
      message: string;
      sender: string;
      id?: number;
      timestamp?: string;
      messageKey?: string;
      conversationId?: number;
    }) => {
      console.log('[Socket Event] 📨 Receive: receiveMessage', payload);

      const senderId = payload.sender?.toString?.() || '';
      const windowsNeedingHistory: Array<{ windowId: string; conversationId: number }> = [];

      setChatWindows((prev) =>
        prev.map((window) => {
          if (window.conversationKey !== payload.roomId) {
            return window;
          }

          let updatedConversationNumericId = window.conversationNumericId;
          let updatedHasMoreHistory = window.hasMoreHistory;
          if (!window.conversationNumericId && payload.conversationId) {
            updatedConversationNumericId = payload.conversationId;
            updatedHasMoreHistory = true;
            if (window.historyPage === 0) {
              windowsNeedingHistory.push({
                windowId: window.id,
                conversationId: payload.conversationId,
              });
            }
          }

          const incomingMessage: ChatMessage = {
            id: payload.id ? `server-${payload.id}` : generateMessageKey(),
            remoteId: payload.id,
            messageKey: payload.messageKey,
            content: payload.message,
            timestamp: payload.timestamp
              ? dayjs(payload.timestamp).format('HH:mm')
              : dayjs().format('HH:mm'),
            createdAt: payload.timestamp,
            senderId,
            senderName: senderId,
            fromMe: senderId === currentUser.id,
            pending: false,
          };

          if (payload.messageKey) {
            const existingIndex = window.messages.findIndex(
              (msg) => msg.messageKey === payload.messageKey,
            );
            if (existingIndex >= 0) {
              const updatedMessages = [...window.messages];
              updatedMessages[existingIndex] = {
                ...updatedMessages[existingIndex],
                ...incomingMessage,
              };
              return {
                ...window,
                conversationNumericId: updatedConversationNumericId,
                hasMoreHistory: updatedHasMoreHistory,
                messages: updatedMessages,
              };
            }
          }

          if (!payload.messageKey && senderId === currentUser.id) {
            return window;
          }

          return window.minimized
            ? {
                ...window,
                conversationNumericId: updatedConversationNumericId,
                hasMoreHistory: updatedHasMoreHistory,
                messages: [...window.messages, incomingMessage],
                unreadCount: window.unreadCount + 1,
              }
            : {
                ...window,
                conversationNumericId: updatedConversationNumericId,
                hasMoreHistory: updatedHasMoreHistory,
                messages: [...window.messages, incomingMessage],
              };
        }),
      );

      windowsNeedingHistory.forEach(({ windowId, conversationId }) =>
        loadConversationHistory(windowId, {
          initial: true,
          conversationIdOverride: conversationId,
        }).catch(() => undefined),
      );
    };

    socket.on('receiveMessage', handleIncomingMessage);

    return () => {
      socket.off('receiveMessage', handleIncomingMessage);
    };
  }, [socket, isConnected, currentUser.id]);

  // Filter friends based on search
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    return friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  // Tìm hoặc tạo chat window với user
  const openChatWithUser = (friend: Participant) => {
    const conversationKey = generateConversationKey(currentUser.id, friend.id);
    const existingWindow = chatWindows.find(
      (window) => window.conversationKey === conversationKey,
    );

    if (existingWindow) {
      joinConversationRoom(conversationKey, friend.name);
      if (existingWindow.minimized) {
        const activeCount = chatWindows.filter((w) => !w.minimized).length;
        if (activeCount >= 2) {
          const otherActiveWindows = chatWindows
            .filter((w) => !w.minimized && w.id !== existingWindow.id)
            .sort((a, b) => a.id.localeCompare(b.id));

          if (otherActiveWindows.length > 0) {
            setChatWindows((prev) =>
              prev.map((window) =>
                window.id === otherActiveWindows[0].id
                  ? { ...window, minimized: true }
                  : window.id === existingWindow.id
                  ? { ...window, minimized: false, unreadCount: 0 }
                  : window,
              ),
            );
            return;
          }
        }

        setChatWindows((prev) =>
          prev.map((window) =>
            window.id === existingWindow.id
              ? { ...window, minimized: false, unreadCount: 0 }
              : window,
          ),
        );
      }
      if (
        existingWindow.historyPage === 0 &&
        existingWindow.conversationNumericId &&
        !existingWindow.isHistoryLoading
      ) {
        loadConversationHistory(existingWindow.id, {
          initial: true,
        }).catch(() => undefined);
      }
      return;
    }

    joinConversationRoom(conversationKey, friend.name);

    const numericConversationId =
      typeof friend.conversationId === 'number' ? friend.conversationId : undefined;

    const newWindow: ChatWindowData = {
      id: `chat-${friend.id}-${Date.now()}`,
      conversationKey,
      conversationNumericId: numericConversationId,
      title: friend.name,
      participants: [currentUser, friend],
      messages: [],
      minimized: false,
      unreadCount: 0,
      historyPage: 0,
      hasMoreHistory: true,
      isHistoryLoading: false,
      maxPageLoaded: 0,
    };

    setChatWindows((prev) => {
      const activeCount = prev.filter((w) => !w.minimized).length;
      if (activeCount >= 2) {
        const oldestActiveWindow = prev
          .filter((w) => !w.minimized)
          .sort((a, b) => a.id.localeCompare(b.id))[0];
        const updated = prev.map((window) =>
          window.id === oldestActiveWindow.id
            ? { ...window, minimized: true }
            : window,
        );
        return [...updated, newWindow];
      }
      return [...prev, newWindow];
    });

    if (numericConversationId) {
      setTimeout(() => {
        loadConversationHistory(newWindow.id, {
          initial: true,
          conversationIdOverride: numericConversationId,
        }).catch(() => undefined);
      }, 0);
    }
  };

  const handleNewChat = () => {
    // Có thể mở modal để chọn user, hoặc tạm thời chọn user đầu tiên
    if (filteredFriends.length > 0) {
      openChatWithUser(filteredFriends[0]);
    }
  };

  const handleSendMessage = (windowId: string, content: string, imageUrl?: string) => {
    const targetWindow = chatWindows.find((window) => window.id === windowId);
    if (!targetWindow) return;

    const messageKey = generateMessageKey();

    setChatWindows((prev) =>
      prev.map((window) =>
        window.id === windowId
          ? {
              ...window,
              messages: [
                ...window.messages,
                {
                  id: `${windowId}-${Date.now()}`,
                  messageKey,
                  createdAt: new Date().toISOString(),
                  content,
                  timestamp: dayjs().format('HH:mm'),
                  senderId: currentUser.id,
                  senderName: currentUser.name,
                  fromMe: true,
                  pending: true,
                  imageUrl,
                },
              ],
            }
          : window,
      ),
    );

    if (!socket || !isConnected) {
      console.warn('[Socket Event] ⚠️ Socket chưa sẵn sàng - không thể gửi tin nhắn.');
      return;
    }

    const messagePayload = {
      roomId: targetWindow.conversationKey,
      message: content,
      sender: currentUser.id,
      messageKey,
    };
    
    console.log('[Socket Event] 📤 Emit: sendMessage', messagePayload);
    socket.emit('sendMessage', messagePayload);
  };

  const handleMinimizeWindow = (windowId: string) => {
    setChatWindows((prev) =>
      prev.map((window) =>
        window.id === windowId ? { ...window, minimized: true } : window,
      ),
    );
  };

  const handleRestoreWindow = (windowId: string) => {
    setChatWindows((prev) =>
      prev.map((window) =>
        window.id === windowId ? { ...window, minimized: false, unreadCount: 0 } : window,
      ),
    );
  };

  const handleCloseWindow = (windowId: string) => {
    setChatWindows((prev) => prev.filter((window) => window.id !== windowId));
  };

  const minimizedWindows = chatWindows.filter((window) => window.minimized);
  const activeWindows = chatWindows.filter((window) => !window.minimized);

  // Lấy last message và unread count cho mỗi friend
  const getFriendChatInfo = (friendId: string) => {
    const conversationKey = generateConversationKey(currentUser.id, friendId);
    const window = chatWindows.find((w) => w.conversationKey === conversationKey);
    if (!window) return { lastMessage: null, unreadCount: 0 };
    const lastMsg = window.messages[window.messages.length - 1];
    return {
      lastMessage: lastMsg ? lastMsg.content : null,
      unreadCount: window.minimized ? window.unreadCount : 0,
    };
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Sidebar - Danh sách bạn bè */}
      <div className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Bạn bè
          </h2>
          <Input
            placeholder="Tìm kiếm bạn bè..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>

        {/* Danh sách bạn bè */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingFriends ? (
            <div className="flex items-center justify-center h-full">
              <Spin size="large" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <UserOutlined className="text-4xl text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {searchQuery ? 'Không tìm thấy bạn bè' : 'Chưa có bạn bè nào'}
              </p>
            </div>
          ) : (
            <List
              dataSource={filteredFriends}
              renderItem={(friend) => {
              const chatInfo = getFriendChatInfo(friend.id);
              const hasUnread = chatInfo.unreadCount > 0;
              
              return (
                <List.Item
                  className="px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => openChatWithUser(friend)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={friend.online} offset={[-2, 32]} color="green">
                        <AntdAvatar src={friend.avatar} name={friend.name} size="large" />
                      </Badge>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {friend.name}
                        </span>
                        {hasUnread && (
                          <Badge count={chatInfo.unreadCount} overflowCount={99} />
                        )}
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {friend.online ? (
                            <span className="text-green-500">● Đang hoạt động</span>
                          ) : (
                            'Offline'
                          )}
                        </span>
                        {chatInfo.lastMessage && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {chatInfo.lastMessage}
                          </p>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
            />
          )}
        </div>
      </div>

      {/* Main Content - Chat Windows */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Cuộc trò chuyện
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Click vào bạn bè ở sidebar để bắt đầu chat
            </p>
          </div>
        </div>

        {activeWindows.length === 0 ? (
          <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center space-y-4 h-full flex items-center justify-center">
            <MessageOutlined className="text-5xl text-slate-300 dark:text-slate-600" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Chưa có cuộc trò chuyện nào
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Chọn một người bạn từ danh sách bên trái để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {activeWindows.map((window) => (
              <ChatWindow
                key={window.id}
                window={window}
                currentUserId={currentUser.id}
                onSendMessage={handleSendMessage}
                onMinimize={handleMinimizeWindow}
                onClose={handleCloseWindow}
                onLoadMoreHistory={() => loadConversationHistory(window.id)}
              />
            ))}
          </div>
        )}
      </div>

      {minimizedWindows.length > 0 && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          {minimizedWindows.map((window) => (
            <div
              key={window.id}
              className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => handleRestoreWindow(window.id)}
            >
              <Badge count={window.unreadCount} overflowCount={9}>
                <MessageOutlined className="text-blue-600" />
              </Badge>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {window.title}
              </span>
              <Button
                size="small"
                type="text"
                icon={<CloseOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseWindow(window.id);
                }}
              />
            </div>
          ))}
        </div>
      )}
      </div>
    </main>
  );
}

