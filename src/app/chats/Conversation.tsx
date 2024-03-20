import type { Message, UseChatHelpers } from 'ai/react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from '@/components/chatbot/ChatMessage';
import { useAutoScrollToBottom } from '../hooks';
import { Textarea } from '@/components/ui/textarea';
import { KeyboardEvent, KeyboardEventHandler, useRef } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';

interface IProps {
  messages: Message[];
  onSubmit: UseChatHelpers['handleSubmit'];
  input: string;
  onChange: UseChatHelpers['handleInputChange'];
}

export default function Conversation({
  input,
  messages,
  onSubmit,
  onChange,
}: IProps) {
  const scrollContainerRef = useAutoScrollToBottom([messages]);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const inputPanelRef = useRef<ImperativePanelHandle>(null);

  function handleTextareaKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // 纯回车才发送
    if (
      e.key.toLowerCase() === 'enter' &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.altKey
    ) {
      e.preventDefault();
      if (input.trim() && submitBtnRef.current) {
        submitBtnRef.current.click();
      }
    }
  }

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={80}>
        <div className=" h-full overflow-y-scroll" ref={scrollContainerRef}>
          <div className="space-y-8 p-10">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
          </div>
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
        <form onSubmit={onSubmit} className="w-full">
          <div className="flex w-full items-center space-x-2 px-14">
            <AutosizeTextarea
              placeholder="请输入内容..."
              value={input}
              onChange={onChange}
              // className="max-h-[4em]"
              onKeyDown={handleTextareaKeyDown}
              rows={1}
              maxHeight={74}
              minHeight={30}
              className="resize-none"
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
