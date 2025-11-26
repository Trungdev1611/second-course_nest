'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface ChatSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const ChatSocketContext = createContext<ChatSocketContextValue>({
  socket: null,
  isConnected: false,
});

export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuthStore();

  const socketUrl = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001'
    );
  }, []);

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    const handleConnect = () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason: Socket.DisconnectReason) => {
      console.warn('⚠️ Socket disconnected:', reason);
      setIsConnected(false);
    };

    const handleError = (error: Error) => {
      console.error('❌ Socket error:', error.message);
      setIsConnected(false);
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleError);

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleError);
      newSocket.disconnect();
    };
  }, [socketUrl, token, user?.id]);

  return (
    <ChatSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) {
    throw new Error('useChatSocket must be used within ChatSocketProvider');
  }
  return ctx;
}

