import type { Message, UseChatHelpers } from 'ai/react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './Message';

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
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={80}>
        <div className="space-y-8 p-10">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={6}
        minSize={6}
        maxSize={15}
        className="flex items-center justify-center px-10"
      >
        <form onSubmit={onSubmit} className="w-full">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="请输入内容..."
              value={input}
              onChange={onChange}
            />
            <Button type="submit">提交</Button>
          </div>
        </form>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
