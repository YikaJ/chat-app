'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Conversation from './Conversation';
import { useParams, useSearchParams } from 'next/navigation';
import { EventContext } from './EventProvider';
import type { Chat } from '@/typings';

// eslint-disable-next-line @next/next/no-async-client-component
export default function Chat({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const { eventEmitter } = useContext(EventContext);
  const chatID = searchParams.get('chatID') || '';

  function handleCreateChat(chat: Chat) {
    // HACK: 因为 history.replaceState 不会让 useParams 获取到最新参数
    // 客户端 next/router 未支持 shallow
    setTimeout(() => {
      window.history.replaceState(
        { chatID: chat.id },
        '',
        `/ai/chats?chatID=${chat.id}`
      );
    }, 500);
    eventEmitter?.emit({
      type: 'CREATE_NEW_CHAT',
      data: { chat },
    });
  }

  return <Conversation chatID={chatID} onCreateChat={handleCreateChat} />;
}
