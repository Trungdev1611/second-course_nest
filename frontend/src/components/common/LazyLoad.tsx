'use client';

import { ReactNode } from 'react';
import { useLazyLoad } from '@/hooks/useLazyLoad';

interface LazyLoadProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  placeholder?: ReactNode;
  className?: string;
}

/**
 * LazyLoad component - Wrapper component để lazy load content
 * Sử dụng callback ref để đảm bảo hoạt động tốt trong mọi trường hợp
 */
export function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '100px',
  triggerOnce = true,
  placeholder,
  className = '',
}: LazyLoadProps) {
  const [setRef, isVisible] = useLazyLoad({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <div ref={setRef} className={className}>
      {isVisible ? (
        children
      ) : (
        placeholder || (
          <div className="h-full w-full bg-slate-100 rounded animate-pulse">
            <div className="h-full w-full bg-slate-200" />
          </div>
        )
      )}
    </div>
  );
}

