import { LoaderIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  hasNextPage: boolean;
  isLoading: boolean;
  getNextPage: () => void;
}

export function InfiniteScroll({
  hasNextPage,
  isLoading,
  getNextPage,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isLoading) {
          getNextPage();
        }
      },
      {
        threshold: 0.2,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isLoading, getNextPage]);

  return (
    hasNextPage && (
      <div
        ref={observerRef}
        className="absolute bottom-0 flex h-50 w-full items-end justify-center py-2"
      >
        <LoaderIcon size={16} className="animate-spin" />
      </div>
    )
  );
}
