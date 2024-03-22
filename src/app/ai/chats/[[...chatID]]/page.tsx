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

// eslint-disable-next-line @next/next/no-async-client-component
export default function Chat() {
  return (
    <EventProvider>
      <ResizablePanelGroup direction="horizontal" className="border">
        <ResizablePanel defaultSize={10} minSize={10} maxSize={30}>
          <div className="p-3">
            <NewChat />
            <Separator className="my-3" />
          </div>
          <List />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={90}>
          <Conversation />
        </ResizablePanel>
      </ResizablePanelGroup>
    </EventProvider>
  );
}
