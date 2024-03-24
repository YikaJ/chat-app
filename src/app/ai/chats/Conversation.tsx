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
import {
  ArrowUpFromLineIcon,
  CircleStopIcon,
  CopyIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { debounce } from 'lodash-es';
import type { Chat } from '@/typings';
import { StartUp } from './StartUp';
import { useSearchParams } from 'next/navigation';
import classNames from 'classnames';
import { Copy } from '@/components/Copy';

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
    reload,
  } = useChat({
    api: '/api/chats/chat',
    onError(err) {
      saveable.current = false;
      setWaitingAssistantStream(false);
    },
    onResponse() {
      // 开始有流式内容输出
      setWaitingAssistantStream(false);
    },
    onFinish() {
      // 流式内容输出完成
      // isLoading 已经为 true 了

      // 存储 AI 会话
      saveable.current = true;
    },
  });
  const scrollContainerRef = useAutoScrollToBottom([messages]);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const inputPanelRef = useRef<ImperativePanelHandle>(null);
  const { toast } = useToast();
  const [waitingAssistantStream, setWaitingAssistantStream] = useState(false);
  const saveable = useRef(false);
  const searchParams = useSearchParams();

  // 加载历史对话信息
  const getChatHistory = async (id: string) => {
    const response = await fetch(`/api/chats/detail?chatID=${id}`);
    const {
      Response: { Chat },
    } = await response.json();
    setMessages(Chat?.messages || []);
  };

  // 加载历史记录
  useEffect(() => {
    console.log('Conversaction Loaded');
    if (chatID) {
      getChatHistory(chatID);
    } else {
      setMessages([]);
    }
  }, [chatID]);

  // 将会话保存到数据库中
  useEffect(() => {
    if (isLoading) saveable.current = false;
    if (saveable.current && messages.length > 0) saveConveration();
  }, [isLoading, messages]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveConveration = useCallback(async () => {
    saveable.current = false;
    const response = await fetch('/api/chats/update', {
      method: 'POST',
      body: JSON.stringify({
        chatID,
        messages,
      }),
    });
    const {
      Response: { Chat },
    } = await response.json();

    // 新会话状态
    if (!searchParams.get('chatID')) {
      // 通知 List 组件创建了新的会话
      onCreateChat(Chat);
    }
  }, [messages, chatID]);

  // 停止流式输出
  function handleStopStreaming() {
    stop();
    setWaitingAssistantStream(false);
    saveable.current = false;
  }

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
    e.preventDefault();

    if (isLoading) {
      toast({ title: '请先等待上一段内容结束后再发送' });
      return;
    }

    // 有内容再提交
    if (input.trim()) {
      // 存储用户对话
      saveable.current = true;
      setWaitingAssistantStream(true);
      handleSubmit(e);
    }
  }

  async function handleReload() {
    setWaitingAssistantStream(true);
    reload();
  }

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={90}>
        <div className=" h-full overflow-y-scroll" ref={scrollContainerRef}>
          {messages.length > 0 ? (
            <div className="space-y-8 p-10  pr-24">
              {messages.map((m, index) => {
                const isNotLast = index < messages.length - 1;
                const isLast = index === messages.length - 1;
                const isLoadingAndLast = isLoading && isLast;
                const isNotLoadingAndLast = !isLoading && isLast;

                return (
                  <div key={m.id} className="group/message">
                    <ChatMessage message={m} />
                    {/* 对话框下的工具栏 */}
                    <div
                      className={classNames(
                        'flex space-x-3 ml-16 mt-3 text-zinc-500',
                        {
                          // loading 时，最后一条不展示
                          // 非 loading 时，最后一条常驻展示
                          // 非最后一条的都可以 hover 展示
                          invisible: isNotLast || isLoadingAndLast,
                          visible: isNotLoadingAndLast,
                          'group-hover/message:visible': isNotLast,
                        }
                      )}
                    >
                      {m.role === 'assistant' && (
                        <>
                          <Copy
                            className="w-6 h-6 cursor-pointer hover:text-zinc-800"
                            content={m.content}
                          />
                          {isLast && (
                            <RefreshCwIcon
                              onClick={handleReload}
                              className="w-6 h-6 cursor-pointer hover:text-zinc-800"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading UI */}
              {!error && waitingAssistantStream && (
                <ChatMessage
                  key="loading"
                  message={{
                    id: 'loading',
                    role: 'assistant',
                    content: '努力思考中...',
                    ui: (
                      <div className="py-4 animate-spin">
                        <LoaderCircleIcon />
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
              key={chatID}
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
            {isLoading ? (
              <Button size="icon" onClick={handleStopStreaming}>
                <CircleStopIcon className="w-6 h-6" />
              </Button>
            ) : (
              <Button size="icon" ref={submitBtnRef} type="submit">
                <ArrowUpFromLineIcon className="w-6 h-6" />
              </Button>
            )}
          </div>
        </form>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
