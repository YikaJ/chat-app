import { useEffect, useLayoutEffect, useRef } from 'react';

export function useAutoScrollToBottom(dependencies: any[] = []) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, dependencies);

  return scrollContainerRef;
}