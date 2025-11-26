'use client';

import { ReactNode } from 'react';
import { ChatSocketProvider } from './ChatSocketProvider';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <ChatSocketProvider>{children}</ChatSocketProvider>;
}

