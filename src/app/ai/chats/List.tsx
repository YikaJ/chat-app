'use client';

import { Message } from 'ai/react';
import { useContext, useEffect, useState } from 'react';
import { EventContext } from './EventProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// 会话列表
export function ListItem() {}

interface IProps {}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function List() {
  const [chats, setChats] = useState<Chat[]>([]);
  const { eventEmitter } = useContext(EventContext);

  useEffect(() => {
    fetchUserChats();
  }, []);

  // 监听创建了新对话
  eventEmitter?.useSubscription(({ type, data }) => {
    if (type === 'CREATE_NEW_CHAT') {
      setChats((prev) => {
        return [...prev, data.chat];
      });
      // TODO：向 AI 尝试获取新标题
    }
  });

  async function fetchUserChats() {
    const response = await fetch('/api/user/chats');
    const { Response } = await response.json();

    setChats(Response.Chats || []);
  }
  return (
    <div className="px-3">
      {chats.map((chat) => {
        return (
          <Link
            key={chat.id}
            className="p-3 hover:bg-slate-100 cursor-pointer block w-full flex-1"
            href={`/ai/chats?chatID=${chat.id}`}
          >
            {chat.title}
          </Link>
        );
      })}
    </div>
  );
}
