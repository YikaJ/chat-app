'use client';

import { Message } from 'ai/react';
import { useContext, useEffect, useState } from 'react';
import { EventContext } from './EventProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import classnames from 'classnames';
import { useSearchParams } from 'next/navigation';

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
  const [titleEditedID, setTitleEditedID] = useState('');
  const { eventEmitter } = useContext(EventContext);
  const searchParams = useSearchParams();

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

  // 获取会话列表
  async function fetchUserChats() {
    const response = await fetch('/api/user/chats');
    const { Response } = await response.json();

    setChats(Response.Chats || []);
  }

  // 删除单个会话
  async function handleDel() {}

  // 更新标题
  async function updateTitle(id: string) {}

  // 输入框 blur
  async function handleInputBlur() {
    // 清空编辑状态
    setTitleEditedID('');
  }

  return (
    <div className="px-3">
      {chats.map((chat) => {
        return (
          <div
            className={classnames(
              'flex  px-3 w-full hover:bg-slate-100 cursor-pointer items-center text-base  h-14 group/title',
              {
                'bg-slate-200': chat.id === searchParams.get('chatID'),
              }
            )}
            key={chat.id}
          >
            {chat.id === titleEditedID ? (
              <Input
                size={12}
                autoFocus
                onBlur={handleInputBlur}
                defaultValue={chat.title}
              />
            ) : (
              <Link
                className="block py-3 flex-1 truncate"
                href={`/ai/chats?chatID=${chat.id}`}
              >
                {chat.title}
              </Link>
            )}

            <div
              className={classnames(
                'hidden text-zinc-500 items-center space-x-1  ml-5',
                {
                  'group-hover/title:flex': chat.id !== titleEditedID,
                }
              )}
            >
              <Edit
                className="w-5 h-5 hover:text-zinc-900"
                onClick={() => setTitleEditedID(chat.id)}
              />
              <Trash
                className="w-5 h-5 hover:text-zinc-900"
                onClick={handleDel}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
