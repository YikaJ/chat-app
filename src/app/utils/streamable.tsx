import { ChatRequestMessage, OpenAIClient } from '@azure/openai';
import { OpenAIStream } from 'ai';
import { createStreamableUI } from 'ai/rsc';
import type { ReactNode } from 'react';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import {
  createResolvablePromise,
  isAsyncGenerator,
  isPromise,
  isSymbolIterator,
} from '.';

type Streamable = ReactNode | Promise<ReactNode>;
type Renderer<T> = (
  props: T
) =>
  | Streamable
  | Generator<Streamable, Streamable, void>
  | AsyncGenerator<Streamable, Streamable, void>;

export function azureRender<
  TS extends {
    [name: string]: z.Schema;
  } = {},
  FS extends {
    [name: string]: z.Schema;
  } = {}
>(options: {
  provider: OpenAIClient;
  deploymentName: string;
  messages: ChatRequestMessage[];
  text?: Renderer<{
    content: string;
    delta: string;
    done: boolean;
  }>;
  tools?: {
    [name in keyof TS]: {
      description?: string;
      parameters: TS[name];
      render: Renderer<z.infer<TS[name]>>;
    };
  };
  initial?: ReactNode;
  temperature?: number;
}): ReactNode {
  const ui = createStreamableUI(options.initial);

  // 默认输出文本内容
  const text = options.text
    ? options.text
    : ({ content }: { content: string }) => content;

  // 处理工具 tools
  const tools = options.tools
    ? Object.entries(options.tools).map(
        ([name, { description, parameters }]) => {
          return {
            type: 'function' as const,
            function: {
              name,
              description,
              parameters: zodToJsonSchema(parameters) as Record<
                string,
                unknown
              >,
            },
          };
        }
      )
    : undefined;

  let finished: Promise<void> | undefined;

  // 做实际的 RSC 渲染
  async function handleRender(
    args: any,
    renderer: undefined | Renderer<any>,
    res: ReturnType<typeof createStreamableUI>
  ) {
    if (!renderer) return;
    const resolvable = createResolvablePromise<void>();

    // Finished Promise
    if (finished) {
      finished = finished.then(() => resolvable.promise);
    } else {
      finished = resolvable.promise;
    }

    const value = renderer(args);
    if (isPromise(value)) {
      const node = await (value as Promise<React.ReactNode>);
      res.update(node);
      resolvable.resolve(void 0);
    } else if (isAsyncGenerator(value)) {
      const it = value as AsyncGenerator<
        React.ReactNode,
        React.ReactNode,
        void
      >;
      while (true) {
        const { done, value } = await it.next();
        res.update(value);
        if (done) break;
      }
      resolvable.resolve(void 0);
    } else if (isSymbolIterator(value)) {
      // 迭代器处理
      const it = value as Generator<React.ReactNode, React.ReactNode, void>;
      while (true) {
        const { done, value } = it.next();
        res.update(value);
        if (done) break;
      }
      resolvable.resolve(void 0);
    } else {
      res.update(value as ReactNode);
      resolvable.resolve(void 0);
    }
  }

  (async () => {
    let hasFunction = false;
    let content = '';

    const response = await options.provider.streamChatCompletions(
      options.deploymentName,
      options.messages,
      {
        ...(tools
          ? {
              tools,
            }
          : {}),
      }
    );

    const stream = OpenAIStream(response, {
      ...(tools
        ? {
            async experimental_onToolCall(toolCallPayload) {
              console.log('触发函数', JSON.stringify(toolCallPayload));
              hasFunction = true;
              for (const tool of toolCallPayload.tools) {
                handleRender(
                  tool.func.arguments,
                  options.tools?.[tool.func.name as any]?.render,
                  ui
                );
              }
            },
          }
        : {}),
      onText(chunk) {
        content += chunk;
        handleRender({ content, done: false, delta: chunk }, text, ui);
      },
      async onFinal() {
        if (hasFunction) {
          await finished;
          ui.done();
          return;
        }

        handleRender({ content, done: false }, text, ui);
        await finished;
        ui.done();
      },
    });

    consumeStream(stream);
  })();

  return ui.value;
}

// 持续消费 Stream
export async function consumeStream(stream: ReadableStream) {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
}
