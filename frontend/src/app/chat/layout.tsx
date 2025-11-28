'use client';

import { ReactNode } from 'react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  // Socket provider đã được di chuyển lên root layout
  // để tất cả users đều connect socket khi đã login
  return <>{children}</>;
}

