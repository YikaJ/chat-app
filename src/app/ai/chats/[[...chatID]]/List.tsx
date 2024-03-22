'use client';

import { Message } from 'ai/react';
import { useContext, useEffect, useState } from 'react';
import { EventContext } from './EventProvider';
import Link from 'next/link';

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
    <div className="spa-y-4">
      {chats.map((chat) => {
        return (
          <div className="hover:underline" key={chat.id}>
            <Link href={`/ai/chats/${chat.id}`}>{chat.title}</Link>
          </div>
        );
      })}
    </div>
  );
}
