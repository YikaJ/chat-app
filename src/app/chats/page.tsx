'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useChat } from 'ai/react';
import List from './List';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Conversation from './Conversation';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="PAGE_CHATS_RESIZABLE"
      className="border"
    >
      <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
        <div className="p-3">
          <Button className="w-full box-border">新建会话</Button>
          <Separator className="my-3" />
        </div>

        <List />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <Conversation
          messages={messages}
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
