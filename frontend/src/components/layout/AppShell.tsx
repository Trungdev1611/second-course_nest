 'use client';
 
 import { ReactNode } from 'react';
 import { usePathname } from 'next/navigation';
 import { AppHeader } from './AppHeader';

 interface AppShellProps {
   children: ReactNode;
 }
 
 export function AppShell({ children }: AppShellProps) {
   const pathname = usePathname();
   const isAuthRoute = pathname?.startsWith('/auth');
 
   if (isAuthRoute) {
     return <>{children}</>;
   }
 
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 overflow-hidden">
      <AppHeader />
      <main className="pt-24 pb-12">{children}</main>
    </div>
  );
 }

