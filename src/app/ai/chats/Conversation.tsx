'use client';

import { useChat, type Message, type UseChatHelpers } from 'ai/react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/chatbot/ChatMessage';
import { useAutoScrollToBottom } from '@/hooks/index';
import React, {
  FormEvent,
  KeyboardEvent,
  KeyboardEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { useToast } from '@/components/ui/use-toast';
import { LoaderCircle } from 'lucide-react';
import { debounce } from 'lodash-es';
import type { Chat } from '@/typings';
import { StartUp } from './StartUp';

interface IProps {
  chatID?: string;
  onCreateChat: (chat: Chat) => void;
}

export default function Conversation({ chatID, onCreateChat }: IProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    setMessages,
  } = useChat({
    onError(err) {
      console.error(err);
      stop();
    },
  });
  const scrollContainerRef = useAutoScrollToBottom([messages]);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const inputPanelRef = useRef<ImperativePanelHandle>(null);
  const { toast } = useToast();
  const [waitingAssistant, setWaitingAssistant] = useState(false);
  const [isUserEdit, setIsUserEdit] = useState(false);

  // 加载历史对话信息
  const getChatHistory = async (id: string) => {
    const response = await fetch(`/api/user/chats/detail?chatID=${id}`);
    const {
      Response: { Chat },
    } = await response.json();
    setMessages(Chat?.messages || []);
  };
  useEffect(() => {
    console.log('Conversaction Loaded');
    if (chatID) {
      getChatHistory(chatID);
    } else {
      setMessages([]);
    }
  }, [chatID]);

  // 将会话保存到数据库中
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveConveration = useCallback(
    debounce(async (messages: Message[]) => {
      if (messages.length > 0) {
        const response = await fetch('/api/user/chats/update', {
          method: 'POST',
          body: JSON.stringify({
            chatID,
            messages,
          }),
        });
        const {
          Response: { chat },
        } = await response.json();

        // 新会话状态
        if (!chatID) {
          // 通知 List 组件创建了新的会话
          onCreateChat(chat);
        }
      }
    }, 2000),
    []
  );
  useEffect(() => {
    // 只有用户已经修改过内容，才需要更新会话
    // 纯历史阅读无需更新
    if (isUserEdit) saveConveration(messages);
  }, [messages]);

  // 纯回车才发送
  function handleTextareaKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key.toLowerCase() === 'enter' &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.altKey
    ) {
      e.preventDefault();
      if (submitBtnRef.current) {
        submitBtnRef.current.click();
      }
    }
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    if (isLoading) {
      toast({ title: '请先等待上一段内容结束后再发送' });
      return;
    }

    // 有内容再提交
    if (input.trim()) {
      setWaitingAssistant(true);
      handleSubmit(e);
      setIsUserEdit(true);
    }
  }

  useEffect(() => {
    const lastMessage = messages.slice(-1)[0];
    if (isLoading && lastMessage?.role === 'assistant' && lastMessage.content) {
      setWaitingAssistant(false);
    }
  }, [isLoading, messages]);

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={90}>
        <div className=" h-full overflow-y-scroll" ref={scrollContainerRef}>
          {messages.length > 0 ? (
            <div className="space-y-8 p-10  pr-24">
              {messages.map((m, index) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {!error && waitingAssistant && (
                <ChatMessage
                  key="loading"
                  message={{
                    id: 'loading',
                    role: 'assistant',
                    content: '努力思考中...',
                    ui: (
                      <div className="py-4 animate-spin">
                        <LoaderCircle />
                      </div>
                    ),
                  }}
                />
              )}
              {error && (
                <ChatMessage
                  key="loading"
                  message={{
                    id: 'loading',
                    role: 'assistant',
                    content: error.message || '模型出错了...',
                  }}
                />
              )}
            </div>
          ) : (
            <StartUp />
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={10}
        minSize={6}
        maxSize={12}
        className="flex items-center justify-center px-10"
        ref={inputPanelRef}
      >
        <form onSubmit={handleFormSubmit} className="w-full">
          <div className="flex w-full items-center space-x-2 px-14">
            <AutosizeTextarea
              placeholder="请输入内容..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleTextareaKeyDown}
              rows={1}
              maxHeight={74}
              minHeight={30}
              className="resize-none"
              autoFocus
            />
            <Button ref={submitBtnRef} type="submit">
              提交
            </Button>
          </div>
        </form>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
