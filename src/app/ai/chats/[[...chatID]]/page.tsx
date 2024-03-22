import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import List from './List';
import { Separator } from '@/components/ui/separator';
import Conversation from './Conversation';
import { NewChat } from './NewChat';

// eslint-disable-next-line @next/next/no-async-client-component
export default function Chat({ params }: { params: { chatID: string[] } }) {
  const chatID = params?.chatID?.[0];
  console.log({ chatID });

  return (
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
  );
}
