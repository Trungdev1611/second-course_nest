'use client';

import { useMemo, useRef, useState } from 'react';
import { Button, Input, Badge, List } from 'antd';
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

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  fromMe: boolean;
  imageUrl?: string;
}

interface Participant {
  id: string;
  name: string;
  online?: boolean;
  avatar?: string;
}

interface ChatWindowData {
  id: string;
  title: string;
  participants: Participant[];
  messages: ChatMessage[];
  minimized: boolean;
  unreadCount: number;
}

interface ChatWindowProps {
  window: ChatWindowData;
  currentUserId: string;
  onSendMessage: (windowId: string, content: string, imageUrl?: string) => void;
  onMinimize: (windowId: string) => void;
  onClose: (windowId: string) => void;
}

function ChatWindow({
  window,
  currentUserId,
  onSendMessage,
  onMinimize,
  onClose,
}: ChatWindowProps) {
  const [draft, setDraft] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50 dark:bg-slate-950/40">
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
                }`}
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

// Mock danh sách bạn bè - TODO: Fetch từ API
const mockFriends: Participant[] = [
  { id: 'u1', name: 'Lan Phạm', online: true, avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'u2', name: 'Minh Trần', online: true, avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'u3', name: 'Tuấn Nguyễn', online: false, avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 'u4', name: 'Hà Hoàng', online: true, avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 'u5', name: 'Anh Đỗ', online: false, avatar: 'https://i.pravatar.cc/150?img=51' },
  { id: 'u6', name: 'Bình Lê', online: true, avatar: 'https://i.pravatar.cc/150?img=68' },
];

export default function ChatPage() {
  const currentUser = useMemo(() => ({ id: 'me', name: 'Bạn' }), []);
  const [chatWindows, setChatWindows] = useState<ChatWindowData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter friends based on search
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return mockFriends;
    return mockFriends.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Tìm hoặc tạo chat window với user
  const openChatWithUser = (friend: Participant) => {
    // Check xem đã có chat với user này chưa
    const existingWindow = chatWindows.find(
      (window) =>
        window.participants.some((p) => p.id === friend.id) &&
        window.participants.length === 2
    );

    if (existingWindow) {
      // Nếu đã có, restore window (mở lại nếu đang minimized)
      if (existingWindow.minimized) {
        // Đếm số windows đang active
        const activeCount = chatWindows.filter((w) => !w.minimized).length;
        
        // Nếu đã có 2 windows active, minimize window cũ nhất (không phải window đang restore)
        if (activeCount >= 2) {
          const otherActiveWindows = chatWindows
            .filter((w) => !w.minimized && w.id !== existingWindow.id)
            .sort((a, b) => {
              // Sort by creation time (oldest first) - dựa vào ID có timestamp
              return a.id.localeCompare(b.id);
            });
          
          if (otherActiveWindows.length > 0) {
            // Minimize window cũ nhất
            setChatWindows((prev) =>
              prev.map((window) =>
                window.id === otherActiveWindows[0].id
                  ? { ...window, minimized: true }
                  : window.id === existingWindow.id
                  ? { ...window, minimized: false, unreadCount: 0 }
                  : window
              )
            );
            return;
          }
        }
        
        // Nếu chưa đủ 2 windows, chỉ cần restore
        setChatWindows((prev) =>
          prev.map((window) =>
            window.id === existingWindow.id
              ? { ...window, minimized: false, unreadCount: 0 }
              : window
          )
        );
      }
      // Nếu đang mở rồi thì không làm gì
      return;
    }

    // Tạo chat window mới
    const newWindow: ChatWindowData = {
      id: `chat-${friend.id}-${Date.now()}`,
      title: friend.name,
      participants: [currentUser, friend],
      messages: [],
      minimized: false,
      unreadCount: 0,
    };

    // Đếm số windows đang active
    const activeCount = chatWindows.filter((w) => !w.minimized).length;
    
    // Nếu đã có 2 windows active, minimize window cũ nhất
    if (activeCount >= 2) {
      const oldestActiveWindow = chatWindows
        .filter((w) => !w.minimized)
        .sort((a, b) => a.id.localeCompare(b.id))[0];
      
      setChatWindows((prev) => [
        ...prev.map((window) =>
          window.id === oldestActiveWindow.id
            ? { ...window, minimized: true }
            : window
        ),
        newWindow,
      ]);
    } else {
      // Nếu chưa đủ 2 windows, thêm window mới bình thường
      setChatWindows((prev) => [...prev, newWindow]);
    }
  };

  const handleNewChat = () => {
    // Có thể mở modal để chọn user, hoặc tạm thời chọn user đầu tiên
    if (filteredFriends.length > 0) {
      openChatWithUser(filteredFriends[0]);
    }
  };

  const handleSendMessage = (windowId: string, content: string, imageUrl?: string) => {
    setChatWindows((prev) =>
      prev.map((window) =>
        window.id === windowId
          ? {
              ...window,
              messages: [
                ...window.messages,
                {
                  id: `${windowId}-${Date.now()}`,
                  content,
                  timestamp: dayjs().format('HH:mm'),
                  senderId: currentUser.id,
                  senderName: currentUser.name,
                  fromMe: true,
                  imageUrl,
                },
              ],
            }
          : window,
      ),
    );

    // Fake partner reply after short delay (demo only)
    setTimeout(() => {
      setChatWindows((prev) =>
        prev.map((window) => {
          if (window.id !== windowId) return window;

          const partner = window.participants.find((p) => p.id !== currentUser.id);
          if (!partner) return window;

          const replyMessage: ChatMessage = {
            id: `${windowId}-reply-${Date.now()}`,
            content: `(${partner.name}): Mình đã nhận được tin nhắn nhé!`,
            timestamp: dayjs().add(1, 'minute').format('HH:mm'),
            senderId: partner.id,
            senderName: partner.name,
            fromMe: false,
          };

          return window.minimized
            ? {
                ...window,
                messages: [...window.messages, replyMessage],
                unreadCount: window.unreadCount + 1,
              }
            : {
                ...window,
                messages: [...window.messages, replyMessage],
              };
        }),
      );
    }, 1200);
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
    const window = chatWindows.find(
      (w) => w.participants.some((p) => p.id === friendId) && w.participants.length === 2
    );
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

