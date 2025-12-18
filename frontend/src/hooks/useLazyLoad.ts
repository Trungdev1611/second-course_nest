import { useEffect, useRef, useState, useCallback } from "react";

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook tối ưu kết hợp cả callback ref và useRef
 * Hoạt động tốt cho cả 2 trường hợp:
 * 1. Element render cùng lúc với component (dùng với LazyLoad component)
 * 2. Element render sau (dùng trực tiếp trong component)
 * 
 * @returns [callbackRef, isVisible] - Callback ref để gán vào element và state visibility
 */
export function useLazyLoad(
  options: UseLazyLoadOptions = {}
): [(element: HTMLDivElement | null) => void, boolean] {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.1, rootMargin = "100px", triggerOnce = true } = options;

  // Helper function để check xem element có visible ngay từ đầu không
  const checkInitialVisibility = useCallback((element: HTMLDivElement) => {
    try {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      // Parse rootMargin (format: "100px" hoặc "0px 0px 200px 0px")
      // Default: nếu không parse được thì dùng 0
      let topMargin = 0;
      let bottomMargin = 0;
      let leftMargin = 0;
      let rightMargin = 0;

      if (rootMargin) {
        const parts = rootMargin.trim().split(/\s+/);
        if (parts.length === 1) {
          // "100px" -> tất cả margins = 100px
          const value = parseInt(parts[0]) || 0;
          topMargin = bottomMargin = leftMargin = rightMargin = value;
        } else if (parts.length === 2) {
          // "100px 200px" -> top/bottom = 100px, left/right = 200px
          topMargin = bottomMargin = parseInt(parts[0]) || 0;
          leftMargin = rightMargin = parseInt(parts[1]) || 0;
        } else if (parts.length === 4) {
          // "0px 0px 200px 0px" -> top, right, bottom, left
          topMargin = parseInt(parts[0]) || 0;
          rightMargin = parseInt(parts[1]) || 0;
          bottomMargin = parseInt(parts[2]) || 0;
          leftMargin = parseInt(parts[3]) || 0;
        }
      }

      // Check nếu element visible với rootMargin
      // Element visible nếu:
      // - Top edge < viewport bottom + bottomMargin
      // - Bottom edge > viewport top - topMargin
      // - Left edge < viewport right + rightMargin
      // - Right edge > viewport left - leftMargin
      const isVisibleNow =
        rect.top < windowHeight + bottomMargin &&
        rect.bottom > -topMargin &&
        rect.left < windowWidth + rightMargin &&
        rect.right > -leftMargin;

      return isVisibleNow;
    } catch (error) {
      // Nếu có lỗi, return false để dùng observer
      return false;
    }
  }, [rootMargin]);

  // Callback ref - được gọi khi element mount/unmount
  // Đảm bảo observer được setup đúng thời điểm, kể cả khi element render sau
  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      // Cleanup observer cũ trước khi setup mới
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      elementRef.current = element;

      // Nếu element bị unmount, reset visibility
      if (!element) {
        setIsVisible(false);
        return;
      }

      // Setup observer mới cho element
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isIntersecting = entry.isIntersecting;
          setIsVisible(isIntersecting);

          // Nếu triggerOnce = true, disconnect sau khi visible lần đầu
          if (isIntersecting && triggerOnce) {
            observer.disconnect();
            observerRef.current = null;
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      // ✅ QUAN TRỌNG: Sử dụng requestAnimationFrame để đảm bảo DOM đã ready
      // Sau đó check initial visibility và setup observer
      requestAnimationFrame(() => {
        // Double check element vẫn còn tồn tại
        if (elementRef.current !== element) {
          return;
        }

        // Check xem element có visible ngay từ đầu không
        // Điều này quan trọng cho list items có thể đã visible khi render
        console.log(`checkInitialVisibility(element)`, checkInitialVisibility(element))
        if (checkInitialVisibility(element)) {
          setIsVisible(true);
          // Nếu triggerOnce = true, không cần setup observer
          if (triggerOnce) {
            return;
          }
        }

        // Setup observer để track khi element vào viewport
        observer.observe(element);
        observerRef.current = observer;
      });
    },
    [threshold, rootMargin, triggerOnce, checkInitialVisibility]
  );

  // Cleanup on unmount để tránh memory leaks
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return [setRef, isVisible];
}

