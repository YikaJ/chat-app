import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import List from './List';
import { Separator } from '@/components/ui/separator';
import Conversation from './Conversation';
import { NewChat } from './NewChat';
import { EventProvider } from './EventProvider';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventProvider>
      <ResizablePanelGroup direction="horizontal" className="border">
        <ResizablePanel defaultSize={10} minSize={10} maxSize={30}>
          <div className="px-3 mt-3">
            <NewChat />
            <Separator className="my-3" />
          </div>
          <List />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={90}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </EventProvider>
  );
}
