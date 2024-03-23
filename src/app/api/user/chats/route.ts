import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// 获取对话列表
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const userChats = await prisma.chat.findMany({
    where: {
      userId: session?.user?.id
    },
    select: {
      id: true,
      title: true
    }
  })

  return NextResponse.json({
    Response: {
      Chats: userChats
    }
  })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession()
  const searchParams = req.nextUrl.searchParams
  const delResp = await prisma.chat.delete({
    where: {
      id: searchParams.get('chatID') as string,
      userId: session?.user?.id
    }
  })

  return NextResponse.json({
    Response: {
      Chat: delResp
    }
  })
}