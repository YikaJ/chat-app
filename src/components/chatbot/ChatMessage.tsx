import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message } from 'ai/react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { sleep } from 'openai/core.mjs';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';

interface IProps {
  message: Message;
}

function CopyButton(props: any) {
  const [copySuccess, setCopySuccess] = useState(false);

  async function handleCopy() {
    const copyContent = props.content.props.children;
    if (copyContent) {
      await navigator.clipboard.writeText(copyContent);
      setCopySuccess(true);
      await sleep(1500);
      setCopySuccess(false);
    }
  }

  return (
    <div
      className={classNames(
        'absolute right-3 top-3  transition duration-300 ease-in-out group-hover/pre:opacity-100 group-hover/pre:translate-y-0 group-hover/pre:block',
        {
          'hidden translate-y-full opacity-0': !copySuccess,
        }
      )}
    >
      {copySuccess ? (
        <CheckIcon className="w-5 h-5" />
      ) : (
        <CopyIcon className="cursor-pointer w-5 h-5" onClick={handleCopy} />
      )}
    </div>
  );
}

export default function ChatMessage(props: IProps) {
  function renderAssistantMessage() {
    return (
      <div className="flex">
        <div className="mr-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="text-2xl">🤖</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-max flex-col gap-2 rounded-lg px-5 bg-muted">
          <Markdown
            className="prose max-w-full"
            components={{
              pre(props) {
                return (
                  <pre
                    className="relative group/pre"
                    style={{ background: 'rgb(45, 45, 45)' }}
                  >
                    <CopyButton content={props.children} />
                    {props.children}
                  </pre>
                );
              },
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
        <pre className="flex w-max flex-col gap-2 rounded-lg px-5 p-5  bg-gray-900   text-primary-foreground">
          {props.message.content}
        </pre>
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
