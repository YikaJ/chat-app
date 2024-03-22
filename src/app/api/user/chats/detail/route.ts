import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const query = req.nextUrl.searchParams
  const chatID = query.get('chatID') as string
  const userChat = await prisma.chat.findFirst({
    where: {
      id: chatID,
      //  只允许当前用户获取聊天记录
      userId: session?.user?.id
    }
  })

  return NextResponse.json({
    Response: {
      Chat: userChat
    }
  })
}