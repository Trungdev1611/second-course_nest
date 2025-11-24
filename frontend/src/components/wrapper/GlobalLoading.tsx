'use client';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export const GlobalLoading = () => {
  const isFetching = useIsFetching(); // trả về số lượng query đang fetching
  const isMutating = useIsMutating(); // trả về số lượng mutation đang chạy
  
  // Hiển thị loading nếu có query hoặc mutation đang chạy
  if (!isFetching && !isMutating) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-[9999]">
      <div className="h-full bg-blue-600 animate-shimmer" style={{ width: '100%' }} />
    </div>
  );
};
