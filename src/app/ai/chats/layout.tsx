import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import List from './List';
import { Separator } from '@/components/ui/separator';
import Conversation from './Conversation';
import { NewChat } from './NewChatButton';
import { EventProvider } from './EventProvider';
import { Suspense } from 'react';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventProvider>
      <ResizablePanelGroup direction="horizontal" className="border">
        <ResizablePanel defaultSize={10} minSize={10} maxSize={30}>
          <div className="flex flex-col h-full">
            <div className="px-3 mt-3">
              <NewChat />
              <Separator className="my-3" />
            </div>
            <div className="flex-1 overflow-scroll pb-16">
              <List />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={90}>
          <Suspense fallback={'loading...'}>{children}</Suspense>
        </ResizablePanel>
      </ResizablePanelGroup>
    </EventProvider>
  );
}
