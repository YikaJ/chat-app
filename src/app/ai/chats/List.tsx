'use client';

import { Message, useCompletion } from 'ai/react';
import { FocusEventHandler, useContext, useEffect, useState } from 'react';
import { EventContext } from './EventProvider';
import Link from 'next/link';
import { Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import classnames from 'classnames';
import { useRouter, useSearchParams } from 'next/navigation';
import { remove } from 'lodash-es';

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
  const router = useRouter();
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/chats/autoTitle',
  });
  const [newChatID, setNewChatID] = useState('');

  useEffect(() => {
    fetchUserChats();
  }, []);

  // 监听创建了新对话
  eventEmitter?.useSubscription(
    async ({ type, data }: { type: string; data: { chat: Chat } }) => {
      if (type === 'CREATE_NEW_CHAT') {
        setChats((prev) => {
          return [...prev, data.chat];
        });
        // 向 AI 尝试获取新标题
        autoCreateTitle(data.chat);
      }
    }
  );

  // 获取会话列表
  async function fetchUserChats() {
    const response = await fetch('/api/chats');
    const { Response } = await response.json();

    setChats(Response.Chats || []);
  }

  // 删除单个会话
  async function handleDel(id: string) {
    const response = await fetch(`/api/chats?chatID=${id}`, {
      method: 'DELETE',
    });
    const { Response } = await response.json();

    // 删除成功后
    if (Response.Chat?.id) {
      setChats((prevState) => {
        const newState = [...prevState];
        remove(newState, (chat) => chat.id === id);
        return newState;
      });

      router.push('/ai/chats');
    }
  }

  // 自动根据内容更新标题
  async function autoCreateTitle(chat: Chat) {
    setNewChatID(chat.id);
    const newTitle = await complete(chat.messages[0]?.content);
    if (newTitle) await handleUpdateTitle(chat, newTitle);
    setNewChatID('');
  }

  // 输入框 blur
  async function handleUpdateTitle(chat: Chat, newTitle: string) {
    const chatID = chat.id;
    if (newTitle && newTitle !== chat.title) {
      const response = await fetch('/api/chats/update', {
        method: 'POST',
        body: JSON.stringify({ chatID, title: newTitle }),
      });
      const {
        Response: { Chat },
      } = await response.json();
      if (Chat?.id) {
        setChats((prevState) => {
          const newChats = prevState.map((chat) => {
            if (chat.id === chatID) return Chat;
            return chat;
          });
          return newChats;
        });
      }
    }
    // 清空编辑状态
    setTitleEditedID('');
  }

  return (
    <>
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
                  onBlur={(e) => handleUpdateTitle(chat, e.currentTarget.value)}
                  onKeyUp={(e) => {
                    if (e.code.toLowerCase() === 'enter') {
                      handleUpdateTitle(chat, e.currentTarget.value);
                    }
                  }}
                  defaultValue={chat.title}
                />
              ) : (
                <Link
                  className="block py-3 flex-1 truncate"
                  href={`/ai/chats?chatID=${chat.id}`}
                  key={chat.id}
                >
                  {isLoading && newChatID === chat.id ? '...' : chat.title}
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash className="w-5 h-5 hover:text-zinc-900" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除此对话？</AlertDialogTitle>
                      <AlertDialogDescription>
                        即将删除 {chat.title}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDel(chat.id)}>
                        确认删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
