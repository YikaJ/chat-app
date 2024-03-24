import type { Message } from "ai";
import { NextRequest } from "next/server";
import { AIChat } from "../chat/route";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (prompt) {
    const targetMessages: Message[] = [
      {
        id: 'system_message',
        role: 'system',
        content: '请根据以下内容，生成精炼短小的标题，输出内容不能包含标点符号'
      },
      {
        id: 'user_message',
        role: 'user',
        content: prompt
      }
    ]

    return AIChat(targetMessages)
  }
}