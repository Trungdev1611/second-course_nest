'use client';

import { ReactNode } from 'react';
import { ChatSocketProvider } from '@/app/chat/ChatSocketProvider';

export function SocketProvider({ children }: { children: ReactNode }) {
  return <ChatSocketProvider>{children}</ChatSocketProvider>;
}

