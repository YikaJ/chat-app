import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const body = await req.json()
  // TODO：补充 Schema ZOD Check

  const response = await prisma.chat.upsert({
    where: {
      id: body.chatID || '',
      userId: session?.user?.id
    },
    update: {
      messages: body.messages,
      title: body.title
    },
    create: {
      userId: session?.user?.id,
      title: '新的对话',
      messages: body.messages || []
    }
  })

  return NextResponse.json({
    Response: {
      Chat: response
    },
    Message: 'OK'
  })
}