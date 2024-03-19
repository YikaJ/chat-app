import { useEffect, useRef } from 'react';

export function useAutoScrollToBottom(dependencies: any[] = []) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // 当依赖内容发生变化时，自动 smooth 过去
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, dependencies); // 依赖项数组作为 useEffect 的第二个参数

  return endOfMessagesRef;
}