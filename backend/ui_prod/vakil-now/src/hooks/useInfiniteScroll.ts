import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  isLoading: boolean
) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // Disconnect previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          callback();
        }
      },
      {
        root: null,
        rootMargin: '100px', // Trigger 100px before reaching the bottom
        threshold: 0.1
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.current.observe(currentRef);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [callback, hasMore, isLoading]);

  return ref;
};
