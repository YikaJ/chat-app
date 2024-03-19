import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message } from 'ai/react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface IProps {
  message: Message;
}

export default function Message(props: IProps) {
  function renderAssistantMessage() {
    return (
      <div className="flex">
        <div className="mr-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="text-2xl">🤖</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-max max-w-[95%] flex-col gap-2 rounded-lg p-5 bg-muted">
          <Markdown
            className="prose"
            components={{
              code(props) {
                const { children, className, node, ref, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    language={match[1]}
                    style={tomorrow}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {props.message.content}
          </Markdown>
        </div>
      </div>
    );
  }

  function renderUserMessage() {
    return (
      <div className="flex">
        <div className="mr-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="text-2xl">🐧</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-max max-w-[95%] flex-col gap-2 rounded-lg px-3 p-5  bg-gray-900   text-primary-foreground">
          {props.message.content}
        </div>
      </div>
    );
  }

  return (
    <div>
      {props.message.role === 'assistant' && renderAssistantMessage()}
      {props.message.role === 'user' && renderUserMessage()}
    </div>
  );
}
