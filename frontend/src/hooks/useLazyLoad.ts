import { useEffect, useRef, useState, useCallback } from "react";

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyLoad(
  options: UseLazyLoadOptions = {}
): [(element: HTMLDivElement | null) => void, boolean] {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.1, rootMargin = "100px", triggerOnce = true } = options;

  // Callback ref that gets called when element is mounted/unmounted
  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      elementRef.current = element;

      if (!element) {
        return;
      }

      // Create new observer for the element
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isIntersecting = entry.isIntersecting;
          setIsVisible(isIntersecting);

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

      observer.observe(element);
      observerRef.current = observer;
    },
    [threshold, rootMargin, triggerOnce]
  );

  // Cleanup on unmount
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

