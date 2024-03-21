import { useChat, type Message, type UseChatHelpers } from 'ai/react';
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
import {
  FormEvent,
  KeyboardEvent,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { AutosizeTextarea } from '@/components/ui/auto-size-textarea';
import { useToast } from '@/components/ui/use-toast';
import { LoaderCircle } from 'lucide-react';

export default function Conversation() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
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

  function handleTextareaKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // 纯回车才发送
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
      <ResizablePanel defaultSize={80}>
        <div className=" h-full overflow-y-scroll" ref={scrollContainerRef}>
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
